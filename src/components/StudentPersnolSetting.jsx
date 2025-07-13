import React, { useState, useEffect } from 'react';
import './StudentPersnolSetting.css';
import { FaEdit } from 'react-icons/fa';
import StudentFooter from './StudentFooter';
import Studentheaderhome from './Studentheaderhome';
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from '../store/api/apiSlice';
import { toast } from 'react-toastify';

const initialPersonal = {
  name: 'Saumyata Khandelwal',
  mobile: '+91 9876543210',
  email: 'saumyata@gmail.com',
  dob: '1st Jan 2015',
  address: '123, ABC building,\nABC road,\nABC area,\nCity,\nCountry\nPin code',
  guardian: 'Lokesh Khandelwal',
};
const initialSchool = {
  schoolName: 'Oberoi National School',
  grade: '9th',
  roll: '123456',
  board: 'CBSE',
};
const initialPreferences = {
  // Add dummy preferences if needed
};

const sections = [
  { key: 'personal', label: 'Personal Details' },
  { key: 'school', label: 'School Details' },
  { key: 'preferences', label: 'Preferences' },
];

const StudentPersnolSetting = () => {
  const [active, setActive] = useState('personal');
  const [personal, setPersonal] = useState(initialPersonal);
  const [school, setSchool] = useState(initialSchool);
  const [edit, setEdit] = useState({});
  const [changed, setChanged] = useState(false);
  const { data, isLoading, isError, refetch } = useGetUserProfileQuery();
  const [updateUserProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();

 useEffect(() => {
    if (data && data.data) {
      setPersonal({
        name: `${data.data.firstName || ''} ${data.data.lastName || ''}`.trim(),
        mobile: data.data.mobile_num ? `+91 ${data.data.mobile_num}` : '',
        email: data.data.email || '',
        dob: data.data.dateOfBirth || '',
        address: data.data.address || '',
        guardian: data.data.guardian || '',
      });
      // Optionally set school and preferences if available
    }
  }, [data]);

  // Handlers for editing
  const handleEdit = (section, field) => {
    setEdit({ section, field });
  };
  const handleChange = (e) => {
    setChanged(true);
    if (edit.section === 'personal') {
      setPersonal({ ...personal, [edit.field]: e.target.value });
    } else if (edit.section === 'school') {
      setSchool({ ...school, [edit.field]: e.target.value });
    }
  };
  const handleSave = async () => {
    setEdit({});
    setChanged(false);
    // Call API to save changes
    try {
      const [firstName, ...lastArr] = personal.name.split(' ');
      const lastName = lastArr.join(' ');
      await updateUserProfile({
        firstName,
        lastName,
        email: personal.email,
        mobile_num: personal.mobile.replace('+91 ', ''),
        dateOfBirth: personal.dob,
        address: personal.address,
        guardian: personal.guardian,
      }).unwrap();
      // Update local state so UI reflects changes instantly
      setPersonal({ ...personal, name: `${firstName} ${lastName}`.trim() });
      setEdit({});
      setChanged(false);
      refetch();
      toast.success('Profile updated successfully!');
    } catch (e) {
      toast.error('Failed to update profile');
    }
  };
  const handleCancelEdit = () => {
    setEdit({});
    setChanged(false);
    setPersonal(initialPersonal);
    setSchool(initialSchool);
  };

  return (
    <>
    <Studentheaderhome/>
      <div className="stu-set-container">
        {/* Sidebar */}
        <div className="stu-set-sidebar">
          <div className="stu-set-sidebar-top">
            {sections.map((s) => (
              <button
                key={s.key}
                className={`stu-set-sidebar-btn${active === s.key ? ' active' : ''}`}
                onClick={() => setActive(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>
          <button className="stu-set-delete-btn">Delete Account</button>
        </div>
        {/* Main Content */}
        <div className="stu-set-main">
          {isLoading ? (
            <div>Loading...</div>
          ) : isError ? (
            <div>Error loading profile.</div>
          ) : active === 'personal' && (
            <>
              <div className="stu-set-title">Personal Details</div>
              <div className="stu-set-row">
                <span className="stu-set-label">Student Name</span>
                <span className="stu-set-sep">:</span>
                {edit.section === 'personal' && edit.field === 'name' ? (
                  <input
                    className="stu-set-input"
                    value={personal.name}
                    onChange={handleChange}
                    onBlur={handleSave}
                    autoFocus
                  />
                ) : (
                  <>
                    <span className="stu-set-value">{personal.name}</span>
                    <FaEdit className="stu-set-edit-icon" onClick={() => handleEdit('personal', 'name')} />
                  </>
                )}
              </div>
              <div className="stu-set-row">
                <span className="stu-set-label">Mobile Number</span>
                <span className="stu-set-sep">:</span>
                {edit.section === 'personal' && edit.field === 'mobile' ? (
                  <input
                    className="stu-set-input"
                    value={personal.mobile}
                    onChange={handleChange}
                    onBlur={handleSave}
                    autoFocus
                  />
                ) : (
                  <>
                    <span className="stu-set-value">{personal.mobile}</span>
                    <FaEdit className="stu-set-edit-icon" onClick={() => handleEdit('personal', 'mobile')} />
                  </>
                )}
              </div>
              <div className="stu-set-row">
                <span className="stu-set-label">Email ID</span>
                <span className="stu-set-sep">:</span>
                {edit.section === 'personal' && edit.field === 'email' ? (
                  <input
                    className="stu-set-input"
                    value={personal.email}
                    onChange={handleChange}
                    onBlur={handleSave}
                    autoFocus
                  />
                ) : (
                  <>
                    <span className="stu-set-value">{personal.email}</span>
                    <FaEdit className="stu-set-edit-icon" onClick={() => handleEdit('personal', 'email')} />
                  </>
                )}
              </div>
              <div className="stu-set-row">
                <span className="stu-set-label">Date Of Birth</span>
                <span className="stu-set-sep">:</span>
                <span className="stu-set-value">{personal.dob}</span>
              </div>
              <div className="stu-set-row">
                <span className="stu-set-label">Address</span>
                <span className="stu-set-sep">:</span>
                {edit.section === 'personal' && edit.field === 'address' ? (
                  <textarea
                    className="stu-set-textarea"
                    value={personal.address}
                    onChange={handleChange}
                    onBlur={handleSave}
                    autoFocus
                  />
                ) : (
                  <>
                    <span className="stu-set-value" style={{ whiteSpace: 'pre-line' }}>{personal.address}</span>
                    <FaEdit className="stu-set-edit-icon" onClick={() => handleEdit('personal', 'address')} />
                  </>
                )}
              </div>
              <div className="stu-set-row">
                <span className="stu-set-label">Guardian's Name</span>
                <span className="stu-set-sep">:</span>
                <span className="stu-set-value">{personal.guardian}</span>
              </div>
              <button
                className="stu-set-save-btn"
                disabled={!changed || isUpdating}
                onClick={handleSave}
                style={{ float: 'right' }}
              >
                {isUpdating ? 'Saving...' : 'Save changes'}
              </button>
            </>
          )}
          {active === 'school' && (
            <>
              <div className="stu-set-title">School Details</div>
              <div className="stu-set-row">
                <span className="stu-set-label">School Name</span>
                <span className="stu-set-sep">:</span>
                <span className="stu-set-value">{school.schoolName}</span>
                <FaEdit className="stu-set-edit-icon" onClick={() => handleEdit('school', 'schoolName')} />
              </div>
              <div className="stu-set-row">
                <span className="stu-set-label">Grade</span>
                <span className="stu-set-sep">:</span>
                <span className="stu-set-value">{school.grade}</span>
                <FaEdit className="stu-set-edit-icon" onClick={() => handleEdit('school', 'grade')} />
              </div>
              <div className="stu-set-row">
                <span className="stu-set-label">Roll Number</span>
                <span className="stu-set-sep">:</span>
                <span className="stu-set-value">{school.roll}</span>
                <FaEdit className="stu-set-edit-icon" onClick={() => handleEdit('school', 'roll')} />
              </div>
              <div className="stu-set-row">
                <span className="stu-set-label">Board</span>
                <span className="stu-set-sep">:</span>
                <span className="stu-set-value">{school.board}</span>
                <FaEdit className="stu-set-edit-icon" onClick={() => handleEdit('school', 'board')} />
              </div>
              <button
                className="stu-set-save-btn"
                disabled={!changed}
                onClick={handleSave}
                style={{ float: 'right' }}
              >
                Save changes
              </button>
            </>
          )}
          {active === 'preferences' && (
            <>
              <div className="stu-set-title">Preferences</div>
              <div className="stu-set-row">
                <span className="stu-set-label">No preferences set.</span>
              </div>
            </>
          )}
        </div>
      </div>
      <StudentFooter/>
      </>
  );
};

export default StudentPersnolSetting;