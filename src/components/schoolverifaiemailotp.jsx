import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useVerifyOtpMutation } from '../store/api/apiSlice';
import { toast } from 'react-toastify';
import Button from './common/Button';
import Card from './common/Card';
import './OtpVerification.css';

const schoolverifaiemailotp = () => {
  const [otp, setOtp] = useState([ '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(90); // 1:30 in seconds
  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const navigate = useNavigate();
  const location = useLocation();
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

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
      
      // Auto-focus next input
      if (value && index < 5) {
        inputRefs[index + 1].current.focus();
      }
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
    
    if (otpValue.length !== 4) {
      toast.error('Please enter a valid 4-digit OTP');
      return;
    }

    try {
      const response = await verifyOtp({ 
        mobileNumber: location.state?.mobileNumber, 
        otp: otpValue 
      }).unwrap();
      
      toast.success(response.message || 'OTP verified successfully');
      navigate('/student/register/email-registration', { state: { mobileNumber: location.state?.mobileNumber } });
    } catch (err) {
      toast.error(err.data?.message || 'Invalid OTP. Please try again.');
    }
  };

  const handleResendOtp = () => {
    setTimeLeft(90);
    setOtp(['', '', '', '', '', '']);
    inputRefs[0].current.focus();
    toast.info('OTP resent successfully');
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="registration-container">
      <Card className="registration-form ">
        <h1 style={{marginTop:"5rem"}}>Verify your Email ID</h1>
        
        <p className="otp-instruction">
        Enter the OTP sent to - {location.state?.email ? `+91 ${location.state.email}` : ''}
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

        <Button 
          onClick={handleSubmit}
          variant="primary"
          size="large"
          disabled={isLoading}
          className="submit-btn"
        >
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </Button>
      </Card>
    </div>
  );
};

export default schoolverifaiemailotp; 