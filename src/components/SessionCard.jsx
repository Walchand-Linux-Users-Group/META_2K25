import React, { useState, useEffect, useRef } from "react";
import "./CardSlider.css";

const BODY_BACKGROUNDS = ["#8850FF", "#FFBA00", "#4054FF"];

const CardSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const cardsRef = useRef([]);
  const sliderRef = useRef(null);

  const handleStart = (e) => {
    setIsDragging(true);
    const x = e.pageX || e.touches[0].pageX;
    setStartX(x);
    setCurrentX(x);
  };

  const handleMove = (e) => {
    if (!isDragging) return;

    const x = e.pageX || e.touches[0].pageX;
    setCurrentX(x);

    const diff = startX - x;
    const card = cardsRef.current[currentIndex];
    if (card) {
      card.style.transform = `translateX(${-diff}px)`;
    }
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const diff = startX - currentX;
    const threshold = window.innerWidth / 4;

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentIndex < cardsRef.current.length - 1) {
        slideTo(currentIndex + 1);
      } else if (diff < 0 && currentIndex > 0) {
        slideTo(currentIndex - 1);
      } else {
        resetCardPosition();
      }
    } else {
      resetCardPosition();
    }
  };

  const slideTo = (index) => {
    setCurrentIndex(index);
    updateBackground(index);
  };

  const resetCardPosition = () => {
    const card = cardsRef.current[currentIndex];
    if (card) {
      card.style.transition = "transform 0.5s ease-out";
      card.style.transform = "translateX(0)";
      setTimeout(() => {
        card.style.transition = "";
      }, 500);
    }
  };

  const updateBackground = (index) => {
    document.body.style.backgroundColor = BODY_BACKGROUNDS[index];
  };

  useEffect(() => {
    const handleResize = () => resetCardPosition();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    updateBackground(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    const handleTouchStart = (e) => handleStart(e);
    const handleTouchMove = (e) => handleMove(e);
    const handleTouchEnd = () => handleEnd();

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    document.addEventListener("mousedown", handleStart);
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);

      document.removeEventListener("mousedown", handleStart);
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleEnd);
    };
  }, [isDragging, currentIndex, startX, currentX]);

  return (
    <div className="slider-wrapper" ref={sliderRef}>
      <div className="cards-placeholder">
        {BODY_BACKGROUNDS.map((_, index) => (
          <div
            key={index}
            className={`cards-placeholder__item ${
              index === currentIndex ? "cards-placeholder__item--active" : ""
            }`}
          ></div>
        ))}
      </div>

      <div className="cards-container">
        {BODY_BACKGROUNDS.map((_, index) => (
          <div
            key={index}
            ref={(el) => (cardsRef.current[index] = el)}
            className={`card ${
              index === currentIndex
                ? "card--active"
                : index < currentIndex
                ? "card--prev"
                : "card--next"
            }`}
          >
            <div className="card__content">
              <h3>Card {index + 1}</h3>
              <p>This is card {index + 1} content.</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardSlider;
