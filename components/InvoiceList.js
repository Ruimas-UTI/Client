/* 
 *  File: InvoiceList.js
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

import gql from 'graphql-tag';
import { Query } from 'react-apollo';
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
import store from 'store-js';
import { Redirect } from '@shopify/app-bridge/actions';
import { Context } from '@shopify/app-bridge-react';
import { PageMajorMonotone, PageDownMajorMonotone } from '@shopify/polaris-icons';
import { getShopOrigin } from '@shopify/app-bridge';
import Cookies from "js-cookie";
import dynamic from 'next/dynamic';
//import getInvoices from '../server/getInvoices';

class InvoiceList extends React.Component {
  static contextType = Context;
  componentDidMount() {
      console.debug("did mount");
      console.debug("props",this.props);
      var shop =        Cookies.get("shopOrigin");
      console.debug("shop", shop);
  
      // ccvar getMerchant = require('../server/getMerchant.js');
      fetch(`/invoices/${shop}`, {
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
          console.log("data returned:\n",data);
          if (Object.keys(data).length > 0) {
            this.setState({ 'data' : data});
          } else {
            this.setState(this.defaultState);
          }
        });

  }

  static async getInitialProps({ req }) {
    if (req) {
      // If `req` is defined, we're rendering on the server and should use
      // MongoDB directly. You could also use the REST API, but that's slow
      // and inelegant.
      //var invoices = getInvoices("swiss-qr-invoice.myshopify.com");
      return { req }
    }
  }

  render() {
    const app = this.context;
    
    //const rows = [];
    
    
    const rows = [
      ['#1023', '2020-07-08', '2020-07-08', <Badge status="success" >paid</Badge>, '$122.00', '$122.00', <Icon
        source={PageDownMajorMonotone} />],
      ['#2032', '2020-07-08', '2020-07-08', <Badge>unpaid</Badge>, '$190.00', '$122.00'],
      [<Link url="https://help.shopify.com/manual">#1230</Link>,
        '2020-07-08', '2020-07-08', <Badge status="critical">3rd reminder</Badge>, '$190.00', '$122.00',
      <Link url="google.de"><Icon
        source={PageMajorMonotone} /></Link>],
    ];

    const totals=['', '', '', '', '$155,830.00', '$155,830.00', ''];
    

    if(this.state){
      this.state.data.forEach(element => {
        console.debug(element);
        const row = [ element.order_number, element.created_at, '2020-07-08', <Badge status="success" >paid</Badge>, '$122.00', '$122.00', <Icon
      source={PageDownMajorMonotone} /> ];
        rows.push(row);  
      });
      
    }

    return (
      <Page title="Invoices in ascending order">
        <Card>
          <DataTable
            columnContentTypes={[
              'text',
              'text',
              'text',
              'text',
              'numeric',
              'numeric',
              'text'
            ]}
            headings={[
              'Order',
              'Created at',
              'Invoice sent at',
              'State',
              'Payments received',
              'Payments expected',
              'PDF invoice'
            ]}
            rows={rows}
            totals={totals}
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

export default InvoiceList;
