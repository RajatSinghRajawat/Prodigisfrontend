import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import "./Schoolforgatpassword.css";
import Button from "./common/Button";
import Input from "./common/Input";
import Card from "./common/Card";
import { useOrganisationforgetpassotpMutation } from "../store/api/apiSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Organiserforgetpassword = () => {
  const navigate = useNavigate();
  const [sendotp, { isLoading }] = useOrganisationforgetpassotpMutation();

  const [formData, setFormData] = useState({
    email: ""
  });

  const [formValidate, setFormValidate] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setFormValidate(value.trim() !== "");
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

    const credentials = isEmail
      ? { email: formData.email }
      : { mobile_num: formData.email };

    try {
      const response = await sendotp(credentials).unwrap();

      // console.log(response.message, "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");

      if (response.status) {
        console.log(response.message);
        
        toast.success(response.message || "OTP sent successfully!");
        navigate("/organiser/verify-forget-email-otp", {
          state: { email: formData.email }
        });
      } else {
        toast.error(response.message || "Something went wrong. Try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error(error?.data?.message || "Something went wrong. Try again.");
    }
  };

  return (
    <div className="schoolforgat">
      <div className="contanier-fluid">
        <div className="row" style={{ width: "100%" }}>
          <div className="col-lg-6 left-panel"></div>
          <div className="col-lg-6 p-0">
            <Card className="registration-form1">
              <h2>Forgot your password?</h2>
              <p className="forgot-password-text">Don’t worry! It happens.</p>

              <form>
                <div className="form-group">
                  <Input
                    label="Organiser’s Email ID"
                    name="email"
                    placeholder="Enter your registered organiser Email ID"
                    type="email"
                    required
                    className="custom-input"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="button-container">
                  <Button
                    type="submit"
                    variant="primary"
                    size="large"
                    onClick={handleSendOTP}
                    className="submit-btn"
                    disabled={!formValidate || isLoading}
                  >
                    {isLoading ? "Sending..." : "Send OTP"}
                  </Button>
                </div>

                <div className="form-actions1">
                  <span>Still facing issues?</span>
                  <Link to="/forgot-password-email" className="email-link">
                    Contact Us
                  </Link>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>

      {/* Toast Container should be present for toast to work */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default Organiserforgetpassword;
