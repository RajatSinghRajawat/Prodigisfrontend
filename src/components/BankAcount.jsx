import React, { useState } from "react";
import OrganiserFooter from "./OrganiserFooter";
import Organisersheader from "./Organisersheader";
import "./BankAcount.css"

const BankAcount = () => {
  const [formData, setFormData] = useState({
    accountNumber: "",
    ifsc: "",
    accountType: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const isFormValid = formData.accountNumber.trim() && 
                     formData.ifsc.trim() && 
                     formData.accountType;

  return (
    <div>
      <Organisersheader />
      <div className="bankAccount-header">
        <h2 className="bankAccount-title">Bank Account Addition</h2>
      </div>
      <div className="bankAccount-container">
        <form className="bankAccount-form" onSubmit={handleSubmit}>
          <div className="bankAccount-formGroup">
            <label className="bankAccount-label">
              Account No.<span className="bankAccount-required">*</span>
            </label>
            <input
              type="text"
              name="accountNumber"
              className="bankAccount-input"
              placeholder="Enter Bank Account number"
              value={formData.accountNumber}
              onChange={handleInputChange}
              maxLength="18"
            />
          </div>

          <div className="bankAccount-formGroup">
            <label className="bankAccount-label">
              IFSC<span className="bankAccount-required">*</span>
            </label>
            <input
              type="text"
              name="ifsc"
              className="bankAccount-input"
              placeholder="Enter IFSC"
              value={formData.ifsc}
              onChange={handleInputChange}
              maxLength="11"
            />
          </div>

          <div className="bankAccount-formGroup">
            <label className="bankAccount-label">
              Account Type<span className="bankAccount-required">*</span>
            </label>
            <select 
              name="accountType"
              className="bankAccount-select"
              value={formData.accountType}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="savings">Savings</option>
              <option value="current">Current</option>
            </select>
          </div>
        </form>
        <div className="bankAccount-button-outer">
          <button 
            className="bankAccount-button" 
            disabled={!isFormValid}
            onClick={handleSubmit}
          >
            Add Bank Account
          </button>
        </div>
      </div>
      <OrganiserFooter />
    </div>
  );
};

export default BankAcount;
