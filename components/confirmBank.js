/* 
 *  File: confirmBank.js
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

const ConfirmBankAccount = function() {
    const [active, setActive] = useState(true);
  
    const handleChange = useCallback(() => setActive(!active), [active]);
  
    return (
      <div style={{height: '500px'}}>
        <Button onClick={handleChange}>Open</Button>
        <Modal
          open={active}
          onClose={handleChange}
          title="Did you review your bank account information?"
          primaryAction={{
            content: 'Confirm',
            onAction: handleChange,
          }}
          secondaryActions={[
            {
              content: 'Cancel',
              onAction: handleChange,
            },
          ]}
        >
          <Modal.Section>
            <TextContainer>
              <p>
                Make sure you carefully reviewed the bank account information.
                We are not responsible for any invalid payments due to wrong IBAN entries provided and record any change to your bank account and associated IP addresses used.
              </p>
            </TextContainer>
          </Modal.Section>
        </Modal>
      </div>
    );
  }
  export default ConfirmBankAccount;