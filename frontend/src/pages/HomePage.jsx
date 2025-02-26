import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/SideBar";
import Navbar from "../components/NavBar";
import CreatePost from "../components/CreatePost";
import PostList from "../components/PostList";
import "../styles/HomePage.css";

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [refreshPosts, setRefreshPosts] = useState(false);

    useEffect(() => {
        // Redirect to login if not authenticated
        if (!user && !localStorage.getItem('token')) {
            navigate('/');
        }
    }, [user, navigate]);

    // If still checking authentication status, show loading
    if (!user && localStorage.getItem('token')) {
        return <div className="loading">Loading...</div>;
    }

    const handlePostCreated = (newPost) => {
        // Trigger a refresh of the post list
        setRefreshPosts(prev => !prev);
    };

    return (
        <div className="home-container">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <div className="content-wrapper">
                    <CreatePost onPostCreated={handlePostCreated} />
                    <PostList refreshTrigger={refreshPosts} />
                </div>
            </div>
        </div>
    );
};

export default Home;