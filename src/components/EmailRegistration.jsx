import React, { useState, useRef } from 'react';
import './EmailRegistration.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from './common/Button';
import Input from './common/Input';
import Card from './common/Card';
import eyeIcon from '../assets/eye.svg';
import eyeOffIcon from '../assets/eye-off.svg';
import { API_BASE_URL, API_ENDPOINTS } from '../config/apiConfig';
import { FaCalendarAlt } from 'react-icons/fa';

const EmailRegistration = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    password: '',
    mobile_num: location.state?.mobileNumber || '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [touched, setTouched] = useState({});

  const dateInputRef = useRef(null);

  // Password rules check
  const passwordRules = [
    {
      label: 'Min. 8 characters',
      test: (pw) => pw.length >= 8,
    },
    {
      label: 'Min. 1 Capital letter',
      test: (pw) => /[A-Z]/.test(pw),
    },
    {
      label: 'Min. 1 numeric character',
      test: (pw) => /[0-9]/.test(pw),
    },
    {
      label: 'Min. 1 special character (~!@#$%^&*()_+=[]{}|;:,.<>?/)',
      test: (pw) => /[~!@#$%^&*()_+=\[\]{}|;:,.<>?/]/.test(pw),
    },
  ];

  // Helper for name validation
  const isAlpha = (str) => /^[A-Za-z]+$/.test(str);
  const isAlphaOrEmpty = (str) => str === '' || /^[A-Za-z ]+$/.test(str);

  // Helper for DOB validation (min 5 years old)
  const isValidDOB = (dateOfBirth) => {
    if (!dateOfBirth) return false;
    const dobDate = new Date(dateOfBirth);
    const now = new Date();
    const minAge = 5;
    const minDate = new Date(now.getFullYear() - minAge, now.getMonth(), now.getDate());
    return dobDate <= minDate && !isNaN(dobDate);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    setFormErrors(validate({
      ...formData,
      [name]: value
    }));
  };

  const handleBlur = (e) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  const validate = (data) => {
    const errors = {};
    if (!data.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (!isAlpha(data.firstName.trim())) {
      errors.firstName = 'First name must contain only letters';
    }
    if (!isAlphaOrEmpty(data.middleName.trim())) {
      errors.middleName = 'Middle name must contain only letters';
    }
    if (!data.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (!isAlpha(data.lastName.trim())) {
      errors.lastName = 'Last name must contain only letters';
    }
    if (!data.dateOfBirth.trim()) {
      errors.dateOfBirth = 'Date of birth is required';
    } else if (!isValidDOB(data.dateOfBirth.trim())) {
      errors.dateOfBirth = 'Enter a valid date of birth (min age 5 years)';
    }
    if (!data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Enter a valid email';
    }
    if (!data.password.trim()) {
      errors.password = 'Password is required';
    } else if (!passwordRules.every(rule => rule.test(data.password))) {
      errors.password = 'Password must meet all requirements';
    }
    return errors;
  };

  const isFormValid = () => {
    const errors = validate(formData);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    const errors = validate(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }
    // Debug log
    console.log('Submitting:', formData);

    // Defensive: If dateOfBirth is empty, don't submit
    if (!formData.dateOfBirth) {
      toast.error('Date of Birth is required');
      return;
    }

    try {
      setIsLoading(true);
      // Convert dateOfBirth to Date object if not empty
      const payload = {
        ...formData,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : ''
      };
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REGISTER_USER}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      setIsLoading(false);
      if (!response.ok) {
        toast.error(data.message || 'Registration failed. Please try again.');
        return;
      }
      toast.success('Registration successful!');
      navigate('/registration-success');
    } catch (err) {
      setIsLoading(false);
      toast.error('Registration failed. Please try again.');
    }
  };

  const handleGoogleSignUp = () => {
    console.log('Sign up with Google');
  };

  const handleMicrosoftSignUp = () => {
    console.log('Sign up with Microsoft');
  };

  return (
    <div className="registration-container">
      <Card className="registration-form">
        <h1>Create your Account</h1>

        <div className="social-buttons">
          <Button onClick={handleGoogleSignUp} variant="outline" className="social-button google">
            <img src="/src/assets/google-icon.svg" alt="Google" />
            Sign up with Google
          </Button>
          <Button onClick={handleMicrosoftSignUp} variant="outline" className="social-button microsoft">
            <img src="/src/assets/microsoft-icon.svg" alt="Microsoft" />
            Sign up with Microsoft
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* First Name + Middle Name */}
          <div className="form-row">
            <div className="form-group">
              <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} onBlur={handleBlur} placeholder="Saumyata" />
              {(touched.firstName || hasSubmitted) && formErrors.firstName && <p className="input-error">{formErrors.firstName}</p>}
            </div>
            <div className="form-group">
              <Input label="Middle Name (optional)" name="middleName" value={formData.middleName} onChange={handleChange} onBlur={handleBlur} placeholder="Middle Name"
              />
              {(touched.middleName || hasSubmitted) && formErrors.middleName && <p className="input-error">{formErrors.middleName}</p>}
            </div>
          </div>

          {/* Last Name + DOB */}
          <div className="form-row">
            <div className="form-group">
              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Khandelwal"
              />
              {(touched.lastName || hasSubmitted) && formErrors.lastName && (
                <p className="input-error">{formErrors.lastName}</p>
              )}
            </div>
            <div className="form-group">
              <Input
                label="Date of Birth"
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                onBlur={handleBlur}
                ref={dateInputRef}
                icon={
                  <FaCalendarAlt
                    onClick={() => {
                      if (dateInputRef.current) {
                        if (dateInputRef.current.showPicker) {
                          dateInputRef.current.showPicker();
                        } else {
                          dateInputRef.current.focus();
                        }
                      }
                    }}
                    size={18}
                    title="Open calendar"
                  />
                }
              />
              {(touched.dateOfBirth || hasSubmitted) && formErrors.dateOfBirth && (
                <p className="input-error">{formErrors.dateOfBirth}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} placeholder="you@example.com" />
            {(touched.email || hasSubmitted) && formErrors.email && <p className="input-error">{formErrors.email}</p>}
          </div>

          {/* Password */}
          <div className="form-group" style={{ position: 'relative' }}>
            <Input label="Password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} onBlur={handleBlur} placeholder="********" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 10, top: 38, background: 'none', border: 'none' }}>
              <img src={showPassword ? eyeOffIcon : eyeIcon} alt="toggle password" width={20} height={20} />
            </button>
            {(touched.password || hasSubmitted) && (
              <ul style={{ marginTop: 8, paddingLeft: 16 }}>
                {passwordRules.map((rule, idx) => (
                  <li key={idx} style={{ color: rule.test(formData.password) ? '#4CAF50' : 'red', fontSize: '0.85rem' }}>
                    {rule.test(formData.password) ? '✓' : '✗'} {rule.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Submit */}
          <button type="submit" className="submit-btn" disabled={!isFormValid()} style={{ background: isFormValid() ? '#4CAF4F' : '#D3D3D3', cursor: isFormValid() ? 'pointer' : 'not-allowed' }}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </Card>
    </div>
  );
};

export default EmailRegistration;