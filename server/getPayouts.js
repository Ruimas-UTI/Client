/* 
 *  File: getPayouts.js
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

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://192.168.0.14:27017/"; //TODO change to take DB IP and Port from ENV variable


const getPayouts = async function getPayouts(shop) {


    const query = [
            { $match: { merchant: "swiss-qrcode.myshopify.com" }}, //TODO replace with shop param and add basic unit tests for this query
   {
     $group:{ _id: { order_number: "$order_number", merchant: "$merchant" }, paidamount: { $sum: "$payment.amount"  } }
   },
   { 
       $lookup: { 
           from: "orders",
           let: { total_amount: "$total_amount", order_number: "$order_number", shop: "$shop", outer: "$_id.order_number", merchant: "$_id.merchant"},
           pipeline: [
                  //{ $match: { $expr: { $eq: [ "$order_number", "$$outer" ] } } }, //  order_number: "" order_number: 1009
                  
                  
                  { $match: { $expr: { $and: [
                      { $eq: [ "$order_number", "$$outer" ] },
                      { $eq: ["$shop","$$merchant"] }
                      ]} } },
              // { $project: { paid: { $gte: ["$paidamount", "$total_price" ] } } }
               ],
           as: "paid"
       } 
       
   },
   { $project: { paid: { $gte: ["$paidamount", "$total_price" ] }, total_price : "$paid.total_price", paidamount: "$paidamount" } }
   ];
    console.debug("query",query);
    let db = await MongoClient.connect(url);
    const dbo = db.db("qrcode").collection("payments");
    const payments = await dbo.aggregate(query);
    // invoices.skip(100).limit(100);
    const result = await payments.toArray();
    return result;
}

module.exports = { getPayouts };