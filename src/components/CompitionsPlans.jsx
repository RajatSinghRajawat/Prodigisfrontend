import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import "./Compitionspayment.css";
import "./Compition-Plans-Student.css";
import { FaCheck, FaTimes } from "react-icons/fa";

import Studentheaderhome from "./Studentheaderhome";
import StudentFooter from "./StudentFooter";

const fallbackPlans = [
  
  {
    price: 150,
    title: "Only Registration",
    subtitle: "Registration",
    features: [
      { text: "Simple and easy registration", included: true },
      { text: "Preparation material", included: false },
      { text: "Tips and tricks", included: false },
      { text: "Past year question papers", included: false },
    ],
  },
  {
    price: 800,
    title: "Complete prep",
    subtitle: "Registration + Prep + Practice papers",
    features: [
      { text: "Simple and easy registration", included: true },
      { text: "Preparation material", included: true },
      { text: "Tips and tricks", included: true },
      { text: "Practice papers", included: true },
    ],
  },
  {
    price: 1200,
    title: "Advanced prep",
    subtitle: "Registration + Prep + Past year question papers",
    recommended: true,
    features: [
      { text: "Simple and easy registration", included: true },
      { text: "Preparation material", included: true },
      { text: "Tips and tricks", included: true },
      { text: "Past 4 year question papers", included: true },
    ],
  },
];

const PlanCard = ({ plan, onChoose, recommended }) => (
  <div className={`plan-card${recommended ? " recommended" : ""}`}>
    <div className="plan-header">
      <h3 style={recommended ? { color: "#fff" } : {}}>INR {plan.price}</h3>
      <p style={recommended ? { color: "#fff", fontWeight: 600 } : {}}>
        {plan.title}
      </p>
      {recommended && <span className="recommended-badge">Recommended</span>}
    </div>
    <div className="plan-subtitle">{plan.subtitle}</div>
    <ul className="plan-features">
      {plan.features.map((f, i) => (
        <li
          key={i}
          className={f.included ? "included" : "excluded"}
          style={recommended ? { color: "#fff" } : {}}
        >
          {f.included ? (
            <FaCheck style={{ marginRight: 6 }} />
          ) : (
            <FaTimes style={{ marginRight: 6 }} />
          )}
          {f.text}
        </li>
      ))}
    </ul>
    <button
      onClick={() => onChoose(plan)}
      className="choose-plan-btn"
      style={
        recommended
          ? { background: "#103E13", color: "#17481f", fontWeight: 700 }
          : {}
      }
    >
      Choose Plan
    </button>
  </div>
);

PlanCard.propTypes = {
  plan: PropTypes.shape({
    price: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    features: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        included: PropTypes.bool.isRequired,
      })
    ).isRequired,
    recommended: PropTypes.bool,
  }).isRequired,
  onChoose: PropTypes.func.isRequired,
  recommended: PropTypes.bool,
};

PlanCard.defaultProps = {
  recommended: false,
};

const CompitionsPlans = () => {
  const navigate = useNavigate();
  const { competitionsid } = useParams();

  const [plans, setPlans] = useState(fallbackPlans);
  const [competitionData, setCompetitionData] = useState({
    name: "Competition Name",
    instituteName: "Institute Name",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRegistrationData = async () => {
    if (!competitionsid) {
      console.log("No competition ID provided, using fallback data");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // Fetch registration data
      const registrationResponse = await fetch(
        `http://localhost:3001/api/competitions/registration/${competitionsid}`,
        {
          method: "GET",
          redirect: "follow",
        }
      );

      if (!registrationResponse.ok) {
        throw new Error(`HTTP error! status: ${registrationResponse.status}`);
      }

      const registrationResult = await registrationResponse.json();
      console.log(`✅ Registration API Response:`, registrationResult);

      // Fetch overview data for competition name
      const overviewResponse = await fetch(
        `http://localhost:3001/api/competitions/getoverview/${competitionsid}`,
        {
          method: "GET",
          redirect: "follow",
        }
      );

      let competitionName = "Competition Name";
      let instituteName = "Institute Name";

      if (overviewResponse.ok) {
        const overviewResult = await overviewResponse.json();
        if (overviewResult.success && overviewResult.data) {
          competitionName = overviewResult.data.name || "Competition Name";
          instituteName =
            overviewResult.data.instituteName ||
            overviewResult.data.organizerName ||
            "Institute Name";
        }
      }

      setCompetitionData({
        name: competitionName,
        instituteName: instituteName,
      });

      // Process plans data
      if (
        registrationResult.success &&
        registrationResult.data &&
        registrationResult.data.plans
      ) {
        const apiPlans = registrationResult.data.plans.map((plan, index) => ({
          price: plan.plan_fee || 0,
          title: plan.name || `Plan ${index + 1}`,
          subtitle: plan.description || plan.name || `Plan ${index + 1}`,
          recommended:
            index === Math.floor(registrationResult.data.plans.length / 2), // Middle plan as recommended
          features: [
            { text: "Registration included", included: true },
            {
              text: plan.included || "Additional benefits",
              included: !!plan.included,
            },
            {
              text: plan.not_included
                ? `${plan.not_included} (not included)`
                : "Extra features",
              included: !plan.not_included,
            },
            {
              text: plan.student_limit
                ? `Up to ${plan.student_limit} students`
                : "Student participation",
              included: true,
            },
          ],
          originalPlan: plan, // Store original plan data for payment
        }));

        console.log("✅ Processed plans:", apiPlans);
        setPlans(apiPlans);
      } else {
        console.log("⚠️ No plans found in API response, using fallback plans");
        // Keep fallback plans
      }
    } catch (error) {
      console.error(`❌ Error fetching registration data:`, error);
      setError(error.message);
      // Keep fallback plans on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrationData();
  }, [competitionsid]);

  const handleChoosePlan = (plan) => {
    // Pass both processed plan and original plan data to payment page
    const planData = {
      ...plan,
      competitionId: competitionsid,
      competitionName: competitionData.name,
      instituteName: competitionData.instituteName,
    };
    navigate(`/compitions-payment/${competitionsid}`, { state: { plan: planData } });
  };

  if (loading) {
    return (
      <>
        <Studentheaderhome />
        <div
          className="plans-container"
          style={{ textAlign: "center", padding: "50px" }}
        >
          <h2>Loading Competition Plans...</h2>
        </div>
        <StudentFooter />
      </>
    );
  }

  return (
    <>
      <Studentheaderhome />
      <div className="plans-container">
        <h2>{competitionData.name}</h2>
        <p>{competitionData.instituteName}</p>

        {error && (
          <div
            style={{
              backgroundColor: "#fff3cd",
              border: "1px solid #ffeaa7",
              color: "#856404",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "20px",
            }}
          >
            <strong>Notice:</strong> Could not load competition plans ({error}).
            Showing default plans.
          </div>
        )}

        <div className="plans-list">
          {plans.map((plan, idx) => (
            <PlanCard
              key={idx}
              plan={plan}
              recommended={plan.recommended}
              onChoose={handleChoosePlan}
            />
          ))}
        </div>
      </div>

      <StudentFooter />
    </>
  );
};

export default CompitionsPlans;
