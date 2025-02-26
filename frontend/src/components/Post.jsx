import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Comments, AddComment } from "./Comment";
import { FaHeart, FaRegHeart, FaComment } from "react-icons/fa";
import '../styles/Post.css';

const Post = ({ post }) => {
    const { _id, description, author, createdAt, comments, likes = [], tags = [] } = post;
    const [postComments, setPostComments] = useState(comments || []);
    const [showComments, setShowComments] = useState(false);
    const [likesCount, setLikesCount] = useState(likes.length);
    const [isLiked, setIsLiked] = useState(false);

    // Check if the current user has liked this post
    useEffect(() => {
        const checkIfLiked = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const userData = await axios.get('http://localhost:3000/api/users/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (userData.data && userData.data._id) {
                    setIsLiked(likes.includes(userData.data._id));
                }
            } catch (error) {
                console.error('Error checking like status:', error);
            }
        };

        checkIfLiked();
    }, [likes]);

    const handleLike = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await axios.post(
                `http://localhost:3000/api/posts/${_id}/like`,
                {},
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            if (response.data) {
                setLikesCount(response.data.likes);
                setIsLiked(response.data.isLiked);
            }
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleCommentAdded = (newComment) => {
        setPostComments([...postComments, newComment]);
    };

    // Format date to be more readable
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="post">
            <div className="post-header">
                <span className="post-author">
                    {author?.username || 'Unknown User'}
                </span>
                <span className="post-date">
                    {formatDate(createdAt)}
                </span>
            </div>

            <div className="post-content">
                {description}
            </div>

            {tags && tags.length > 0 && (
                <div className="post-tags">
                    {tags.map((tag, index) => (
                        <span key={index} className="tag">#{tag}</span>
                    ))}
                </div>
            )}

            <div className="post-actions">
                <button
                    className={`action-button ${isLiked ? 'liked' : ''}`}
                    onClick={handleLike}
                    aria-label={isLiked ? "Rimuovi Mi piace" : "Mi piace"}
                >
                    <span className="button-text">Mi piace</span>
                    {isLiked ? (
                        <FaHeart className="action-icon" />
                    ) : (
                        <FaRegHeart className="action-icon" />
                    )}
                    <span className="count-badge">{likesCount}</span>
                </button>
                
                <button
                    className="action-button"
                    onClick={() => setShowComments(!showComments)}
                >
                    <span className="button-text">Commenti</span>
                    <FaComment className="action-icon" />
                    <span className="count-badge">{postComments.length}</span>
                </button>
            </div>

            {showComments && (
                <div className="comments-container">
                    <Comments comments={postComments} />
                    <AddComment postId={_id} onCommentAdded={handleCommentAdded} />
                </div>
            )}
        </div>
    );
};

export default Post;