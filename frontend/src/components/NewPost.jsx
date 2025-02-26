import React, { useState } from "react";
import axios from 'axios';


const CreatePost = ({ onPostCreated }) => {
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const hanldeSubmit = async (e) => {
        e.preventDefault();
        if (!description.trim()) {
            setError('Post cannot be empty');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in to create a post');
                return;
            }
            const response = await axios.post('http://localhost:3000/api/posts', { description }, {
                headers: { 'Authorization': `Bearer ${token}` }
            }
            );
            setDescription('');
            if (onPostCreated) onPostCreated(response.data);
        } catch (error) {
            console.error('Error creating post: ', error);
            setError(error.response?.data?.message || 'Failed to create post');
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="create-post">
            <h3>Create nee Post</h3>
            <form onSubmit={hanldeSubmit}>
                <div className="input-area">
                    <textarea
                        placeholder="What's on your mind?"
                        value={description}
                        onChange={() => setDescription(e.target.value)} maxLength={1000} />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="post-button" disabled={loading}>
                    {loading ? 'Posting...' : 'Post'}
                </button>
            </form>
        </div>
    );
};

export default CreatePost;