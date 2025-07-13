import { useState, useEffect } from "react";
import { Button, Input, Select, Tabs, Card, Row, Col, Typography, message } from 'antd';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { CiCirclePlus } from "react-icons/ci";
import { useParams } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

const OPattern = ({ fun, ID }) => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("preliminary");
  const [loading, setLoading] = useState(false);
  const [patternsByTab, setPatternsByTab] = useState({
    preliminary: [],
    final: []
  });
  
  // Use ID from props if available, otherwise use id from params
  const competitionId = ID || id;

  // Fetch pattern data when component mounts
  useEffect(() => {
    const getPattern = async () => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow"
        };

        const response = await fetch(`http://localhost:3001/api/competitions/getpattern/${competitionId}`, requestOptions);
        const result = await response.json();

        if (response.ok && result.success && result.data && result.data.sections) {
          console.log(result.data.sections, "result.data.sections");

          const fetchedSections = result.data.sections?.map((section, index) => ({
            id: Date.now() + index,
            name: section.sectionName || section.name,
            formats: [{
              id: Date.now() + index + 1,
              format: "MCQ", // Default format, can be adjusted based on API data
              questions: section.questions.toString(),
              marks: `+${section.marksPerQuestion}`
            }]
          }));

          setPatternsByTab({
            preliminary: fetchedSections, // Assuming all sections go to preliminary tab
            final: []
          });
        }
      } catch (error) {
        console.error('Error fetching pattern:', error);
        message.error('Failed to fetch pattern data.');
      }
    };

    getPattern();
  }, [competitionId]);

  const addSection = () => {
    const newSection = {
      id: Date.now(),
      name: "",
      formats: [
        {
          id: Date.now(),
          format: "",
          questions: "",
          marks: ""
        }
      ]
    };
    setPatternsByTab({
      ...patternsByTab,
      [activeTab]: [...patternsByTab[activeTab], newSection]
    });
  };

  const removeSection = (sectionId) => {
    setPatternsByTab({
      ...patternsByTab,
      [activeTab]: patternsByTab[activeTab].filter(section => section.id !== sectionId)
    });
  };

  const updateSection = (sectionId, field, value) => {
    setPatternsByTab({
      ...patternsByTab,
      [activeTab]: patternsByTab[activeTab].map(section =>
        section.id === sectionId
          ? { ...section, [field]: value }
          : section
      )
    });
  };

  const addFormat = (sectionId) => {
    setPatternsByTab({
      ...patternsByTab,
      [activeTab]: patternsByTab[activeTab].map(section =>
        section.id === sectionId
          ? {
            ...section,
            formats: [
              ...section.formats,
              {
                id: Date.now(),
                format: "",
                questions: "",
                marks: ""
              }
            ]
          }
          : section
      )
    });
  };

  const updateFormat = (sectionId, formatId, field, value) => {
    setPatternsByTab({
      ...patternsByTab,
      [activeTab]: patternsByTab[activeTab].map(section =>
        section.id === sectionId
          ? {
            ...section,
            formats: section.formats.map(format =>
              format.id === formatId
                ? { ...format, [field]: value }
                : format
            )
          }
          : section
      )
    });
  };

  const transformDataForAPI = () => {
    // Combine sections from both preliminary and final tabs with complete data
    const allSections = [];
    
    // Add preliminary sections
    patternsByTab.preliminary.forEach(section => {
      section.formats.forEach(format => {
        allSections.push({
          name: section.name,
          format: format.format,
          questions: parseInt(format.questions) || 0,
          marksPerQuestion: format.marks.replace('+', '') || '0'
        });
      });
    });
    
    // Add final sections
    patternsByTab.final.forEach(section => {
      section.formats.forEach(format => {
        allSections.push({
          name: section.name,
          format: format.format,
          questions: parseInt(format.questions) || 0,
          marksPerQuestion: format.marks.replace('+', '') || '0'
        });
      });
    });

    return {
      sections: allSections
    };
  };

  const savePattern = async () => {
    try {
      setLoading(true);

      // Validate required fields for both tabs
      const hasEmptyFields = Object.keys(patternsByTab).some(tab =>
        patternsByTab[tab].some(section =>
          !section.name.trim() ||
          section.formats.some(format =>
            !format.format || !format.questions || !format.marks
          )
        )
      );

      if (hasEmptyFields) {
        message.error('Please fill all required fields (Name, Format, Questions, Marks) in both Preliminary and Final tabs');
        return;
      }

      if (patternsByTab.preliminary.length === 0 && patternsByTab.final.length === 0) {
        message.warning('Please add at least one section in either Preliminary or Final tab before saving.');
        return;
      }

      const transformedData = transformDataForAPI();

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify(transformedData);

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      const response = await fetch(`http://localhost:3001/api/competitions/updatepattern/${competitionId}`, requestOptions);

      if (response.ok) {
        const result = await response.text();
        console.log('Success:', result);
        message.success('Pattern saved successfully!');
        fun(3, competitionId);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error saving pattern:', error);
      message.error('Failed to save pattern. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tabItems = [
    {
      key: 'preliminary',
      label: 'Preliminary',
    },
    {
      key: 'final',
      label: 'Final',
    }
  ];

  return (
    <div style={{ padding: '0', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      {/* Tabs Section */}
      <div style={{ backgroundColor: 'white', padding: '0 24px', borderBottom: '1px solid #f0f0f0' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          size="large"
        />
      </div>

      {/* Main Content */}
      <div style={{ padding: '24px', paddingBottom: '100px' }}>
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Title level={4} style={{ marginBottom: '24px', fontWeight: '600' }}>Pattern</Title>

          {patternsByTab[activeTab].map((section, sectionIndex) => (
            <div key={section.id} style={{
              border: '1px solid #f0f0f0',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '16px',
              backgroundColor: '#fafafa'
            }}>
              {/* Section Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <Text strong style={{ fontSize: '16px' }}>Section {sectionIndex + 1}</Text>
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  onClick={() => removeSection(section.id)}
                  size="small"
                  style={{ color: '#999' }}
                />
              </div>

              {/* Name Field */}
              <div style={{ marginBottom: '20px' }}>
                <Row align="middle" gutter={[16, 0]}>
                  <Col span={3}>
                    <Text strong>
                      Name<span style={{ color: 'red' }}>*</span>
                    </Text>
                  </Col>
                  <Col span={21}>
                    <Input
                      placeholder="Name of the Section"
                      value={section.name}
                      onChange={(e) => updateSection(section.id, 'name', e.target.value)}
                      style={{ width: '300px' }}
                    />
                  </Col>
                </Row>
              </div>

              {/* Format Fields */}
              {section.formats.map((format, formatIndex) => (
                <div key={format.id} style={{ marginBottom: '16px' }}>
                  <Row align="middle" gutter={[16, 0]}>
                    <Col span={3}>
                      <Text strong>
                        Format<span style={{ color: 'red' }}>*</span>
                      </Text>
                    </Col>
                    <Col span={5}>
                      <Select
                        placeholder="Select"
                        value={format.format}
                        onChange={(value) => updateFormat(section.id, format.id, 'format', value)}
                        style={{ width: '100%' }}
                        suffixIcon={<div style={{ color: '#999' }}>▼</div>}
                      >
                        <Option value="MCQ">MCQ</Option>
                        <Option value="Subjective">Subjective</Option>
                        <Option value="True/False">True/False</Option>
                      </Select>
                    </Col>
                    <Col span={3}>
                      <Text strong>
                        Questions<span style={{ color: 'red' }}>*</span>
                      </Text>
                    </Col>
                    <Col span={3}>
                      <Input
                        placeholder="Enter"
                        value={format.questions}
                        onChange={(e) => updateFormat(section.id, format.id, 'questions', e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </Col>
                    <Col span={3}>
                      <Text strong>
                        {formatIndex === 0 ? 'Marks' : 'Marks Per Question'}<span style={{ color: 'red' }}>*</span>
                      </Text>
                    </Col>
                    <Col span={4}>
                      <Input
                        placeholder="Enter"
                        value={format.marks}
                        onChange={(e) => updateFormat(section.id, format.id, 'marks', e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </Col>
                  </Row>
                </div>
              ))}

              {/* Add Format Button */}
              <div style={{ marginTop: '16px', marginLeft: '120px' }}>
                <Button
                  type="link"
                  icon={<CiCirclePlus className="fs-4" />}
                  onClick={() => addFormat(section.id)}
                  style={{ padding: '0', color: '#1890ff', fontSize: '14px' }}
                >
                  Add Format
                </Button>
              </div>
            </div>
          ))}

          {/* Add Section Button */}
          <Button
            type="link"
            icon={<CiCirclePlus className="fs-4" />}
            onClick={addSection}
            style={{ padding: '0', color: '#1890ff', fontSize: '14px', marginTop: '8px' }}
          >
            Add Section
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
        backgroundColor: 'white',
        padding: '16px 24px',
        borderTop: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'flex-end',
        zIndex: 1000
      }}>
        <Button
          type="primary"
          size="large"
          loading={loading}
          onClick={savePattern}
          style={{
            backgroundColor: (patternsByTab.preliminary.length > 0 || patternsByTab.final.length > 0) ? '#4CAF50' : '#d9d9d9',
            color: (patternsByTab.preliminary.length > 0 || patternsByTab.final.length > 0) ? '#fff' : '#666',
            minWidth: '160px',
            height: '40px',
            fontWeight: '500'
          }}
          disabled={patternsByTab.preliminary.length === 0 && patternsByTab.final.length === 0}
        >
          Save and Continue
        </Button>
      </div>
    </div>
  );
};

export default OPattern;