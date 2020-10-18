/* 
 *  File: webhooks.js
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

const { receiveWebhook, registerWebhook } = require('@shopify/koa-shopify-webhooks');
const { getMerchant, getAllMerchants } = require('./getMerchant');
const { ApiVersion } = require('@shopify/koa-shopify-graphql-proxy');

async function registerHooksForAllShops() {
    var allMerchants = await getAllMerchants();
    // console.debug(allMerchants);
    allMerchants.forEach(m => {
        try {
            registerHooks(m.shop, m.accessToken);
        } catch (e) {
            console.error("Failed to register hooks", e);
        }
    });
}

async function registerHooks(shop, accessToken) {
    console.debug("Hooks for shop " + shop + " token " + accessToken);

    const registrationOrderCreate = await registerWebhook({
        address: `${process.env.HOST}/webhooks/orders/create`,
        topic: 'ORDERS_CREATE',
        accessToken,
        shop,
        apiVersion: ApiVersion.July20
    });
    processWebhookResponse("orders.create", shop, registrationOrderCreate)

    
    const registrationShopUpdate = await registerWebhook({
        address: `${process.env.HOST}/webhooks/shop/update`,
        topic: 'SHOP_UPDATE',
        accessToken,
        shop,
        apiVersion: ApiVersion.July20
    });
    processWebhookResponse("shop.update", shop, registrationShopUpdate)

    const address = `${process.env.HOST}/webhooks/app/uninstalled`;
    const registrationAppUninstalled = await registerWebhook({
        'address': address,
        'topic': 'APP_UNINSTALLED',
        accessToken,
        shop,
        apiVersion: ApiVersion.July20
    });
    processWebhookResponse("app.uninstalled", shop, registrationAppUninstalled)

}

function processWebhookResponse(hook, shop, registration) {
    if (registration.success) {
        console.log(`webhook ${hook} successfully registered`);
    } else {
        console.log(`Failed to register webhook ${hook} for shop ${shop}`, registration.result);
        if (registration.result &&
            registration.result.data &&
            registration.result.data.webhookSubscriptionCreate &&
            registration.result.data.webhookSubscriptionCreate.userErrors) {
                console.error("User errors");
            registration.result.data.webhookSubscriptionCreate.userErrors.forEach(error =>
                console.debug(error));
        }else{
            console.error(registration);
        }
    }
}

module.exports = { registerHooksForAllShops };