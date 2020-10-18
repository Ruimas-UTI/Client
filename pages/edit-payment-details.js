/* 
 *  File: edit-payment-details.js
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

import {
  Banner,
  Card,
  DisplayText,
  Form,
  FormLayout,
  Frame,
  Layout,
  Page,
  Button,
  ButtonGroup,
  PageActions,
  TextField,
  Toast,
} from '@shopify/polaris';
import { useCallback } from 'react';
import { Redirect, TitleBar } from '@shopify/app-bridge/actions';
import { Context } from '@shopify/app-bridge-react';
import { getShopOrigin } from '@shopify/app-bridge';
import { env } from 'process';
import Cookies from "js-cookie";

var validUrl = require('valid-url');
var validatorEmail = require("email-validator");
const validatePhoneNumber = require('validate-phone-number-node-js');
var IBAN = require('iban');


class EditPaymentDetails extends React.Component {
  static contextType = Context;

  state = {};

  defaultState = {
    storeName: 'Highly profitable store',
    storeURL: 'http://www.simpsons.com',
    storeEmail: 'bart@simpsons.com',
    technicalContactName: 'Bart Simpson',
    technicalContactEmail: 'bart@simpsons.com',
    technicalContactPhone: '+41 78 715 61 04',
    creditorCompanyName: "Your Company Name",
    creditorAdditionalAddressLine: "c/o Bart Simpson",
    creditorAddress: "Küfergasse 2",
    creditorZip: "6315",
    creditorLocation: "Oberägeri",
    creditorUID: "123.345.100 MWST",
    creditorCountry: "Switzerland",
    paymentAccountHolder: "Simpson AG",
    paymentBank: "Postfinance",
    paymentBIC: "POFICHBEXXX",
    paymentIBAN: "CH3908704016075473007",
    invoicePaymentAccountsReceivableDays: "14",
    invoicePaymentReminder1Days: "15",
    invoicePaymentReminder2Days: "30",
    invoicePaymentReminder3Days: "35",
  };


  errors = [];
  success = false;

  componentDidMount() {
    // this.setState({ discount: '20' });
    console.debug("props",this.props);
    var shop = this.props.query.shop;
    
    console.debug("shop", shop);

    // ccvar getMerchant = require('../server/getMerchant.js');
    fetch(`/creditor/${shop}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .catch(err => {
        console.log("Request error", err);
      })
      .then(result => {
        return result.json();
      })
      .then(data => {
        console.log("data returned:\n",);
        if (Object.keys(data).length > 0) {
          this.setState(data);
        } else {
          this.setState(this.defaultState);
        }
      });
  }

  static getInitialProps({ query }) {
    console.debug("getInitialProps" , query);
    return { query }
  }
  render() {
    // console.debug("merchant", merchant);
    return (
      <Page>
        <PageActions
          primaryAction={{
            content: 'Save',
            onAction: this.editCreditor.bind(this)
          }}
          secondaryActions={[
            {
              content: 'Cancel',
              onAction: this.cancel.bind(this)
            },
          ]}
        />
        <Layout>
          {this.errors.length == 0 && this.success ?
            <Layout.Section>
              <Banner
                title="Your information has been saved."
                status="success"
                action={{
                  content: 'Back to Swiss QR Code Invoice app',
                  onAction: this.cancel.bind(this)
                }}
              //onDismiss={() => {}}
              ><p>For your security, we saved your client's IP address and a timestamp of your changes</p>
              </Banner>
            </Layout.Section>
            : ""}
          {this.errors.length > 0 ?
            <Layout.Section>
              <Banner
                title="Your information has NOT been saved."
                status="critical"
              // action={{content: 'Print label'}}
              //onDismiss={() => {}}
              >
                <p>
                  Please correct the following:
                </p>
                <ul>
                  {this.errors.map((error, i) => (<li key={i}> {error} </li>))}
                </ul>

              </Banner>
            </Layout.Section>
            : ""}

          <Layout.AnnotatedSection
            title="Store details"
            description="We and your customers will use this information to contact you."
          >
            <Card sectioned>
              <FormLayout>
                <TextField label="Store name" value={this.state.storeName}
                  onChange={(value) => this.setState({ storeName: value })}
                />
                <TextField label="Store URL" value={this.state.storeURL}
                  helpText={<span> Will be shown on the invoice as the URL at which the customer did purchase.</span>}
                  onChange={(value) => this.setState({ storeURL: value })}
                />
                <TextField type="E-mail" label="Account email" value={this.state.storeEmail}
                  helpText={<span> E-mail address of the primary contact person.</span>}
                  onChange={(value) => this.setState({ storeEmail: value })}
                />
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection
            title="Technical contact"
            description="We may use this information to contact you."
          >
            <Card sectioned>
              <FormLayout>
                <TextField label="Name" value={this.state.technicalContactName}
                  helpText={<span> A contact person which we may contact in case of technical issues.</span>}
                  onChange={(value) => this.setState({ technicalContactName: value })}
                />
                <TextField label="Phone" value={this.state.technicalContactPhone}
                  helpText={<span> Swiss phone number (can be mobile) of the contact person.</span>}
                  onChange={(value) => this.setState({ technicalContactPhone: value })}
                />
                <TextField type="email" label="E-mail" value={this.state.technicalContactEmail}
                  helpText={<span> E-mail address of the contact person.</span>}
                  onChange={(value) => this.setState({ technicalContactEmail: value })}
                />
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection
            title="Creditor/merchant invoice information"
            description="We will use this information to create a proper swiss QR invoice for your customers."
          >
            <Card sectioned>
              <FormLayout>
                <TextField label="Company name" value={this.state.creditorCompanyName}
                  onChange={(value) => this.setState({ creditorCompanyName: value })}
                />
                <TextField label="Additional address line" value={this.state.creditorAdditionalAddressLine}
                  onChange={(value) => this.setState({ creditorAdditionalAddressLine: value })}
                />

                <TextField label="Address (Street, No.)" value={this.state.creditorAddress}
                  onChange={(value) => this.setState({ creditorAddress: value })}
                />
                <TextField label="Zip Code" value={this.state.creditorZip}
                  onChange={(value) => this.setState({ creditorZip: value })}
                />
                <TextField label="Location" value={this.state.creditorLocation}
                  onChange={(value) => this.setState({ creditorLocation: value })}
                />
                <TextField label="Country" value={this.state.creditorCountry}
                  onChange={(value) => this.setState({ creditorCountry: value })}
                />
                <TextField label="UID / MWST ID" value={this.state.creditorUID}
                  onChange={(value) => this.setState({ creditorUID: value })}
                />
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection
            title="Payment modalities"
            description="We send out invoices as soon as the order is created or latest, by end of day on the day the order has been created.
            Provide the number of business days you want us to wait before we send out reminders. Note that the following in line with our regulations:
            Reminder 1 is free of charge whereas the customer is obliged to provide an e-mail address in order to receive that first reminder.
            It is your obligation as merchant to ensure the collection of email addresses.
            Reminder 2 comes with additional charges for the customer. Reminder 3 is when we escalate and hand over to debt collection.
            If you need any custom durations that the configuration does not allow, contact our service."
          >
            <Card sectioned>
              <FormLayout>
                <TextField label="Accounts receivable income [days]"
                  value={this.state.invoicePaymentAccountsReceivableDays}
                  helpText={<span> Number of days between order creation and incoming money on OUR account. This number will be printed on the invoice as well.</span>}
                  onChange={(value) => this.setState({ invoicePaymentAccountsReceivableDays: value })}
                />
                <TextField label="Deadline for Reminder 1 [days]" value={this.state.invoicePaymentReminder1Days}
                  helpText={<span> Number of days between order creation and sending a first reminder to the customer.</span>}
                  onChange={(value) => this.setState({ invoicePaymentReminder1Days: value })}
                />
                <TextField label="Deadline for Reminder 2 [days]" value={this.state.invoicePaymentReminder2Days}
                  helpText={<span> Deadline for the second reminder in days.</span>}
                  onChange={(value) => this.setState({ invoicePaymentReminder2Days: value })}
                />
                <TextField label="Deadline for Reminder 3 [days]" value={this.state.invoicePaymentReminder3Days}
                helpText={<span> Deadline for the third reminder in days.</span>}
                  onChange={(value) => this.setState({ invoicePaymentReminder3Days: value })}
                />
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection
            title="Swiss bank account for payouts"
            description="We use this information to transfer any payouts to our bank account. We currently only accept swiss bank accounts for payouts.
            IMPORTANT: Double check this information as we cannot be held liable for invalid bank account information."
          >
            <Card sectioned>
              <FormLayout>
                <TextField label="Account holder" value={this.state.paymentAccountHolder}
                  helpText={<span> Will be shown on the invoice as the URL at which the customer did purchase.</span>}
                  onChange={(value) => this.setState({ paymentAccountHolder: value })}
                />
                <TextField label="Bank name" value={this.state.paymentBank}
                  helpText={<span> Will be shown on the invoice as the URL at which the customer did purchase.</span>}
                  onChange={(value) => this.setState({ paymentBank: value })}
                />
                <TextField label="IBAN" value={this.state.paymentIBAN}
                  helpText={<span> Will be shown on the invoice as the URL at which the customer did purchase.</span>}
                  onChange={(value) => this.setState({ paymentIBAN: value })}
                />
                <TextField label="BIC" value={this.state.paymentBIC}
                  onChange={(value) => this.setState({ paymentBIC: value })}
                />
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>


          {this.errors.length == 0 && this.success ?
            <Layout.Section>
              <Banner
                title="Your information has been saved."
                status="success"
                action={{
                  content: 'Back to Swiss QR Code Invoice app',
                  onAction: this.cancel.bind(this)
                }}
              //onDismiss={() => {}}
              ><p>For your security, we saved your client's IP address and a timestamp of your changes</p>
              </Banner>
            </Layout.Section>
            : ""}
          {this.errors.length > 0 ?
            <Layout.Section>
              <Banner
                title="Your information has NOT been saved."
                status="critical"
              // action={{content: 'Print label'}}
              //onDismiss={() => {}}
              >
                <p>
                  Please correct the following:
                </p>
                <ul>
                  {this.errors.map((error, i) => (<li key={i}> {error} </li>))}
                </ul>

              </Banner>
            </Layout.Section>
            : ""}

        </Layout>
        <PageActions
          primaryAction={{
            content: 'Save',
            onAction: this.editCreditor.bind(this)
          }}
          secondaryActions={[
            {
              content: 'Cancel',
              onAction: this.cancel.bind(this)
            },
          ]}
        />
      </Page>
    );
  }

  editCreditor() {
    if (this.checkValues()) {
      const data = JSON.stringify(this.state);
      //console.debug(data);
      fetch(`/creditor/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      }).then(() => {
        this.success = true;
        this.forceUpdate();
      }).catch(() => {
        this.success = false;
        this.errors.push("Information has not been saved. Try again.");
        this.forceUpdate();
      });
    } else {
      this.forceUpdate();
    }

  }

  checkValues() {

    this.errors.length = 0;

    if (!validUrl.isWebUri(this.state.storeURL)) {
      this.errors.push("Store URL is not a valid URL");
    }

    if (!validatorEmail.validate(this.state.storeEmail)) {
      this.errors.push("Store e-mail address is not valid");
    }

    if (!validatorEmail.validate(this.state.technicalContactEmail)) {
      this.errors.push("Technical contact e-mail address is not valid");
    }

    if (! typeof Number(this.state.creditorZip) === 'number' && this.state.creditorZip.length != 4) {
      this.errors.push("Zip code is not valid: requires a 4 digit number");
    }

    const phone = this.state.technicalContactPhone.split(" ").join("");
    if (!validatePhoneNumber.validate(phone)) {
      this.errors.push("Technical contact phone is not valid: requires to use international format, e.g. +41 78 715 61 04");
    }

    if (! typeof Number(this.state.invoicePaymentAccountsReceivableDays) === 'number' &&
      Number(this.state.invoicePaymentAccountsReceivableDays) >= 7 && Number(this.state.invoicePaymentAccountsReceivableDays <= 30)) {
      this.errors.push("Accounts receivable income date is not valid: choose a value between 7 and 30 days.");
    }

    if (! typeof Number(this.state.invoicePaymentReminder1Days) === 'number' &&
      Number(this.state.invoicePaymentReminder1Days) >= 7 && Number(this.state.invoicePaymentReminder1Days) <= 30 &&
      Number(this.state.invoicePaymentReminder1Days) > Number(this.state.invoicePaymentAccountsReceivableDays)) {
      this.errors.push("Deadline for Reminder 1 invalid: choose a value between 7 and 60 days and make sure that 'Deadline for Reminder 1' > 'Accounts receivable income'");
    }

    if (! typeof Number(this.state.invoicePaymentReminder2Days) === 'number' &&
      Number(this.state.invoicePaymentReminder2Days) >= 30 && Number(this.state.invoicePaymentReminder2Days) <= 60 &&
      Number(this.state.invoicePaymentReminder2Days) > Number(this.state.invoicePaymentReminder1Days)) {
      this.errors.push("Deadline for Reminder 2 invalid: choose a value between 30 and 60 days and make sure that 'Deadline for Reminder 2' > 'Deadline for Reminder 1'");
    }

    if (! typeof Number(this.state.invoicePaymentReminder3Days) === 'number' &&
      Number(this.state.invoicePaymentReminder3Days) >= 45 && Number(this.state.invoicePaymentReminder3Days) <= 90 &&
      Number(this.state.invoicePaymentReminder3Days) > Number(this.state.invoicePaymentReminder2Days)) {
      this.errors.push("Deadline for Reminder 3 invalid: choose a value between 45 and 90 days and make sure that 'Deadline for Reminder 3' > 'Deadline for Reminder 2'");
    }

    if (!IBAN.isValid(this.state.paymentIBAN)) {
      this.errors.push("IBAN is invalid: Please doublecheck carefully.")
    }

    return this.errors.length == 0;

  }
  cancel() {
    const app = this.context;
    const redirect = Redirect.create(app);
    console.log("CANCEL");
    redirect.dispatch(
      Redirect.Action.APP,
      '/',
    );
  }

}

export default EditPaymentDetails;
