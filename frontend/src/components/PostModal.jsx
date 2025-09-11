import React, { useEffect, useRef } from 'react';
import { FaPencilAlt, FaTimes } from 'react-icons/fa';
import CreatePost from './CreatePost';
import '../styles/PostModal.css';

// Componente modal per creare un nuovo post

const PostModal = ({ isOpen, onClose, onPostCreated }) => {
  const modalRef = useRef(null); // Ref per il contenitore del modal

  // gestione click esterni al modal

  // chiudi il modal se si clicca fuori
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  // gestione tasto ESC e scroll del body
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Aggiungi o rimuovi listener e gestisci lo scroll del body
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // previeni lo scroll del body quando il modal è aperto
      document.body.style.overflow = 'hidden';
    }

    // Pulizia all'unmount o quando isOpen cambia
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