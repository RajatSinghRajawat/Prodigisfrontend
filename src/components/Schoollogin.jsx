import React, { useState } from 'react';
import './StudentLogin.css';
import './Schoollogin.css';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../store/api/apiSlice';
import { toast } from 'react-toastify';
import Button from './common/Button';
import Input from './common/Input';
import Card from './common/Card';

const Schoollogin = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Determine if the input is email or mobile number
    const isEmail = formData.email.includes('@');
    const credentials = isEmail 
      ? { email: formData.email, password: formData.password }
      : { mobile_num: formData.email, password: formData.password };

    try {
      const response = await login(credentials).unwrap();
      
      // Store the token in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      toast.success('Login successful!');
      navigate('/dashboard'); // Redirect to dashboard or home page
    } catch (err) {
      toast.error(err.data?.message || 'Login failed. Please try again.');
    }
  };

  const handleGoogleSignIn = () => {
    console.log('Sign in with Google');
  };

  const handleMicrosoftSignIn = () => {
    console.log('Sign in with Microsoft');
  };

  return (
    <div className="schoollogin">
    <div className="registration-container">
      <Card className="registration-form" >
        <h1>Welcome back!</h1>

        <div className="social-buttons">
          <Button 
            onClick={handleGoogleSignIn} 
            variant="outline"
            className="social-button google"
          >
            <img src="/google-icon.svg" alt="Google" />
            Log In with Google
          </Button>
          <Button 
            onClick={handleMicrosoftSignIn} 
            variant="outline"
            className="social-button microsoft"
          >
            <img src="/microsoft-icon.svg" alt="Microsoft" />
            Log In with Microsoft
          </Button>
          <Button 
            
            variant="outline"
            className="social-button microsoft"
          >
            
            Log In with SSO
          </Button>
        </div>

        <form onSubmit={handleSubmit} className='registration-form2'>
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

          <div className="form-group password-group">
            <Input
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="*************"
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              <img 
                src={showPassword ? "/eye-off.svg" : "/eye.svg"} 
                alt={showPassword ? "Hide password" : "Show password"}
              />
            </button>
          </div>
          <div className='forgot-password' onClick={()=>{navigate("/ForgotPasswordSendOtp")}}>Forgot your password?</div>

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

            <Button 
              type="submit"
              variant="primary"
              size="large"
              disabled={isLoading}
              className="submit-btn"
            >
              {isLoading ? 'Logging in...' : 'LOG IN'}
            </Button>
          </div>
          <div className="register-link">
          School not registered yet?<Link to="/student/register/mobile">Refer Your School Now</Link>
          </div>
        </form>
      </Card>
    </div>
    </div>
  );
};

export default Schoollogin; 