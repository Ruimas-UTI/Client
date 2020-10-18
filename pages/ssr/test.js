/* 
 *  File: test.js
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

import React from 'react';
import { render } from 'react-dom';
import { Context } from '@shopify/app-bridge-react';
import dynamic from 'next/dynamic';

class Test extends React.Component  {

  static contextType = Context;
  
  static async getInitialProps(ctx){
    const getinvoices = dynamic(() => import ('./invoice'));
    console.debug(invoices.length);
    return { name : getinvoices};
  }
  
  render(){
    
    return (<h1>test11  { this.props.name }</h1>);
  }

  async getServerSideProps() {
    // Fetch data from external API
    console.debug("Server side PROPS!!!");
    const data = { name: "test"};
    // Pass data to the page via props
    return { props: { data } }
  }
  
}

export default Test;

  
