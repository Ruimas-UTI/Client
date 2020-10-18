/* 
 *  File: getMerchant.js
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

const getMerchant = async function getMerchant(shopName) {
  const MongoClient = require('mongodb').MongoClient;
  const url = "mongodb://192.168.0.14:27017/"; //TODO use host/port from ENV variable
  let db = await MongoClient.connect(url);
  const dbo = db.db("qrcode");
  const merchant = await dbo.collection("merchants").findOne({ 'shop': shopName }).then();
  if(merchant){
    const creditorInfo = merchant["creditorInfo"];
    if(creditorInfo){
      return creditorInfo;
    }
  }
  return {};
}

const getAllMerchants = async function getAllMerchants() {
  const MongoClient = require('mongodb').MongoClient;
  const url = "mongodb://192.168.0.14:27017/"; //TODO use host/port from ENV variable
  let db = await MongoClient.connect(url);
  const dbo = db.db("qrcode");
  const merchants = await dbo.collection("merchants").find();
  const result = await merchants.toArray();
  return result;
}


module.exports = { getMerchant, getAllMerchants };