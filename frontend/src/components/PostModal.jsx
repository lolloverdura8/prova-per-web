import React, { useEffect, useRef } from 'react';
import { FaPencilAlt, FaTimes } from 'react-icons/fa';
import CreatePost from './CreatePost';
import '../styles/PostModal.css';

const PostModal = ({ isOpen, onClose, onPostCreated }) => {
  const modalRef = useRef(null);
  
  // Close when clicking outside the modal
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };
  
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'visible';
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="modal-overlay"
      onClick={handleBackdropClick}
    >
      <div 
        className="modal-container"
        ref={modalRef}
      >
        <div className="modal-header">
          <h3 className="modal-title">
            <FaPencilAlt /> Crea nuovo post
          </h3>
          <button 
            className="close-button"
            onClick={onClose}
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>
        <div className="modal-body">
          <CreatePost 
            onPostCreated={(post) => {
              onPostCreated(post);
              onClose();
            }} 
          />
        </div>
      </div>
    </div>
  );
};

export default PostModal;