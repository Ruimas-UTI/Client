/* 
 *  File: editPayments.js
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
import ResourceListWithOrders from '../components/OrderList';
import session from 'koa-session';
import { Context } from '@shopify/app-bridge-react';
import EditPaymentDetails from './edit-payment-details';


class EditPayments extends React.Component {

    static contextType = Context;

    static getInitialProps({ query }) {
        console.debug("editPayments.js", query);
        return { query }
    }

    state = { open: false };
    render() {
        const emptyState = false; //!store.get('ids');
        console.log("Session", session);
        return (<Page>
            <TitleBar title="Merchant creditor settings" />
            <Layout>
                <Layout.AnnotatedSection
                    title="Merchant creditor settings"
                    description="Swiss invoice uses this information to process your invoices."
                ></Layout.AnnotatedSection>
            </Layout>
            <EditPaymentDetails {...this.props} />
        </Page>);
    }

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

export default EditPayments;
