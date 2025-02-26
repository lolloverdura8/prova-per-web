import React, { useState } from "react";
import axios from 'axios';
import '../styles/CreatePost.css';

const CreatePost = ({ onPostCreated }) => {
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description.trim()) {
            setError('Post cannot be empty');
            return;
        }

        setLoading(true);
        setError('');

        // Process tags
        const tagArray = tags
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag !== '');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in to create a post');
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

            setDescription('');
            setTags('');

            if (onPostCreated) {
                onPostCreated(response.data);
            }
        } catch (error) {
            console.error('Error creating post: ', error);
            setError(error.response?.data?.message || 'Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-post">
            <h3>Create New Post</h3>
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

                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="post-button" disabled={loading}>
                    {loading ? 'Pubblicando...' : 'Pubblica'}
                </button>
            </form>
        </div>
    );
};

export default CreatePost;