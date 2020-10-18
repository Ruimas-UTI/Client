/* 
 *  File: payouts.js
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

import { EmptyState, Layout, Page, Button, ButtonGroup, Card, Navigation, TextStyle } from '@shopify/polaris';
import { HomeMajorMonotone, OrdersMajorTwotone, ProductsMajorTwotone, OnlineStoreMajorTwotone } from '@shopify/polaris-icons';
import { ResourcePicker, TitleBar, useClientRouting } from '@shopify/app-bridge-react';
import store from 'store-js';
import ResourceListWithOrders from '../components/OrderList';
import session from 'koa-session';
import { Context } from '@shopify/app-bridge-react';


class Payouts extends React.Component {

    static contextType = Context;

    static getInitialProps({ query }) {
        //console.debug(query);
        return { query }
    }

    state = { open: false };
    render() {
        const emptyState = false; //!store.get('ids');
        console.log(session);
        return (<Page title="Payouts">
            <TitleBar title="Payouts"></TitleBar>
            <Layout>
                <Layout.AnnotatedSection
                    title="Payouts details"
                    description="As soon as your customers transfered money to Swiss Invoice, it is available as payout. Note that we transfer money to the provided bank account as configured in the creditor settings."
                ></Layout.AnnotatedSection>
            </Layout>
            <p>
            <TextStyle variation="strong">There is currently no funds available for payout nor is there a payment history to show.</TextStyle>
            </p>
            <p>
            <TextStyle variation="strong">This page will be updated as soon as we received payments from your customers.</TextStyle>
            </p>
        </Page>);
    }
}

export default Payouts;
