/* 
 *  File: getInvoices.js
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
const url = "mongodb://192.168.0.14:27017/";


const getInvoices = async function getInvoices(shop) {
    let db = await MongoClient.connect(url);
    const dbo = db.db("qrcode");
    const invoices = await dbo.collection("invoices")
    .find({'shop': shop })
    .project({ 'order_number': 'order_number',
    'created_at': 'created_at',
    'sent_at': 'sent_at',
    'status': 'status'
    });
    // invoices.skip(100).limit(100);
    const result = await invoices.toArray();
    return result;
}

const getInvoiceCount = async function getInvoiceCount(shop) {   
    let db = await MongoClient.connect(url);
    const dbo = db.db("qrcode");
    const invoices = await dbo.collection("invoices").find({ 'shop': shop });
    return invoices.count;
}

module.exports = { getInvoices, getInvoiceCount };