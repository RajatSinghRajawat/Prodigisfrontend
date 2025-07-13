import React from 'react';
import PropTypes from 'prop-types';
import './Input.css';

const Input = React.forwardRef(({
  type = 'text',
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  icon,
  onBlur
}, ref) => {
  return (
    <div className={`input-container ${className}`} style={{ position: 'relative' }}>
      {label && (
        <label htmlFor={name} className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`input ${error ? 'error' : ''}`}
          ref={ref}
          onBlur={onBlur}
          style={icon ? { paddingRight: '2rem' } : {}}
        />
        {icon && (
          <span style={{ position: 'absolute', right: 10, cursor: 'pointer', color: '#888' }}>
            {icon}
          </span>
        )}
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
});

Input.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  icon: PropTypes.node,
  onBlur: PropTypes.func
};

export default Input; 