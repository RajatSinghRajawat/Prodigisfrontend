import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { ChevronDown, X } from "lucide-react";
import "./OverviewZero.css";
import JoditEditor from "jodit-react";
import {
  Input,
  Button,
  Select,
  DatePicker,
  Checkbox,
  Radio,
  Space,
  Row,
  Col,
  Typography,
  Card,
  Modal,
} from "antd";
import { CiCirclePlus } from "react-icons/ci";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";

const { Option } = Select;
const { Title, Text } = Typography;

const Orightcontaint = ({ fun, ID }) => {
  const { id } = useParams();
  const [showImage, setShowImage] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const editor = useRef(null);
  const userData = JSON.parse(localStorage.getItem("user_Data"));
  const userId = userData?._id;
  
  // Use ID from props if available, otherwise use id from params
  const competitionId = ID || id;

  const [competitionData, setCompetitionData] = useState({
    name: "",
    image: "",
    description: "",
    stages: [
      {
        id: Date.now(),
        name: "",
        date: "",
        endDate: "",
        mode: "Online",
        participation: "Individual",
        location: ["India"],
        duration: "2 hours",
      },
    ],
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const locationOptions = ["India"];

  // Strip HTML to plain text
  const stripHtml = (html) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  // JoditEditor configuration - using useMemo to prevent re-creation
  const editorConfig = useMemo(() => ({
    placeholder:
      "Tell the students about the competition and why they should register for this one.",
    height: 400,
    toolbarAdaptive: false,
    buttons: [
      "bold",
      "italic",
      "underline",
      "|",
      "ul",
      "ol",
      "|",
      "outdent",
      "indent",
      "|",
      "font",
      "fontsize",
      "brush",
      "paragraph",
      "|",
      "image",
      "table",
      "link",
      "|",
      "align",
      "undo",
      "redo",
      "|",
      "hr",
      "eraser",
      "copyformat",
    ],
    removeButtons: ["fullsize", "about"],
    uploader: {
      insertImageAsBase64URI: true,
    },
    style: {
      fontSize: "14px",
    },
  }), []);

  // Update competition field - using useCallback to prevent re-creation
  const updateCompetitionField = useCallback((field, value) => {
    setCompetitionData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Add a new stage
  const addStage = useCallback(() => {
    const newStage = {
      id: Date.now(),
      name: "",
      date: "",
      endDate: "",
      mode: "Online",
      participation: "Individual",
      location: ["India"],
      duration: "2 hours",
    };
    setCompetitionData((prev) => ({
      ...prev,
      stages: [...prev.stages, newStage],
    }));
  }, []);

  // Remove a stage
  const removeStage = useCallback((stageId) => {
    setCompetitionData((prev) => ({
      ...prev,
      stages: prev.stages.filter((stage) => stage.id !== stageId),
    }));
  }, []);

  // Update stage field
  const updateStage = useCallback((stageId, field, value) => {
    setCompetitionData((prev) => ({
      ...prev,
      stages: prev.stages.map((stage) =>
        stage.id === stageId ? { ...stage, [field]: value } : stage
      ),
    }));
  }, []);

  // Handle image upload
  const handleImageUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setShowImage(reader.result);
        setFileName(file.name);
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
        setFileSize(sizeInMB);
        setCompetitionData((prev) => ({
          ...prev,
          image: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Remove uploaded image
  const handleRemoveImage = useCallback(() => {
    setShowImage("");
    setFileName("");
    setFileSize(0);
    setCompetitionData((prev) => ({
      ...prev,
      image: "",
    }));
  }, []);

  // Handle editor content change - using useCallback to prevent re-creation
  const handleEditorChange = useCallback((newContent) => {
    setCompetitionData((prev) => ({
      ...prev,
      description: newContent,
    }));
  }, []);

  // Validate form
  useEffect(() => {
    const isOverviewValid =
      competitionData.name.trim() !== "" &&
      stripHtml(competitionData.description).trim() !== "" &&
      competitionData.image !== "";

    const areStagesValid = competitionData.stages.every(
      (stage) =>
        stage.name.trim() !== "" &&
        stage.date !== "" &&
        stage.mode.trim() !== "" &&
        stage.participation.trim() !== "" &&
        stage.location.length > 0 &&
        stage.duration.trim() !== ""
    );

    setIsFormValid(isOverviewValid && areStagesValid);
  }, [competitionData]);

  // Fetch overview data if ID exists
  const getOverview = async () => {
    if (!competitionId) return;
    // alert(competitionId)
    // Check localStorage first
    const localKey = `competition_overview_${competitionId}`;
    const saved = localStorage.getItem(localKey);
    // alert(saved)
    if (saved) {
      setCompetitionData(JSON.parse(saved));
      // Also set image preview if available
      const savedData = JSON.parse(saved);
      if (savedData.image && typeof savedData.image === "string") {
        setShowImage(savedData.image);
        setFileName(savedData.image.split("/").pop() || "Uploaded Image");
      }
      // return;
    }
    try {
      const response = await fetch(
        `http://localhost:3001/api/competitions/getoverview/${competitionId}`,
        {
          method: "GET",
          redirect: "follow",
        }
      );
      const result = await response.json();
      console.log("API Response:", result); // Debug: Log API response
      if (result.success && result.data) {
        const fetchedData = result.data;
        // Normalize stages to ensure all required fields
        const normalizedStages = fetchedData.stages?.length
          ? fetchedData.stages.map((stage, index) => ({
              id: stage.id || Date.now() + index, // Ensure unique ID
              name: stage.name || "",
              date: stage.date ? dayjs(stage.date).format("YYYY-MM-DD") : "",
              endDate: stage.endDate
                ? dayjs(stage.endDate).format("YYYY-MM-DD")
                : "",
              mode: stage.mode || "Online",
              participation: stage.participation || "Individual",
              location: Array.isArray(stage.location)
                ? stage.location
                : ["India"],
              duration: stage.duration || "2 hours",
            }))
          : [
              {
                id: Date.now(),
                name: "",
                date: "",
                endDate: "",
                mode: "Online",
                participation: "Individual",
                location: ["India"],
                duration: "2 hours",
              },
            ];

        const updatedCompetitionData = {
          name: fetchedData.name || "",
          description: fetchedData.description || "",
          image: fetchedData.image || "",
          stages: normalizedStages,
        };

        setCompetitionData(updatedCompetitionData);
        console.log("Updated competitionData:", updatedCompetitionData); // Debug: Log state

        if (fetchedData.image) {
          // Assuming image is a relative path; prepend base URL if needed
          const imageUrl = fetchedData.image.startsWith("http")
            ? fetchedData.image
            : `http://localhost:3001${fetchedData.image}`;
          setShowImage(imageUrl);
          setFileName(fetchedData.image.split("/").pop() || "Uploaded Image");
          setFileSize(fetchedData.imageSize || 0); // Update if API provides imageSize
        }

        // Save to localStorage
        localStorage.setItem(localKey, JSON.stringify(updatedCompetitionData));
      } else {
        console.error("No valid data found in response:", result);
      }
    } catch (error) {
      console.error("Error fetching overview:", error);
    }
  };

  useEffect(() => {
    getOverview();
  }, [competitionId]);

  // Persist competitionData to localStorage on change
  useEffect(() => {
    if (competitionId) {
      const localKey = `competition_overview_${competitionId}`;
      localStorage.setItem(localKey, JSON.stringify(competitionData));
    }
  }, [competitionData, competitionId]);

  // Save or update competition data
  const handleSave = useCallback(async () => {
    try {
      const formdata = new FormData();
      formdata.append("organizerId", userId);
      formdata.append("name", competitionData.name);
      formdata.append("description", stripHtml(competitionData.description));
      if (competitionData.image && typeof competitionData.image !== "string") {
        formdata.append("image", competitionData.image);
      }
      formdata.append("user_id", userId);
      formdata.append("stages", JSON.stringify(competitionData.stages));

      const url = competitionId
        ? `http://localhost:3001/api/competitions/updateoverview/${competitionId}`
        : `http://localhost:3001/api/competitions/overview`;

      const method = competitionId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formdata,
        redirect: "follow",
      });

      const result = await response.json();
      console.log("Save/Update Response:", result); // Debug: Log API response
      
      // Pass the ID to next step - use existing ID for updates, new ID for creates
      const resultId = competitionId || result._id;
      // Clear localStorage for this step on successful save
      if (competitionId) {
        localStorage.removeItem(`competition_overview_${competitionId}`);
      } else if (result._id) {
        localStorage.removeItem(`competition_overview_${result._id}`);
      }
      fun(1, resultId);
    } catch (error) {
      console.error(`${competitionId ? "Update" : "Save"} error:`, error);
    }
  }, [competitionData, userId, competitionId, fun]);

  const [deleteModal, setDeleteModal] = useState({ open: false, stageId: null });

  return (
    <div style={{ padding: "24px", backgroundColor: "#fff" }}>
      <Title
        level={2}
        style={{ marginBottom: "24px", color: "#000", fontWeight: 500 }}
      >
        Competition Overview
      </Title>

      <Row gutter={24} style={{ marginBottom: "24px" }}>
        <Col span={12}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Text strong style={{ color: "#000" }}>
              Name<span style={{ color: "#ef4444" }}>*</span>
            </Text>
            <Input
              placeholder="Create a unique name for your competition"
              value={competitionData.name}
              onChange={(e) => updateCompetitionField("name", e.target.value)}
              size="large"
            />
          </Space>
        </Col>
        <Col span={12}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Text strong style={{ color: "#000" }}>
              Image<span style={{ color: "#ef4444" }}>*</span>
            </Text>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
                id="image-upload"
              />
              {!showImage ? (
                <Button
                  type="primary"
                  icon={<CiCirclePlus className="fs-3" />}
                  onClick={() =>
                    document.getElementById("image-upload").click()
                  }
                  style={{
                    backgroundColor: "#4CAF50",
                    borderColor: "#4CAF50",
                  }}
                >
                  Upload Image
                </Button>
              ) : (
                <div className="d-flex justify-content-center gap-3">
                  <img
                    src={showImage}
                    alt="Competition"
                    style={{ maxWidth: "100px", maxHeight: "100px" }}
                  />
                  <div className="d-flex flex-column">
                    <Text style={{ flex: 1, fontWeight: 700 }}>{fileName}</Text>
                    <Text
                      style={{ flex: 1, fontWeight: 100, fontSize: "12px" }}
                    >
                      {fileSize} MB
                    </Text>
                  </div>
                  <Button
                    type="text"
                    size="small"
                    icon={<X size={14} />}
                    onClick={handleRemoveImage}
                  />
                </div>
              )}
            </div>
          </Space>
        </Col>
      </Row>

      <div style={{ marginBottom: "32px" }}>
        <Text
          strong
          style={{
            color: "#000",
            fontSize: "16px",
            display: "block",
            marginBottom: "12px",
          }}
        >
          Competition Description<span style={{ color: "#ef4444" }}>*</span>
        </Text>
        <Card
          style={{
            boxShadow: "0px 0px 20px 0px #00000012",
            borderRadius: "12px",
            border: "1px solid #f0f0f0",
          }}
        >
          <JoditEditor
            ref={editor}
            value={competitionData.description}
            config={editorConfig}
            onChange={handleEditorChange}
          />
        </Card>
      </div>

      <div>
        <Title level={3} style={{ marginBottom: "16px", color: "#000" }}>
          Stages
        </Title>

        <Space direction="vertical" style={{ width: "100%" }} size="large">
          {competitionData.stages.map((stage, index) => (
            <Card
              key={stage.id}
              style={{
                boxShadow: "0px 0px 20px 0px #00000012",
                borderRadius: "12px",
              }}
              bodyStyle={{ padding: "24px" }}
            >
              <div className="stage-header-container">
                <Title level={4} className="stage-title">
                  Stage {index + 1}
                </Title>
                {competitionData.stages.length > 1 && (
                  <Button
                    type="text"
                    size="small"
                    icon={<X size={16} />}
                    onClick={() => setDeleteModal({ open: true, stageId: stage.id })}
                    className="remove-stage-btn"
                  />
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                {/* Name Field */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "32px" }}
                >
                  <div style={{ minWidth: "80px" }}>
                    <Text strong style={{ color: "#000", fontSize: "14px" }}>
                      Name<span style={{ color: "#ef4444" }}>*</span>
                    </Text>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Input
                      placeholder="Name of the Stage"
                      value={stage.name}
                      onChange={(e) =>
                        updateStage(stage.id, "name", e.target.value)
                      }
                      size="large"
                      style={{ fontSize: "14px", height: "40px" }}
                    />
                  </div>
                </div>

                {/* Date Field */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "32px" }}
                >
                  <div style={{ minWidth: "80px" }}>
                    <Text strong style={{ color: "#000", fontSize: "14px" }}>
                      Date<span style={{ color: "#ef4444" }}>*</span>
                    </Text>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <DatePicker
                      placeholder="Select"
                      value={stage.date ? dayjs(stage.date) : null}
                      onChange={(date, dateString) =>
                        updateStage(stage.id, "date", dateString)
                      }
                      size="large"
                      style={{ width: "160px", height: "40px" }}
                      format="YYYY-MM-DD"
                    />
                    {stage.endDate && (
                      <>
                        <Text
                          style={{
                            color: "#666",
                            fontSize: "14px",
                            margin: "0 8px",
                          }}
                        >
                          to
                        </Text>
                        <DatePicker
                          placeholder="Select"
                          value={stage.endDate ? dayjs(stage.endDate) : null}
                          onChange={(date, dateString) =>
                            updateStage(stage.id, "endDate", dateString)
                          }
                          size="large"
                          style={{ width: "160px", height: "40px" }}
                          format="YYYY-MM-DD"
                        />
                      </>
                    )}
                    <Checkbox
                      checked={!!stage.endDate}
                      onChange={(e) => {
                        if (e.target.checked) {
                          const endDateValue =
                            stage.date || dayjs().format("YYYY-MM-DD");
                          updateStage(stage.id, "endDate", endDateValue);
                        } else {
                          updateStage(stage.id, "endDate", "");
                        }
                      }}
                      style={{ marginLeft: "16px" }}
                    >
                      <Text style={{ color: "#757575", fontSize: "14px" }}>
                        Add a Date Range
                      </Text>
                    </Checkbox>
                  </div>
                </div>

                {/* Mode and Participation Row */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "32px" }}
                >
                  <div style={{ minWidth: "80px" }}>
                    <Text strong style={{ color: "#000", fontSize: "14px" }}>
                      Mode<span style={{ color: "#ef4444" }}>*</span>
                    </Text>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: "80px",
                    }}
                  >
                    <Radio.Group
                      value={stage.mode}
                      onChange={(e) =>
                        updateStage(stage.id, "mode", e.target.value)
                      }
                      buttonStyle="solid"
                      size="middle"
                      style={{ display: "flex" }}
                    >
                      <Radio.Button
                        value="Online"
                        style={{
                          borderRadius: "20px 0 0 20px",
                          padding: "6px 20px",
                          fontSize: "14px",
                          height: "32px",
                          lineHeight: "20px",
                        }}
                      >
                        Online
                      </Radio.Button>
                      <Radio.Button
                        value="Offline"
                        style={{
                          borderRadius: "0 20px 20px 0",
                          padding: "6px 20px",
                          fontSize: "14px",
                          height: "32px",
                          lineHeight: "20px",
                        }}
                      >
                        Offline
                      </Radio.Button>
                    </Radio.Group>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                      }}
                    >
                      <Text
                        strong
                        style={{
                          color: "#000",
                          fontSize: "14px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Participation<span style={{ color: "#ef4444" }}>*</span>
                      </Text>
                      <Radio.Group
                        value={stage.participation}
                        onChange={(e) =>
                          updateStage(stage.id, "participation", e.target.value)
                        }
                        buttonStyle="solid"
                        size="middle"
                        style={{ display: "flex" }}
                      >
                        <Radio.Button
                          value="Individual"
                          style={{
                            borderRadius: "20px 0 0 20px",
                            padding: "6px 20px",
                            fontSize: "14px",
                            height: "32px",
                            lineHeight: "20px",
                          }}
                        >
                          Individual
                        </Radio.Button>
                        <Radio.Button
                          value="School"
                          style={{
                            borderRadius: "0 20px 20px 0",
                            padding: "6px 20px",
                            fontSize: "14px",
                            height: "32px",
                            lineHeight: "20px",
                          }}
                        >
                          School
                        </Radio.Button>
                      </Radio.Group>
                    </div>
                  </div>
                </div>

                {/* Locations Field */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "32px" }}
                >
                  <div style={{ minWidth: "80px" }}>
                    <Text strong style={{ color: "#000", fontSize: "14px" }}>
                      Locations<span style={{ color: "#ef4444" }}>*</span>
                    </Text>
                  </div>
                  <div style={{ flex: 1, maxWidth: "300px" }}>
                    <Select
                      mode="multiple"
                      placeholder="Select locations"
                      value={stage.location}
                      onChange={(value) =>
                        updateStage(stage.id, "location", value)
                      }
                      style={{ width: "100%" }}
                      size="large"
                      suffixIcon={<ChevronDown size={16} />}
                    >
                      {locationOptions.map((location) => (
                        <Option key={location} value={location}>
                          {location}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </div>

                {/* Duration Field */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "32px" }}
                >
                  <div style={{ minWidth: "80px" }}>
                    <Text strong style={{ color: "#000", fontSize: "14px" }}>
                      Duration<span style={{ color: "#ef4444" }}>*</span>
                    </Text>
                  </div>
                  <div style={{ flex: 1, maxWidth: "300px" }}>
                    <Input
                      placeholder="e.g., 2 hours"
                      value={stage.duration}
                      onChange={(e) =>
                        updateStage(stage.id, "duration", e.target.value)
                      }
                      size="large"
                      style={{ fontSize: "14px", height: "40px" }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}

          <Button
            onClick={addStage}
            icon={<CiCirclePlus className="fs-3" />}
            size="large"
          >
            Add Stage
          </Button>
        </Space>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "40px",
        }}
      >
        <Button
          type="primary"
          size="large"
          onClick={handleSave}
          disabled={!isFormValid}
          style={{
            backgroundColor: isFormValid ? "#4CAF50" : "#dadada",
            borderColor: isFormValid ? "#4CAF50" : "#dadada",
            color: isFormValid ? "#fff" : "#888",
            padding: "12px 24px",
          }}
        >
          Save and Continue
        </Button>
      </div>

      <Modal
        open={deleteModal.open}
        onCancel={() => setDeleteModal({ open: false, stageId: null })}
        footer={null}
        centered
      >
        <div style={{ textAlign: "center" }}>
          <h2>Are you sure you want to delete the stage?</h2>
          <p>All details about the stage would be deleted.</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 24 }}>
            <Button
              onClick={() => setDeleteModal({ open: false, stageId: null })}
              style={{ borderColor: "#4CAF50", color: "#4CAF50" }}
            >
              No, Back
            </Button>
            <Button
              type="primary"
              style={{ backgroundColor: "#4CAF50", borderColor: "#4CAF50" }}
              onClick={() => {
                removeStage(deleteModal.stageId);
                setDeleteModal({ open: false, stageId: null });
              }}
            >
              Yes, Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Orightcontaint;