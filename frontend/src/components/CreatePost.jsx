import React, { useState } from "react";
import axios from 'axios';
import { FaPencilAlt, FaTimes, FaExclamationCircle, FaPaperPlane } from "react-icons/fa";
import '../styles/CreatePost.css';

const CreatePost = ({ onPostCreated }) => {
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const resetForm = () => {
        setDescription('');
        setTags('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description.trim()) {
            setError('Il post non può essere vuoto');
            return;
        }

        setLoading(true);
        setError('');

        // Processa i tag
        const tagArray = tags
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag !== '');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Devi essere loggato per creare un post');
                setLoading(false);
                return;
            }

            const postData = {
                description,
                tags: tagArray.length > 0 ? tagArray : undefined
            };

            const response = await axios.post(
                'http://localhost:3000/api/posts', 
                postData, 
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
            
            resetForm();
            
            if (onPostCreated) {
                onPostCreated(response.data);
            }
        } catch (error) {
            console.error('Errore nella creazione del post: ', error);
            setError(error.response?.data?.message || 'Impossibile creare il post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-post">
            <h3><FaPencilAlt /> Crea nuovo post</h3>
            <form onSubmit={handleSubmit}>
                <div className="input-area">
                    <textarea
                        placeholder="Cosa stai pensando?"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} 
                        maxLength={1000} 
                    />
                </div>
                
                <div className="input-area tags-input">
                    <input 
                        type="text" 
                        placeholder="Aggiungi tag (separati da virgola)" 
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />
                    <small className="helper-text">Esempio: musica, sport, tecnologia</small>
                </div>
                
                {error && (
                    <p className="error-message">
                        <FaExclamationCircle /> {error}
                    </p>
                )}
                
                <div className="post-actions">
                    <button 
                        type="button" 
                        className="cancel-button" 
                        onClick={resetForm}
                    >
                        <FaTimes /> Annulla
                    </button>
                    <button 
                        type="submit" 
                        className="post-button" 
                        disabled={loading}
                    >
                        {loading ? 'Pubblicando...' : (
                            <>
                                <FaPaperPlane /> Pubblica
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;