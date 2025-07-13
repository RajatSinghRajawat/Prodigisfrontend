import React from "react";
import FooterUsers from "./FooterUsers";
import "./UserLogin.css";
import HeaderUser from "./HeaderUser";
import right from "../images/Rectangle 157.png";
import left from "../images/Rectangle 157.png";
import Slider from "./common/Slider";
import Studentheaderhome from "./Studentheaderhome";
import { useGetAllCompetitionsQuery } from '../store/api/apiSlice';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import UserCard from "./common/UserCard";
// import UserCard from "./UserCard";

const UserLoginpage = ({ title }) => {
  const { data, isLoading, isError } = useGetAllCompetitionsQuery();
  const { competitionsid } = useParams();
  const navigate = useNavigate();
  const [bookmarkedCompetitions, setBookmarkedCompetitions] = useState([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(false);

  // Get user ID from localStorage
  const getUserId = () => {
    try {
      const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        return parsedUser.id;
      }
      return null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };

  const userId = getUserId();

  // Fetch bookmarked competitions
  const fetchBookmarkedCompetitions = async () => {
    if (!userId) return;
    
    setBookmarksLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/competitions/user-bookmarks/${userId}`);
      const result = await response.json();
      
      if (result.success) {
        // Format bookmarked competitions for display
        const formattedBookmarks = result.competitions.map((comp) => ({
          id: comp._id,
          image: comp.overview?.image
            ? comp.overview.image.startsWith('http')
              ? comp.overview.image
              : `http://localhost:3001${comp.overview.image}`
            : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-eE9u3e8kMX7dXfOHkTaaEHLZmZj7muf-fg&s",
          name: comp.overview?.name || "Competition",
          institute: comp.organizerId?.organiserName || "",
          date: comp.overview?.stages?.[0]?.date ? new Date(comp.overview.stages[0].date).toLocaleDateString() : "",
          score: comp.score ? `${comp.score}%` : `${Math.floor(Math.random() * 40) + 50}%`,
          enrollments: comp.enrollments || `${Math.floor(Math.random() * 500) + 100}+`,
          fee: comp.registration?.registration_type?.total_registration_fee ? `₹${comp.registration.registration_type.total_registration_fee}` : "₹850",
        }));
        setBookmarkedCompetitions(formattedBookmarks);
      }
    } catch (error) {
      console.error('Error fetching bookmarked competitions:', error);
    } finally {
      setBookmarksLoading(false);
    }
  };

  // Fetch bookmarked competitions on component mount
  useEffect(() => {
    fetchBookmarkedCompetitions();
  }, [userId]);

  let cards = [];
  if (data && data.competitions) {
    cards = data.competitions.map((comp) => ({
      id: comp._id,
      image: comp.overview?.image
        ? comp.overview.image.startsWith('http')
          ? comp.overview.image
          : `http://localhost:3001${comp.overview.image}`
        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-eE9u3e8kMX7dXfOHkTaaEHLZmZj7muf-fg&s",
      name: comp.overview?.name || "Competition",
      institute: comp.organizerId?.organiserName || "",
      date: comp.overview?.stages?.[0]?.date ? new Date(comp.overview.stages[0].date).toLocaleDateString() : "",
      score: comp.score ? `${comp.score}%` : "",
      enrollments: comp.enrollments || "",
      fee: comp.registration?.registration_type?.total_registration_fee ? `₹${comp.registration.registration_type.total_registration_fee}` : "",
    }));
  }

  const competitions = [
    {
      name: "Competition 1",
      daysAway: 90,
      progress: 60,
    },
    {
      name: "Competition 2",
      daysAway: 100,
      progress: 60,
    },
  ];

  const handleCardClick = (id) => {
    navigate(`/Competitionsdetail/${id}`);
  };

  return (
    <>
      <Studentheaderhome />
      <div className="progress-wrapper">
        <img src={left} alt="Top Right" className="corner-img top-right1" />
        <img src={right} alt="Bottom Left" className="corner-img bottom-left1" />

          <h2 style={{ fontWeight: 900 }}>Your Progress</h2>
        <div className=" progress-container">
          <div className="container progress-card-container">
            {competitions.map((comp, index) => (
              <div key={index} className="progress-card">
                <div className="card-left">
                
                  <div>
                    <div className="card-title">{comp.name}</div>
                    <div className="card-days">{comp.daysAway} Days Away</div>
                  </div>
                </div>
                <div className="card-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${comp.progress}%` }}
                    ></div>
                  </div>
                  <div className="progress-info">
                    <strong>{comp.progress}%</strong> Completed
                  </div>
                </div>
                <button className="prep-button">Continue Prep</button>
              </div>
            ))}
          </div>
        </div>
      </div>

    

      {isLoading ? (
        <div style={{ textAlign: 'center', margin: '2rem' }}>Loading competitions...</div>
      ) : isError ? (
        <div style={{ textAlign: 'center', margin: '2rem', color: 'red' }}>Failed to load competitions.</div>
      ) : (
        <>
          {/* Your Bookmarks Slider - Only show if user is logged in */}
          {userId && (
            bookmarksLoading ? (
              <div style={{ textAlign: 'center', margin: '2rem' }}>Loading your bookmarks...</div>
            ) : bookmarkedCompetitions.length > 0 ? (
              <Slider title="Your Wishlist" cards={bookmarkedCompetitions} onCardClick={handleCardClick}>
                {bookmarkedCompetitions.map((card) => (
                  <UserCard 
                    key={card.id} 
                    card={card} 
                    onClick={() => handleCardClick(card.id)}
                    onBookmarkChange={fetchBookmarkedCompetitions} // Refresh bookmarks when changed
                  />
                ))}
              </Slider>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                margin: '2rem',
                padding: '2rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                color: '#666'
              }}>
                <h3>No Bookmarked Competitions Yet</h3>
                <p>Start bookmarking competitions to see them here!</p>
              </div>
            )
          )}
          
        
          <Slider title="Top Competitions" cards={cards} onCardClick={handleCardClick}>
            {cards.map((card) => (
              <UserCard 
                key={card.id} 
                card={card} 
                onClick={() => handleCardClick(card.id)}
                onBookmarkChange={fetchBookmarkedCompetitions} // Refresh bookmarks when changed
              />
            ))}
          </Slider>
          <Slider title="Recommended For You" cards={cards} onCardClick={handleCardClick}>
            {cards.map((card) => (
              <UserCard 
                key={card.id} 
                card={card} 
                onClick={() => handleCardClick(card.id)}
                onBookmarkChange={fetchBookmarkedCompetitions} // Refresh bookmarks when changed
              />
            ))}
          </Slider>
          <Slider title="Latest Competitions" cards={cards} onCardClick={handleCardClick}>
            {cards.map((card) => (
              <UserCard 
                key={card.id} 
                card={card} 
                onClick={() => handleCardClick(card.id)}
                onBookmarkChange={fetchBookmarkedCompetitions} // Refresh bookmarks when changed
              />
            ))}
          </Slider>
        </>
      )}

      <FooterUsers />
    </>
  );
};

export default UserLoginpage;
