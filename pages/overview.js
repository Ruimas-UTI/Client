/* 
 *  File: overview.js
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

import { EmptyState, Layout, Page, Button, ButtonGroup, Card, Navigation, Badge, List, Caption } from '@shopify/polaris';
import { HomeMajorMonotone, OrdersMajorTwotone, ProductsMajorTwotone, OnlineStoreMajorTwotone } from '@shopify/polaris-icons';
import { ResourcePicker, TitleBar, useClientRouting } from '@shopify/app-bridge-react';
import store from 'store-js';
import ResourceListWithOrders from '../components/OrderList';
import session from 'koa-session';
import { Context } from '@shopify/app-bridge-react';

const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

class Status extends React.Component {

    static contextType = Context;

    static getInitialProps({ query }) {
        //console.debug(query);
        return { query }
    }


    render() {
        return (<Page>
            <TitleBar title="Overview"></TitleBar>
            <Layout>
            <EmptyState
              heading="Send an invoice with Swiss QR Code to your customers!"
              action={{
                content: 'View merchant creditor settings',
                onAction: () => this.setState({ open: true }),
              }}
              image={img}><p>We send invoices, make sure to keep track of incoming payments, automatically send reminders, and set orders to 'paid'.</p></EmptyState>
          </Layout>
        </Page>);
    }

    goToEditCreditor = () => {
        const app = this.context;
        const redirect = Redirect.create(app);
        redirect.dispatch(
          Redirect.Action.APP,
          '/editPyments',
        );
      }
}

export default Status;
