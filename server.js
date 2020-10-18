/* 
 *  File: server.js
 *  Author: siik
 *  
 *  Copyright (C) 2020 Roth Advisory, Oberaegeri, Zug, Switzerland
 *  
 *  All rights reserved.
 *  
 *  The above copyright notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE. 
 */

require('isomorphic-fetch');
const dotenv = require('dotenv');
dotenv.config();
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const next = require('next');

const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');
const { default: graphQLProxy } = require('@shopify/koa-shopify-graphql-proxy');
const { ApiVersion } = require('@shopify/koa-shopify-graphql-proxy');
const Router = require('koa-router');
const { receiveWebhook, registerWebhook } = require('@shopify/koa-shopify-webhooks');
const { MongoClient } = require('mongodb');

const storeEngine = require('store-js/src/store-engine');
const { getShopOrigin } = require('@shopify/app-bridge');
const { getMerchant, getAllMerchants } = require('./server/getMerchant');
const getSubscriptionUrl = require('./server/getSubscriptionUrl');
const { initMQ, sendMessage, ZMQMessage } = require("./dist/mqClient");
const { registerHooksForAllShops } = require('./server/webhooks');
const { getInvoices, getInvoiceCount } = require('./server/getInvoices');
const { parse } = require('url');
const { getPayouts} = require('./server/getPayouts');
const auth = require('koa-basic-auth');
// const { renderComponent, serveStatic } = require('next/server')


// const url = require('url'); //delete

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const {
  SHOPIFY_API_SECRET_KEY,
  SHOPIFY_API_KEY,
  HOST,
} = process.env;

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();
  server.use(session({ sameSite: 'none', secure: true }, server));
  server.keys = [SHOPIFY_API_SECRET_KEY];

  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY,
      accessMode: 'offline',
      scopes: [
        //'read_all_orders',
        'read_orders',
        'write_orders',
        'read_customers',
        'read_locales',
        'read_products',
        'read_fulfillments',
        //  'write_products'
      ],
      async afterAuth(ctx) {
        const { shop, accessToken } = ctx.session;
        console.info("Auth called for shop " + shop);
        console.debug(ctx);
        ctx.cookies.set("shopOrigin", shop, {
          httpOnly: false,
          secure: true,
          sameSite: 'none'
        });

        // await getSubscriptionUrl(ctx, accessToken, shop);
        ctx.redirect("/");

        var obj = { callback: ctx.originalUrl, accessToken: accessToken, shop: shop };

        sendMessage({ action: "newMerchant", data: obj }); //inserts or updates mongoDB

      }
    })
  );

  router.use('/internal/', auth({name: 'test', pass: 'me'}));


  // registerHooksForAllShops();

  initMQ();
  sendMessage({ action: "bootUpNodeJS" });


  const webhook = receiveWebhook({ secret: SHOPIFY_API_SECRET_KEY });

  // GDPR Endpoints
  router.post('/customers/redact', webhook, (ctx) => {
    console.info('received customer redact: ', ctx.state.webhook);
    // Payload provided
    /*
    {
      "shop_id": 954889,
      "shop_domain": "snowdevil.myshopify.com",
      "customer": {
        "id": 191167,
        "email": "john@email.com",
        "phone": "555-625-1199"
      },
      "orders_to_redact": [299938, 280263, 220458]
    }
    */
    ctr.res.statusCode = 200;

  });

  router.post('/shop/redact', webhook, (ctx) => {
    console.info('received shop redact: ', ctx.state.webhook);
    // Payload
    /*
    {
      "shop_id": 954889,
      "shop_domain": "snowdevil.myshopify.com"
    }
    */
  });

  router.post('/customers/data_request', webhook, (ctx) => {
    console.info('customer data request: ', ctx.state.webhook);
    // Payload
    /*
    {
      "shop_id": 954889,
      "shop_domain": "snowdevil.myshopify.com",
      "customer": {
        "id": 191167,
        "email": "john@email.com",
        "phone":  "555-625-1199"
      },
      "orders_requested": [299938, 280263, 220458]
    }
    */
  });

  // END GDPR Endpoints

  router.post('/webhooks/app/uninstalled', webhook, (ctx) => {
    console.info('received webhook: ', ctx.state.webhook);
  });

  router.post('/webhooks/products/create', webhook, (ctx) => {
    console.info('received webhook: ', ctx.state.webhook);
  });

  router.post('/webhooks/orders/create', webhook, (ctx) => {
    console.info('received webhook orders: ', ctx.state.webhook);
    var order = ctx.state.webhook.payload;
    order.shop = ctx.state.webhook.domain;
    sendMessage({ action: "newOrder", data: order });
  });

  router.use(bodyParser());


  router.get('/payouts/:shopName', verifyRequest(), async (ctx) => {
    console.debug("Get called for shop " + ctx.params.shopName);
    var creditorInfo = await getPayouts(ctx.params.shopName);
    console.debug("res ", creditorInfo);
    ctx.body = creditorInfo;
    ctx.respond = true;
    ctx.res.statusCode = 200;
  });

  router.get('/invoiceCount/:shopName', verifyRequest(), async (ctx) => {
    console.debug("Get called for shop " + ctx.params.shopName);
    var creditorInfo = await getInvoiceCount(ctx.params.shopName);
    console.debug("res ", creditorInfo);
    ctx.body = creditorInfo;
    ctx.respond = true;
    ctx.res.statusCode = 200;
  });

  router.get('/invoices/:shopName', verifyRequest(), async (ctx) => {
    console.debug("Get called for shop " + ctx.params.shopName);
    var creditorInfo = await getInvoices(ctx.params.shopName);
    console.debug("res ", creditorInfo);
    ctx.body = creditorInfo;
    ctx.respond = true;
    ctx.res.statusCode = 200;
  });

  router.get('/creditor/:shopName', verifyRequest(), async (ctx) => {
    console.debug("Get called for shop " + ctx.params.shopName);
    var creditorInfo = await getMerchant(ctx.params.shopName);
    console.debug("res ", creditorInfo);
    ctx.body = creditorInfo;
    ctx.respond = true;
    ctx.res.statusCode = 200;
  });

  router.post('/creditor/edit', verifyRequest(), (ctx) => {

    var ip = ctx.request.headers['x-forwarded-for'];
    var referer = ctx.request.headers['referer'];
    //console.debug("request:", ctx.request);
    //console.debug("body:", ctx.request.body);
    //let digest = crypto.createHmac('sha256', get("hmac")).update(ctx.request.body).digest("base64");

    const shopOrigin = ctx.session.shop;
    const creditorInfo = ctx.request.body;
    creditorInfo['ip'] = ip;
    creditorInfo['referer'] = referer;

    sendMessage({
      'action': 'updateCreditor',
      'data': { shop: shopOrigin, creditorInfo: creditorInfo }
    });
    setTimeout(function () {
      sendMessage({
        'action': 'sendTestInvoice',
        'data': { shop: shopOrigin }
      });
    }, 5000);

    ctx.res.statusCode = 200;
    ctx.respond = true;
  });

  server.use(graphQLProxy({ version: ApiVersion.July20 }));

  router.get('/ssr/*', verifyRequest(), async (ctx) => {
    //console.debug("get called " + ctx.href);
    //console.debug("get called " + ctx.search);
    /*
    const hmac = (new URLSearchParams(ctx.search)).get("hmac");
    if (hmac) {
      console.debug(hmac);
      ctx.cookies.set("hmac", hmac);
    }*/
    console.debug("Server side rendering here " + ctx.href);
    const parsedUrl = parse(ctx.req.url, true)
    const { pathname, query } = parsedUrl
    console.debug("path " + pathname);

    const data = await app.renderToHTML(ctx.req, ctx.res, pathname, ctx.query);
    //const data = await app.render(ctx.req,ctx.res,,ctx.query);
    //const data = "<h1>test</h1>";
    ctx.res.statusCode = 200;
    ctx.response = false;

    ctx.res.write(data);
    //ctx.res.write("<h1>test</h1>");
    
    ctx.res.end();  
  });
  
  router.get('*', verifyRequest(), async (ctx) => {
    //console.debug("get called " + ctx.href);
    //console.debug("get called " + ctx.search);
    /*
    const hmac = (new URLSearchParams(ctx.search)).get("hmac");
    if (hmac) {
      console.debug(hmac);
      ctx.cookies.set("hmac", hmac);
    }*/

    const parsedUrl = parse(ctx.req.url, true)
    const { pathname, query } = parsedUrl
    console.debug("path: " + pathname);

    console.debug("Client side rendering here");
    if (ctx.session.shop == "swiss-qr-code.myshopify.com") {
      await handle(ctx.req, ctx.res, ctx.href, ctx.query); //, ctx);
      ctx.respond = false;
      ctx.res.statusCode = 200;
    } else {
      console.debug("Ignoring request");
    }
  });



  console.log(router.routes());

  server.use(router.allowedMethods());
  server.use(router.routes());


  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });





  setInterval(() => {

    const GET_ORDER_BY_ID = `
  {
    orders(last: 60, query: "updated_at:>2020-07-09") {
      edges{
        node {
          id  
          name
          email
          displayFinancialStatus
          totalPriceSet { presentmentMoney {
            amount
            currencyCode
          } }
        }
      }
    }
  }
`;



    /*
        fetch("https://" + shop + "/admin/api/graphql.json", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": key
          },
          body: JSON.stringify({ query: GET_ORDER_BY_ID })
        })
          .catch(err => {
            console.log(err);
          })
          .then(result => {
            return result.json();
          })
          .then(data => {
            console.log("data returned:\n", data);
    
            data.data.orders.edges.forEach(node => {
              console.log("Order", node);
            });
          });
    
    */


    // retrievAndSaveOrders(shop, "https://" + shop + "/admin/api/2020-07/orders.json?limit=250&status=any",key);
    console.debug("NO-OP");

  }, 60 * 1000);

  function retrievAndSaveOrders(shop, url, key) {

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": key
      }
    })
      .catch(err => {
        console.error("Error", err);
      })
      .then(response => {
        // console.log("headers",response.headers);
        let link = parse_link_header(response.headers.get("link"));
        if (link.next) {
          console.log("Link", link.next);
          retrievAndSaveOrders(shop, link.next, key);
        } else {
          console.log("Unused", link);
          console.log("Headers:", response.headers);
        }
        return response.json();
      })
      .then(data => {
        //      console.log("data returned:\n", data);

        var MongoClient = require('mongodb').MongoClient;
        var url = "mongodb://192.168.0.14:27017/";

        MongoClient.connect(url, {
          poolSize: 10, bufferMaxEntries: 0,
          useNewUrlParser: true, useUnifiedTopology: true
        }, function (err, db) {
          var dbo = db.db("qrcode");
          data.orders.forEach(async order => {
            order.shop = shop;
            await dbo.collection("orders").insertOne(order, async function (err, res) {
              if (err && err.code == 11000) {
                //we expect duplicates here
                await dbo.collection("orders").replaceOne({ 'id': order.id, 'shop': shop }, order, function (err, res) {
                  if (err) {
                    console.error("Error replacing order", err);
                  }
                });
              }
              else if (err) {
                console.error(err);
              }
            });
          })
          db.close();
        });
      });
  }

  function parse_link_header(header) {
    var links = {};
    if (!header || header.length === 0) {
      //      throw new Error("input must not be of zero length");
      return links;
    }

    // Split parts by comma
    var parts = header.split(',');

    // Parse each part into a named link
    for (var i = 0; i < parts.length; i++) {
      var section = parts[i].split(';');
      if (section.length !== 2) {
        throw new Error("section could not be split on ';'");
      }
      var url = section[0].replace(/<(.*)>/, '$1').trim();
      var name = section[1].replace(/rel="(.*)"/, '$1').trim();
      links[name] = url;
    }
    return links;
  }

});
