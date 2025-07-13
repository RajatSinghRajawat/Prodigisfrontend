import React, { useRef } from 'react';
import UserCard from './UserCard';
import './UserCardSlider.css';
import { FaGreaterThan } from "react-icons/fa";
import { FaLessThan } from "react-icons/fa";


const SliderC = ({ title, cards, onCardClick }) => {
  const containerRef = useRef(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 300; // Adjust scroll distance as needed
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 300; // Adjust scroll distance as needed
    }
  };

  return (
    <div className="sliderC">
      <h1 className="sliderC-title">{title}</h1>
      <div className="sliderC-wrapper">
        <button className="sliderC-btn sliderC-left" onClick={scrollLeft}>
          <span style={{ fontWeight: 900, fontSize: '2rem'}}>
          <FaLessThan />
          </span>
        </button>
        <div
          className="sliderC-cards-container d-flex gap-3 overflow-auto"
          ref={containerRef}
        >
          {cards.map((card) => (
            <UserCard
              key={card.id}
              card={card}
              onClick={() => onCardClick && onCardClick(card.id)}
            />
          ))}
        </div>
        <button className="sliderC-btn sliderC-right" onClick={scrollRight}>
          <span style={{ fontWeight: 900, fontSize: '2rem'}}><FaGreaterThan />
          </span>
        </button>
      </div>
    </div>
  );
};

export default SliderC;