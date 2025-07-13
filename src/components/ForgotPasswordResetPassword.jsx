import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import Button from "./common/Button";
import Card from "./common/Card";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const ForgotPasswordResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [reenterPassword, setReenterPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleOTPVerify = () => {
    navigate("/student/dashboard");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="contanier-fluid">
      <div className="row">
        <div className="col-lg-6 left-panel"></div>
        <div className="col-lg-6">
          <Card className="registration-form1">
            <h2>Create New Password</h2>
            <label style={{marginTop:"3rem"}}>Password</label>
            <input
              className="custom-input1"
              type="password"
              placeholder="************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Re-enter Password</label>
            <div className="password-wrapper">
              <input
                className="custom-input1"
                type={showPassword ? "text" : "password"}
                placeholder="************"
                value={reenterPassword}
                onChange={(e) => setReenterPassword(e.target.value)}
              />
              <span
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>
            <Button
              onClick={handleOTPVerify}
              variant="primary"
              size="large"
              className="submit-btn1"
            >
              Update Password
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordResetPassword;