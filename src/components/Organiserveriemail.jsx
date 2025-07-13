import React, { useState } from "react";
import "./AdditionalDetails.css";
import "./Schoolmobile.css";
import { useSendOtpOrganiserPhoneMutation } from "../store/api/apiSlice";
import { useNavigate } from "react-router-dom";

const Organiserveriemail = () => {
  const [sendOtpOrganiserPhone, { isLoading }] =
    useSendOtpOrganiserPhoneMutation();
  const Navigate = useNavigate();

  const [formData, setFormData] = useState({
    mobile_num: "",
    name: "",
    role: "",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const isFormInvalid =
    !formData.mobile_num.trim() ||
    !formData.name.trim() ||
    !formData.role.trim() ||
    !termsAccepted;

  const [formErrors, setFormErrors] = useState({});
  const options = [
    "Admin",
    "Director",
    "HOD",
    "Teacher",
    "Principal",
    "Vice Principal",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For mobile number, only allow digits and limit to 10 characters
    if (name === 'mobile_num') {
      const numericValue = value.replace(/\D/g, ''); // Remove non-digits
      if (numericValue.length <= 10) {
        setFormData((prev) => ({
          ...prev,
          [name]: numericValue,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    
    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const validate = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.role) {
      errors.role = "Role is required";
    }

    if (!formData.mobile_num.trim()) {
      errors.mobile_num = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(formData.mobile_num)) {
      errors.mobile_num = "Enter a valid 10-digit mobile number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const response = await sendOtpOrganiserPhone(
        formData.mobile_num
      ).unwrap();
      console.log(response);

      if (response.status) {
        Navigate("/organiser/verify-opt", {
          state: {
            mobileNumber: formData.mobile_num,
            role: formData.role,
            name: formData.name,
          },
        });
      }
    } catch (err) {
      console.error("OTP send failed:", err);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-form orgenaiser-registration-form">
        <h1 className="heading-details">
          Register Your Organisation To Elevate Your Competitions!
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Your Full Name"
            />
            {formErrors.name && (
              <div className="error-text">{formErrors.name}</div>
            )}
          </div>

          <div className="form-group">
            <label>
              Your Role in Organisation <span className="text-danger">*</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="select-input inslect"
            >
              <option value="" disabled>
                Select
              </option>
              {options.map((opt, index) => (
                <option key={index} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {formErrors.role && (
              <div className="error-text">{formErrors.role}</div>
            )}
          </div>

          <div className="form-group mt-5">
            <label htmlFor="">Your Mobile Number</label>
            <input
              type="text"
              name="mobile_num"
              value={formData.mobile_num}
              onChange={handleChange}
              placeholder="Enter your mobile number"
              maxLength="10"
            />
            {formErrors.mobile_num && (
              <div className="error-text">{formErrors.mobile_num}</div>
            )}
          </div>

          <label className="terms-checkbox">
            <input 
              type="checkbox" 
              checked={termsAccepted}
              onChange={handleTermsChange}
            />I accept the{" "}
            <a href="#">Terms & Condition</a> and <a href="#">Privacy Policy</a>
          </label>

          <div className="form-button">
            <button
              type="submit"
              disabled={isFormInvalid}
              className="submit-btn mb-2"
              style={{
                background: isFormInvalid ? "#D3D3D3" : "#4CAF4F",
                borderRadius: "4px",
              }}
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Organiserveriemail;
