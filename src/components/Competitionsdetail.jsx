import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import "./Competitionsdetail.css";
import HeaderUser from "./HeaderUser";
import FooterUsers from "./FooterUsers";
import Organisersheader from "./Organisersheader";
import { GoDotFill } from "react-icons/go";

import Studentheaderhome from "./Studentheaderhome";

function Ocompetitionsdetail() {
  const { competitionsid } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  // Separate state for each section
  const [sectionData, setSectionData] = useState({
    overview: null,
    syllabus: null,
    pattern: null,
    eligibility: null,
    registration: null,
    awards: null
  });

  // Loading states for each section
  const [sectionLoading, setSectionLoading] = useState({
    overview: true,
    syllabus: true,
    pattern: true,
    eligibility: true,
    registration: true,
    awards: true
  });

  // Error states for each section
  const [sectionErrors, setSectionErrors] = useState({
    overview: null,
    syllabus: null,
    pattern: null,
    eligibility: null,
    registration: null,
    awards: null
  });

  // Add studentInformation state
  const [studentInformation, setStudentInformation] = useState({ StudentDetails: [], SchoolDetails: [] });

  const openTab = (tab) => {
    setActiveTab(tab);
  };

  // Helper function to update section loading state
  const updateSectionLoading = (section, isLoading) => {
    setSectionLoading(prev => ({
      ...prev,
      [section]: isLoading
    }));
  };

  // Helper function to update section error state
  const updateSectionError = (section, error) => {
    setSectionErrors(prev => ({
      ...prev,
      [section]: error
    }));
  };

  // Helper function to update section data
  const updateSectionData = (section, data) => {
    setSectionData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  // Generic API call function
  const fetchSectionData = async (section, endpoint) => {
    try {
      updateSectionLoading(section, true);
      updateSectionError(section, null);

      console.log(`🔍 Fetching ${section} data from: ${endpoint}`);

      const response = await fetch(endpoint, {
        method: "GET",
        redirect: "follow",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(`✅ ${section} API Response:`, result);

      if (result.success && result.data) {
        if (section === "eligibility") {
          // Store eligibility array and studentInformation object
          updateSectionData("eligibility", result.data.eligibility || []);
          setStudentInformation(result.data.studentInformation || { StudentDetails: [], SchoolDetails: [] });
        } else {
          updateSectionData(section, result.data);
        }
        console.log(`✅ ${section} data loaded successfully`);
      } else {
        throw new Error(result.message || `Failed to fetch ${section} data`);
      }
    } catch (error) {
      console.error(`❌ Error fetching ${section} data:`, error);
      updateSectionError(section, error.message);
    } finally {
      updateSectionLoading(section, false);
    }
  };

  // Individual API calls for each section
  const fetchOverviewData = () => {
    fetchSectionData('overview', `http://localhost:3001/api/competitions/getoverview/${competitionsid}`);
  };

  const fetchSyllabusData = () => {
    fetchSectionData('syllabus', `http://localhost:3001/api/competitions/getsyllabus/${competitionsid}`);
  };

  const fetchPatternData = () => {
    fetchSectionData('pattern', `http://localhost:3001/api/competitions/getpattern/${competitionsid}`);
  };

  const fetchEligibilityData = () => {
    fetchSectionData('eligibility', `http://localhost:3001/api/competitions/eligibility/${competitionsid}`);
  };

  const fetchRegistrationData = () => {
    fetchSectionData('registration', `http://localhost:3001/api/competitions/registration/${competitionsid}`);
  };

  const fetchAwardsData = () => {
    fetchSectionData('awards', `http://localhost:3001/api/competitions/awards/${competitionsid}`);
  };

  // Fetch all data when component mounts
  useEffect(() => {
    if (competitionsid) {
      console.log(`🚀 Starting to fetch all competition data for ID: ${competitionsid}`);

      // Fetch all sections data
      fetchOverviewData();
      fetchSyllabusData();
      fetchPatternData();
      fetchEligibilityData();
      fetchRegistrationData();
      fetchAwardsData();
    } else {
      console.error("❌ No competition ID provided");
    }
  }, [competitionsid]);

  // Loading component for individual sections
  const SectionLoader = ({ section }) => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
      fontSize: '16px',
      color: '#666'
    }}>
      Loading {section} data...
    </div>
  );

  // Error component for individual sections
  const SectionError = ({ section, error, onRetry }) => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
      fontSize: '16px',
      color: 'red',
      textAlign: 'center'
    }}>
      <p>Error loading {section}: {error}</p>
      <button
        onClick={onRetry}
        style={{
          marginTop: '10px',
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Retry
      </button>
    </div>
  );

  // Helper functions to safely access data
  const getOverviewData = () => sectionData.overview || {};
  const getSyllabusData = () => sectionData.syllabus || {};
  const getPatternData = () => sectionData.pattern || {};
  const getEligibilityData = () => sectionData.eligibility || [];
  const getRegistrationData = () => sectionData.registration || {};
  const getAwardsData = () => sectionData.awards || [];

  // Get student information from eligibility data or separate call
  const getStudentInformation = () => studentInformation;

  return (
    <>
      <Studentheaderhome />
      <div className="Competitionsdetail">
        <div className="exam-header">
          <div className="exam-title">
            <h1>
              {sectionLoading.overview ? (
                "Loading..."
              ) : sectionErrors.overview ? (
                "Error Loading Competition"
              ) : (
                getOverviewData().name || "Competition Name"
              )}
            </h1>
            <p>Verified by Prodigi</p>
          </div>
          <div className="action-button">
            <button className="btn-primary">
              <NavLink to={`/compitions-plans/${competitionsid}`} style={{ textDecoration: "none", color: "white" }}>
                Register
              </NavLink>
            </button>
          </div>
        </div>

        <div className="tabs-container">
          <div className="tabs">
            {[
              { key: "overview", label: "Overview" },
              { key: "exam-pattern", label: "Exam Pattern" },
              { key: "syllabus", label: "Syllabus" },
              { key: "eligibility", label: "Eligibility" },
              { key: "registration", label: "Registration" },
              { key: "awards", label: "Awards" }
            ].map((tab) => (
              <button
                key={tab.key}
                className={`tab-btn ${activeTab === tab.key ? "active" : ""}`}
                onClick={() => openTab(tab.key)}
              >
                {tab.label}
                {/* Show loading indicator in tab */}
                {sectionLoading[tab.key === 'exam-pattern' ? 'pattern' : tab.key] && (
                  <span style={{ marginLeft: '5px', fontSize: '12px' }}>⏳</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="tab-content">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div id="overview" className="tab-pane active">

              <h2 style={{ fontWeight: '900', fontFamily: ' Albert Sans' }}>Overview</h2>
              {sectionLoading.overview ? (
                <SectionLoader section="overview" />
              ) : sectionErrors.overview ? (
                <SectionError
                  section="overview"
                  error={sectionErrors.overview}
                  onRetry={fetchOverviewData}
                />
              ) : (
                <>
                  <div style={{ marginBottom: "20px" }}>
                    {getOverviewData().image && (
                      <img
                        src={getOverviewData().image.startsWith('http')
                          ? getOverviewData().image
                          : `http://localhost:3001${getOverviewData().image}`
                        }
                        alt="Competition"
                        style={{ maxWidth: "300px", height: "auto", marginBottom: "15px" }}
                      />
                    )}
                  </div>
                  <p className="overview-text">
                    {getOverviewData().description || "No description available"}
                  </p>
                  <div className="info-grid">
                    <div className="info-item">
                      <h4>
                        Total stages: {getOverviewData().stages?.length || 0}
                      </h4>
                      {getOverviewData().stages?.map((stage, index) => (
                        <p key={index}>
                          Stage {index + 1}: {stage.name} ({stage.date})
                        </p>
                      ))}
                    </div>
                    <div className="info-item">
                      <h4>Scale: National</h4>
                    </div>
                    <div className="info-item">
                      <h4>
                        Date of 1st level: {getOverviewData().stages?.[0]?.date || "N/A"}
                      </h4>
                    </div>
                    <div className="info-item">
                      <h4>Mode: {getOverviewData().stages?.[0]?.mode || "N/A"}</h4>
                    </div>
                    <div className="info-item">
                      <h4>Participation: {getOverviewData().stages?.[0]?.participation || "N/A"}</h4>
                    </div>
                    <div className="info-item">
                      <h4>Duration: {getOverviewData().stages?.[0]?.duration || "N/A"}</h4>
                    </div>
                    {/* Awards Preview in Overview */}
                    {!sectionLoading.awards && getAwardsData().length > 0 && (
                      <div className="info-item">
                        <h4>Awards</h4>
                        {getAwardsData().map((award, index) => (
                          <ul key={index}>
                            <li> <GoDotFill style={{ fontSize: "14px", paddingRight: "1px" }} />
                              {award.Award_Type}: {award.Quantity} (Given to: {award.Given_To})</li>
                          </ul>
                        ))}
                      </div>
                    )}

                  </div>

                  <div className="why-choose">
                    <h3>Why Should you Apply?</h3>
                    <div className="benefits-grid">
                      <div className=" SUPERFICIAL benefit-col">
                        <ul className="benefit-list">
                          <li>
                            <span className="icon ">✔</span>Total enrollments: 1L+
                          </li>
                          <li>
                            <span className="icon">✔</span>Total schools Competing: 5K+
                          </li>
                          <li>
                            <span className="icon">✔</span>Total prizes worth: INR 1L+
                          </li>
                          <li>
                            <span className="icon">✔</span>Upto 1K+ prize winners

                          </li>
                        </ul>
                      </div>
                      <div className="benefit-col right-line">
                        <ul className="benefit-list">
                          <li style={{ fontSize: 'larger' }}>
                            <span style={{ color: 'red' }}>×</span>2 rounds of competition
                          </li>
                          <li style={{ fontSize: 'larger' }}>
                            <span style={{ color: 'red' }}>×</span>No certificate of participation
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Replicated Sections */}
                  <div className="section-summaries" style={{ marginTop: '40px' }}>


                    {/* Syllabus Section */}
                    <div className="summary-section" style={{ marginTop: '40px' }}>
                      <h2 style={{ fontWeight: '900', fontFamily: ' Albert Sans' }}>Syllabus</h2>
                      {sectionLoading.syllabus ? (
                        <SectionLoader section="syllabus" />
                      ) : sectionErrors.syllabus ? (
                        <SectionError
                          section="syllabus"
                          error={sectionErrors.syllabus}
                          onRetry={fetchSyllabusData}
                        />
                      ) : (
                        <>
                          {getSyllabusData().topics?.length > 0 ? (
                            <div className="syllabus-flex-container">
                              {getSyllabusData().topics.map((topic, index) => (
                                <div className="syllabus-flex-item" key={index}>
                                  <div className="topic-title">

                                    {typeof topic === 'string' ? topic : topic.name}
                                  </div>

                                  {typeof topic === 'object' && (
                                    <>
                                      {topic.subtopics?.length > 0 && (
                                        <ul className="subtopics-list">
                                          {topic.subtopics.map((sub, i) => (
                                            <li key={i}><GoDotFill style={{ fontSize: "14px", paddingRight: "1px" }} />                 {sub}</li>
                                          ))}
                                        </ul>
                                      )}
                                      {topic.weight && (
                                        <p><strong>Weight:</strong> {topic.weight}%</p>
                                      )}
                                      {topic.stage && (
                                        <p><strong>Stage:</strong> {topic.stage}</p>
                                      )}
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div>No syllabus data available</div>
                          )}
                        </>
                      )}
                    </div>


                    {/* Exam Pattern Section */}
                    <div className="summary-section">
                      <h2 style={{ fontWeight: '900', fontFamily: ' Albert Sans' }}>Exam Pattern</h2>
                      {sectionLoading.pattern ? (
                        <SectionLoader section="pattern" />
                      ) : sectionErrors.pattern ? (
                        <SectionError
                          section="pattern"
                          error={sectionErrors.pattern}
                          onRetry={fetchPatternData}
                        />
                      ) : (
                        <div className="table-container">
                          <table className="exam-table">
                            <thead className="thhead">
                              <tr>
                                <th>Section</th>
                                <th>Pattern</th>
                                <th>No. of Questions</th>
                                <th>Marks per Question</th>
                              </tr>
                            </thead>
                            <tbody className="table-boby">
                              {getPatternData().sections?.length > 0 ? (
                                getPatternData().sections.map((section, index) => (
                                  <tr key={index}>
                                    <td>{section.name || section.sectionName || "N/A"}</td>
                                    <td>{section.type || section.format || "MCQ"}</td>
                                    <td>{section.questions || section.numberOfQuestions || "N/A"}</td>
                                    <td>{section.marks || section.marksPerQuestion || "N/A"}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="4">No exam pattern data available</td>
                                </tr>
                              )}
                              {getPatternData().sections?.length > 0 && (
                                <tr>
                                  <td>
                                    <strong>Grand Total</strong>
                                  </td>
                                  <td></td>
                                  <td>
                                    <strong>
                                      {getPatternData().sections.reduce(
                                        (total, section) => total + (parseInt(section.questions) || parseInt(section.numberOfQuestions) || 0),
                                        0
                                      )}
                                    </strong>
                                  </td>
                                  <td></td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>


                    {/* Eligibility Section */}
                    <div className="summary-section" style={{ marginTop: '40px' }}>
                      <h2 style={{ fontWeight: '900', fontFamily: ' Albert Sans' }}>Eligibility</h2>
                      {sectionLoading.eligibility ? (
                        <SectionLoader section="eligibility" />
                      ) : sectionErrors.eligibility ? (
                        <SectionError
                          section="eligibility"
                          error={sectionErrors.eligibility}
                          onRetry={fetchEligibilityData}
                        />
                      ) : (
                        <>
                          {/* Eligibility Criteria */}
                          {getEligibilityData().length > 0 && (
                            <div>
                              <p>Eligibility Criteria</p>
                              <ul>
                                {getEligibilityData().map((criteria, index) => (
                                  <li key={`criteria-${index}`}>
                                    <span className="icon ">✔</span>
                                    <strong>{criteria.title}:</strong>  <span className="icon ">✔</span>{criteria.requirement}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <h6>Student Details Required</h6>
                          <ul>
                            {getStudentInformation().StudentDetails?.length > 0 ? (
                              getStudentInformation().StudentDetails.map((item, index) => (
                                <li key={`student-${index}`}>
                                  <span className="icon">✔</span>
                                  {item}
                                </li>
                              ))
                            ) : (
                              <li>No student details specified</li>
                            )}
                          </ul>

                          <h6>School Details Required</h6>
                          <ul>
                            {getStudentInformation().SchoolDetails?.length > 0 ? (
                              getStudentInformation().SchoolDetails.map((item, index) => (
                                <li key={`school-${index}`}>
                                  <span className="icon">✔</span>
                                  {item}
                                </li>
                              ))
                            ) : (
                              <li>No school details specified</li>
                            )}
                          </ul>
                        </>
                      )}
                    </div>


                    {/* Registration Section */}
                    <div className="summary-section" style={{ marginTop: '40px' }}>
                      <h2 style={{ fontWeight: '900', fontFamily: ' Albert Sans' }}>Registration</h2>
                      {sectionLoading.registration ? (
                        <SectionLoader section="registration" />
                      ) : sectionErrors.registration ? (
                        <SectionError
                          section="registration"
                          error={sectionErrors.registration}
                          onRetry={fetchRegistrationData}
                        />
                      ) : (
                        <>



                          <div className="registration-info mt-4">
                            <p>
                              <strong>
                                Registration for this competitive exam is now open from{" "}
                                {getRegistrationData().registration_type?.registration_start_date || "N/A"}{" "}
                                to{" "} <br />
                                {getRegistrationData().registration_type?.registration_end_date || "N/A"}
                                . Total registration fee: ₹{getRegistrationData().registration_type?.total_registration_fee || "N/A"}
                                . Click the button below to register.
                              </strong>
                            </p>
                            <div className="action-button">
                              <button className="btn-primary">
                                <NavLink to={`/compitions-plans/${competitionsid}`} style={{ textDecoration: "none", color: "white" }}>
                                  Register
                                </NavLink>
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Exam Pattern Tab */}
          {activeTab === "exam-pattern" && (
            <div id="exam-pattern" className="tab-pane active">
              <h2>Exam Pattern</h2>
              {sectionLoading.pattern ? (
                <SectionLoader section="pattern" />
              ) : sectionErrors.pattern ? (
                <SectionError
                  section="pattern"
                  error={sectionErrors.pattern}
                  onRetry={fetchPatternData}
                />
              ) : (
                <div className="table-container">
                  <table className="exam-table">
                    <thead className="thhead">
                      <tr>
                        <th>Section</th>
                        <th>Pattern</th>
                        <th>No. of Questions</th>
                        <th>Marks per Question</th>
                      </tr>
                    </thead>
                    <tbody className="table-boby">
                      {getPatternData().sections?.length > 0 ? (
                        getPatternData().sections.map((section, index) => (
                          <tr key={index}>
                            <td>{section.name || section.sectionName || "N/A"}</td>
                            <td>{section.type || section.format || "MCQ"}</td>
                            <td>{section.questions || section.numberOfQuestions || "N/A"}</td>
                            <td>{section.marks || section.marksPerQuestion || "N/A"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4">No exam pattern data available</td>
                        </tr>
                      )}
                      {getPatternData().sections?.length > 0 && (
                        <tr>
                          <td>
                            <strong>Grand Total</strong>
                          </td>
                          <td></td>
                          <td>
                            <strong>
                              {getPatternData().sections.reduce(
                                (total, section) => total + (parseInt(section.questions) || parseInt(section.numberOfQuestions) || 0),
                                0
                              )}
                            </strong>
                          </td>
                          <td></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Syllabus Tab */}
          {activeTab === "syllabus" && (
             <div className="summary-section" style={{ marginTop: '40px' }}>
             <h2 style={{ fontWeight: '900', fontFamily: ' Albert Sans' }}>Syllabus</h2>
             {sectionLoading.syllabus ? (
               <SectionLoader section="syllabus" />
             ) : sectionErrors.syllabus ? (
               <SectionError
                 section="syllabus"
                 error={sectionErrors.syllabus}
                 onRetry={fetchSyllabusData}
               />
             ) : (
               <>
                 {getSyllabusData().topics?.length > 0 ? (
                   <div className="syllabus-flex-container">
                     {getSyllabusData().topics.map((topic, index) => (
                       <div className="syllabus-flex-item" key={index}>
                         <div className="topic-title">

                           {typeof topic === 'string' ? topic : topic.name}
                         </div>

                         {typeof topic === 'object' && (
                           <>
                             {topic.subtopics?.length > 0 && (
                               <ul className="subtopics-list">
                                 {topic.subtopics.map((sub, i) => (
                                   <li key={i}><GoDotFill style={{ fontSize: "14px", paddingRight: "1px" }} />                 {sub}</li>
                                 ))}
                               </ul>
                             )}
                             {topic.weight && (
                               <p><strong>Weight:</strong> {topic.weight}%</p>
                             )}
                             {topic.stage && (
                               <p><strong>Stage:</strong> {topic.stage}</p>
                             )}
                           </>
                         )}
                       </div>
                     ))}
                   </div>
                 ) : (
                   <div>No syllabus data available</div>
                 )}
               </>
             )}
           </div>
          )}

          {/* Eligibility Tab */}
          {activeTab === "eligibility" && (
            <div id="eligibility" className="tab-pane active">
              <h2>Eligibility</h2>
              {sectionLoading.eligibility ? (
                <SectionLoader section="eligibility" />
              ) : sectionErrors.eligibility ? (
                <SectionError
                  section="eligibility"
                  error={sectionErrors.eligibility}
                  onRetry={fetchEligibilityData}
                />
              ) : (
                <>
                  {/* Eligibility Criteria */}
                  {getEligibilityData().length > 0 && (
                    <div>
                      <h3>Eligibility Criteria</h3>
                      <ul>
                        {getEligibilityData().map((criteria, index) => (
                          <li key={`criteria-${index}`}>
                            <span className="icon">✔</span>
                            <strong>{criteria.title}:</strong> {criteria.requirement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <h3>Student Details Required</h3>
                  <ul>
                    {getStudentInformation().StudentDetails?.length > 0 ? (
                      getStudentInformation().StudentDetails.map((item, index) => (
                        <li key={`student-${index}`}>
                          <span className="icon">✔</span>
                          {item}
                        </li>
                      ))
                    ) : (
                      <li>No student details specified</li>
                    )}
                  </ul>

                  <h3>School Details Required</h3>
                  <ul>
                    {getStudentInformation().SchoolDetails?.length > 0 ? (
                      getStudentInformation().SchoolDetails.map((item, index) => (
                        <li key={`school-${index}`}>
                          <span className="icon">✔</span>
                          {item}
                        </li>
                      ))
                    ) : (
                      <li>No school details specified</li>
                    )}
                  </ul>
                </>
              )}
            </div>
          )}

          {/* Registration Tab */}
          {activeTab === "registration" && (
            <div id="registration" className="tab-pane active">
              <h2>Registration</h2>
              {sectionLoading.registration ? (
                <SectionLoader section="registration" />
              ) : sectionErrors.registration ? (
                <SectionError
                  section="registration"
                  error={sectionErrors.registration}
                  onRetry={fetchRegistrationData}
                />
              ) : (
                <>
                  <div className="registration-info">
                    <p>
                      <strong>
                        Registration for this competitive exam is now open from{" "}
                        {getRegistrationData().registration_type?.registration_start_date || "N/A"}{" "}
                        to{" "}
                        {getRegistrationData().registration_type?.registration_end_date || "N/A"}
                        . Total registration fee: ₹{getRegistrationData().registration_type?.total_registration_fee || "N/A"}
                        . Click the button below to register.
                      </strong>
                    </p>
                    <button className="btn-primary">  <NavLink to={`/compitions-plans/${competitionsid}`} style={{ textDecoration: "none", color: "white" }}>
                      Register
                    </NavLink></button>
                  </div>

                  {getRegistrationData().plans?.length > 0 && (
                    <div>
                      <h3>Available Plans</h3>
                      <div style={{ display: 'grid', gap: '20px' }}>
                        {getRegistrationData().plans.map((plan, index) => (
                          <div key={index} style={{
                            border: '1px solid #ddd',
                            padding: '20px',
                            borderRadius: '8px',
                            backgroundColor: '#f9f9f9'
                          }}>
                            <h4>{plan.name || "Plan " + (index + 1)}</h4>
                            <p><strong>Fee:</strong> ₹{plan.plan_fee || "N/A"}</p>
                            {plan.student_limit && (
                              <p><strong>Student Limit:</strong> {plan.student_limit}</p>
                            )}
                            {plan.description && (
                              <p><strong>Description:</strong> {plan.description}</p>
                            )}
                            {plan.included && (
                              <div>
                                <p><strong>What's Included:</strong></p>
                                <p>{plan.included}</p>
                              </div>
                            )}
                            {plan.not_included && (
                              <div>
                                <p><strong>What's Not Included:</strong></p>
                                <p>{plan.not_included}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Awards Tab */}
          {activeTab === "awards" && (
            <div id="awards" className="tab-pane active">
              <h2>Awards</h2>
              {sectionLoading.awards ? (
                <SectionLoader section="awards" />
              ) : sectionErrors.awards ? (
                <SectionError
                  section="awards"
                  error={sectionErrors.awards}
                  onRetry={fetchAwardsData}
                />
              ) : getAwardsData().length > 0 ? (
                <div>
                  <h3>Competition Awards</h3>
                  <div style={{ display: 'grid', gap: '15px' }}>
                    {getAwardsData().map((award, index) => (
                      <div key={index} style={{
                        border: '1px solid #ddd',
                        padding: '20px',
                        borderRadius: '8px',
                        backgroundColor: '#f8f9fa',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}>
                        <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>
                          {award.Award_Type}
                        </h4>
                        <p><strong>Quantity:</strong> {award.Quantity}</p>
                        <p><strong>Given To:</strong> {award.Given_To}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: '#666'
                }}>
                  No awards information available
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <FooterUsers />
    </>
  );
}

export default Ocompetitionsdetail;