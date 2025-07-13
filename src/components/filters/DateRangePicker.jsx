import React, { useState } from 'react';
import { Calendar } from 'lucide-react'; 

const DateRangePicker = ({ value, onChange }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selecting, setSelecting] = useState('from');

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const handleDateClick = (date) => {
    if (selecting === 'from') {
      onChange({ from: formatDate(date), to: value.to });
      setSelecting('to');
    } else {
      const fromDate = parseDate(value.from);
      if (fromDate && date < fromDate) {
        onChange({ from: formatDate(date), to: value.from });
      } else {
        onChange({ ...value, to: formatDate(date) });
      }
      setShowCalendar(false);
      setSelecting('from');
    }
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const monthName = currentMonth.toLocaleString('default', { month: 'long' });

    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateStr = formatDate(date);
      const isFromDate = dateStr === value.from;
      const isToDate = dateStr === value.to;
      const isInRange =
        value.from &&
        value.to &&
        date >= parseDate(value.from) &&
        date <= parseDate(value.to);

      days.push(
        <div
          key={i}
          className={`calendar-day ${isFromDate ? 'from-date' : ''} ${isToDate ? 'to-date' : ''} ${isInRange ? 'in-range' : ''}`}
          onClick={() => handleDateClick(date)}
        >
          {i}
        </div>
      );
    }

    return (
      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={() => setCurrentMonth(new Date(year, month - 1))}>❮</button>
          <div>{monthName} {year}</div>
          <button onClick={() => setCurrentMonth(new Date(year, month + 1))}>❯</button>
        </div>
        <div className="weekdays">
          <div>S</div>
          <div>M</div>
          <div>T</div>
          <div>W</div>
          <div>T</div>
          <div>F</div>
          <div>S</div>
        </div>
        <div className="calendar-days">
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="date-range-picker">
      <div className="date-inputs">
        <div className="date-input-group">
          <label>From</label>
          <div className="date-input-wrapper">
            <input
              type="text"
              value={value.from}
              readOnly
              placeholder="DD-MM-YYYY"
              onClick={() => {
                setSelecting('from');
                setShowCalendar(true);
              }}
            />
            <button
              className="calendar-button"
              onClick={(e) => {
                e.stopPropagation();
                setSelecting('from');
                setShowCalendar(!showCalendar);
              }}
            >
              <Calendar size={16} />
            </button>
          </div>
        </div>

        <div className="date-input-group">
          <label>To</label>
          <div className="date-input-wrapper">
            <input
              type="text"
              value={value.to}
              readOnly
              placeholder="DD-MM-YYYY"
              onClick={() => {
                setSelecting('to');
                setShowCalendar(true);
              }}
            />
            <button
              className="calendar-button"
              onClick={(e) => {
                e.stopPropagation();
                setSelecting('to');
                setShowCalendar(!showCalendar);
              }}
            >
              <Calendar size={16} />
            </button>
          </div>
        </div>
      </div>

      {showCalendar && renderCalendar()}
    </div>
  );
};

export default DateRangePicker;
