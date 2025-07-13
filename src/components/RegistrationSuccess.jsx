import React, { useEffect } from 'react';
import './RegistrationSuccess.css';
import { useNavigate } from 'react-router-dom';

const RegistrationSuccess = () => {
  const navigate = useNavigate();
 useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/student/login');
    }, 5000); // 5000 milliseconds = 5 seconds

    return () => clearTimeout(timer); // cleanup to prevent memory leak
  }, [navigate]);
  return (
    <div className="registration-container">
      <div className="registration-form">
        <div className="success-content">
          <div className="success-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="#65B741"/>
              <path 
                d="M8 12l3 3 5-5" 
                stroke="white" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1>Registration Completed</h1>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccess; 