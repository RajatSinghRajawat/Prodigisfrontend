import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import "./Schoolforgatpassword.css";
import Button from "./common/Button";
import Input from "./common/Input";
import Card from "./common/Card";

const Schoolforgatpassword = () => {
  const navigate = useNavigate();

  const handleSendOTP = () => {
    navigate("/ForgotPasswordVerify");
  };

  return (
    <div className='schoolforgat'>
      <div className="contanier-fluid ">
        <div className="row" style={{width:'100%'}}>
          <div className="col-lg-6 left-panel"></div>
          <div className="col-lg-6 p-0">
            <Card className="registration-form1">
              <h2>Forgot your password?</h2>
              <p className="forgot-password-text">
              Don’t worry ! It happens.
              </p>

              <form>
                <div className="form-group d-block mt-5">
                  <Input
                    label="School Email ID"
                    name="email"
                    placeholder="Enter your registered school Email ID"
                    type="mail"
                    required
                    className="custom-input"
                  />
                  <div className="button-container">
                    <Button
                      type="submit"
                      variant="primary"
                      size="large"
                      onClick={handleSendOTP}
                      className="submit-btn"
                    >
                      Send OTP
                    </Button>
                  </div>
                </div>

                <div className="form-actions1"><span>Still facing issues?</span>
                  <Link to="/forgot-password-email" className="email-link">
                  Contact Us
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

export default Schoolforgatpassword;