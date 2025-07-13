import React, { useEffect, useRef, useState } from "react";
import { FaUpload } from "react-icons/fa";
import "./OrganiserProfileEdit.css";
import "./Compition.css";
import JoditEditor from "jodit-react";
import Organisersheader from "./Organisersheader";
import { toast } from "react-toastify";
// import Swal from "sweetalert2"; // Remove SweetAlert2

const API_BASE_URL = "http://localhost:3001";

const DUMMY_AVATAR = "https://ui-avatars.com/api/?name=Organiser&background=cccccc&color=555555&size=128";

const OrganiserProfileUpdate = () => {
  const [cards, setCards] = useState([]);
  const [profile, setProfile] = useState({
    name: "",
    mobileNumber: "",
    organiserMobileNumber: "",
    directorMobileNumber: "",
    organiserEmail: "",
    aims: "",
    image: null,
    imagePreview: null,
  });
  const [contactContent, setContactContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // For custom modal
  const fileInputRef = useRef(null);
  const editor = useRef(null);

  const userData = JSON.parse(localStorage.getItem("user_Data"));
  const organizerId = userData?._id;

  // Helper function to strip HTML and get plain text
  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  // Handle back navigation
  const handleBackClick = () => {
    window.history.back();
  };

  // Fetch all competitions
  const getAllComplete = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/competitions/getCompetitionsByOrganizerComplete?organizerId=${organizerId}`
      );
      const result = await response.json();
      setCards(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch organizer profile
  const getprofileOrganizer = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/organisations/profile/${organizerId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobileNumber: "9876543210" }),
        }
      );
      const result = await response.json();
      if (response.ok && result.data) {
        setProfile({
          ...result.data,
          aims: result.data.aims || result.data.about || "",
          imagePreview: result.data.image ? `${API_BASE_URL}${result.data.image}` : null,
        });
        setContactContent(`
          <div>
            <p><strong>Mobile No 1:</strong> ${result.data.mobileNumber || ""}</p>
            <p><strong>Mobile No 2:</strong> ${result.data.organiserMobileNumber || ""}</p>
            <p><strong>Director Mobile No:</strong> ${result.data.directorMobileNumber || ""}</p>
            <p><strong>Email:</strong> ${result.data.organiserEmail || ""}</p>
          </div>
        `);
      } else {
        throw new Error(result.message || "Failed to fetch profile");
      }
    } catch (error) {
      setError(error.message);
      toast.error(`Error fetching profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Update profile (triggered after modal confirmation)
  const updateProfile = async () => {
    try {
      setLoading(true);
      const formdata = new FormData();
      formdata.append("mobileNumber", profile.mobileNumber);
      formdata.append("email", profile.organiserEmail);
      formdata.append("name", profile.name);
      formdata.append("organiserMobileNumber", profile.organiserMobileNumber);
      formdata.append("directorMobileNumber", profile.directorMobileNumber);
      formdata.append("about", stripHtml(profile.aims)); // Save as plain text
      if (profile.image) {
        formdata.append("image", profile.image);
      }

      const response = await fetch(
        `${API_BASE_URL}/api/organisations/Updateprofile/${organizerId}`,
        {
          method: "PUT",
          body: formdata,
        }
      );
      const result = await response.json();
      if (response.ok) {
        setProfile({ ...profile, ...result.data });
        toast.success("Profile updated successfully");
      } else {
        throw new Error(result.message || "Failed to update profile");
      }
    } catch (error) {
      setError(error.message);
      toast.error(`Error updating profile: ${error.message}`);
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  // Trigger file input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Parse contact content from editor
  const handleContactContentChange = (newContent) => {
    setContactContent(newContent);
    const parser = new DOMParser();
    const doc = parser.parseFromString(newContent, "text/html");
    const paragraphs = doc.getElementsByTagName("p");
    const updates = {};

    Array.from(paragraphs).forEach((p) => {
      const text = p.textContent;
      if (text.includes("Mobile No 1:")) {
        updates.mobileNumber = text.replace("Mobile No 1:", "").trim();
      } else if (text.includes("Mobile No 2:")) {
        updates.organiserMobileNumber = text.replace("Mobile No 2:", "").trim();
      } else if (text.includes("Director Mobile No:")) {
        updates.directorMobileNumber = text.replace("Director Mobile No:", "").trim();
      } else if (text.includes("Email:")) {
        updates.organiserEmail = text.replace("Email:", "").trim();
      }
    });

    setProfile((prev) => ({ ...prev, ...updates }));
  };

  // On page load
  useEffect(() => {
    getAllComplete();
    getprofileOrganizer();
    return () => {
      if (profile.imagePreview) {
        URL.revokeObjectURL(profile.imagePreview);
      }
    };
    // eslint-disable-next-line
  }, []);

  // Scroll functionality
  const scrollCards = (direction) => {
    const container = document.getElementById("organiseCardWrapper");
    const scrollAmount = 300;
    if (container) {
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Modal handlers
  const handleSaveClick = (e) => {
    e.preventDefault();
    setShowModal(true);
  };
  const handleModalNo = () => setShowModal(false);
  const handleModalYes = () => updateProfile();

  return (
    <div>
      <div className="organiser-edit-container">
        <Organisersheader />

        <main className="organiser-main">
          {/* Back button in top-left corner */}
         <div className="relative">
         <div style={{ position: "absolute", top: "6rem", left: "20px", zIndex: 10 }}>
            <button
              className=""
              onClick={handleBackClick}
              style={{
                padding: "10px 20px",
                color: "black",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "14px",
                backgroundColor:"transparent"
              }}
            >
              ← Back
            </button>
          </div>
         </div>

          <div className="organiser-info d-flex justify-content-between align-content-center">
            <div className="d-flex align-items-center">
              <div
                className="organiser-image-box edit-mode d-flex justify-content-center align-items-center"
                onClick={triggerFileInput}
                style={{ cursor: "pointer" }}
              >
                {profile.imagePreview ? (
                  <img
                    src={profile.imagePreview}
                    alt="Profile"
                    className="organiser-avatar"
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                  />
                ) : (
                  <img
                    src={DUMMY_AVATAR}
                    alt="Dummy Avatar"
                    className="organiser-avatar"
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                  />
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
              <div>
                <h2 className="organiser-name p-3">
                  {profile.name || "Organiser Name"}
                </h2>
              </div>
            </div>
            <div>
              <button
                className="organiser-save-button"
                onClick={handleSaveClick}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>

          <section className="organiser-about">
            <h3>About Us</h3>
            <div className="form-group">
              <JoditEditor
                ref={editor}
                value={profile.aims || ""}
                tabIndex={1}
                onChange={newContent =>
                  setProfile(prev => ({ ...prev, aims: newContent }))
                }
              />
            </div>
          </section>

          <div className="organise-slider-container">
            <button
              className="organise-slider-btn left"
              onClick={() => scrollCards("left")}
              aria-label="Scroll left"
              style={{ left:"-18px" }}
            >
              ‹
            </button>
            <div className="organise-card-wrapper" id="organiseCardWrapper">
              {loading ? (
                <p>Loading competitions...</p>
              ) : cards.length === 0 ? (
                <p>No competitions found.</p>
              ) : (
                cards.map((card, index) => (
                  <div key={card._id || index} className="organise-user-card">
                    <div className="organise-user-card-image-container">
                      <img
                        src={
                          card.overview?.image
                            ? `${API_BASE_URL}${card.overview.image}`
                            : "https://via.placeholder.com/300x200"
                        }
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
                          <p className="organise-user-card-label">
                            Enrollments:
                          </p>
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
                ))
              )}
            </div>
            <button
              className="organise-slider-btn right"
              onClick={() => scrollCards("right")}
              aria-label="Scroll right"
            >
              ›
            </button>
          </div>

          <section className="organiser-contact">
            <h3>Contact Us</h3>
            <div className="form-group">
              <JoditEditor
                ref={editor}
                value={contactContent}
                tabIndex={1}
                onChange={handleContactContentChange}
              />
            </div>
          </section>
        </main>
      </div>
      {/* Custom Modal for Save Confirmation */}
      {showModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-box">
            <p className="custom-modal-title">Are you sure you want to save the changes?</p>
            <div className="custom-modal-actions">
              <button className="custom-modal-btn custom-modal-btn-outline" onClick={handleModalNo}>
                No, Back
              </button>
              <button className="custom-modal-btn custom-modal-btn-green" onClick={handleModalYes}>
                Yes, Save
              </button>
            </div>
          </div>
        </div>
      )}
      <footer>
        <div className="footer-content">
          <div className="footer-logo">
            <p className="logo-text">Prodigi</p>
            <p>
              Thakur Village, Kandivali (East),
              <br />
              Mumbai - 400101
            </p>
            <div className="social-links">{/* Add social icons */}</div>
          </div>
          <div className="footer-links">
            <div className="link-column">
              <h4>Company</h4>
              <a href="#">About us</a>
              <a href="#">Contact us</a>
              <a href="#">Testimonials</a>
            </div>
            <div className="link-column">
              <h4>Support</h4>
              <a href="#">Help center</a>
              <a href="#">Terms of service</a>
              <a href="#">Privacy policy</a>
              <a href="#">Status</a>
            </div>
            <div className="newsletter">
              <h4>Stay up to date</h4>
              <div className="subscribe">
                <input type="email" placeholder="Your email address" />
                <button type="submit">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OrganiserProfileUpdate;