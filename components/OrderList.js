/* 
 *  File: OrderList.js
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
} from '@shopify/polaris';
import store from 'store-js';
import { Redirect } from '@shopify/app-bridge/actions';
import { Context } from '@shopify/app-bridge-react';

const GET_ORDER_BY_ID = gql`
  {
    orders(first: 60) {
      edges{
        node {
          id  
          name
          email
          displayFinancialStatus
          totalPriceSet { presentmentMoney {
            amount
            currencyCode
          } }
        }
      }
    }
  }
`;

class ResourceListWithOrders extends React.Component {
  static contextType = Context;

  render() {
    const app = this.context;
    const redirectToProduct = () => {
      const redirect = Redirect.create(app);
      redirect.dispatch(
        Redirect.Action.APP,
        '/edit-products',
      );
    };

    return (
      <Query query={GET_ORDER_BY_ID} variables={{ id: 1234 }}>
        {({ data, loading, error }) => {
          if (loading) { return <div>Loading…</div>; }
          if (error) { return <div>{error.message}</div>; }
          console.log(data);
          return (
            <Card>
              <ResourceList
                showHeader
                resourceName={{ singular: 'Invoiced Order', plural: 'Invoiced Orders' }}
                items={data.orders.edges}
                renderItem={(item) => {
                  const price = item.node.totalPriceSet.presentmentMoney.amount;
                  const currency = item.node.totalPriceSet.presentmentMoney.currencyCode;
                  return (
                    <ResourceList.Item
                      id={item.node.id}
                      accessibilityLabel={`View details for ${item.node.name}`}
                      onClick={() => {
                        store.set('item', item);
                        redirectToProduct();
                      }
                      }
                    >
                      <Stack>
                        <Stack.Item fill>
                          <h3>
                            <TextStyle variation="strong">
                              {item.node.name}
                            </TextStyle>
                          </h3>
                        </Stack.Item>
                        <Stack.Item>
                          <p>mail:{item.node.email}</p>
                        </Stack.Item>
                        <Stack.Item>
                          <p>Payment:&nbsp;
                        <TextStyle variation="negative">{item.node.displayFinancialStatus}</TextStyle>
                          </p>
                        </Stack.Item>
                        <Stack.Item>
                          <p>{price} {currency}</p>
                        </Stack.Item>
                      </Stack>
                    </ResourceList.Item>
                  );
                }}
              />
            </Card>
          );
        }}
      </Query>
    );
  }
}

export default ResourceListWithOrders;
