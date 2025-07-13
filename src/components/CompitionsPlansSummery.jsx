import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Compitionspayment.css";
import StudentFooter from "./StudentFooter";
import Studentheaderhome from "./Studentheaderhome";

const CompitionsPlansSummery = () => {
  const location = useLocation();
  const navigate = useNavigate()
  const { plan, form } = location.state || {};
  const [payTab, setPayTab] = useState("card");
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [formData, setFormData] = useState({
    nameOnCard: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const [errors, setErrors] = useState({});
  const [cardBrand, setCardBrand] = useState("");

  // Calculate prices
  const planPrice = Number(plan?.price) || 0;
  const convenienceFee = 60;
  const total = planPrice + convenienceFee;

  // Card number formatting and brand detection
  const formatCardNumber = (value) => {
    // Remove all non-digit
    const digits = value.replace(/\D/g, "");
    // Group in 4s
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const detectCardBrand = (number) => {
    const digits = number.replace(/\D/g, "");
    if (/^4/.test(digits)) return "Visa";
    if (/^5[1-5]/.test(digits)) return "MasterCard";
    if (/^3[47]/.test(digits)) return "Amex";
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "cardNumber") {
      const formatted = formatCardNumber(value);
      setFormData((prev) => ({
        ...prev,
        cardNumber: formatted,
      }));
      setCardBrand(detectCardBrand(formatted));
    } else if (name === "expiry") {
      // Auto-format expiry as MM/YY
      let digits = value.replace(/[^\d]/g, "");
      if (digits.length > 4) digits = digits.slice(0, 4);
      let formatted = digits;
      if (digits.length > 2) {
        formatted = digits.slice(0, 2) + " / " + digits.slice(2);
      }
      setFormData((prev) => ({
        ...prev,
        expiry: formatted,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePaymentMethodChange = (method) => {
    setSelectedPayment(method);
  };

  const validatePayment = () => {
    const newErrors = {};
    if (!formData.nameOnCard.trim()) newErrors.nameOnCard = "Name on card is required";
    if (!formData.cardNumber.trim() || formData.cardNumber.replace(/\s/g, '').length < 12) newErrors.cardNumber = "Valid card number required";
    if (!formData.expiry.trim() || !/^(0[1-9]|1[0-2])\s*\/\s*\d{2}$/.test(formData.expiry)) newErrors.expiry = "Expiry must be MM / YY";
    if (!formData.cvc.trim() || formData.cvc.length < 3) newErrors.cvc = "CVC required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validatePayment();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    // Simulate payment success
    window.alert("Payment successful! Registration complete.");
    navigate("/");
  };

  return (
    <>
      <Studentheaderhome />
      <div className="payment-container">
        <div className="payment-content">
          {/* Left Side - Order Summary */}
          <div className="order-summary">
            <div className="competition-header">
              <div className="logo-placeholder"></div>
              <div className="competition-info">
                <h2 className="competition-name">{form?.competitionName || "Competition"}</h2>
                <p className="institute-name">{form?.instituteName || "Institute"}</p>
              </div>
            </div>

            <div className="plan-summary">
              <h3>Plan summary</h3>

              <div className="plan-item">
                <div className="plan-details">
                  <div className="plan-name">{plan?.title || "Plan"}</div>
                  <div className="plan-description">{plan?.subtitle || "Plan details"}</div>
                </div>
                <div className="plan-price">INR {planPrice.toFixed(2)}</div>
              </div>

              <div className="plan-item">
                <div className="plan-details">
                  <div className="plan-name">Convenience Fee</div>
                </div>
                <div className="plan-price">INR {convenienceFee.toFixed(2)}</div>
              </div>

              <div className="total-section">
                <div className="total-label">Overall total</div>
                <div className="total-amount">INR {total.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Right Side - Payment Form */}
          <div className="payment-section">
            {/* Payment Methods Sidebar */}
            <div className="payment-sidebar">
              <h3>Pay with</h3>

              <div className="payment-options">
                <div
                  className={`payment-option ${selectedPayment === "card" ? "selected" : ""}`}
                  onClick={() => handlePaymentMethodChange("card")}
                >
                  <div className="option-indicator"></div>
                  <span>Credit / DebitCard</span>
                </div>

                <div
                  className={`payment-option ${selectedPayment === "upi" ? "selected" : ""}`}
                  onClick={() => handlePaymentMethodChange("upi")}
                >
                  <div className="option-indicator"></div>
                  <span>UPI</span>
                </div>

                <div
                  className={`payment-option ${selectedPayment === "netbanking" ? "selected" : ""}`}
                  onClick={() => handlePaymentMethodChange("netbanking")}
                >
                  <div className="option-indicator"></div>
                  <span>Net Banking</span>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="payment-form-content">
              {selectedPayment === "card" && (
                <form className="card-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Name on Card</label>
                    <input
                      type="text"
                      name="nameOnCard"
                      placeholder="Name"
                      value={formData.nameOnCard}
                      onChange={handleInputChange}
                    />
                    {errors.nameOnCard && <div style={{ color: 'red', marginTop: 4 }}>{errors.nameOnCard}</div>}
                  </div>

                  <div className="form-group">
                    <label>Card number</label>
                    <div className="card-input-container">
                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="1234 1234 1234 1234"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        maxLength={19} // 16 digits + 3 spaces
                        autoComplete="cc-number"
                      />
                      <div className="card-icons">
                        {cardBrand && (
                          <span className="card-icon" style={{ fontWeight: 'bold', color: '#007bff' }}>{cardBrand}</span>
                        )}
                      </div>
                    </div>
                    {errors.cardNumber && <div style={{ color: 'red', marginTop: 4 }}>{errors.cardNumber}</div>}
                  </div>

                  <div className="form-row">
                    <div className="form-group half">
                      <label>Expiry</label>
                      <input
                        type="text"
                        name="expiry"
                        placeholder="MM / YY"
                        value={formData.expiry}
                        onChange={handleInputChange}
                      />
                      {errors.expiry && <div style={{ color: 'red', marginTop: 4 }}>{errors.expiry}</div>}
                    </div>
                    <div className="form-group half">
                      <label>CVC</label>
                      <input
                        type="text"
                        name="cvc"
                        placeholder="CVC"
                        value={formData.cvc}
                        onChange={handleInputChange}
                      />
                      {errors.cvc && <div style={{ color: 'red', marginTop: 4 }}>{errors.cvc}</div>}
                    </div>
                  </div>

                  <button className="make-payment-btn" type="submit">Make Payment</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <StudentFooter />
    </>
  );
};

export default CompitionsPlansSummery;