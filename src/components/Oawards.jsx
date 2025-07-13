import React, { useState } from "react";
import {
  Tabs,
  Select,
  Collapse,
  Input,
  Button,
  Space,
  Row,
  Col,
  Typography,
  Form,
  Card,
  message,
  Modal,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  UpOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Title } = Typography;
const { Option } = Select;

const Oawards = ({ fun, ID }) => {
  const navigate = useNavigate();
  const [awardTypes, setAwardTypes] = useState([]);
  const [activeKeys, setActiveKeys] = useState([]);
  const [selectedAwardType, setSelectedAwardType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // Use ID from props
  const competitionId = ID;

  // Available award type options
  const awardTypeOptions = [
    { value: "academic", label: "Academic Excellence" },
    { value: "sports", label: "Sports Achievement" },
    { value: "leadership", label: "Leadership Award" },
    { value: "attendance", label: "Perfect Attendance" },
    { value: "behavior", label: "Good Behavior" },
    { value: "participation", label: "Active Participation" },
    { value: "improvement", label: "Most Improved" },
    { value: "creativity", label: "Creativity Award" },
  ];

  const handleAwardTypeSelect = (value) => {
    const selectedOption = awardTypeOptions.find(
      (option) => option.value === value
    );
    if (selectedOption) {
      const newAwardType = {
        id: Date.now(),
        name: selectedOption.label,
        value: selectedOption.value,
        rows: [],
      };

      setAwardTypes((prev) => [...prev, newAwardType]);
      setActiveKeys((prev) => [...prev, newAwardType.id.toString()]);
      setSelectedAwardType(null); // Reset dropdown
    }
  };

  const addRow = (typeId) => {
    setAwardTypes((prev) =>
      prev.map((type) => {
        if (type.id === typeId) {
          const newRow = {
            id: Date.now(),
            quantity: "",
            givenTo: "",
          };
          return {
            ...type,
            rows: [...type.rows, newRow],
          };
        }
        return type;
      })
    );
  };

  const removeRow = (typeId, rowId) => {
    setAwardTypes((prev) =>
      prev.map((type) => {
        if (type.id === typeId) {
          return {
            ...type,
            rows: type.rows.filter((row) => row.id !== rowId),
          };
        }
        return type;
      })
    );
  };

  const updateRow = (typeId, rowId, field, value) => {
    setAwardTypes((prev) =>
      prev.map((type) => {
        if (type.id === typeId) {
          return {
            ...type,
            rows: type.rows.map((row) => {
              if (row.id === rowId) {
                return { ...row, [field]: value };
              }
              return row;
            }),
          };
        }
        return type;
      })
    );
  };

  const removeType = (typeId) => {
    setAwardTypes((prev) => prev.filter((type) => type.id !== typeId));
    setActiveKeys((prev) => prev.filter((key) => key !== typeId.toString()));
  };

  const renderAwardTypeContent = (type) => {
    return (
      <div style={{ padding: "16px 0" }}>
        {type.rows.length === 0 ? (
          <div
            style={{ textAlign: "center", color: "#999", padding: "20px 0" }}
          >
            No data added yet. Click "Add Row" to start adding data.
          </div>
        ) : (
          type.rows.map((row, index) => (
            <Row key={row.id} gutter={16} style={{ marginBottom: 16 }}>
              <Col span={10}>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 4,
                      fontWeight: 500,
                    }}
                  >
                    Quantity<span style={{ color: "red" }}>*</span>
                  </label>
                  <Input
                    placeholder="Enter quantity per student"
                    value={row.quantity}
                    onChange={(e) =>
                      updateRow(type.id, row.id, "quantity", e.target.value)
                    }
                  />
                </div>
              </Col>
              <Col span={10}>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 4,
                      fontWeight: 500,
                    }}
                  >
                    Given To<span style={{ color: "red" }}>*</span>
                  </label>
                  <Select
                    placeholder="Select"
                    style={{ width: "100%" }}
                    value={row.givenTo}
                    onChange={(value) =>
                      updateRow(type.id, row.id, "givenTo", value)
                    }
                  >
                    <Option value="student">Student</Option>
                    <Option value="class">Class</Option>
                    <Option value="school">School</Option>
                    <Option value="grade">Grade</Option>
                  </Select>
                </div>
              </Col>
              <Col
                span={4}
                style={{
                  display: "flex",
                  alignItems: "end",
                  justifyContent: "end",
                }}
              >
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => removeRow(type.id, row.id)}
                  style={{ color: "#ff4d4f" }}
                />
              </Col>
            </Row>
          ))
        )}

        <Button
          type="link"
          icon={<PlusOutlined />}
          onClick={() => addRow(type.id)}
          style={{ color: "#1890ff", padding: 0, marginTop: 8 }}
        >
          Add Row
        </Button>
      </div>
    );
  };

  const customCollapseHeader = (type) => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <span style={{ fontWeight: 500 }}>{type.name}</span>
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            type="text"
            size="small"
            icon={
              activeKeys.includes(type.id.toString()) ? (
                <UpOutlined />
              ) : (
                <DownOutlined />
              )
            }
          />
          <Button
            type="text"
            size="small"
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              removeType(type.id);
            }}
            style={{ color: "#ff4d4f" }}
          />
        </div>
      </div>
    );
  };

  // Filter out already selected award types
  const availableOptions = awardTypeOptions.filter(
    (option) => !awardTypes.some((type) => type.value === option.value)
  );

  // Transform data to API format
  const transformDataForAPI = () => {
    const awards = [];

    awardTypes.forEach((type) => {
      type.rows.forEach((row) => {
        if (row.quantity && row.givenTo) {
          awards.push({
            Award_Type: type.name,
            Quantity: parseInt(row.quantity) || 0,
            Given_To: row.givenTo,
          });
        }
      });
    });

    return awards;
  };

  // API call function
  const publishAwards = async () => {
    setLoading(true);

    try {
      const awards = transformDataForAPI();

      if (awards.length === 0) {
        message.warning(
          "Please add at least one complete award entry before publishing."
        );
        setLoading(false);
        return;
      }

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        awards: awards,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        `http://localhost:3001/api/competitions/awards/${competitionId}`,
        requestOptions
      );

      if (response.ok) {
        const result = await response.json();
        console.log("API Response:", result);
        message.success("Awards published successfully!");
        navigate("/organiser/dashboard");

        // Optional: Reset form after successful submission
        // setAwardTypes([]);
        // setActiveKeys([]);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error publishing awards:", error);
      message.error("Failed to publish awards. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // validation
  const isFormValid = () => {
    if (awardTypes.length === 0) return false;

    for (const type of awardTypes) {
      if (type.rows.length === 0) return false;
      for (const row of type.rows) {
        if (!row.quantity || !row.givenTo) return false;
      }
    }

    return true;
  };

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <Card style={{ maxWidth: "100%", margin: "0 auto" }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Preliminary" key="1" />
          <TabPane tab="Final" key="2" />
        </Tabs>

        <div style={{ marginTop: 24 }}>
          <Title level={3} style={{ marginBottom: 24 }}>
            Awards
          </Title>

          <Row style={{ marginBottom: 24 }}>
            <Col span={12}>
              <div>
                <label
                  style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
                >
                  Award Type
                </label>
                <Select
                  placeholder="Select All Award Types"
                  style={{ width: "100%" }}
                  value={selectedAwardType}
                  onChange={handleAwardTypeSelect}
                  suffixIcon={<DownOutlined />}
                >
                  {availableOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </div>
            </Col>
          </Row>

          {awardTypes.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "#999",
                padding: "40px 20px",
                border: "2px dashed #d9d9d9",
                borderRadius: "8px",
                marginBottom: 24,
              }}
            >
              <div style={{ fontSize: "16px", marginBottom: "8px" }}>
                No Award Types Added
              </div>
              <div style={{ fontSize: "14px" }}>
                Select an award type from the dropdown above to get started
              </div>
            </div>
          ) : (
            <Collapse
              activeKey={activeKeys}
              onChange={setActiveKeys}
              style={{ marginBottom: 24 }}
              expandIcon={() => null}
            >
              {awardTypes.map((type) => (
                <Panel
                  key={type.id.toString()}
                  header={customCollapseHeader(type)}
                  style={{ marginBottom: 8 }}
                >
                  {renderAwardTypeContent(type)}
                </Panel>
              ))}
            </Collapse>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 32,
            }}
          >
            <Button
              type=""
              size="large"
              disabled={!isFormValid() || loading}
              loading={loading}
              onClick={() => setIsModalVisible(true)}
              style={{
                backgroundColor: !isFormValid() ? "#dadada" : "#4CAF50",
                // borderColor: plans.length > 0 && registrationData.totalRegistrationFee ? '#1890ff' : '#d9d9d9',
                color: "#ffffff",
                height: "48px",
                paddingLeft: "32px",
                paddingRight: "32px",
                fontSize: "16px",
                fontWeight: "500",
                borderRadius: "6px",
              }}
            >
              Publish
            </Button>
          </div>
        </div>
      </Card>

      <Modal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalVisible(false)} style={{ color: "#4CAF50", borderColor: "#4CAF50", background: "#fff" }}>
            No, Back
          </Button>,
          <Button
            key="submit"
            type="primary"
            style={{ background: "#4CAF50", borderColor: "#4CAF50" }}
            loading={loading}
            onClick={async () => {
              await publishAwards();
              setIsModalVisible(false);
            }}
          >
            Yes, Publish
          </Button>,
        ]}
        centered
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>
            Are you sure you want to publish this Competition?
          </div>
          <div style={{ color: "#555", fontSize: 16 }}>
            Please review the details thoroughly. You will not be able to change any detail once the competition is published.
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Oawards;
