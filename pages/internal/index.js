/* 
 *  File: index.js
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

import {
  Card,
  ResourceList,
  Stack,
  TextStyle,
  Thumbnail,
  DataTable,
  Page,
  Link,
  Badge,
  Icon,
  Pagination,
} from '@shopify/polaris';
import { HomeMajorMonotone, OrdersMajorTwotone, ProductsMajorTwotone, OnlineStoreMajorTwotone } from '@shopify/polaris-icons';
import { ResourcePicker, TitleBar, useClientRouting } from '@shopify/app-bridge-react';
import store from 'store-js';
import session from 'koa-session';
import { getShopOrigin } from '@shopify/app-bridge';
import { Redirect } from '@shopify/app-bridge/actions';
import { Context } from '@shopify/app-bridge-react';
import React from 'react';
import { PageMajorMonotone, PageDownMajorMonotone } from '@shopify/polaris-icons';

class Index extends React.Component {
  

  componentDidMount() {
    // this.setState({ discount: '20' });
    console.debug("props",this.props);
    var shop = this.props.query.shop;
    console.debug("shop", shop);

    // ccvar getMerchant = require('../server/getMerchant.js');
    fetch(`/payouts/${shop}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .catch(err => {
        console.log(err);
      })
      .then(result => {
        return result.json();
      })
      .then(data => {
        console.log("data returned:\n",);
        if (Object.keys(data).length > 0) {
          console.log("setting state");
          this.setState({ 'data' : data});
        } else {
          this.setState(this.defaultState);
        }
      });
  }


  render() {
    const rows = [];
    let totalAmountToBePaid = 0;
    let totalAmountPaid = 0;
    if(this.state){
      this.state.data.forEach(element => {
        const totalAmount = Number(element.total_price[0]);
        const profit = element.paidamount-totalAmount;
        totalAmountPaid += element.paidamount;
        totalAmountToBePaid += totalAmount;

        const row = [element._id.order_number, element._id.merchant, '2020-07-08',
         <Badge status="success">{element.paid ? 'paid': 'open'}</Badge>, totalAmount.toFixed(2), element.paidamount.toFixed(2), profit.toFixed(2)]
        rows.push(row);
      });
    }else{
      rows.push(
        ['#----', 'shop', '2020-00-00', <Badge status="success" >paid</Badge>, '$0.00', '$0.00']
      );
      } 
    return (
<Page title="Payments in ascending order">
        <Card>
          <DataTable
            columnContentTypes={[
              'text',
              'text',
              'text',
              'text',
              'numeric',
              'numeric',
              'numeric'
            ]}
            headings={[
              'Order',
              'Merchant',
              'Invoice sent at',
              'State',
              'Payments expected',
              'Payments received',
              'Profit'
            ]}
            rows={rows}
            totals={['', '', '', '', totalAmountToBePaid.toFixed(2), totalAmountPaid.toFixed(2), (totalAmountPaid-totalAmountToBePaid).toFixed(2)]}
          />
        </Card>
        <Pagination
          hasPrevious
          onPrevious={() => {
            console.log('Previous');
          }}
          hasNext
          onNext={() => {
            console.log('Next');
          }}
        />
      </Page>
    );
  }

}

export default Index;
