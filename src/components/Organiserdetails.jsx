import React, { useState } from "react";
import "./StudentLogin.css";
import "./SchoolDetails.css";
import "./AdditionalDetails.css";

import { useLocation, useNavigate } from "react-router-dom";

import Button from "./common/Button";
import Input from "./common/Input";
import Card from "./common/Card";
import { useOrganisationRegisterMutation } from "../store/api/apiSlice";
import { toast } from "react-toastify";

const Organiserdetails = () => {
  const navigate = useNavigate();
  const [organisationRegister, { isLoading }] =
    useOrganisationRegisterMutation();
  const location = useLocation();
  const { mobileNumber, role, name, password, email } = location.state || {};
  console.log(mobileNumber, role, name, password, email, "last data");

  const [formData, setFormData] = useState({
    name: name || "",
    role: role || "",
    mobileNumber: mobileNumber || "",
    organiserName: "",
    organiserAddress: {
      addressLine1: "",
      addressLine2: "",
      addressLine3: "",
      cityDistrict: "",
      pincode: "",
      country: "India",
    },
    organiserMobileNumber: "",
    organiserEmail: "",
    organiserWebsite: "",
    directorName: "",
    directorMobileNumber: "",
    password: password || "",
  });

  // Error state for each field
  const [errors, setErrors] = useState({});

  // Validation function
  const validate = () => {
    const newErrors = {};

    if (!formData.organiserName.trim()) {
      newErrors.organiserName = "Organiser Name is required";
    }

    if (!formData.organiserAddress.addressLine1.trim()) {
      newErrors.addressLine1 = "Address Line 1 is required";
    }

    if (!formData.organiserAddress.addressLine2.trim()) {
      newErrors.addressLine2 = "Address Line 2 is required";
    }

    if (!formData.organiserAddress.addressLine3.trim()) {
      newErrors.addressLine3 = "Address Line 3 is required";
    }

    if (!formData.organiserAddress.cityDistrict.trim()) {
      newErrors.cityDistrict = "City / District is required";
    }

    if (!formData.organiserAddress.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{5,6}$/.test(formData.organiserAddress.pincode.trim())) {
      newErrors.pincode = "Pincode must be 5 or 6 digits";
    }

    if (!formData.organiserAddress.country.trim()) {
      newErrors.country = "Country is required";
    }

    if (!formData.organiserMobileNumber.trim()) {
      newErrors.organiserMobileNumber = "Organiser Mobile Number is required";
    } else if (!/^\+91\d{10}$/.test(formData.organiserMobileNumber.trim())) {
      newErrors.organiserMobileNumber = "Enter valid 10 digit mobile number starting with +91";
    }

    if (!formData.organiserEmail.trim()) {
      newErrors.organiserEmail = "Organiser Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
        formData.organiserEmail.trim()
      )
    ) {
      newErrors.organiserEmail = "Enter valid email address";
    }

    if (!formData.organiserWebsite.trim()) {
      newErrors.organiserWebsite = "Organiser Website is required";
    } else if (
      !/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(
        formData.organiserWebsite.trim()
      )
    ) {
      newErrors.organiserWebsite =
        "Enter valid website URL starting with http/https";
    }

    if (!formData.directorName.trim()) {
      newErrors.directorName = "Director's Name is required";
    }

    if (!formData.directorMobileNumber.trim()) {
      newErrors.directorMobileNumber = "Director's Mobile Number is required";
    } else if (!/^\+91\d{10}$/.test(formData.directorMobileNumber.trim())) {
      newErrors.directorMobileNumber = "Enter valid 10 digit mobile number starting with +91";
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  // Handler for input change
  const handleChange = (field, value, nestedField) => {
    if (nestedField) {
      setFormData((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          [nestedField]: value,
        },
      }));

      // Remove error for that field on change
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[nestedField];
        return copy;
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const isFormCompletelyFilled = () => {
    const {
      organiserName,
      organiserAddress,
      organiserMobileNumber,
      organiserEmail,
      organiserWebsite,
      directorName,
      directorMobileNumber,
    } = formData;
    console.log(formData, "formData");

    return (
      organiserName.trim() &&
      organiserAddress.addressLine1.trim() &&
      organiserAddress.addressLine2.trim() &&
      organiserAddress.addressLine3.trim() &&
      organiserAddress.cityDistrict.trim() &&
      organiserAddress.pincode.trim() &&
      organiserAddress.country.trim() &&
      organiserMobileNumber.trim() &&
      organiserEmail.trim() &&
      organiserWebsite.trim() &&
      directorName.trim() &&
      directorMobileNumber.trim()
    );
  };

  return (
    <div className="Organiserform Organiserform-detail-form">
      <div className="registration-container">
        <Card className="registration-form">
          <h1>Tell us more about your Organisation</h1>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (validate()) {
                const response = await organisationRegister(formData);
                console.log(response, " response");
                if (response.status || response.data.status) {
                  navigate("/organiser/login");
                } else {
                  // toast.error(response.message || 'Registration failed. Please try again.');
                }
              }
            }}
          >
            <div className="form-group">
              <Input
                label="Organiser Name"
                name="organiserName"
                value={formData.organiserName}
                onChange={(e) => handleChange("organiserName", e.target.value)}
                placeholder="Enter Organiser Name"
                required
              />
              {errors.organiserName && (
                <div className="error-message">{errors.organiserName}</div>
              )}
            </div>

            <div
              className="form-group password-group"
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <div
                className="form-group"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <Input
                  label="Organiser Address Line 1"
                  name="addressLine1"
                  value={formData.organiserAddress.addressLine1}
                  onChange={(e) =>
                    handleChange(
                      "organiserAddress",
                      e.target.value,
                      "addressLine1"
                    )
                  }
                  type="text"
                  placeholder="Address Line 1"
                  required
                />
                {errors.addressLine1 && (
                  <div className="error-message">{errors.addressLine1}</div>
                )}

                <Input
                  name="addressLine2"
                  value={formData.organiserAddress.addressLine2}
                  onChange={(e) =>
                    handleChange(
                      "organiserAddress",
                      e.target.value,
                      "addressLine2"
                    )
                  }
                  type="text"
                  placeholder="Address Line 2"
                  required
                />
                {errors.addressLine2 && (
                  <div className="error-message">{errors.addressLine2}</div>
                )}

                <Input
                  name="addressLine3"
                  value={formData.organiserAddress.addressLine3}
                  onChange={(e) =>
                    handleChange(
                      "organiserAddress",
                      e.target.value,
                      "addressLine3"
                    )
                  }
                  type="text"
                  placeholder="Address Line 3"
                  required
                />
                {errors.addressLine3 && (
                  <div className="error-message">{errors.addressLine3}</div>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <Input
                    label="City / District*"
                    name="cityDistrict"
                    value={formData.organiserAddress.cityDistrict}
                    onChange={(e) =>
                      handleChange(
                        "organiserAddress",
                        e.target.value,
                        "cityDistrict"
                      )
                    }
                    placeholder="Enter City"
                    required
                  />
                  {errors.cityDistrict && (
                    <div className="error-message">{errors.cityDistrict}</div>
                  )}
                </div>
                <div className="form-group">
                  <Input
                    label="Pincode"
                    name="pincode"
                    value={formData.organiserAddress.pincode}
                    onChange={(e) =>
                      handleChange(
                        "organiserAddress",
                        e.target.value,
                        "pincode"
                      )
                    }
                    placeholder="Enter Pincode"
                    required
                  />
                  {errors.pincode && (
                    <div className="error-message">{errors.pincode}</div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="Country" className="contit">
                  Country
                </label>
                <select
                  className="custom-select select-input"
                  value={formData.organiserAddress.country}
                  onChange={(e) =>
                    handleChange("organiserAddress", e.target.value, "country")
                  }
                >
                  <option value="India">India</option>
                </select>
                {errors.country && (
                  <div className="error-message">{errors.country}</div>
                )}
              </div>

              <div className="form-group">
                <Input
                  label="Organiser Mobile number"
                  name="organiserMobileNumber"
                  value={formData.organiserMobileNumber || '+91'}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (!value.startsWith('+91')) {
                      value = '+91' + value.replace(/^\+?91?/, '');
                    }
                    // Only allow +91 followed by up to 10 digits
                    value = value.replace(/[^\d+]/g, '');
                    if (value.length > 13) value = value.slice(0, 13);
                    handleChange("organiserMobileNumber", value);
                  }}
                  maxLength={13}
                  placeholder="Enter organisation's official mobile number"
                  required
                />
                {errors.organiserMobileNumber && (
                  <div className="error-message">
                    {errors.organiserMobileNumber}
                  </div>
                )}
              </div>

              <div className="form-group">
                <Input
                  label="Organiser Email ID"
                  name="organiserEmail"
                  value={formData.organiserEmail}
                  onChange={(e) =>
                    handleChange("organiserEmail", e.target.value)
                  }
                  placeholder="Enter organisation's official email ID"
                  required
                />
                {errors.organiserEmail && (
                  <div className="error-message">{errors.organiserEmail}</div>
                )}
              </div>

              <div className="form-group">
                <Input
                  label="Organiser Website link"
                  name="organiserWebsite"
                  value={formData.organiserWebsite}
                  onChange={(e) =>
                    handleChange("organiserWebsite", e.target.value)
                  }
                  placeholder="Enter link to Organiser's website"
                  required
                />
                {errors.organiserWebsite && (
                  <div className="error-message">{errors.organiserWebsite}</div>
                )}
              </div>

              <div className="form-group">
                <Input
                  label="Director's Name"
                  name="directorName"
                  value={formData.directorName}
                  onChange={(e) => handleChange("directorName", e.target.value)}
                  placeholder="Enter Director's Name"
                  required
                />
                {errors.directorName && (
                  <div className="error-message">{errors.directorName}</div>
                )}
              </div>

              <div className="form-group">
                <Input
                  label="Director's Mobile Number"
                  name="directorMobileNumber"
                  value={formData.directorMobileNumber || '+91'}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (!value.startsWith('+91')) {
                      value = '+91' + value.replace(/^\+?91?/, '');
                    }
                    // Only allow +91 followed by up to 10 digits
                    value = value.replace(/[^\d+]/g, '');
                    if (value.length > 13) value = value.slice(0, 13);
                    handleChange("directorMobileNumber", value);
                  }}
                  maxLength={13}
                  placeholder="Enter Director's Mobile Number"
                  required
                />
                {errors.directorMobileNumber && (
                  <div className="error-message">
                    {errors.directorMobileNumber}
                  </div>
                )}
              </div>
            </div>

            <div className="form-actions d-flex justify-content-center">
              <button
                type="submit"
                size="large"
                className="submit-btn sub-but"
                disabled={isLoading || !isFormCompletelyFilled()}
                style={{
                  background: isFormCompletelyFilled() ? "#4CAF4F" : "#D3D3D3",
                }}
              >
                {isLoading ? "Submitting..." : "Continue"}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Organiserdetails;