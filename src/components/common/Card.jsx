import React from 'react';
import PropTypes from 'prop-types';
import './Card.css';

const Card = ({ children, className = '', title, footer }) => {
  return (
    <div className={`card ${className}`}>
      {title && <div className="card-header">{title}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  title: PropTypes.node,
  footer: PropTypes.node
};

export default Card; 