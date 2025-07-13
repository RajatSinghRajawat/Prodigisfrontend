import React, { useState } from 'react';
import './StudentLogin.css';
import './Schoollogin.css';
import { Link, useNavigate } from 'react-router-dom';
import { useOrganisationloginMutation } from '../store/api/apiSlice';
import { toast } from 'react-toastify';
import Button from './common/Button';
import Input from './common/Input';
import Card from './common/Card';
import googleIcon from '../assets/google-icon.svg';
import microsoftIcon from '../assets/microsoft-icon.svg';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Organiserlogin = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useOrganisationloginMutation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const isFormInvalid = !formData.email.trim() || !formData.password.trim()

  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors((prev) => ({
      ...prev,
      [name]: '', // Clear error on change
    }));
  };

  const validatePassword = (password) => {
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
    let errors = {};
    if (!formData.email.trim()) {
      errors.email = 'Email or Mobile number is required';
    } else if (
      formData.email.includes('@') &&
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)
    ) {
      errors.email = 'Invalid email format';
    } else if (!formData.email.includes('@') && !/^\+91[0-9]{10}$/.test(formData.email)) {
      errors.email = 'Mobile number must be 10 digits and start with +91';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      errors.password = 'Password must be at least 8 characters, include 1 capital letter, 1 number, and 1 special character.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const isEmail = formData.email.includes('@');
    const credentials = isEmail
      ? { email: formData.email, password: formData.password }
      : { mobile_num: formData.email, password: formData.password };

    try {
      const response = await login(credentials).unwrap();
      console.log(response);
      localStorage.setItem('token',JSON.stringify(response.token))
      localStorage.setItem('user_Data', JSON.stringify(response.data));
      navigate('/organiser/dashboard');
    } catch (err) {
      toast.error(err.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="schoollogin">
      <div className="registration-container">
        <Card className="registration-form">
          <h1>Welcome back!</h1>
          <div className="social-buttons">
            <Button onClick={() => console.log('Google')} variant="outline" className="social-button google">
              <img src={googleIcon} alt="Google" />
              Log In with Google
            </Button>
            <Button onClick={() => console.log('Microsoft')} variant="outline" className="social-button microsoft">
              <img src={microsoftIcon} alt="Microsoft" />
              Log In with Microsoft
            </Button>
            <Button variant="outline" className="social-button microsoft">
              Log In with SSO
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="registration-form2 mt-5">
            <div className="form-group">
              <div className='w-100'>
                <Input
                  label="Email or Mobile Number"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="saumyata@gmail.com or 9876543210"
                  required
                />
                {formErrors.email && <div className="error-text">{formErrors.email}</div>}
              </div>
            </div>

            <div className="form-group password-group">
              <div className='w-100'>
                <div className='password-group form-group'>
                  <Input
                    className='input-grow'
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
                    className="toggle-password "
                    onClick={() => setShowPassword(!showPassword)}
                    style={{marginTop:"-20px"}}
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
                {formErrors.password && <div className="error-text">{formErrors.password}</div>}
              </div>
            </div>

            <div className="forgot-password" style={{cursor:"pointer"}} onClick={() => navigate('/organiser/forgetpassword')}>
              Forgot your password?
            </div>

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

              <button type="submit" variant="primary" size="large" disabled={isFormInvalid} className="submit-btn"
                style={{
                  background: isFormInvalid ? "#D3D3D3" : "#4CAF4F"
                }}
              >
                {isLoading ? 'Logging in...' : 'LOG IN'}
              </button>
            </div>

            <div className="register-link">
              School not registered yet? <Link to="/organiser/register">Register Now</Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Organiserlogin;
