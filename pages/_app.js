/* 
 *  File: _app.js
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

import App from 'next/app';
import Head from 'next/head';
import { AppProvider, Frame, TopBar, Link, TextStyle } from '@shopify/polaris';
import { Provider } from '@shopify/app-bridge-react';
import Cookies from "js-cookie";
import '@shopify/polaris/styles.css';
import translations from '@shopify/polaris/locales/en.json';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { EmptyState, Layout, Page, Button, ButtonGroup, Card, Navigation } from '@shopify/polaris';
import { SettingsMajorMonotone, BillingStatementDollarMajorMonotone, CashDollarMajorMonotone, CircleInformationMajorMonotone, DataVisualizationMajorMonotone, ArrowLeftMinor, LegalMajorMonotone } from '@shopify/polaris-icons';
import { useState, useCallback } from 'react';
import session from 'koa-session';
const querystring = require('querystring');

const client = new ApolloClient({
  fetchOptions: {
    credentials: 'include',
  },
});

class MyApp extends App {

  goBackToShop(){
    window.location = 'https://' + this.shop + "/admin";
  }


  render() {
    // console.debug(session);
    // console.debug("Session1", session.shop);
    // console.debug("session2", session[":shopify_domain"]);
    // const invoiceCount = getInvoiceCount(session.shopOrigin);
    // console.debug("Shoporigin", Cookies.get("shopOrigin"));

    const invoiceCount = 15;
    const { Component, pageProps } = this.props;
    console.debug("props", this.props);
    this.shop = this.props.router.query.shop;
    console.debug("shop", this.shop);
    
    const config = { apiKey: API_KEY, shopOrigin: this.shop, forceRedirect: false };
    const theme = {
      colors: {
        topBar: {
          background: '#FFFFFF',
        },
      },
      logo: {
        width: 48,
        topBarSource:
          'https://de.wikipedia.org/wiki/Fahne_und_Wappen_der_Schweiz#/media/Datei:Flag_of_Switzerland.svg',
        url: 'https://swiss-invoice.ch',
        accessibilityLabel: 'Swiss Invoice',
      },
    };

    const topBarMarkup = (
      <TopBar />
    );
    const navigation = (<Navigation location="/">
      <Navigation.Section
        items={[
          {
            label: 'Back to Shopify',
            icon: ArrowLeftMinor,
            onClick: () => this.goBackToShop()
          },
        ]}
      />
      <Navigation.Section
        items={[
          {
            url: '/overview?' + querystring.stringify(this.props.router.query),
            location: '/overview',
            label: 'Overview',
            icon: DataVisualizationMajorMonotone,
          },
          {
            url: '/invoices?' + querystring.stringify(this.props.router.query),
            location: '/invoices',
            label: 'Invoices',
            icon: BillingStatementDollarMajorMonotone,
            badge: `${invoiceCount}`,
          },
          {
            url: '/payouts?' + querystring.stringify(this.props.router.query),
            location: '/payouts',
            label: 'Payouts',
            icon: CashDollarMajorMonotone,
          },
          {
            url: '/status?' + querystring.stringify(this.props.router.query),
            location: '/status',
            label: 'App Status',
            icon: CircleInformationMajorMonotone,
          },
        ]}
      />
      <Navigation.Section
        items={[
          {
            url: '/legal?' + querystring.stringify(this.props.router.query),
            label: 'Legal information',
            icon: LegalMajorMonotone,
          },
          {
            url: '/editPayments?' + querystring.stringify(this.props.router.query),
            label: 'Merchant creditor settings',
            icon: SettingsMajorMonotone,
          },
        ]}
        separator
      />
    </Navigation>);
    return (
      <React.Fragment>
        <Head>
          <title>Swiss Invoice App</title>
          <meta charSet="utf-8" />
        </Head>
        <Provider config={config}>
          <AppProvider i18n={translations} theme={theme}>
            <ApolloProvider client={client}>
              <Frame
                navigation={navigation}
                topBar={topBarMarkup}
              >
                <Component {...pageProps} />
                <TextStyle variation="subdued">By continuing to use swiss invoice, you agree to our <Link url="/legal">terms of usage</Link>.</TextStyle>
              </Frame>
            </ApolloProvider>
          </AppProvider>
        </Provider>
      </React.Fragment>
    );
  }
}

export default MyApp;
