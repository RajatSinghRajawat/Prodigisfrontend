import React, { useState } from "react";
import {
  Tabs,
  Select,
  Button,
  Collapse,
  Input,
  Tag,
  Space,
  Row,
  Col,
  Typography,
  message,
  Spin
} from "antd";
import {
  DownOutlined,
  CloseOutlined,
  CaretRightOutlined
} from "@ant-design/icons";

const { Option } = Select;
const { Panel } = Collapse;
const { Title } = Typography;

const OEligibility = ({ fun, ID }) => {
  const [activeTab, setActiveTab] = useState("preliminary");
  const [activeKeys, setActiveKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataByTab, setDataByTab] = useState({
    preliminary: {
      selectedCriteria: [],
      criteriaData: {},
      studentDetails: ['Name', 'Mobile', 'Email ID', 'City'],
      schoolDetails: ['School Name']
    },
    final: {
      selectedCriteria: [],
      criteriaData: {},
      studentDetails: ['Name', 'Mobile', 'Email ID', 'City'],
      schoolDetails: ['School Name']
    }
  });
  
  // Use ID from props
  const competitionId = ID;

  const criteriaOptions = [
    { value: 'age_limit', label: 'Age Limit' },
    { value: 'education', label: 'Education' },
    { value: 'previous_performance', label: 'Previous Performance' },
    { value: 'attendance', label: 'Attendance' },
    { value: 'documents', label: 'Documents' }
  ];

  const studentDetailOptions = [
    'Name', 'Mobile', 'Email ID', 'City', 'Address', 'Date of Birth', 'Gender', 'Grade', 'Age', 'Photo'
  ];

  const schoolDetailOptions = [
    'School Name', 'School Code', 'School Address', 'Principal Name', 'School Type'
  ];

  // API call function
  const saveEligibilityData = async () => {
    setLoading(true);

    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      // Validate data for at least one tab
      const hasValidData = Object.keys(dataByTab).some(tab =>
        dataByTab[tab].selectedCriteria.length > 0 && dataByTab[tab].studentDetails.length > 0
      );

      if (!hasValidData) {
        message.warning('Please select at least one criteria and student detail in either Preliminary or Final tab.');
        return;
      }

      // Combine eligibility criteria from both tabs into a single array
      const eligibility = [
        ...dataByTab.preliminary.selectedCriteria.map(criteria => {
          const criteriaLabel = criteriaOptions.find(opt => opt.value === criteria)?.label;
          const data = dataByTab.preliminary.criteriaData[criteria];
          
          let requirement = "";
          if (data?.min && data?.max) {
            requirement = `Range: ${data.min} to ${data.max}`;
          } else if (data?.min) {
            requirement = `Minimum: ${data.min}`;
          } else if (data?.max) {
            requirement = `Maximum: ${data.max}`;
          } else {
            requirement = `${criteriaLabel} criteria applies`;
          }

          return {
            title: criteriaLabel,
            requirement: requirement
          };
        }),
        ...dataByTab.final.selectedCriteria.map(criteria => {
          const criteriaLabel = criteriaOptions.find(opt => opt.value === criteria)?.label;
          const data = dataByTab.final.criteriaData[criteria];
          
          let requirement = "";
          if (data?.min && data?.max) {
            requirement = `Range: ${data.min} to ${data.max}`;
          } else if (data?.min) {
            requirement = `Minimum: ${data.min}`;
          } else if (data?.max) {
            requirement = `Maximum: ${data.max}`;
          } else {
            requirement = `${criteriaLabel} criteria applies`;
          }

          return {
            title: criteriaLabel,
            requirement: requirement
          };
        })
      ];

      // Combine StudentDetails and SchoolDetails from both tabs, ensuring uniqueness
      const studentDetails = [
        ...new Set([
          ...(dataByTab.preliminary.studentDetails || []),
          ...(dataByTab.final.studentDetails || [])
        ])
      ];
      const schoolDetails = [
        ...new Set([
          ...(dataByTab.preliminary.schoolDetails || []),
          ...(dataByTab.final.schoolDetails || [])
        ])
      ];

      // Format data for API
      const formattedData = {
        eligibility,
        StudentInformation: {
          StudentDetails: studentDetails.length > 0 ? studentDetails : [],
          SchoolDetails: schoolDetails.length > 0 ? schoolDetails : []
        }
      };

      const raw = JSON.stringify(formattedData);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      const response = await fetch(`http://localhost:3001/api/competitions/eligibility/${competitionId}`, requestOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.text();
      console.log('API Response:', result);
      
      message.success('Eligibility criteria saved successfully!');
      fun(4, competitionId);
      
    } catch (error) {
      console.error('API Error:', error);
      message.error('Failed to save eligibility criteria. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCriteriaChange = (values) => {
    setDataByTab({
      ...dataByTab,
      [activeTab]: {
        ...dataByTab[activeTab],
        selectedCriteria: values
      }
    });
    setActiveKeys(values);
  };

  const handleCriteriaDataChange = (criteriaKey, field, value) => {
    setDataByTab({
      ...dataByTab,
      [activeTab]: {
        ...dataByTab[activeTab],
        criteriaData: {
          ...dataByTab[activeTab].criteriaData,
          [criteriaKey]: {
            ...dataByTab[activeTab].criteriaData[criteriaKey],
            [field]: value
          }
        }
      }
    });
  };

  const removeCriteria = (criteriaToRemove) => {
    const newSelectedCriteria = dataByTab[activeTab].selectedCriteria.filter(c => c !== criteriaToRemove);
    const newCriteriaData = { ...dataByTab[activeTab].criteriaData };
    delete newCriteriaData[criteriaToRemove];

    setDataByTab({
      ...dataByTab,
      [activeTab]: {
        ...dataByTab[activeTab],
        selectedCriteria: newSelectedCriteria,
        criteriaData: newCriteriaData
      }
    });
    setActiveKeys(newSelectedCriteria);
  };

  const handleStudentDetailsChange = (values) => {
    setDataByTab({
      ...dataByTab,
      [activeTab]: {
        ...dataByTab[activeTab],
        studentDetails: values
      }
    });
  };

  const handleSchoolDetailsChange = (values) => {
    setDataByTab({
      ...dataByTab,
      [activeTab]: {
        ...dataByTab[activeTab],
        schoolDetails: values
      }
    });
  };

  const renderCriteriaContent = (criteriaKey) => (
    <Row gutter={16}>
      <Col xs={24} sm={12}>
        <div style={{ marginBottom: 8 }}>
          <span style={{ fontSize: '12px', color: '#666' }}>Min.</span>
        </div>
        <Input
          placeholder="Enter"
          value={dataByTab[activeTab].criteriaData[criteriaKey]?.min || ''}
          onChange={(e) => handleCriteriaDataChange(criteriaKey, 'min', e.target.value)}
        />
      </Col>
      <Col xs={24} sm={12}>
        <div style={{ marginBottom: 8 }}>
          <span style={{ fontSize: '12px', color: '#666' }}>Max.</span>
        </div>
        <Input
          placeholder="Enter"
          value={dataByTab[activeTab].criteriaData[criteriaKey]?.max || ''}
          onChange={(e) => handleCriteriaDataChange(criteriaKey, 'max', e.target.value)}
        />
      </Col>
    </Row>
  );

  const renderTabContent = () => (
    <div style={{ 
      height: 'calc(100vh - 120px)', 
      overflowY: 'auto',
      overflowX: 'hidden',
      padding: '24px 40px 0px 40px',
      scrollbarWidth: 'thin',
      scrollbarColor: '#d4d4d4 #f1f1f1',
      paddingBottom: '80px'
    }}>
      <style>
        {`
          .tab-content::-webkit-scrollbar {
            width: 8px;
          }
          .tab-content::-webkit-scrollbar-track {
            background: #f1f1f1;
            borderRadius: 4px;
          }
          .tab-content::-webkit-scrollbar-thumb {
            background: #d4d4d4;
            borderRadius: 4px;
          }
          .tab-content::-webkit-scrollbar-thumb:hover {
            background: #bbb;
          }
        `}
      </style>
      
      {/* Eligibility Section */}
      <div style={{ marginBottom: '32px' }}>
        <Title level={3} style={{ 
          marginBottom: '16px', 
          fontSize: '18px', 
          fontWeight: '600',
          '@media (max-width: 768px)': {
            fontSize: '16px'
          }
        }}>
          Eligibility
        </Title>
        
        <div style={{ marginBottom: '24px' }}>
          <div style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', color: '#333' }}>Criteria</span>
          </div>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select All Criteria"
            value={dataByTab[activeTab].selectedCriteria}
            onChange={handleCriteriaChange}
            suffixIcon={<DownOutlined />}
            size="large"
          >
            {criteriaOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>

        {/* Criteria Accordions */}
        {dataByTab[activeTab].selectedCriteria.length > 0 && (
          <Collapse
            activeKey={activeKeys}
            onChange={setActiveKeys}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            style={{ background: '#fff' }}
          >
            {dataByTab[activeTab].selectedCriteria.map(criteria => {
              const criteriaLabel = criteriaOptions.find(opt => opt.value === criteria)?.label;
              return (
                <Panel
                  key={criteria}
                  header={
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      width: '100%'
                    }}>
                      <span style={{ 
                        fontSize: window.innerWidth <= 768 ? '14px' : '16px' 
                      }}>
                        {criteriaLabel}
                      </span>
                      <CloseOutlined
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCriteria(criteria);
                        }}
                        style={{ color: '#999', fontSize: '12px' }}
                      />
                    </div>
                  }
                >
                  {renderCriteriaContent(criteria)}
                </Panel>
              );
            })}
          </Collapse>
        )}
      </div>

      {/* Student Information Section */}
      <div style={{ marginBottom: '32px' }}>
        <Title level={3} style={{ 
          marginBottom: '16px', 
          fontSize: '18px', 
          fontWeight: '600',
          '@media (max-width: 768px)': {
            fontSize: '16px'
          }
        }}>
          Student Information
        </Title>
        
        <div style={{ marginBottom: '24px' }}>
          <div style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', color: '#333' }}>
              Student Details<span style={{ color: '#ff4d4f' }}>*</span>
            </span>
          </div>
          <Select
            mode="multiple"
            style={{ width: '100%', marginBottom: '12px' }}
            placeholder="Select All Information fields"
            value={dataByTab[activeTab].studentDetails}
            onChange={handleStudentDetailsChange}
            suffixIcon={<DownOutlined />}
            size="large"
          >
            {studentDetailOptions.map(option => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '8px',
            maxWidth: '100%'
          }}>
            {dataByTab[activeTab].studentDetails?.map (detail => (
              <Tag
                key={detail}
                closable
                onClose={() => {
                  handleStudentDetailsChange(dataByTab[activeTab].studentDetails.filter(d => d !== detail));
                }}
                style={{
                  background: '#f0f9f0',
                  border: '1px solid #95de64',
                  color: '#52c41a',
                  borderRadius: '16px',
                  padding: '4px 12px',
                  fontSize: window.innerWidth <= 768 ? '12px' : '14px',
                  margin: '2px'
                }}
              >
                {detail}
              </Tag>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', color: '#333' }}>School Details</span>
          </div>
          <Select
            mode="multiple"
            style={{ width: '100%', marginBottom: '12px' }}
            placeholder="Select All Information fields"
            value={dataByTab[activeTab].schoolDetails}
            onChange={handleSchoolDetailsChange}
            suffixIcon={<DownOutlined />}
            size="large"
          >
            {schoolDetailOptions.map(option => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '8px',
            maxWidth: '100%'
          }}>
            {dataByTab[activeTab].schoolDetails.map(detail => (
              <Tag
                key={detail}
                closable
                onClose={() => {
                  handleSchoolDetailsChange(dataByTab[activeTab].schoolDetails.filter(d => d !== detail));
                }}
                style={{
                  background: '#f0f9f0',
                  border: '1px solid #95de64',
                  color: '#52c41a',
                  borderRadius: '16px',
                  padding: '4px 12px',
                  fontSize: window.innerWidth <= 768 ? '12px' : '14px',
                  margin: '2px'
                }}
              >
                {detail}
              </Tag>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const tabItems = [
    {
      key: 'preliminary',
      label: 'Preliminary',
      children: renderTabContent(),
    },
    {
      key: 'final',
      label: 'Final',
      children: renderTabContent(),
    },
  ];

  return (
    <div style={{ 
      background: '#f5f5f5', 
      minHeight: '100vh',
      padding: '0',
      overflow: 'hidden',
      width: '100%',
      position: 'relative'
    }}>
      <div style={{
        background: '#fff',
        minHeight: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden'
      }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          style={{ 
            height: '100vh',
            overflow: 'hidden'
          }}
          tabBarStyle={{
            margin: '0',
            paddingLeft: window.innerWidth <= 768 ? '16px' : '40px',
            paddingRight: window.innerWidth <= 768 ? '16px' : '40px',
            background: '#fff',
            borderBottom: '1px solid #f0f0f0',
            position: 'sticky',
            top: 0,
            zIndex: 100
          }}
        />
        
        {/* Fixed Footer */}
        <div style={{ 
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#fff',
          borderTop: '1px solid #f0f0f0',
          padding: '16px 40px',
          display: 'flex',
          justifyContent: 'flex-end',
          zIndex: 1000,
          boxShadow: '0 -2px 8px rgba(0,0,0,0.1)'
        }}>
          <Button
            type="primary"
            size="large"
            disabled={
              !(
                (dataByTab.preliminary.selectedCriteria.length > 0 && dataByTab.preliminary.studentDetails.length > 0) ||
                (dataByTab.final.selectedCriteria.length > 0 && dataByTab.final.studentDetails.length > 0)
              ) || loading
            }
            loading={loading}
            style={{
              background: (
                !(
                  (dataByTab.preliminary.selectedCriteria.length > 0 && dataByTab.preliminary.studentDetails.length > 0) ||
                  (dataByTab.final.selectedCriteria.length > 0 && dataByTab.final.studentDetails.length > 0)
                ) || loading
              ) ? '#d9d9d9' : '#4CAF50',
              borderRadius: '6px',
              padding: '0 32px',
              height: '40px',
              minWidth: window.innerWidth <= 768 ? '120px' : '180px'
            }}
            onClick={saveEligibilityData}
          >
            Save and Continue
          </Button>
        </div>
      </div>
      
      {/* Media Queries for Additional Responsive Styling */}
      <style>
        {`
          @media (max-width: 768px) {
            .ant-tabs-content-holder {
              padding: 16px !important;
            }
            .ant-select-selector {
              padding: 8px 12px !important;
            }
            .ant-collapse-header {
              padding: 12px 16px !important;
            }
            .ant-collapse-content-box {
              padding: 16px !important;
            }
            .fixed-footer {
              padding: 12px 16px !important;
            }
          }
          
          @media (max-width: 480px) {
            .ant-tabs-tab {
              padding: 8px 12px !important;
              font-size: 14px !important;
            }
            .ant-btn-lg {
              height: 36px !important;
              padding: 0 20px !important;
              font-size: 14px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default OEligibility;