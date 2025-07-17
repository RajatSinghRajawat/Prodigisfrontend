import React, { useState } from 'react';
import './StudentLogin.css';
// import './Registration.css';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL, API_ENDPOINTS } from '../config/apiConfig';
import { toast } from 'react-toastify';
import Button from './common/Button';
import Input from './common/Input';
import Card from './common/Card';
import googleIcon from '../assets/google-icon.svg';
import microsoftIcon from '../assets/microsoft-icon.svg';
import eyeIcon from '../assets/eye.svg';
import eyeOffIcon from '../assets/eye-off.svg';

const StudentLogin = () => {


  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const isFormInvalid = !formData.email.trim() || !formData.password.trim();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateEmail = (email) => {
    // Simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateMobile = (mobile) => {
    return /^\d{10}$/.test(mobile);
  };

  const getPasswordErrors = (password) => {
    const errors = [];
    if (!/.{8,}/.test(password)) errors.push('Min. 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('Min. 1 Capital letter');
    if (!/[0-9]/.test(password)) errors.push('Min. 1 numeric character');
    if (!/[~!@#$%^&*()_+=\[\]{};':",.<>/?-]/.test(password)) errors.push('Min. 1 special character ("~!@#$%^&*()_+=[]{};\':\",.<>/?-")');
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      email: '',
      password: ''
    };

    const emailOrMobile = formData.email.trim();
    if (!emailOrMobile) {
      newErrors.email = 'Email or mobile number is required';
    } else if (emailOrMobile.includes('@')) {
      if (!validateEmail(emailOrMobile)) {
        newErrors.email = 'Please enter a valid email ID. Eg. - name@example.com';
      }
    } else if (!validateMobile(emailOrMobile)) {
      newErrors.email = 'Please enter a valid 10-digit mobile number.';
    }

    const passwordErrors = getPasswordErrors(formData.password);
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (passwordErrors.length > 0) {
      newErrors.password = '';
    }

    setErrors(newErrors);

    if (newErrors.email || (newErrors.password && !formData.password.trim())) {
      return;
    }

    const isEmail = formData.email.includes('@');
    const credentials = isEmail
      ? { email: formData.email, password: formData.password }
      : { mobile_num: formData.email, password: formData.password };

    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await response.json();
      setIsLoading(false);
      if (!response.ok) {
        toast.error(data.message || 'Login failed. Please try again.');
        return;
      }
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      toast.success('Login successful!');
      navigate('/student/dashboard');
    } catch (err) {
      setIsLoading(false);
      toast.error('Login failed. Please try again.');
    }
  };


  const handleGoogleSignIn = () => {
    console.log('Sign in with Google');
  };

  const handleMicrosoftSignIn = () => {
    console.log('Sign in with Microsoft');
  };

  return (
    <div className="registration-container">
      <Card className="registration-form">
        <h1>Welcome back!</h1>

        <div className="social-buttons">
          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className="social-button google"
          >
            <img src={googleIcon} alt="Google" />
            Log In with Google
          </Button>
          <Button
            onClick={handleMicrosoftSignIn}
            variant="outline"
            className="social-button microsoft"
          >
            <img src={microsoftIcon} alt="Microsoft" />
            Log In with Microsoft
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <Input
              label="Email or Mobile Number"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="saumyata@gmail.com or 9876543210"
              required
            />

          </div>
          {errors.email && <p className="error-message">{errors.email}</p>}

          <div className="form-group password-group" style={{ position: "relative" }}>
            <Input
              label="Password"
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="*************"
              required
              className="password-input"
              autoComplete="off"
              icon={
                <img
                  src={showPassword ? eyeOffIcon : eyeIcon}
                  alt={showPassword ? "Hide password" : "Show password"}
                  className="password-toggle-icon"
                  onClick={() => setShowPassword(!showPassword)}
                />
              }
            />
          </div>
          {formData.password && getPasswordErrors(formData.password).length > 0 && (
            <div style={{ color: 'red', fontSize: 13, marginTop: 4 }}>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {getPasswordErrors(formData.password).map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}
          <div className='forgot-password' style={{ cursor: "pointer" }} onClick={() => { navigate("/ForgotPasswordSendOtp") }}>Forgot your password?</div>

          <div className="form-actions">
            <div className="terms-checkbox">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
              />
              <label htmlFor="terms">Remember me</label>
            </div>

            <button
              type="submit"
              size="large"
              disabled={isFormInvalid}
              className="submit-btn"
              style={{
                background: isFormInvalid ? "#D3D3D3" : "#4CAF4F"
              }}
            >
              {isLoading ? 'Logging in...' : 'LOG IN'}
            </button>
          </div>
          <div className="register-link">
            No account yet? <Link to="/student/register/mobile">Register Now</Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default StudentLogin; 