import React from "react";
import '../styles/Post.css';

const Post = ({ post }) => {
    const { description, author, createdAt } = post;
    return (
        <div className="post">
            <div className="post-header">
                <span className="post-author">
                    {author.username}
                </span>
                <span className="post-date">
                    {new Date(createdAt).toLocaleDateString}
                </span>
                <div className="post-content">
                    {description}
                </div>
                <div className="post-action">
                    <button className="action-button">Like</button>
                    <button className="action-button">Comment</button>
                </div>
            </div>
        </div>
    );
};

export default Post;