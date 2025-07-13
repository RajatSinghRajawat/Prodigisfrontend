import React, { useState, useEffect } from 'react';
import { IoBookmarkOutline, IoBookmark } from "react-icons/io5";
import './UserCardSlider.css';

const UserCard = ({ card, onClick, onBookmarkChange }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

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

  // Check bookmark status on component mount
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!userId || !card.id) return;

      try {
        const response = await fetch(`http://localhost:3001/api/competitions/bookmark/check?userId=${userId}&competitionId=${card.id}`);
        const result = await response.json();
        if (result.success) {
          setIsBookmarked(result.isBookmarked);
        }
      } catch (error) {
        console.error('Error checking bookmark status:', error);
      }
    };

    checkBookmarkStatus();
  }, [card.id, userId]);

  // Handle bookmark toggle
  const handleBookmarkClick = async (e) => {
    e.stopPropagation(); // Prevent card click when clicking bookmark

    if (!userId) {
      alert('Please login to bookmark competitions');
      return;
    }

    setIsBookmarkLoading(true);

    try {
      const url = 'http://localhost:3001/api/competitions/bookmark';
      const method = isBookmarked ? 'DELETE' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          competitionId: card.id
        })
      });

      const result = await response.json();

      if (result.success) {
        setIsBookmarked(!isBookmarked);
        // Call the refresh function if provided
        if (onBookmarkChange) {
          onBookmarkChange();
        }
      } else {
        console.error('Bookmark operation failed:', result.message);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  return (
    <div className="user-card" style={{ minWidth: '24rem', cursor: 'pointer', position: 'relative' }} onClick={onClick}>
      <div className="user-card-image-container">
        <img
          src={card.image}
          alt={card.name}
          className="user-card-image"
        />
        {/* Bookmark Icon */}
        <div
          className="bookmark-icon-slider"
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            zIndex: 10,
            background: "rgba(255, 255, 255, 0.9)",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            transition: "all 0.2s ease",
            border: "1px solid rgba(0, 0, 0, 0.1)"
          }}
          onClick={handleBookmarkClick}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 1)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.9)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
          }}
          title={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
        >
          {isBookmarkLoading ? (
            <div style={{
              fontSize: "14px",
              color: "#666",
              animation: "spin 1s linear infinite"
            }}>⋯</div>
          ) : isBookmarked ? (
            <IoBookmark style={{
              fontSize: "18px",
              color: "#1a7f37",
              filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))"
            }} />
          ) : (
            <IoBookmarkOutline
              className="bookmark-outline-slider"
              style={{
                fontSize: "18px",
                color: "#666",
                transition: "color 0.2s ease"
              }}
            />
          )}
        </div>
      </div>
      <div className="user-card-content">
        <h2 className="user-card-name">{card.name}</h2>
        <p className="user-card-institute">{card.institute}</p>
        <div className="user-card-details">
          <div className="d-flex">
            <div className='d-flex gap-2'>
              <p className="user-card-label">Date:</p>
              <p className="user-card-value">{card.date}</p>
            </div>
            <div className='d-flex gap-2'>
              <p className="user-card-label">Variance Score:</p>
              <p className="user-card-badge mt-3">{card.score || 70}</p>
            </div>
          </div>
          <div className="d-flex ">
            <div className='d-flex gap-2'>
              <p className="user-card-label">Enrollments:</p>
              <p className="user-card-value">{card.enrollments || 770}</p>
            </div>
            <div className='d-flex gap-2'>
              <p className="user-card-label">Registration Fee:</p>
              <p className="user-card-value">{card.fee || 70000}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
