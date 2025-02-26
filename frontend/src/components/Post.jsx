import React, { useState } from "react";
import axios from 'axios';
import { Comments, AddComment } from "./Comments";
import '../styles/Post.css';

const Post = ({ post }) => {
    const { _id, description, author, createdAt, comments } = post;
    const [postComments, setPostComments] = useState(comments || []);
    const [showComments, setShowComments] = useState(false);
    const [likesCount, setLikesCount] = useState(post.likes ? post.likes.length : 0);
    const [isLiked, setIsLiked] = useState(false); // Would need to check against current user

    const handleLike = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            await axios.post(
                `http://localhost:3000/api/posts/${_id}/like`,
                {},
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
            setIsLiked(!isLiked);
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleCommentAdded = (newComment) => {
        setPostComments([...postComments, newComment]);
    };

    return (
        <div className="post">
            <div className="post-header">
                <span className="post-author">
                    {author.username}
                </span>
                <span className="post-date">
                    {new Date(createdAt).toLocaleDateString()}
                </span>
            </div>
            <div className="post-content">
                {description}
            </div>
            <div className="post-actions">
                <button
                    className={`action-button ${isLiked ? 'liked' : ''}`}
                    onClick={handleLike}
                >
                    {isLiked ? 'Liked' : 'Like'} ({likesCount})
                </button>
                <button
                    className="action-button"
                    onClick={() => setShowComments(!showComments)}
                >
                    Comments ({postComments.length})
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