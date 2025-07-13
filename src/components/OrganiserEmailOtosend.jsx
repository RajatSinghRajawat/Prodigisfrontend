import React, { useState } from 'react';
import './StudentLogin.css';
import './Schoollogin.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSendOtpOrganiserEmailMutation } from '../store/api/apiSlice';
import { toast } from 'react-toastify';
import Button from './common/Button';
import Input from './common/Input';
import Card from './common/Card';
import googleIcon from '../assets/google-icon.svg';
import microsoftIcon from '../assets/microsoft-icon.svg';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const OrganiserEmailOtosend = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mobileNumber, role, name } = location.state || {};

  const [sendOtpOrganiserEmail, { isLoading }] = useSendOtpOrganiserEmailMutation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const isFormInvalid = !formData.email.trim()
    || !formData.password.trim()

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  // Password validation function as per the policy
  const validatePassword = (password) => {
    // Min. 8 characters
    // Min. 1 Capital letter
    // Min. 1 numeric character
    // Min. 1 special character (~`!@#$%^&*()_-+={[}]|:;"'<,>.?/)
    const minLength = /.{8,}/;
    const capital = /[A-Z]/;
    const number = /[0-9]/;
    const special = /[~`!@#$%^&*()_\-+={[}\]|:;"'<,>.?/]/;
    return (
      minLength.test(password) &&
      capital.test(password) &&
      number.test(password) &&
      special.test(password)
    );
  };

  const validate = () => {
    const newErrors = { email: '', password: '' };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = 'Email is required.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Enter a valid email.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (!validatePassword(formData.password)) {
      newErrors.password =
        'Password must be at least 8 characters, include 1 capital letter, 1 number, and 1 special character.';
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error as user types
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      // alert(mobileNumber)
      // alert(formData.email)
      const response = await sendOtpOrganiserEmail({ data: { email: formData.email, mobileNumber: mobileNumber } }).unwrap();
      toast.success(response.message || 'OTP sent successfully');
      navigate('/organiser/verify-email-otp', {
        state: {
          email: formData.email,
          mobileNumber,
          role,
          name,
          password: formData.password,
        },
      });
    } catch (err) {
      console.log(err);

      toast.error(err?.data?.message || 'Failed to send OTP. Please try again.');
    }
  };

  const handleGoogleSignIn = () => console.log('Sign in with Google');
  const handleMicrosoftSignIn = () => console.log('Sign in with Microsoft');

  return (
    <div className="schoollogin">
      <div className="registration-container">
        <Card className="registration-form">
          <h1>Register Your Email</h1>

          <div className="">
            <div className="social-buttons">
              <div>
                <Button onClick={handleGoogleSignIn} variant="outline" className="social-button google">
                  <img src={googleIcon} alt="Google" />
                  Register with Google
                </Button>
              </div>
              <div>
                <Button onClick={handleMicrosoftSignIn} variant="outline" className="social-button microsoft">
                  <img src={microsoftIcon} alt="Microsoft" />
                  Register with Microsoft
                </Button>
              </div>
              <div>
                <Button variant="outline" className="social-button sso">
                  Register with SSO
                </Button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="registration-form2 registration-form-validate mt-5">
            <div className="form-group">
              <div className="w-100">
                <Input
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="saumyata@gmail.com"
                  required
                />
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>
            </div>

            <div className="form-group password-group">
              <div className="w-100">
                <div className='w-100 form-group password-group'>
                  <Input
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="*************"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{marginTop:"-20px"}}
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
                {errors.password && <div className="error-message">{errors.password}</div>}
              </div>
            </div>

            <div className="form-actions" style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                type="submit"
                size="large"
                disabled={isFormInvalid}
                style={{
                  background: isFormInvalid ? "#D3D3D3" : "#4CAF4F"
                }}
                className="submit-btn"
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default OrganiserEmailOtosend;
