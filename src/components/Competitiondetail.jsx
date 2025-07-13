import React from 'react';
import './Competitiondetail.css';



function Competitiondetail() {
  return (
    <>
    <div className="cardpament">
    <div className="container">
      <div className="left-panel">
        <div className="side-icon">
          <div className="box"></div>
          <div className="content">
            <h2>Competition Name</h2>
            <p>Institute Name</p>
          </div>
        </div>

        <div className="cardpamt">
          <div className="card">
            <h2 className="card-title">Plan summary</h2>

            <div className="plan-item">
              <div className="item-details">
                <div className="item-name">Advanced Prep</div>
                <div className="item-description">
                  Registration + Prep + Past Year Question Papers
                </div>
              </div>
              <div className="item-price">INR 1200.00</div>
            </div>

            <div className="plan-item">
              <div className="item-details">
                <div className="item-name">Convenience Fee</div>
              </div>
              <div className="item-price">INR 60.00</div>
            </div>

            <div className="divider"></div>

            <div className="total-row">
              <div className="total-label">Overall total</div>
              <div className="total-amount">INR 1260.00</div>
            </div>
          </div>
        </div>
      </div>

      <div className="right-panel">
        <h2>We Need Some More Information To Process The Application</h2>

        <div className="payment-container">
          <div className="payment-sidebar">
            <h3 className="sidebar-title">Pay with</h3>

            <div className="payment-option selected">
              <div className="option-indicator"></div>
              <i className="fas fa-credit-card"></i>
              <span>Credit / Debit Card</span>
            </div>

            <div className="payment-option">
              <i className="fas fa-mobile-alt"></i>
              <span>UPI</span>
            </div>

            <div className="payment-option">
              <i className="fas fa-university"></i>
              <span>Net Banking</span>
            </div>
          </div>

          <div className="payment-form">
            <div className="form-group">
              <label htmlFor="cardName">Name on Card</label>
              <input type="text" id="cardName" placeholder="Name" />
            </div>

            <div className="form-group">
              <label htmlFor="cardNumber">Card number</label>
              <div className="card-number-container">
                <input
                  type="text"
                  id="cardNumber"
                  placeholder="1234 5678 1234 1234"
                />
                <div className="card-icons">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                    alt="Visa"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png"
                    alt="Mastercard"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png"
                    alt="Amex"
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="expiry">Expiry</label>
                <input type="text" id="expiry" placeholder="MM / YY" />
              </div>

              <div className="form-group half">
                <label htmlFor="cvc">CVC</label>
                <input type="text" id="cvc" placeholder="CVC" />
              </div>
            </div>

            <button className="payment-button">Make Payment</button>
          </div>
        </div>
      </div>
    </div>

    </div>
    </>
  )
  
}

export default Competitiondetail;
