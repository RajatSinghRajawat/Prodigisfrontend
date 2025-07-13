import React, { useRef, useState, useEffect } from 'react'; 

const Slider = ({ min, max, value, onChange }) => {
  const sliderRef = useRef(null);
  const [isDraggingMin, setIsDraggingMin] = useState(false);
  const [isDraggingMax, setIsDraggingMax] = useState(false);

  const getPercentage = (val) => {
    return ((val - min) / (max - min)) * 100;
  };

  const minPos = getPercentage(value.min);
  const maxPos = getPercentage(value.max);

  const handleMouseDown = (e, isMin) => {
    e.preventDefault();
    if (isMin) {
      setIsDraggingMin(true);
    } else {
      setIsDraggingMax(true);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDraggingMin && !isDraggingMax) return;
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const sliderWidth = rect.width;
    const offsetX = e.clientX - rect.left;

    const percentage = Math.min(Math.max(0, offsetX / sliderWidth), 1);
    const newValue = Math.round(min + percentage * (max - min));

    if (isDraggingMin) {
      if (newValue < value.max) {
        onChange({ ...value, min: newValue });
      }
    } else if (isDraggingMax) {
      if (newValue > value.min) {
        onChange({ ...value, max: newValue });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDraggingMin(false);
    setIsDraggingMax(false);
  };

  useEffect(() => {
    if (isDraggingMin || isDraggingMax) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingMin, isDraggingMax, value]);

  return (
    <div className="slider-container" ref={sliderRef}>
      <div className="slider-track">
        <div
          className="slider-progress"
          style={{
            left: `${minPos}%`,
            width: `${maxPos - minPos}%`,
          }}
        />
      </div>

      <div
        className={`slider-handle min-handle ${isDraggingMin ? 'active' : ''}`}
        style={{ left: `${minPos}%` }}
        onMouseDown={(e) => handleMouseDown(e, true)}
      />

      <div
        className={`slider-handle max-handle ${isDraggingMax ? 'active' : ''}`}
        style={{ left: `${maxPos}%` }}
        onMouseDown={(e) => handleMouseDown(e, false)}
      />
    </div>
  );
};

export default Slider;
