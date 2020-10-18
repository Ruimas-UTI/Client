/* 
 *  File: status.js
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


class Status extends React.Component {

    static contextType = Context;

    static getInitialProps({ query }) {
        //console.debug(query);
        return { query }
    }


    render() {
        return (<Page>
            <TitleBar title="Status"></TitleBar>
            <Layout>
                <Layout.AnnotatedSection
                    title="App integration status"
                    description="Swiss invoice can validate if required access levels function and you made all necessary changes to proceed with invoice payment."
                ></Layout.AnnotatedSection>
                <List>
                    <List.Item>
                        App integration <Badge status="success">successful</Badge><Caption>Order management and notifications</Caption>
                    </List.Item>
                    <List.Item>
                        Swiss Invoice servers <Badge status="success">reachable</Badge><Caption>Order management and notifications</Caption>
                    </List.Item>
                    <List.Item>
                        Merchant creditor settings <Badge status="critical">unconfigured</Badge><Caption>Order management and notifications</Caption>
                    </List.Item>
                </List>
            </Layout>
        </Page>);
    }
}

export default Status;
