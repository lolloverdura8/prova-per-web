import React, { useState } from "react";
import axios from 'axios';
import '../styles/Comment.css';

// Comments display component
const Comments = ({ comments = [] }) => {
    if (comments.length === 0) return null;

    return (
        <div className="comments-section">
            <h4>Comments</h4>
            {comments.map((comment, index) => (
                <div key={index} className="comment">
                    <div className="comment-header">
                        <div className="comment-author-info">
                            <span className="comment-author">{comment.user?.username}</span>
                        </div>
                        <span className="comment-date">
                            {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="comment-content">{comment.text}</div>
                </div>
            ))}
        </div>
    );
};

// Add comment component
const AddComment = ({ postId, onCommentAdded }) => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in to comment');
                return;
            }

            const response = await axios.post(
                `http://localhost:3000/api/posts/${postId}/comments`,
                { text },
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            setText('');
            if (onCommentAdded) onCommentAdded(response.data);
        } catch (error) {
            console.error('Error adding comment:', error);
            setError(error.response?.data?.message || 'Failed to add comment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-comment">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Add a comment..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                {error && <p className="error-message">{error}</p>}
                <button
                    type="submit"
                    disabled={loading || !text.trim()}
                >
                    {loading ? '...' : 'Comment'}
                </button>
            </form>
        </div>
    );
};

export { Comments, AddComment };