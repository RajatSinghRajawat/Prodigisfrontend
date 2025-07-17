import React, { useState } from 'react';
import './AdditionalDetails.css';
import Input from './common/Input';
import { useNavigate } from 'react-router-dom';

const gradeOptions = [
  '6th', '7th', '8th', '9th', '10th', '11th', '12th'
];
const boardOptions = [
  'CBSE', 'ICSE', 'IGCSE', 'State Board', 'IB'
];
const subjectOptions = [
  'Maths', 'English', 'General Knowledge', 'Hindi', 'Computers'
];

const AdditionalDetails = () => {
  const [formData, setFormData] = useState({   
    SchoolName: '',
    Grade: '',
    Board: '',
    PreferredSubjects: [],
  });
  const [selected, setSelected] = useState("");
  const options = ["Option 1", "Option 2", "Option 3"];
  const navigate = useNavigate();

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
    navigate('/registration-success');
  };

  const handleSubjectSelect = (e) => {
    const value = e.target.value;
    if (value && !formData.PreferredSubjects.includes(value)) {
      setFormData(prev => ({
        ...prev,
        PreferredSubjects: [...prev.PreferredSubjects, value]
      }));
    }
  };

  const handleRemoveSubject = (subject) => {
    setFormData(prev => ({
      ...prev,
      PreferredSubjects: prev.PreferredSubjects.filter(s => s !== subject)
    }));
  };

  // Validation: all fields required
  const isFormInvalid =
    !formData.SchoolName.trim() ||
    !formData.Grade.trim() ||
    !formData.Board.trim() ||
    formData.PreferredSubjects.length === 0;

  return (
    <div className="addreg-container">
      <div className="addreg-form-box">
        <h1 className="addreg-heading">Tell us more about yourself</h1>

        <form onSubmit={handleSubmit}>
          <div className="addreg-group">
            <label>School</label>
            <input
              type="text"
              name="SchoolName"
              value={formData.SchoolName}
              onChange={handleChange}
              placeholder="Oberoi International School"
            />
          </div>

          <div className="addreg-group">
            <label>Grade</label>
            <div className="addreg-select-wrapper">
              <select
                name="Grade"
                value={formData.Grade}
                onChange={handleChange}
                className="addreg-select"
              >
                <option value="" disabled>Select</option>
                {gradeOptions.map((grade, idx) => (
                  <option key={idx} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="addreg-group">
            <label>Board</label>
            <div className="addreg-select-wrapper">
              <select
                name="Board"
                value={formData.Board}
                onChange={handleChange}
                className="addreg-select"
              >
                <option value="" disabled>Select</option>
                {boardOptions.map((board, idx) => (
                  <option key={idx} value={board}>{board}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="addreg-group">
            <label>Preferred Subjects</label>
            <div className="addreg-select-wrapper">
              <select
                value=""
                onChange={handleSubjectSelect}
                className="addreg-select"
              >
                <option value="" disabled>Select</option>
                {subjectOptions.filter(opt => !formData.PreferredSubjects.includes(opt)).map((opt, index) => (
                  <option key={index} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              {formData.PreferredSubjects.map((subject, idx) => (
                <span key={idx} style={{
                  background: '#e8f5e9',
                  color: '#388e3c',
                  borderRadius: '16px',
                  padding: '4px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '14px',
                  border: '1px solid #c8e6c9',
                  gap: '4px',
                }}>
                  {subject}
                  <button type="button" onClick={() => handleRemoveSubject(subject)} style={{
                    background: 'none',
                    border: 'none',
                    color: '#388e3c',
                    marginLeft: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}>&times;</button>
                </span>
              ))}
            </div>
          </div>

          <div className="addreg-button-wrapper">
            <button type="submit" className="addreg-submit-btn"
              disabled={isFormInvalid}
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdditionalDetails;
