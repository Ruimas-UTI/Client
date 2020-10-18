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

import { EmptyState, Layout, Page, Button, ButtonGroup, Card, Navigation } from '@shopify/polaris';
import { HomeMajorMonotone, OrdersMajorTwotone, ProductsMajorTwotone, OnlineStoreMajorTwotone } from '@shopify/polaris-icons';
import { ResourcePicker, TitleBar, useClientRouting } from '@shopify/app-bridge-react';
import store from 'store-js';
import ResourceListWithProducts from '../components/ResourceList';
import ResourceListWithOrders from '../components/OrderList';
import session from 'koa-session';
import { getShopOrigin } from '@shopify/app-bridge';
import { Redirect } from '@shopify/app-bridge/actions';
import { Context } from '@shopify/app-bridge-react';
import { ConfirmBankAccount } from '../components/confirmBank';


class Index extends React.Component {

  static contextType = Context;

  static getInitialProps({ query }) {
    //console.debug(query);
    return { query }
  }

  state = { open: false };
  render() {
    const emptyState = false; //!store.get('ids');
    console.log("index.js session", session);
    return (<Page>
      <TitleBar
        title="Configuration"
          /*primaryAction={{ content: 'Select products',
            destructive: true,
            onAction: () => this.setState({ open: true }),
          }}*/ />
      <Layout>
        <Layout.Section>
          <Card title="Invoice information sent to customers" sectioned>
            <ButtonGroup>
              <Button critical onClick={this.goToEditCreditor}>Edit creditor information</Button>
            </ButtonGroup>
          </Card>
        </Layout.Section>
        {ConfirmBankAccount} 
        <ResourceListWithProducts />
        <ResourceListWithOrders />
      </Layout>
    </Page>);
  }

  goToEditCreditor = () => {
    const app = this.context;
    const redirect = Redirect.create(app);
    redirect.dispatch(
      Redirect.Action.APP,
      '/edit-payment-details',
    );
  }

  logit = () => {
    const crypto = require('crypto');
    console.debug("origin", getShopOrigin());
    // console.debug("Finally", hmac);
    const data = JSON.stringify({ 'data': 'noneAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' });

    const response = fetch('/creditor/edit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // "X-Shopify-Access-Token": "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",
      },
      body: data,
      credentials: 'include'
    });
  };

  handleSelection = (resources) => {
    const idsFromResources = resources.selection.map((product) => product.id);
    this.setState({ open: false });
    store.set('ids', idsFromResources);
  };

  handleOrderSelection = (resources) => {
    const idsFromResources = resources.selection.map((order) => order.id);
    this.setState({ open: false });
    store.set('orderIds', idsFromResources);
  };
}

export default Index;
