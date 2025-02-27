import React from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import '../styles/FloatingActionButton.css';

const FloatingActionButton = ({ onClick }) => {
  return (
    <button 
      className="floating-action-button"
      onClick={onClick}
      aria-label="Create new post"
    >
      <FaPencilAlt />
    </button>
  );
};

export default FloatingActionButton;