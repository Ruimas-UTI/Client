/* 
 *  File: invoices.js
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
import session from 'koa-session';
import { Context } from '@shopify/app-bridge-react';
import InvoiceList from '../components/InvoiceList';


class Invoices extends React.Component {

    static contextType = Context;
    

    static getInitialProps({ query }) {
        // console.debug("Count: ", getInvoiceCount("swiss-qrcode.myshopify.com"));
        console.log("Context", this.context);
        console.log("Props", this.props);
        console.log("Session", session.shopOrigin + " " + session.shop);

        return { query }
    }

    state = { open: false };

    render() {
        const { Component, pageProps } = this.props;
        console.debug("Pageprops",pageProps);
         //!store.get('ids');
        return (<Page>
            <TitleBar title="Invoices"></TitleBar>
            <Layout>
                <Layout.AnnotatedSection
                    title="Invoice details"
                    description="Swiss invoice uses this information to process invoices and reminder handing."
                ></Layout.AnnotatedSection  >
            </Layout>
            <InvoiceList />
        </Page>);
    }
}

export default Invoices;
