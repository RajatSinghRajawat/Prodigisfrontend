import { useState, useEffect } from "react";
import {
  Tabs,
  Select,
  Form,
  Button,
  Typography,
  Space,
  Input,
  Row,
  Col,
  Card,
  Tag,
  Checkbox,
  List,
  message,
} from "antd";
import {
  CloseOutlined,
  DownOutlined,
  SearchOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

const OSyllabus = ({ fun, ID }) => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("preliminary");
  const [expandedTopics, setExpandedTopics] = useState([]);
  const [topicsByTab, setTopicsByTab] = useState({
    preliminary: [],
    final: [],
  });
  const [selectedTopicFromDropdown, setSelectedTopicFromDropdown] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Use ID from props if available, otherwise use id from params
  const competitionId = ID || id;

  // Static data for subtopics
  const allSubtopics = {
    Algebra: [
      "Linear Equations",
      "Quadratic Equations",
      "Polynomial Equations",
      "Algebraic Expressions",
      "Factorization",
      "Rational Expressions",
      "Inequalities",
      "Systems of Equations",
      "Matrices",
      "Determinants",
    ],
    Geometry: [
      "Points and Lines",
      "Angles",
      "Triangles",
      "Quadrilaterals",
      "Circles",
      "Area and Perimeter",
      "Volume",
      "Coordinate Geometry",
      "Transformations",
      "Similarity and Congruence",
    ],
    Trigonometry: [
      "Trigonometric Ratios",
      "Trigonometric Identities",
      "Trigonometric Equations",
      "Inverse Trigonometric Functions",
      "Applications of Trigonometry",
      "Trigonometric Graphs",
      "Unit Circle",
      "Law of Sines",
      "Law of Cosines",
    ],
    Calculus: [
      "Limits",
      "Derivatives",
      "Integration",
      "Applications of Derivatives",
      "Applications of Integration",
      "Differential Equations",
      "Sequences and Series",
      "Multivariable Calculus",
      "Vector Calculus",
      "Partial Derivatives",
    ],
    Statistics: [
      "Descriptive Statistics",
      "Probability Distributions",
      "Hypothesis Testing",
      "Regression Analysis",
      "Correlation",
      "Sampling Methods",
      "Confidence Intervals",
      "ANOVA",
      "Chi-Square Tests",
      "Non-parametric Tests",
    ],
    Probability: [
      "Basic Probability",
      "Conditional Probability",
      "Bayes Theorem",
      "Random Variables",
      "Probability Distributions",
      "Expected Value",
      "Variance",
      "Central Limit Theorem",
      "Hypothesis Testing",
    ],
    "Linear Algebra": [
      "Vectors",
      "Vector Spaces",
      "Linear Transformations",
      "Eigenvalues",
      "Eigenvectors",
      "Matrix Operations",
      "Determinants",
      "Linear Systems",
    ],
    "Discrete Mathematics": [
      "Set Theory",
      "Logic",
      "Combinatorics",
      "Graph Theory",
      "Number Theory",
      "Boolean Algebra",
      "Recurrence Relations",
    ],
  };

  const allTopics = [
    "Algebra",
    "Geometry",
    "Trigonometry",
    "Calculus",
    "Statistics",
    "Probability",
    "Linear Algebra",
    "Discrete Mathematics",
    "Number Theory",
    "Combinatorics",
    "Graph Theory",
    "Optimization",
    "Differential Equations",
    "Integral Calculus",
    "Vector Calculus",
    "Complex Analysis",
    "Real Analysis",
    "Partial Differential Equations",
    "Numerical Analysis",
    "Cryptography",
    "Information Theory",
    "Game Theory",
  ];

  const handleTopicSelect = (topicName) => {
    const currentTopics = topicsByTab[activeTab];
    if (currentTopics.some((topic) => topic.name === topicName)) {
      return;
    }

    const newTopic = {
      name: topicName,
      weight: 12,
      subtopics: [],
      searchTerm: "",
      searchResults: [],
      selectedSearchItems: [],
    };

    setTopicsByTab({
      ...topicsByTab,
      [activeTab]: [...currentTopics, newTopic],
    });
    setSelectedTopicFromDropdown(null);
  };

  const handleTopicRemove = (index) => {
    const newTopics = topicsByTab[activeTab].filter((_, i) => i !== index);
    setTopicsByTab({
      ...topicsByTab,
      [activeTab]: newTopics,
    });

    if (expandedTopics.includes(index)) {
      setExpandedTopics(expandedTopics.filter((i) => i !== index));
    }
  };

  const handleWeightChange = (index, value) => {
    const newTopics = [...topicsByTab[activeTab]];
    newTopics[index].weight = value;
    setTopicsByTab({
      ...topicsByTab,
      [activeTab]: newTopics,
    });
  };

  const handleSearchChange = (index, value) => {
    const newTopics = [...topicsByTab[activeTab]];
    newTopics[index].searchTerm = value;

    if (value.trim()) {
      const topicName = newTopics[index].name;
      const availableSubtopics = allSubtopics[topicName] || [];
      const searchResults = availableSubtopics.filter(
        (subtopic) =>
          subtopic.toLowerCase().includes(value.toLowerCase()) &&
          !newTopics[index].subtopics.includes(subtopic)
      );
      newTopics[index].searchResults = searchResults;
    } else {
      newTopics[index].searchResults = [];
    }

    setTopicsByTab({
      ...topicsByTab,
      [activeTab]: newTopics,
    });
  };

  const handleSearchItemSelect = (topicIndex, subtopic, checked) => {
    const newTopics = [...topicsByTab[activeTab]];
    if (checked) {
      if (!newTopics[topicIndex].selectedSearchItems.includes(subtopic)) {
        newTopics[topicIndex].selectedSearchItems.push(subtopic);
      }
    } else {
      newTopics[topicIndex].selectedSearchItems = newTopics[
        topicIndex
      ].selectedSearchItems.filter((item) => item !== subtopic);
    }
    setTopicsByTab({
      ...topicsByTab,
      [activeTab]: newTopics,
    });
  };

  const addSelectedSubtopics = (topicIndex) => {
    const newTopics = [...topicsByTab[activeTab]];
    const selectedItems = newTopics[topicIndex].selectedSearchItems;

    selectedItems.forEach((item) => {
      if (!newTopics[topicIndex].subtopics.includes(item)) {
        newTopics[topicIndex].subtopics.push(item);
      }
    });

    newTopics[topicIndex].searchTerm = "";
    newTopics[topicIndex].searchResults = [];
    newTopics[topicIndex].selectedSearchItems = [];

    setTopicsByTab({
      ...topicsByTab,
      [activeTab]: newTopics,
    });
  };

  const removeSubtopic = (topicIndex, subtopicIndex) => {
    const newTopics = [...topicsByTab[activeTab]];
    newTopics[topicIndex].subtopics.splice(subtopicIndex, 1);
    setTopicsByTab({
      ...topicsByTab,
      [activeTab]: newTopics,
    });
  };

  const toggleTopicExpansion = (index) => {
    if (expandedTopics.includes(index)) {
      setExpandedTopics(expandedTopics.filter((i) => i !== index));
    } else {
      setExpandedTopics([...expandedTopics, index]);
    }
  };

  const removeAllWeightage = () => {
    const newTopics = topicsByTab[activeTab].map((topic) => ({
      ...topic,
      weight: 0,
    }));
    setTopicsByTab({
      ...topicsByTab,
      [activeTab]: newTopics,
    });
  };

  const availableTopics = allTopics.filter(
    (topic) =>
      !topicsByTab[activeTab].some(
        (selectedTopic) => selectedTopic.name === topic
      )
  );

  const tabItems = [
    {
      key: "preliminary",
      label: "Preliminary",
    },
    {
      key: "final",
      label: "Final",
    },
  ];

  // Transform data to API format, sending syllabus with topics as an array of names
  const transformDataForAPI = () => {
    const topics = [
      ...topicsByTab.preliminary.map((topic) => ({
        name: topic.name,
        weight: topic.weight,
        subtopics: topic.subtopics || [],
        stage: "preliminary"
      })),
      ...topicsByTab.final.map((topic) => ({
        name: topic.name,
        weight: topic.weight,
        subtopics: topic.subtopics || [],
        stage: "final"
      })),
    ];
    return { syllabus: { topics } };
  };

  // Modified saveSyllabus function to handle create or update
  const saveSyllabus = async () => {
    const data = transformDataForAPI();
    const topics = data.syllabus.topics;

    if (!Array.isArray(topics) || topics.length === 0) {
      message.warning(
        "Please select at least one topic in either Preliminary or Final tab before saving."
      );
      return;
    }

    setLoading(true);

    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      // Log the payload for debugging
      console.log("Payload being sent to API:", JSON.stringify(data, null, 2));

      const raw = JSON.stringify(data);

      if (!competitionId) {
        message.error("Competition ID is required to save syllabus");
        return;
      }

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const url = `http://localhost:3001/api/competitions/updatesyllabus/${competitionId}`;

      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log("Syllabus saved/updated successfully:", result);
      message.success("Syllabus saved successfully!");

      fun(2, competitionId);
    } catch (error) {
      console.error("Error:", error);
      message.error("Failed to save syllabus. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch syllabus and update state
  const getsyllabus = async () => {
    if (!competitionId) return;

    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      const response = await fetch(
        `http://localhost:3001/api/competitions/getsyllabus/${competitionId}`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Fetched syllabus:", result);

      if (result.success && result.data && Array.isArray(result.data.topics)) {
        // Handle case where topics is array of strings or array of objects
        const topics = result.data.topics;
        console.log("Fetched topics from API:", topics);
        
        let preliminaryTopics = [];
        let finalTopics = [];

        // If topics is array of strings, put all in preliminary
        if (topics.length > 0 && typeof topics[0] === 'string') {
          preliminaryTopics = topics
            .filter(topic => allTopics.includes(topic))
            .map((topic) => ({
              name: topic,
              weight: 12,
              subtopics: [],
              searchTerm: "",
              searchResults: [],
              selectedSearchItems: [],
            }));
        } else {
          // If topics is array of objects with stage
          preliminaryTopics = topics
            .filter((topic) => topic.stage === "preliminary" && allTopics.includes(topic.name))
            .map((topic) => ({
              name: topic.name,
              weight: topic.weight || 12,
              subtopics: topic.subtopics || [],
              searchTerm: "",
              searchResults: [],
              selectedSearchItems: [],
            }));

          finalTopics = topics
            .filter((topic) => topic.stage === "final" && allTopics.includes(topic.name))
            .map((topic) => ({
              name: topic.name,
              weight: topic.weight || 12,
              subtopics: topic.subtopics || [],
              searchTerm: "",
              searchResults: [],
              selectedSearchItems: [],
            }));
        }

        setTopicsByTab({
          preliminary: preliminaryTopics,
          final: finalTopics,
        });
      } else {
        console.warn("No valid topics found in the response");
      }
    } catch (error) {
      console.error("Error fetching syllabus:", error);
      message.error("Failed to fetch syllabus. Please try again.");
    }
  };

  useEffect(() => {
    if (competitionId) {
      getsyllabus();
    }
  }, [competitionId]);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "20px",
      }}
    >
      <Card
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          style={{ marginBottom: "32px" }}
        />

        <Title
          level={3}
          style={{
            marginBottom: "32px",
            fontWeight: "normal",
            fontSize: "28px",
          }}
        >
          Syllabus
        </Title>

        <Form layout="vertical">
          <Row gutter={24} align="middle" style={{ marginBottom: "32px" }}>
            <Col span={24}>
              <Form.Item
                label={
                  <span style={{ fontSize: "16px", fontWeight: "500" }}>
                    Topics<span style={{ color: "red" }}>*</span>
                  </span>
                }
                style={{ marginBottom: 0 }}
              >
                <Select
                  placeholder="Select All Topics"
                  style={{ width: "100%" }}
                  suffixIcon={<DownOutlined />}
                  size="large"
                  value={selectedTopicFromDropdown}
                  onChange={handleTopicSelect}
                  onSelect={() => setSelectedTopicFromDropdown(null)}
                >
                  {availableTopics.map((topic, index) => (
                    <Option key={index} value={topic}>
                      {topic}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {topicsByTab[activeTab].length > 0 && (
            <div style={{ marginBottom: "32px" }}>
              {topicsByTab[activeTab].map((topic, index) => (
                <div key={index} style={{ marginBottom: "2px" }}>
                  <Row
                    align="middle"
                    style={{
                      padding: "16px 20px",
                      backgroundColor: "#fff",
                      border: "1px solid #d9d9d9",
                      borderRadius: "6px",
                      marginBottom: expandedTopics.includes(index) ? 0 : "8px",
                    }}
                  >
                    <Col span={12}>
                      <Text style={{ fontSize: "16px", fontWeight: "500" }}>
                        {topic.name}
                      </Text>
                    </Col>
                    <Col span={3}>
                      <Button
                        type="text"
                        icon={
                          expandedTopics.includes(index) ? (
                            <CaretUpOutlined />
                          ) : (
                            <CaretDownOutlined />
                          )
                        }
                        onClick={() => toggleTopicExpansion(index)}
                        style={{ color: "#666" }}
                      />
                    </Col>
                    <Col span={3}>
                      <Button
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={() => handleTopicRemove(index)}
                        style={{ color: "#666" }}
                      />
                    </Col>

                    <Col span={6}>
                      <Row gutter={8} align="middle">
                        <Col span={12}>
                          <Input
                            value={topic.weight}
                            onChange={(e) =>
                              handleWeightChange(index, e.target.value)
                            }
                            style={{ textAlign: "center" }}
                            size="large"
                          />
                        </Col>
                        <Col span={12}>
                          <Text style={{ fontSize: "16px" }}>%</Text>
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  {expandedTopics.includes(index) && (
                    <div
                      style={{
                        backgroundColor: "#fafafa",
                        border: "1px solid #d9d9d9",
                        borderTop: "none",
                        borderRadius: "0 0 6px 6px",
                        padding: "20px",
                        marginBottom: "8px",
                      }}
                    >
                      <Row
                        gutter={16}
                        style={{ marginBottom: "16px" }}
                        className="search-subjects"
                      >
                        <Col span={20}>
                          <Input
                            placeholder="Search subtopics"
                            prefix={<SearchOutlined />}
                            value={topic.searchTerm}
                            onChange={(e) =>
                              handleSearchChange(index, e.target.value)
                            }
                            size="large"
                          />
                        </Col>
                        <Col span={4}>
                          {topic.selectedSearchItems.length > 0 && (
                            <Button
                              type="primary"
                              icon={<PlusOutlined />}
                              onClick={() => addSelectedSubtopics(index)}
                              size="large"
                              style={{ background: "#4CAF50", color: "#fff" }}
                            >
                              Add
                            </Button>
                          )}
                        </Col>
                      </Row>

                      {topic.searchResults.length > 0 && (
                        <div
                          style={{
                            marginBottom: "16px",
                            maxHeight: "200px",
                            overflowY: "auto",
                            border: "1px solid #d9d9d9",
                            borderRadius: "4px",
                            backgroundColor: "#fff",
                          }}
                        >
                          <List
                            size="small"
                            dataSource={topic.searchResults}
                            renderItem={(item) => (
                              <List.Item style={{ padding: "8px 16px" }}>
                                <Checkbox
                                  className="vvvvv"
                                  checked={topic.selectedSearchItems.includes(
                                    item
                                  )}
                                  onChange={(e) =>
                                    handleSearchItemSelect(
                                      index,
                                      item,
                                      e.target.checked
                                    )
                                  }
                                >
                                  {item}
                                </Checkbox>
                              </List.Item>
                            )}
                          />
                        </div>
                      )}

                      {topic.subtopics.length > 0 && (
                        <div>
                          <Text
                            strong
                            style={{ display: "block", marginBottom: "8px" }}
                          >
                            Selected Subtopics:
                          </Text>
                          <Space wrap>
                            {topic.subtopics.map((subtopic, subIndex) => (
                              <Tag
                                key={subIndex}
                                closable
                                onClose={() => removeSubtopic(index, subIndex)}
                                style={{
                                  fontSize: "14px",
                                  padding: "4px 8px",
                                  border: "1px solid #4CAF50",
                                  borderRadius: "999px",
                                  color: "#4CAF50",
                                }}
                              >
                                {subtopic}
                              </Tag>
                            ))}
                          </Space>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {topicsByTab[activeTab].length > 0 && (
            <div
              style={{
                marginBottom: "40px",
                display: "flex",
                justifyContent: "end",
              }}
            >
              <Button
                type="link"
                onClick={removeAllWeightage}
                style={{
                  padding: 0,
                  color: "#1890ff",
                  fontSize: "16px",
                  textAlign: "end",
                }}
              >
                Remove Weightage
              </Button>
            </div>
          )}

          <div style={{ textAlign: "right" }}>
            <Button
              type="primary"
              size="large"
              style={{
                backgroundColor:
                  topicsByTab.preliminary.length > 0 ||
                  topicsByTab.final.length > 0
                    ? "#4CAF50"
                    : "#d9d9d9",
                color:
                  topicsByTab.preliminary.length > 0 ||
                  topicsByTab.final.length > 0
                    ? "#fff"
                    : "#666",
                fontWeight: "normal",
                fontSize: "16px",
                height: "48px",
                paddingLeft: "32px",
                paddingRight: "32px",
              }}
              onClick={saveSyllabus}
              loading={loading}
              disabled={
                topicsByTab.preliminary.length === 0 &&
                topicsByTab.final.length === 0
              }
            >
              Save and Continue
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default OSyllabus;