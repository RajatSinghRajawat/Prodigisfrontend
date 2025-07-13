import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import Button from "./common/Button";
import Input from "./common/Input";
import Card from "./common/Card";
const ForgotPasswordVerifyOTP = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleOTPVerify = () => {
    navigate("/ForgotPasswordResetPassword");
  };
  return (
    <div>
      <div className="contanier-fluid ">
        <div className="row">
          <div className="col-lg-6 left-panel"></div>
          <div className="col-lg-6">
            <Card className="registration-form1">
              <h2>Verify your mobile Number</h2>

              <p className="otp-instruction mt-5">
                Enter the OTP sent to -{" +919876543210"}
              </p>

              <div className="otp-inputs">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    className="otp-input"
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[index] = e.target.value;
                      setOtp(newOtp);
                    }}
                  />
                ))}
              </div>

              <div className="timer">45 Sec</div>

              <div className="resend-otp">
                Don't receive code?{" "}
                <Button variant="text" className="resend-button">
                  Resend OTP
                </Button>
              </div>
              <div className="form-actions1">
                <Link to="/forgot-password-email" className="email-link">
                  Try using Email ID
                </Link>
              </div>

              <Button
                onClick={handleOTPVerify}
                variant="primary"
                size="large"
                className="submit-btn"
              >
                Verify
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordVerifyOTP;
