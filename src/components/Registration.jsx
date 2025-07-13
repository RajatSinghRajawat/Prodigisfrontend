import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from './common/Button';
import Input from './common/Input';
import Card from './common/Card';
import './Registration.css';
import { API_BASE_URL, API_ENDPOINTS } from '../config/apiConfig';

const Registration = () => {
  const [mobileError, setMobileError] = useState('');

  const [mobileNumber, setMobileNumber] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form is invalid if mobile number is empty OR terms are not accepted
  const isFormInvalid = !mobileNumber.trim() || !acceptTerms;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMobileError('');

    if (!mobileNumber.trim()) {
      setMobileError('Mobile number is required');
      return;
    }

    // Check if mobile number is a valid 10-digit number
    if (!/^\d{10}$/.test(mobileNumber.trim())) {
      setMobileError('Enter a valid 10-digit mobile number');
      return;
    }

    if (!acceptTerms) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SEND_OTP}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile_num: mobileNumber })
      });
      const data = await response.json();
      setIsLoading(false);
      if (!response.ok) {
        if (data.message && data.message.includes('Test mode is active')) {
          toast.error('Test mode is active. Please use the test mobile number: +911234567890');
        } else {
          toast.error(data.message || 'Failed to send OTP. Please try again.');
        }
        return;
      }
      toast.success('OTP sent successfully!');
      navigate('/student/register/verify-mobile-otp', { state: { mobileNumber } });
    } catch (err) {
      setIsLoading(false);
      toast.error('Failed to send OTP. Please try again.');
    }
  };


  return (
    <div className="registration-container">
      <Card className="registration-form">
        <h1>Register Now to Begin Your Success Journey</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <Input
              label="Mobile Number"
              name="mobileNumber"
              value={mobileNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                if (value.length <= 10) {
                  setMobileNumber(value);
                  if (value.length === 10 || value.length === 0) {
                    setMobileError('');
                  } else {
                    setMobileError('Enter a valid 10-digit mobile number');
                  }
                }
              }}
              placeholder="9876543210"
              type="tel"
              required
              error={mobileError}
            />
          </div>
          {mobileError && <p className="input-error">{mobileError}</p>}
          
          {/* Test mode notice */}
          <div style={{ 
            background: '#fff3cd', 
            border: '1px solid #ffeaa7', 
            borderRadius: '4px', 
            padding: '8px 12px', 
            marginBottom: '16px',
            fontSize: '12px',
            color: '#856404'
          }}>
            <strong>Test Mode:</strong> For testing purposes, please use the mobile number: <strong>8838838838</strong>
          </div>

          <div className="form-action">
            <div className="terms-checkbox">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
              />
              <label htmlFor="terms">I accept the terms & Condition</label>
            </div>

            <button
              type="submit"
              variant="primary"
              size="large"
              disabled={isFormInvalid}
              className="submit-btn"
              style={{
                background: isFormInvalid ? "#D3D3D3" : "#4CAF4F"
              }}
            >
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </div>

          <div className="login-link">
            Own an Account? <Link to="/student/login">Log In</Link>
          </div>
        </form>
      </Card>

    </div>
  );
};

export default Registration; 