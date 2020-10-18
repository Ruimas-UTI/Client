/* 
 *  File: legal.js
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
        return (<Page title="Legal information">
            <TitleBar title="Legal information"></TitleBar>
            <Layout>
                <Layout.AnnotatedSection
                    title="Terms of usage and terms for your customers"
                    description="On this page you find the terms for your customers and the terms between you as a merchant and swiss invoice."
                ></Layout.AnnotatedSection>
            </Layout>
            
            <Card title="Terms of usage for your customers" sectioned
            secondaryFooterActions={[{content: 'Copy link to clipboard'}]}
            primaryFooterAction={{content: 'View customer terms'}}
            >
                <p>As said in the configuration instructions and in the terms of usage for you as a merchant,
                    you are <TextStyle variation="strong">obliged to provide this link to your customers during the checkout.</TextStyle></p>
                    
            </Card>
            <Card title="Terms of usage for you as a merchant" sectioned
            primaryFooterAction={{content: 'View merchant terms'}}
            >
                <p>These are the terms between you as a merchant and swiss invoice. By continuing to use swiss invoice, you agree to these terms of usage.</p>
            </Card>
        </Page>);
    }
}

export default Payouts;
