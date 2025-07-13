// FilterModal.js
import React, { useState } from 'react';
import './FilterStyles.css';

const initialState = {
  fromDate: '',
  toDate: '',
  registrationFeeMin: 0,
  registrationFeeMax: 1000,
  subjects: [],
  scaleMin: 0,
  scaleMax: 1000000,
  location: '',
  currentMonth: new Date().getMonth(),
  currentYear: new Date().getFullYear(),
};

// Calendar component
const Calendar = ({ fromDate, toDate, onDateSelect, currentMonth, currentYear, onMonthChange }) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();
  
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  
  const days = [];
  
  // Previous month's trailing days
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  
  // Current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }
  
  const formatDate = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    return date.toISOString().split('T')[0];
  };
  
  const isSelected = (day) => {
    if (!day) return false;
    const dateStr = formatDate(day);
    return dateStr === fromDate || dateStr === toDate;
  };
  
  const isInRange = (day) => {
    if (!day || !fromDate || !toDate) return false;
    const dateStr = formatDate(day);
    return dateStr > fromDate && dateStr < toDate;
  };
  
  const prevMonth = () => {
    if (currentMonth === 0) {
      onMonthChange(11, currentYear - 1);
    } else {
      onMonthChange(currentMonth - 1, currentYear);
    }
  };
  
  const nextMonth = () => {
    if (currentMonth === 11) {
      onMonthChange(0, currentYear + 1);
    } else {
      onMonthChange(currentMonth + 1, currentYear);
    }
  };
  
  const prevYear = () => {
    onMonthChange(currentMonth, currentYear - 1);
  };
  
  const nextYear = () => {
    onMonthChange(currentMonth, currentYear + 1);
  };
  
  return (
    <div className="custom-calendar">
      <div className="calendar-header">
        <button className="nav-btn" onClick={prevYear}>«</button>
        <button className="nav-btn" onClick={prevMonth}>‹</button>
        <span className="month-year">{monthNames[currentMonth]} {currentYear}</span>
        <button className="nav-btn" onClick={nextMonth}>›</button>
        <button className="nav-btn" onClick={nextYear}>»</button>
      </div>
      <div className="calendar-grid">
        {daysOfWeek.map(day => (
          <div key={day} className="day-header">{day}</div>
        ))}
        {days.map((day, index) => (
          <div
            key={index}
            className={`calendar-day ${day ? 'clickable' : ''} ${isSelected(day) ? 'selected' : ''} ${isInRange(day) ? 'in-range' : ''}`}
            onClick={() => day && onDateSelect(formatDate(day))}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

// Range Slider component
const RangeSlider = ({ min, max, minValue, maxValue, onMinChange, onMaxChange, step = 1, formatValue }) => {
  const safeMinValue = minValue === '' ? min : minValue;
  const safeMaxValue = maxValue === '' ? max : maxValue;
  const minPercentage = ((safeMinValue - min) / (max - min)) * 100;
  const maxPercentage = ((safeMaxValue - min) / (max - min)) * 100;
  
  const handleMinChange = (newMin) => {
    if (newMin <= maxValue || newMin === '') {
      onMinChange(newMin);
    }
  };
  
  const handleMaxChange = (newMax) => {
    if (newMax >= minValue || newMax === '') {
      onMaxChange(newMax);
    }
  };
  
  return (
    <div className="range-slider-container">
      <div className="range-inputs">
        <div className="range-input-group">
          <span className="currency">₹</span>
          <input 
            type="text" 
            value={minValue === '' ? '' : (formatValue ? formatValue(minValue) : minValue)}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                handleMinChange('');
              } else {
                const numValue = parseInt(value.replace(/,/g, ''));
                if (!isNaN(numValue)) {
                  handleMinChange(numValue);
                }
              }
            }}
            onBlur={(e) => {
              // Set to minimum if empty when focus is lost
              if (e.target.value === '') {
                handleMinChange(min);
              }
            }}
            className="range-display-input"
            placeholder={formatValue ? formatValue(min) : min}
          />
          <span className="label">Min</span>
        </div>
        <div className="range-input-group">
          <span className="currency">₹</span>
          <input 
            type="text" 
            value={maxValue === '' ? '' : (formatValue ? formatValue(maxValue) : maxValue)}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                handleMaxChange('');
              } else {
                const numValue = parseInt(value.replace(/,/g, ''));
                if (!isNaN(numValue)) {
                  handleMaxChange(numValue);
                }
              }
            }}
            onBlur={(e) => {
              // Set to maximum if empty when focus is lost
              if (e.target.value === '') {
                handleMaxChange(max);
              }
            }}
            className="range-display-input"
            placeholder={formatValue ? formatValue(max) : max}
          />
          <span className="label">Max</span>
        </div>
      </div>
      <div className="slider-track">
        <div 
          className="slider-progress" 
          style={{ 
            left: `${minPercentage}%`,
            width: `${maxPercentage - minPercentage}%` 
          }}
        ></div>
        <input
          type="range"
          min={min}
          max={max}
          value={safeMinValue}
          step={step}
          onChange={(e) => handleMinChange(parseInt(e.target.value))}
          className="slider-input slider-min"
          style={{ 
            zIndex: Math.abs(safeMinValue - safeMaxValue) < (max - min) * 0.1 ? 6 : 3
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={safeMaxValue}
          step={step}
          onChange={(e) => handleMaxChange(parseInt(e.target.value))}
          className="slider-input slider-max"
          style={{ 
            zIndex: Math.abs(safeMinValue - safeMaxValue) < (max - min) * 0.1 ? 5 : 4
          }}
        />
      </div>
    </div>
  );
};

const FilterModal = ({ isOpen, onRequestClose, onApplyFilters, anchorRef }) => {
  const [filters, setFilters] = useState(initialState);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDateSelect = (date) => {
    if (!filters.fromDate || (filters.fromDate && filters.toDate)) {
      setFilters(prev => ({ ...prev, fromDate: date, toDate: '' }));
    } else if (date >= filters.fromDate) {
      setFilters(prev => ({ ...prev, toDate: date }));
      setShowCalendar(false); // Close calendar after selecting end date
    } else {
      setFilters(prev => ({ ...prev, fromDate: date, toDate: filters.fromDate }));
    }
  };

  const handleDateInputClick = () => {
    setShowCalendar(!showCalendar);
  };

  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return 'Select date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleMonthChange = (month, year) => {
    setFilters(prev => ({ ...prev, currentMonth: month, currentYear: year }));
  };

  const handleSubjectToggle = (subject) => {
    setFilters(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const handleLocationToggle = (location) => {
    setFilters(prev => ({
      ...prev,
      location: prev.location === location ? '' : location
    }));
  };

  const resetSection = (section) => {
    switch (section) {
      case 'date':
        setFilters(prev => ({ ...prev, fromDate: '', toDate: '' }));
        setShowCalendar(false);
        break;
      case 'fee':
        setFilters(prev => ({ ...prev, registrationFeeMin: 0, registrationFeeMax: 1000 }));
        break;
      case 'subjects':
        setFilters(prev => ({ ...prev, subjects: [] }));
        break;
      case 'scale':
        setFilters(prev => ({ ...prev, scaleMin: 0, scaleMax: 1000000 }));
        break;
      case 'location':
        setFilters(prev => ({ ...prev, location: '' }));
        break;
    }
  };

  const resetAll = () => {
    setFilters(initialState);
  };

  const handleApply = () => {
    const filterObj = {
      dateRange: { from: filters.fromDate, to: filters.toDate },
      feeRange: { min: filters.registrationFeeMin, max: filters.registrationFeeMax },
      selectedSubjects: filters.subjects,
      scaleRange: { min: filters.scaleMin, max: filters.scaleMax },
      selectedLocations: filters.location ? [filters.location] : [],
    };
    onApplyFilters(filterObj);
    onRequestClose();
  };

  const formatNumber = (num) => {
    if (num >= 100000) {
      const lakhs = Math.floor(num / 100000);
      const remainder = num % 100000;
      if (remainder === 0) {
        return `${lakhs},00,000`;
      } else {
        const thousands = Math.floor(remainder / 1000);
        if (thousands > 0) {
          return `${lakhs},${thousands.toString().padStart(2, '0')},000`;
        } else {
          return `${lakhs},00,${remainder.toString().padStart(3, '0')}`;
        }
      }
    } else if (num >= 1000) {
      return `${Math.floor(num / 1000)},${(num % 1000).toString().padStart(3, '0')}`;
    }
    return num.toString();
  };

  if (!isOpen) return null;

  // Responsive dropdown positioning
  let dropdownStyle = { left: 0, top: 56, position: 'absolute' };
  if (anchorRef && anchorRef.current) {
    const rect = anchorRef.current.getBoundingClientRect();
    const modalHeight = 700;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    let top = rect.bottom + window.scrollY + 4;
    if (spaceBelow < modalHeight && spaceAbove > modalHeight) {
      top = rect.top + window.scrollY - modalHeight - 4;
    }
    dropdownStyle = {
      position: 'absolute',
      left: rect.left,
      top,
      zIndex: 1001,
    };
  }

  return (
    <div className="filter-modal" style={{position:'absolute',right:0,left:"auto",top:"86px",zIndex:1001}}>
      <div className="filter-content">
        {/* Competition Date Section */}
        <div className="filter-section">
          <div className="section-header">
            <h3>Competition Date</h3>
            <button className="reset-link" onClick={() => resetSection('date')}>Reset</button>
          </div>
          <div className="date-inputs">
            <div className="date-input-group">
              <label>From</label>
              <div className="date-input-box" onClick={handleDateInputClick}>
                <input 
                  type="text" 
                  value={formatDateForDisplay(filters.fromDate)} 
                  className="date-input"
                  placeholder="Select start date"
                  readOnly
                />
                <span className="calendar-icon">📅</span>
              </div>
            </div>
            <div className="date-input-group">
              <label>To</label>
              <div className="date-input-box" onClick={handleDateInputClick}>
                <input 
                  type="text" 
                  value={formatDateForDisplay(filters.toDate)} 
                  className="date-input"
                  placeholder="Select end date"
                  readOnly
                />
                <span className="calendar-icon">📅</span>
              </div>
            </div>
          </div>
          {showCalendar && (
            <div className="calendar-container">
              <div className="calendar-header-controls">
                <span className="calendar-title">Select Date Range</span>
                <button 
                  className="calendar-close-btn" 
                  onClick={() => setShowCalendar(false)}
                  aria-label="Close calendar"
                >
                  ×
                </button>
              </div>
              <Calendar 
                fromDate={filters.fromDate}
                toDate={filters.toDate}
                onDateSelect={handleDateSelect}
                currentMonth={filters.currentMonth}
                currentYear={filters.currentYear}
                onMonthChange={handleMonthChange}
              />
            </div>
          )}
        </div>

        {/* Registration Fee Section */}
        <div className="filter-section">
          <div className="section-header">
            <h3>Registration Fee</h3>
            <button className="reset-link" onClick={() => resetSection('fee')}>Reset</button>
          </div>
          <RangeSlider
            min={0}
            max={1000}
            minValue={filters.registrationFeeMin}
            maxValue={filters.registrationFeeMax}
            onMinChange={(value) => setFilters(prev => ({ ...prev, registrationFeeMin: value }))}
            onMaxChange={(value) => setFilters(prev => ({ ...prev, registrationFeeMax: value }))}
            step={10}
          />
        </div>

        {/* Subjects Section */}
        <div className="filter-section">
          <div className="section-header">
            <h3>Subjects</h3>
            <button className="reset-link" onClick={() => resetSection('subjects')}>Reset</button>
          </div>
          <div className="subjects-container">
            <div className="selected-subjects">
              {filters.subjects.map(subject => (
                <span key={subject} className="subject-chip">
                  {subject} <span className="remove-chip" onClick={() => handleSubjectToggle(subject)}>×</span>
                </span>
              ))}
            </div>
            <select 
              className="subjects-dropdown"
              onChange={(e) => {
                if (e.target.value && !filters.subjects.includes(e.target.value)) {
                  handleSubjectToggle(e.target.value);
                }
                e.target.value = "";
              }}
              value=""
            >
              <option value="">Select subjects</option>
              <option value="Maths">Maths</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
              <option value="History">History</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="Computer Science">Computer Science</option>
            </select>
          </div>
        </div>

        {/* Scale Section */}
        <div className="filter-section">
          <div className="section-header">
            <h3>Scale</h3>
            <button className="reset-link" onClick={() => resetSection('scale')}>Reset</button>
          </div>
          <RangeSlider
            min={0}
            max={1000000}
            minValue={filters.scaleMin}
            maxValue={filters.scaleMax}
            onMinChange={(value) => setFilters(prev => ({ ...prev, scaleMin: value }))}
            onMaxChange={(value) => setFilters(prev => ({ ...prev, scaleMax: value }))}
            step={1000}
            formatValue={formatNumber}
          />
        </div>

        {/* Location Section */}
        <div className="filter-section">
          <div className="section-header">
            <h3>Location</h3>
            <button className="reset-link" onClick={() => resetSection('location')}>Reset</button>
          </div>
          <div className="location-container">
            <div className="selected-locations">
              {filters.location && (
                <span className="location-chip">
                  {filters.location} <span className="remove-chip" onClick={() => handleLocationToggle(filters.location)}>×</span>
                </span>
              )}
            </div>
            <select 
              className="location-dropdown"
              onChange={(e) => {
                if (e.target.value) {
                  handleLocationToggle(e.target.value);
                }
                e.target.value = "";
              }}
              value=""
            >
              <option value="">Select location</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Chennai">Chennai</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Ahmedabad">Ahmedabad</option>
              <option value="Jaipur">Jaipur</option>
              <option value="Lucknow">Lucknow</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="filter-actions">
          <button className="reset-all-btn" onClick={resetAll}>Reset All</button>
          <button className="apply-filters-btn" onClick={handleApply}>Apply Filters</button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;