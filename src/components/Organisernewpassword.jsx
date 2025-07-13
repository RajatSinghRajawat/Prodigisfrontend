import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import Button from "./common/Button";
import Card from "./common/Card";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useOrganisationresetpasswordMutation } from "../store/api/apiSlice";
import { toast } from "react-toastify";

const Organisernewpassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const [password, setPassword] = useState("");
  const [reenterPassword, setReenterPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [resetpassword, { isLoading }] = useOrganisationresetpasswordMutation();

  const handleOTPVerify = async () => {
    if (!password || !reenterPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password.length < 5) {
      toast.error("Password must be at least 5 characters long.");
      return;
    }

    if (password !== reenterPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const credentials = {
        email: email,
        newPassword: password,
      };
      const response = await resetpassword(credentials).unwrap();
      if (response.status) {
        toast.success("Password updated successfully!");
        navigate("/organiser/login");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.data?.message || "Something went wrong. Try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isFormValid = password && reenterPassword && password.length >= 5;

  return (
    <div className="contanier-fluid">
      <div className="row" style={{ width: "100%" }}>
        <div className="col-lg-6 left-panel"></div>
        <div className="col-lg-6 p-0">
          <Card className="registration-form1">
            <h2>Create New Password</h2>

            <label style={{ marginTop: "3rem" }}>New Password</label>
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
              <span className="password-toggle" onClick={togglePasswordVisibility}>
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>

            <Button
              onClick={handleOTPVerify}
              variant="primary"
              size="large"
              className="submit-btn1"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Organisernewpassword;
