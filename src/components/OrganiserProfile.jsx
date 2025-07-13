import React, { useEffect, useState } from "react";
import "./OrganiserProfileEdit.css";
import { FaUpload, FaUser } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "./Compition.css";
import {
  socialIcon1,
  socialIcon2,
  socialIcon,
  socialIcon11,
  sendIcon,
} from "../assets/images";
import Organisersheader from "./Organisersheader";
import { useNavigate } from "react-router-dom";

const OrganiserProfile = () => {
  const [cards, setcards] = useState([]);
  const [profile, setProfile] = useState({});
  const [contactText, setContactText] = useState("");

  const userData = JSON.parse(localStorage.getItem("user_Data"));
  const organizerId = userData?._id;
  const navigate = useNavigate();

  // Fetch all competitions
  const getAllComplete = () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      fetch(
        `http://localhost:3001/api/competitions/getCompetitionsByOrganizerComplete?organizerId=${organizerId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          console.log(result, "dsfgf");
          setcards(result);
        })
        .catch((error) => console.error(error));
    } catch (error) {
      console.log(error);
    }
  };

  const getprofileOrganizer = () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        mobileNumber: "9876543210",
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(
        `http://localhost:3001/api/organisations/profile/${organizerId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setProfile(result.data);
        })
        .catch((error) => console.error(error));
    } catch (error) {
      console.log(error);
    }
  };

  // On page load
  useEffect(() => {
    getAllComplete();
    getprofileOrganizer();
  }, []);

  // Scroll functionality
  const scrollCards = (direction) => {
    const container = document.getElementById("organiseCardWrapper");
    const scrollAmount = 300;

    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Function to render profile image or avatar
  const renderProfileImage = () => {
    if (profile?.image) {
      return (
        <img
          src={`http://localhost:3001${profile.image}`}
          alt="Organisation"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      );
    }
    return null;
  };

  // Function to render avatar fallback
  const renderAvatar = () => {
    return (
      <div
        style={{
          display: profile?.image ? 'none' : 'flex',
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#e0e0e0",
          color: "#666",
          fontSize: "20px",
        }}
      >
        <FaUser size={24} />
      </div>
    );
  };

  return (
    <div>
      <div className="organiser-edit-container">
        <Organisersheader />
        <main className="organiser-main">
          <div className="organiser-info justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <div
                className="organiser-image-box edit-mode"
                style={{
                  width: "50px",
                  height: "50px",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  overflow: "hidden",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#f9f9f9",
                  margin: "auto",
                }}
              >
                {renderProfileImage()}
                {renderAvatar()}
              </div>

              <h2 className="organiser-name">
                {profile.name || "Organiser Name"}
              </h2>
            </div>
            <div>
              <button
                onClick={() => {
                  navigate("/OraganiserProfileUpdate");
                }}
                className="organiser-save-button"
              >
                Edit Profile
              </button>
            </div>
          </div>

          <section className="organiser-about">
            <h3>About Us</h3>
            <div className="organiser-editor">
              <p style={{ 
                lineHeight: "1.6", 
                color: "#333", 
                margin: "0",
                textAlign: "justify"
              }}>
                {profile.about || 
                  "We are a dedicated organization committed to fostering talent and creativity through various competitions and events. Our mission is to provide platforms where individuals can showcase their skills, learn from peers, and grow professionally. With years of experience in organizing successful events, we ensure quality, fairness, and excellence in everything we do. Join us in this journey of discovery and achievement."}
              </p>
            </div>
          </section>

          <div className="organise-slider-container">
            <button
              className="organise-slider-btn left"
              style={{ top: '50%', transform: 'translateY(-50%)' , left:"-20px" }}
              onClick={() => scrollCards("left")}
            >
              <FiChevronLeft size={32} />
            </button>
            <div className="organise-card-wrapper" id="organiseCardWrapper">
              {cards?.map((card, index) => (
                <div key={card._id || index} className="organise-user-card">
                  <div className="organise-user-card-image-container">
                    <img
                      src={card.overview?.image ? `http://localhost:3001${card.overview?.image}` : "https://via.placeholder.com/300x200"}
                      alt={card.overview?.name || "Competition"}
                      className="organise-user-card-image"
                      style={{ objectFit: 'contain', width: '100%', height: '180px', borderRadius: '10px 10px 0 0' }}
                      onError={e => { e.target.src = "https://via.placeholder.com/300x200"; }}
                    />
                    <div className="organise-bookmark-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="24"
                        viewBox="0 0 18 24"
                        fill="none"
                      >
                        <path
                          d="M0 24V2.66667C0 1.93333 0.251786 1.30556 0.755357 0.783333C1.25893 0.261111 1.86429 0 2.57143 0H15.4286C16.1357 0 16.7411 0.261111 17.2446 0.783333C17.7482 1.30556 18 1.93333 18 2.66667V24L9 20L0 24Z"
                          fill="#103E13"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="organise-user-card-content">
                    <h2 className="organise-user-card-name">
                      {card.overview?.name || "Unnamed Competition"}
                    </h2>
                    <div className="organise-user-card-details">
                      <div className="d-flex gap-2">
                        <p className="organise-user-card-label">Date:</p>
                        <p className="organise-user-card-value">
                          {card.overview?.stages?.[0]?.date || "TBD"}
                        </p>
                      </div>
                      <div className="d-flex gap-2">
                        <p className="organise-user-card-label">
                          Variance Score:
                        </p>
                        <p className="organise-user-card-badge">97%</p>
                      </div>
                      <div className="d-flex gap-2">
                        <p className="organise-user-card-label">Enrollments:</p>
                        <p className="organise-user-card-value">1M+</p>
                      </div>
                      <div className="d-flex gap-2">
                        <p className="organise-user-card-label">
                          Registration Fee:
                        </p>
                        <p className="organise-user-card-value">
                          ₹
                          {card.registration?.registration_type
                            ?.total_registration_fee || "0"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="organise-slider-btn right"
              style={{ top: '50%', transform: 'translateY(-50%)' }}
              onClick={() => scrollCards("right")}
            >
              <FiChevronRight size={32} />
            </button>
          </div>

          <section className="organiser-contact">
            <h3>Contact Us</h3>
            <div className="organiser-editor">
              <div className="contact-item">
                <strong>Mobile No 1:</strong> {profile.mobileNumber || "Not provided"}
              </div>
              <div className="contact-item">
                <strong>Mobile No 2:</strong> {profile.organiserMobileNumber || "Not provided"}
              </div>
              <div className="contact-item">
                <strong>Director Mobile No:</strong>{" "}
                {profile.directorMobileNumber || "Not provided"}
              </div>
              <div className="contact-item">
                <strong>Email:</strong> {profile.organiserEmail || "Not provided"}
              </div>
            </div>
          </section>
        </main>
      </div>
      <footer>
        <div class="footer-content">
          <div class="footer-logo">
            <p class="logo-text">Prodigi</p>
            <p>
              Thakur Village, Kandivali (East),
              <br />
              Mumbai - 400101
            </p>
            <div class="social-links">
              <a href="#">
                <img src={socialIcon1} alt="Instagram" />
              </a>
              <a href="#">
                <img src={socialIcon2} alt="Facebook" />
              </a>
              <a href="#">
                <img src={socialIcon} alt="Twitter" />
              </a>
              <a href="#">
                <img src={socialIcon11} alt="YouTube" />
              </a>
            </div>
          </div>
          <div class="footer-links">
            <div class="link-column">
              <h4>Company</h4>
              <a href="#">About us</a>
              <a href="#">Contact us</a>
              <a href="#">Testimonials</a>
            </div>
            <div class="link-column">
              <h4>Support</h4>
              <a href="#">Help center</a>
              <a href="#">Terms of service</a>
              <a href="#">Privacy policy</a>
              <a href="#">Status</a>
            </div>
            <div class="newsletter">
              <h4>Stay up to date</h4>
              <div class="subscribe">
                <input type="email" placeholder="Your email address" />
                <button type="submit">
                  <img src={sendIcon} alt="Send" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OrganiserProfile;
