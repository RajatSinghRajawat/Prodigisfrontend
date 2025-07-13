import React, { useState, useEffect, useMemo, useRef } from "react";
import { debounce } from "lodash";
import HeaderUser from "./HeaderUser";
import FooterUsers from "./FooterUsers";
import { IoSearchOutline } from "react-icons/io5";
import { CiFilter } from "react-icons/ci";
import { IoBookmarkOutline, IoBookmark } from "react-icons/io5";
import Pagination from "react-bootstrap/Pagination";
import FilterModal from "./FilterModal";
import "./FilterStyles.css";
import "./UserLogin.css";
import "./Compition.css";
import { useNavigate } from "react-router-dom";
import Studentheaderhome from "./Studentheaderhome";

const SORT_OPTIONS = [
  { label: "By Competition Date: Closest First", value: "date_asc", tag: "Date: Closest first" },
  { label: "By Competition Date: Farthest First", value: "date_desc", tag: "Date: Farthest first" },
  { label: "By Registration Fee: Low to High", value: "fee_asc", tag: "Fee: Low to High" },
  { label: "By Registration Fee: High to Low", value: "fee_desc", tag: "Fee: High to Low" },
  { label: "By Variance Score: Low to High", value: "score_asc", tag: "Score: Low to High" },
  { label: "By Variance Score: High to Low", value: "score_desc", tag: "Score: High to Low" },
  { label: "Personalization: Suggested For you", value: "personal", tag: "Suggested For you" },
];

// Memoized CompetitionCard component
const CompetitionCard = React.memo(({ card }) => {
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

  // Get user ID from localStorage (adjust this based on your auth implementation)
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

  // Format date to match the design
  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Generate sample data to match the design
  const varianceScore = Math.floor(Math.random() * 40) + 50; // Random score between 50-90
  const enrollments = Math.floor(Math.random() * 500) + 100; // Random enrollments between 100-600

  // Check bookmark status on component mount
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`http://localhost:3001/api/competitions/bookmark/check?userId=${userId}&competitionId=${card._id}`);
        const result = await response.json();
        if (result.success) {
          setIsBookmarked(result.isBookmarked);
        }
      } catch (error) {
        console.error('Error checking bookmark status:', error);
      }
    };

    checkBookmarkStatus();
  }, [card._id, userId]);

  // Handle bookmark toggle
  const handleBookmarkClick = async (e) => {
    e.stopPropagation(); // Prevent navigation when clicking bookmark

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
          competitionId: card._id
        })
      });

      const result = await response.json();

      if (result.success) {
        setIsBookmarked(!isBookmarked);
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
    <div
      className="user-card"
      style={{ cursor: "pointer", position: "relative" }}
      onClick={() => navigate(`/Competitionsdetail/${card._id}`)}
    >
      {/* Bookmark Icon */}
      <div
        className="bookmark-icon-container"
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          zIndex: 10,
          background: "rgba(255, 255, 255, 0.9)",
          borderRadius: "50%",
          width: "36px",
          height: "36px",
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
            fontSize: "16px",
            color: "#666",
            animation: "spin 1s linear infinite"
          }}>⋯</div>
        ) : isBookmarked ? (
          <IoBookmark style={{
            fontSize: "20px",
            color: "#1a7f37",
            filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))"
          }} />
        ) : (
          <IoBookmarkOutline
            className="bookmark-outline"
            style={{
              fontSize: "20px",
              color: "#666",
              transition: "color 0.2s ease"
            }}
          />
        )}
      </div>

      <div className="user-card-image-container">
        <img
          src={card.overview?.image ? `http://localhost:3001${card.overview.image}` : "https://via.placeholder.com/300x200"}
          alt={card.overview?.name || "Competition"}
          className="user-card-image"
          style={{objectFit:"cover"}}
          loading="lazy"
        />
      </div>
      <div className="user-card-content">
        <h2 className="user-card-name">{card.overview?.name || "Competition Name"}</h2>
        <p className="user-card-institute">Institute Name</p>
        <div className="user-card-details">
          <div className="d-flex">
            <div className="d-flex gap-2">
              <p className="user-card-label">Date:</p>
              <p className="user-card-value">{formatDate(card.overview?.stages?.[0]?.date)}</p>
            </div>
            <div className="d-flex gap-2">
              <p className="user-card-label">Variance Score:</p>
              <p className="user-card-value">{varianceScore}%</p>
            </div>
          </div>
          <div className="d-flex">
            <div className="d-flex gap-2">
              <p className="user-card-label">Enrollments:</p>
              <p className="user-card-value">{enrollments}+</p>
            </div>
            <div className="d-flex gap-2">
              <p className="user-card-label">Registration fee:</p>
              <p className="user-card-value">₹{card.registration?.registration_type?.total_registration_fee || "850"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const Competition = () => {
  const [cards, setCards] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [selectedSort, setSelectedSort] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const itemsPerPage = 10;
  const filterBtnRef = useRef(null);
  const sortBtnRef = useRef(null);
  const sortModalRef = useRef(null);

  // Handle clicks outside to close modals
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        sortModalRef.current &&
        !sortModalRef.current.contains(event.target) &&
        sortBtnRef.current &&
        !sortBtnRef.current.contains(event.target)
      ) {
        setIsSortModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Build query string
  const buildQueryString = (filtersObj, sort, page) => {
    const params = new URLSearchParams();
    if (filtersObj.dateRange) {
      if (filtersObj.dateRange.from) params.append("dateFrom", filtersObj.dateRange.from);
      if (filtersObj.dateRange.to) params.append("dateTo", filtersObj.dateRange.to);
    }
    if (filtersObj.feeRange) {
      if (filtersObj.feeRange.min) params.append("minFee", filtersObj.feeRange.min);
      if (filtersObj.feeRange.max) params.append("maxFee", filtersObj.feeRange.max);
    }
    if (filtersObj.selectedSubjects?.length > 0) {
      params.append("subject", filtersObj.selectedSubjects[0]);
    }
    if (filtersObj.selectedLocations?.length > 0) {
      params.append("city", filtersObj.selectedLocations[0]);
    }
    if (sort) {
      params.append("sort", sort);
    }
    params.append("page", page);
    params.append("limit", itemsPerPage);
    return params.toString() ? `?${params.toString()}` : "";
  };

  // Fetch competitions
  const getAllCompetitions = async (filtersObj = filters, sort = selectedSort, page = currentPage, searchVal = search) => {
    try {
      setIsLoading(true);
      setError(null);

      let response;

      // Use search API if there's a search query, otherwise use getAllCompetitions
      if (searchVal && searchVal.trim() !== '') {
        const searchParams = new URLSearchParams();
        searchParams.append('query', searchVal.trim());
        searchParams.append('page', page);
        searchParams.append('limit', itemsPerPage);

        // Add filters to search
        if (filtersObj.dateRange) {
          if (filtersObj.dateRange.from) searchParams.append("dateFrom", filtersObj.dateRange.from);
          if (filtersObj.dateRange.to) searchParams.append("dateTo", filtersObj.dateRange.to);
        }
        if (filtersObj.feeRange) {
          if (filtersObj.feeRange.min) searchParams.append("minFee", filtersObj.feeRange.min);
          if (filtersObj.feeRange.max) searchParams.append("maxFee", filtersObj.feeRange.max);
        }
        if (filtersObj.selectedSubjects?.length > 0) {
          searchParams.append("subject", filtersObj.selectedSubjects[0]);
        }
        if (filtersObj.selectedLocations?.length > 0) {
          searchParams.append("city", filtersObj.selectedLocations[0]);
        }
        if (sort) {
          searchParams.append("sort", sort);
        }

        response = await fetch(`http://localhost:3001/api/competitions/search?${searchParams.toString()}`, {
          method: "GET",
          redirect: "follow",
        });

        if (!response.ok) throw new Error("Failed to search competitions");
        const result = await response.json();
        setCards(result.data?.competitions || []);
      } else {
        // Use existing getAllCompetitions API for normal browsing
        const queryString = buildQueryString(filtersObj, sort, page);
        response = await fetch(`http://localhost:3001/api/competitions/all${queryString}`, {
          method: "GET",
          redirect: "follow",
        });

        if (!response.ok) throw new Error("Failed to fetch competitions");
        const result = await response.json();
        setCards(result.competitions || []);
      }
    } catch (error) {
      console.error(error);
      setError("Failed to load competitions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedGetAllCompetitions = useMemo(
    () => debounce((filtersObj, sort, page, searchVal) => getAllCompetitions(filtersObj, sort, page, searchVal), 300),
    []
  );

  useEffect(() => {
    debouncedGetAllCompetitions(filters, selectedSort, currentPage, search);
    return () => debouncedGetAllCompetitions.cancel();
  }, [filters, selectedSort, currentPage, search, debouncedGetAllCompetitions]);

  const openFilterModal = () => {
    setIsFilterModalOpen(true);
    setIsSortModalOpen(false);
  };

  const closeFilterModal = () => setIsFilterModalOpen(false);

  const openSortModal = () => {
    setIsSortModalOpen(true);
    setIsFilterModalOpen(false);
  };

  const closeSortModal = () => setIsSortModalOpen(false);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setIsFilterModalOpen(false);
  };

  const handleSortSelect = (sortValue) => {
    setSelectedSort(sortValue);
    setCurrentPage(1);
    setIsSortModalOpen(false);
  };

  const handleRemoveTag = (type, value) => {
    let newFilters = { ...filters };
    if (type === "subject") {
      newFilters = { ...filters, selectedSubjects: [] };
    } else if (type === "city") {
      newFilters = { ...filters, selectedLocations: [] };
    } else if (type === "date") {
      newFilters = { ...filters, dateRange: { from: "", to: "" } };
    } else if (type === "sort") {
      setSelectedSort(null);
    } else if (type === "search") {
      setSearch("");
    }
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const filterTags = useMemo(() => {
    const tags = [];
    if (filters.selectedSubjects?.length > 0) {
      tags.push({ label: filters.selectedSubjects[0], type: "subject", value: filters.selectedSubjects[0] });
    }
    if (filters.selectedLocations?.length > 0) {
      tags.push({ label: filters.selectedLocations[0], type: "city", value: filters.selectedLocations[0] });
    }
    if (filters.dateRange && (filters.dateRange.from || filters.dateRange.to)) {
      tags.push({ label: `${filters.dateRange.from || "Any"} to ${filters.dateRange.to || "Any"}`, type: "date", value: "" });
    }
    if (selectedSort) {
      const sortObj = SORT_OPTIONS.find((opt) => opt.value === selectedSort);
      if (sortObj) tags.push({ label: sortObj.tag, type: "sort", value: selectedSort });
    }
    if (search) {
      tags.push({ label: `Search: ${search}`, type: "search", value: search });
    }
    return tags;
  }, [filters, selectedSort, search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div style={{ position: "relative" }}>
      <Studentheaderhome />
      <div className="search-controls" style={{ position: "relative" }}>
        <div className="search-bar">
          <span className="search-icon">
            <IoSearchOutline />
          </span>
          <input
            type="text"
            placeholder="Search competitions"
            className="search-input"
            value={search}
            onChange={handleSearchChange}
            aria-label="Search competitions"
          />
        </div>
        <button
          className="filter-btn"
          ref={filterBtnRef}
          onClick={openFilterModal}
          aria-label="Open filter modal"
        >
          <span className="filter-icon">
            <CiFilter />
          </span>
          Filter
        </button>
        <button
          className="sort-btn"
          ref={sortBtnRef}
          onClick={openSortModal}
          aria-label="Open sort dropdown"
        >
          <span className="sort-icon">⬆⬇</span> Sort
        </button>

        {/* Filter Modal */}
        <FilterModal
          isOpen={isFilterModalOpen}
          onRequestClose={closeFilterModal}
          onApplyFilters={handleApplyFilters}
          anchorRef={filterBtnRef}
        />

        {/* Sort Dropdown */}
        {isSortModalOpen && (() => {
          const sortBtnRect = sortBtnRef.current?.getBoundingClientRect();
          const sortModalStyle = {
            position: "absolute",
            left: sortBtnRect ? sortBtnRect.left + window.scrollX : 0,
            top: sortBtnRect ? sortBtnRect.bottom + window.scrollY + 8 : 0,
            zIndex: 1002,
            minWidth: 220,
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
            border: "1px solid #e0e0e0",
            padding: "16px 0",
          };
          return (
            <div className="sort-modal" style={sortModalStyle} ref={sortModalRef} role="menu">
              <div className="modal-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h4 className="sort-modal-title" style={{ margin: "0 16px 12px 16px" }}>Sort By</h4>
                <button
                  className="modal-close-btn"
                  onClick={closeSortModal}
                  aria-label="Close sort dropdown"
                  style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", padding: "0 16px" }}
                >
                  ×
                </button>
              </div>
              {SORT_OPTIONS.map((opt) => (
                <div key={opt.value} className="sort-modal-option-wrapper" role="menuitem">
                  <button
                    className={`sort-modal-option${selectedSort === opt.value ? " selected" : ""}`}
                    onClick={() => handleSortSelect(opt.value)}
                    style={{
                      background: selectedSort === opt.value ? "#e6f4ea" : "#f6f6f6",
                      color: selectedSort === opt.value ? "#1a7f37" : "#222",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 16px",
                      width: "100%",
                      textAlign: "left",
                      cursor: "pointer",
                      fontWeight: selectedSort === opt.value ? "bold" : "normal",
                    }}
                    aria-selected={selectedSort === opt.value}
                  >
                    {opt.label}
                  </button>
                </div>
              ))}
            </div>
          );
        })()}
      </div>

      {/* Filter/Sort/Search Tags */}
      <div className="active-filters-container">
        {filterTags.map((tag, idx) => (
          <span key={idx} className="filter-tag">
            {tag.label}
            <span
              className="filter-tag-close"
              onClick={() => handleRemoveTag(tag.type, tag.value)}
              role="button"
              aria-label={`Remove ${tag.label} filter`}
            >
              ✕
            </span>
          </span>
        ))}
      </div>

      {/* Competition Cards */}
      <div className="user-cards-container">
        {isLoading && (
          <div className="loading-container" style={{ gridColumn: '1 / -1' }}>
            <p>Loading competitions...</p>
          </div>
        )}
        {error && (
          <div className="error-message" style={{ gridColumn: '1 / -1' }}>
            {error}
          </div>
        )}
        {!isLoading && !error && cards.length === 0 && (
          <div className="no-results" style={{ gridColumn: '1 / -1' }}>
            <p>No competitions found.</p>
          </div>
        )}
        {!isLoading && !error &&
          cards.map((card, index) => <CompetitionCard key={card._id || index} card={card} />)}
      </div>

      {/* Pagination */}
      <Pagination className="justify-content-center mt-4">
        <Pagination.Prev
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          aria-label="Previous page"
        />
        <Pagination.Item active>{currentPage}</Pagination.Item>
        <Pagination.Next
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={cards.length < itemsPerPage}
          aria-label="Next page"
        />
      </Pagination>

      <FooterUsers />
    </div>
  );
};

export default Competition;