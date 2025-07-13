import React, { useState } from 'react';
import './AdditionalDetails.css';
import './Schoolmobile.css';

const Schoolmobile= () => {
  const [formData, setFormData] = useState({   
    SchoolName: '',
    Grade: '',
    Board: '',
  });
  const [selected, setSelected] = useState("");
  const options = ["Option 1", "Option 2", "Option 3"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

 
  return (
    <div className="registration-container">
      <div className="registration-form">
        <h1 className='heading-details'>Refer Your School to Unlock New Doors For Your Students</h1>

        <form onSubmit={handleSubmit}>
         <div className="form-group">
            <label>Your Name</label>
            <input
              type="text"
              name="SchoolName"
              value={formData.SchoolName}
              onChange={handleChange}
              placeholder="Enter Your Full Name"
            />
          </div>

          <div className="form-group">
            <label>Your Role in School</label>
            <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className='select-input inslect'
        >
        <option value="" disabled>
          Select
        </option>
        {options.map((opt, index) => (
          <option key={index} value={opt}>
            {opt}
          </option>
        ))}
      </select>
          </div>
          <div className="form-group">
            <label>Your Mobile Number</label>
            <input
              type="text"
              name="Board"
              value={formData.Board}
              onChange={handleChange}
              placeholder="Enter your mobile number"
            />
          </div>
          <label class="terms-checkbox">
  <input type="checkbox" />
  I accept the 
  <a href="#">Terms & Condition</a> and 
  <a href="#">Privacy Policy</a>
</label>

          

          <div className="form-button">
          <button type="submit" style={{borderRadius:"30px"}} className="submit-btn mb-2">
          Send OTP
          </button>

</div>
        </form>
      </div>
    </div>
  );
};

export default Schoolmobile; 