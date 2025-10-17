import React, { useState } from "react";
import '../styles/Comment.css';
// import { authCookies } from '../utils/cookieUtils';
import { api, /*withAuth*/ } from '../utils/apiClients';

// Comments display component
const Comments = ({ comments = [] }) => {
    if (comments.length === 0) return null;

    return (
        <div className="comments-section">
            <h4>Comments</h4>
            {/* Lista dei commenti */}
            {comments.map((comment, index) => (
                <div key={index} className="comment">
                    <div className="comment-header">
                        <div className="comment-author-info">
                            <span className="comment-author">{comment.user?.username}</span> {/* Usa l'operatore di chaining opzionale per evitare errori se user è undefined */}
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
            // const token = authCookies.getAuthToken();
            // if (!token) {
            //     setError('You must be logged in to comment');
            //     return;
            // }

            const response = await api.post(
                `/api/posts/${postId}/comments`,
                { text }
                // //withAuth(token)
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