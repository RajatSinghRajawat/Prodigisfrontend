import { useEffect, useState } from "react"
import { ChevronDown, Home, Upload, User, X } from "lucide-react"

import "./OverviewZero.css"

const Oleftsidbar = ({ fun,page,ID }) => {

  const [sidbar, setsidbar] = useState(0)

  useEffect(() => {
    setsidbar(page)
  }, [page])

  return (

    <div className="sidebar">
      <div className="sidebar-title">Competition Name</div>
      <div className="stepper">
        {["Overview", "Syllabus", "Pattern", "Eligibility", "Registration", "Awards"].map((step, index) => (
          <div key={step} onClick={() => {
            fun(index,ID);
            setsidbar(index);
          }} className="step">
            <div className="step-content">
              <div className={`step-indicator ${index === sidbar ? "active" : ""}`}>
                {index === sidbar && <div className="step-dot"></div>}
              </div>
              <div className={`step-label ${index === sidbar ? "active" : ""}`}>{step}</div>
            </div>
            {index < 5 && <div className="step-line"></div>}
          </div>
        ))}
      </div>

      <button className="upload-button">
        <Upload size={16} />
        <span>Upload Competition Details</span>
      </button>
    </div>)
}

export default Oleftsidbar;