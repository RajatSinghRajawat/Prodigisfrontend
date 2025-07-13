import React, { useState, useEffect } from 'react'
import "./OrganiserPersonaolsettingpage.css";
import { Edit, Save, X, Trash2, AlertCircle } from 'lucide-react';
import Organisersheader from './Organisersheader';
import OrganiserFooter from './OrganiserFooter';

const OrganiserPersonaolsettingpage = () => {
  // State management
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initial data structure
  const [userData, setUserData] = useState({
    personal: {
      adminName: "Saumyata Khandelwal",
      mobileNumber: "+91 9876543210",
      emailId: "saumyata@gmail.com",
      roleInOrganisation: "Admin"
    },
    organisation: {
      orgName: "Prodigi Tech",
      orgType: "Private Ltd.",
      location: "Bangalore, India",
      established: "2015"
    }
  });

  // Tab configuration
  const tabs = [
    { id: 'personal', label: 'Personal Details' },
    { id: 'organisation', label: 'Organisation Details' }
  ];

  // Field configurations
  const fieldConfigs = {
    personal: [
      { key: 'adminName', label: 'Admin Name', type: 'text', required: true },
      { key: 'mobileNumber', label: 'Mobile Number', type: 'tel', required: true },
      { key: 'emailId', label: 'Email ID', type: 'email', required: true },
      { key: 'roleInOrganisation', label: 'Role In Organisation', type: 'text', required: true }
    ],
    organisation: [
      { key: 'orgName', label: 'Org Name', type: 'text', required: true },
      { key: 'orgType', label: 'Org Type', type: 'text', required: true },
      { key: 'location', label: 'Location', type: 'text', required: true },
      { key: 'established', label: 'Established', type: 'text', required: true }
    ]
  };

  // Handle edit mode toggle
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setEditedData({});
      setHasChanges(false);
    } else {
      // Start editing
      setEditedData({ ...userData[activeTab] });
    }
    setIsEditing(!isEditing);
  };

  // Handle field changes
  const handleFieldChange = (key, value) => {
    setEditedData(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Check if there are any changes
    const originalData = userData[activeTab];
    const hasAnyChanges = Object.keys(originalData).some(
      fieldKey => originalData[fieldKey] !== editedData[fieldKey]
    );
    setHasChanges(hasAnyChanges);
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUserData(prev => ({
        ...prev,
        [activeTab]: { ...editedData }
      }));
      
      setIsEditing(false);
      setEditedData({});
      setHasChanges(false);
      
      // Show success message (you can add a toast notification here)
      console.log('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete account
  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowDeleteConfirm(false);
      // Redirect to logout or home page
      console.log('Account deleted successfully!');
    } catch (error) {
      console.error('Error deleting account:', error);
    } finally {
      setLoading(false);
    }
  };

  // Validate form
  const isFormValid = () => {
    const currentFields = fieldConfigs[activeTab];
    return currentFields.every(field => {
      if (field.required) {
        return editedData[field.key] && editedData[field.key].trim() !== '';
      }
      return true;
    });
  };

  // Render field input
  const renderField = (field) => {
    const currentValue = isEditing ? editedData[field.key] : userData[activeTab][field.key];
    
    if (isEditing) {
      return (
        <input
          type={field.type}
          value={currentValue || ''}
          onChange={(e) => handleFieldChange(field.key, e.target.value)}
          className="Organisation-Input"
          placeholder={`Enter ${field.label.toLowerCase()}`}
        />
      );
    }
    
    return <span className="Organisation-Value">{currentValue}</span>;
  };

  return (
    <div>
      <Organisersheader/>
      <div className="Organisation-Wrapper">
        <div className="Organisation-Container">
          {/* Sidebar */}
          <div className="Organisation-Sidebar">
            <div>
              <ul className="Organisation-Menu">
                {tabs.map((tab) => (
                  <li
                    key={tab.id}
                    className={`Organisation-MenuItem ${activeTab === tab.id ? 'Organisation-Active' : ''}`}
                    onClick={() => {
                      if (isEditing && hasChanges) {
                        if (window.confirm('You have unsaved changes. Do you want to continue?')) {
                          setIsEditing(false);
                          setEditedData({});
                          setHasChanges(false);
                          setActiveTab(tab.id);
                        }
                      } else {
                        setActiveTab(tab.id);
                      }
                    }}
                  >
                    {tab.label}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="Organisation-SidebarActions">
              <button 
                className="Organisation-DeleteButton"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={loading}
              >
                <Trash2 size={16} />
                Delete Account
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="Organisation-Content">
            <div className="Organisation-Header">
              <h1 className="Organisation-PageTitle">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h1>
              <button
                className={`Organisation-EditButton ${isEditing ? 'Organisation-CancelButton' : ''}`}
                onClick={handleEditToggle}
                disabled={loading}
              >
                {isEditing ? <X size={16} /> : <Edit size={16} />}
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <div className="Organisation-Card">
              <table className="Organisation-Table">
                <tbody>
                  {fieldConfigs[activeTab].map((field, index) => (
                    <tr key={field.key} className="Organisation-Row">
                      <td className="Organisation-Label">
                        {field.label}
                        {field.required && <span className="Organisation-Required">*</span>}
                      </td>
                      <td className="Organisation-Colon">:</td>
                      <td className="Organisation-ValueCell">
                        {renderField(field)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {isEditing && (
              <div className="Organisation-Actions">
                <button
                  className={`Organisation-SaveButton ${!hasChanges || !isFormValid() ? 'Organisation-SaveButtonDisabled' : ''}`}
                  onClick={handleSaveChanges}
                  disabled={!hasChanges || !isFormValid() || loading}
                >
                  {loading ? (
                    <span className="Organisation-Loading">Saving...</span>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="Organisation-ModalOverlay">
          <div className="Organisation-Modal">
            <div className="Organisation-ModalHeader">
              <AlertCircle size={24} className="Organisation-ModalIcon" />
              <h3>Delete Account</h3>
            </div>
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <div className="Organisation-ModalActions">
              <button
                className="Organisation-ModalCancelButton"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="Organisation-ModalDeleteButton"
                onClick={handleDeleteAccount}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <OrganiserFooter/>
    </div>
  )
}

export default OrganiserPersonaolsettingpage