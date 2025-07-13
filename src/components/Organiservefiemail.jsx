import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useVerifyOtpOrganiserEmailMutation } from '../store/api/apiSlice';
import { toast } from 'react-toastify';
import Button from './common/Button';
import Card from './common/Card';
import './OtpVerification.css';

const Organiservefiemail = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [timeLeft, setTimeLeft] = useState(90); // 1:30 in seconds
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const navigate = useNavigate();
  const location = useLocation();
  const { mobileNumber, role, name, password, email } = location.state || {};

  const [verifyOtpOrganiserEmail, { isLoading }] = useVerifyOtpOrganiserEmailMutation();

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
      setOtpError(''); // clear error on input

      // Auto-focus next input
      if (value && index < 3) {
        inputRefs[index + 1].current.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');

    if (otpValue.length !== 4) {
      setOtpError('Please enter a valid 4-digit OTP');
      return;
    }

    try {
      const response = await verifyOtpOrganiserEmail({
        email,
        otp: otpValue,
      }).unwrap();

      toast.success(response.message || 'OTP verified successfully');
      navigate('/organiser/register-details', { state: { mobileNumber, role, name, password, email } });
    } catch (err) {
      setOtpError('OTP is incorrect. Please try again.');
    }
  };

  const handleResendOtp = () => {
    setTimeLeft(90);
    setOtp(['', '', '', '']);
    inputRefs[0].current.focus();
    setOtpError('');
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
      <Card className="registration-form">
        <h1 style={{ marginTop: "5rem" }}>Verify your Email ID</h1>

        <p className="otp-instruction">
          Enter the OTP sent to - {email ? `${email}` : ''}
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
              className={`otp-input ${otpError ? 'otp-input-error' : ''}`}
            />
          ))}
        </div>

        {otpError && <div className="otp-error-message">{otpError}</div>}

        <div className="timer">
          {formatTime(timeLeft)} Sec
        </div>

        <div className="resend-otp">
          Don't receive code?{' '}
          <Button
            onClick={handleResendOtp}
            variant="text"
            className="resend-button"
            disabled={timeLeft > 0}
          >
            Resend OTP
          </Button>
        </div>
        <div className='d-flex justify-content-center'>

          <button
            onClick={handleSubmit}
            variant="primary"
            size="large"
            disabled={isFormInvalid}
            style={{
              background: isFormInvalid ? "#D3D3D3" : "#4CAF4F"
            }}
            className="submit-btn"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Organiservefiemail;
