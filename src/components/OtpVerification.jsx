import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from './common/Button';
import Card from './common/Card';
import './OtpVerification.css';
import { API_BASE_URL, API_ENDPOINTS } from '../config/apiConfig';

const OtpVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(90); // 1:30 in seconds
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState('');

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const handleChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setOtpError('');
      // Auto-focus next input
      if (value && index < otp.length - 1) {
        inputRefs[index + 1].current.focus();
      }
    } else if (value.length > 1) {
      setOtpError('Each box should have only one digit');
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');

    if (otpValue.length !== 4 || otp.some(digit => digit === '')) {
      setOtpError('Please enter a valid 4-digit OTP');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.VERIFY_OTP}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile_num: location.state?.mobileNumber,
          otp: otpValue
        })
      });
      const data = await response.json();
      setIsLoading(false);
      if (!response.ok) {
        setOtpError(data.message || 'Invalid OTP. Please try again.');
        toast.error(data.message || 'Invalid OTP. Please try again.');
        return;
      }
      toast.success(data.message || 'OTP verified successfully');
      navigate('/student/register/email-registration', { state: { mobileNumber: location.state?.mobileNumber } });
    } catch (err) {
      setIsLoading(false);
      setOtpError('Invalid OTP. Please try again.');
      toast.error('Invalid OTP. Please try again.');
    }
  };

  const handleResendOtp = () => {
    setTimeLeft(90);
    setOtp(['', '', '', '']);
    inputRefs[0].current.focus();
    toast.info('OTP resent successfully');
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  const otpValue = otp.join('');
  const isFormInvalid = otpValue.length !== 4 || otp.some(digit => digit === '');

  return (
    <div className="registration-container">
      <Card className="registration-form mt-5">
        <h1 style={{ marginTop: "5rem" }}>Verify your mobile Number</h1>

        <p className="otp-instruction">
          Enter the OTP sent to - {location.state?.mobileNumber ? `+91 ${location.state.mobileNumber}` : ''}
        </p>

        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="otp-input"
            />
          ))}
        </div>
        {otpError && <p className="input-error" style={{ color: 'red', textAlign: 'center', marginTop: 8 }}>{otpError}</p>}

        <div className="timer">
          {formatTime(timeLeft)} Sec
        </div>

        <div className="resend-otp">
          Don't receive code? {' '}
          <Button
            onClick={handleResendOtp}
            variant="text"
            className="resend-button"
            disabled={timeLeft > 0}
          >
            Resend OTP
          </Button>
        </div>
        <div className="d-flex justify-content-center">

          <button
            onClick={handleSubmit}
            variant="primary"
            size="large"
            className="submit-btn"
            disabled={isFormInvalid}
            style={{
              background: isFormInvalid ? "#D3D3D3" : "#4CAF4F"
            }}
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default OtpVerification; 