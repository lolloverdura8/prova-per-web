import React, { useEffect, useState } from "react";
import axios from 'axios';
import Post from "./Post";
import '../styles/PostList.css';

const PostList = () => {
    const [post, setPost] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://0.0.0.0:3000/api/posts');
                setPost(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchPosts();

    }, []);

    if (loading) return <div>Loading posts...</div>;

    return (
        <div className="post-list">
            {post.map(post => (<Post key={post._id} post={post} />))}
        </div>
    );
};

export default PostList;