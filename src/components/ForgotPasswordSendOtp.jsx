import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import Button from "./common/Button";
import Input from "./common/Input";
import Card from "./common/Card";

const ForgotPasswordSendOtp = () => {
  const navigate = useNavigate();
  const [mobileNumber, setmobileNumber] = useState("")
  
  const handleSendOTP = () => {
    navigate("/ForgotPasswordVerify");
  };

  const isFormInvalid = !mobileNumber.trim()


  return (
    <div>
      <div className="contanier-fluid ">
        <div className="row" style={{ width: "100%" }}>
          <div className="col-lg-6 left-panel"></div>
          <div className="col-lg-6">
            <Card className="registration-form1">
              <h2>Forgot your password?</h2>
              <p className="forgot-password-text">
                Don't worry! It happens. Please enter your registered mobile
                number
              </p>

              <form>
                <div className="form-group d-block">
                  <Input
                    label="Mobile Number"
                    name="mobileNumber"
                    placeholder="+91   9876543210"
                    type="tel"
                    required
                    onChange={(e) => { setmobileNumber(e.target.value) }}
                    className="custom-input"
                  />
                  <div className="button-container">
                    <button
                      type="submit" 
                      size="large"
                      onClick={handleSendOTP}
                      className="submit-btn"
                      disabled={isFormInvalid}
                      style={{
                        background: isFormInvalid ? "#D3D3D3" : "#4CAF4F"
                      }}
                    >
                      Send OTP
                    </button>
                  </div>
                </div>

               <div>
                <Link to="/forgot-password-email" className="email-link">
                    Try using Email ID
                  </Link>
               </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordSendOtp;