import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ballpageRegbutton.css';

const BallRegbutton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/register');
  };

  return (
    <div className="ctn top-right-button">
      <button onClick={handleClick} className="button b-pink">
        Register
      </button>
    </div>
  );
};

export default BallRegbutton;