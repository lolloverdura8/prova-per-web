import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/SideBar";
import Navbar from "../components/NavBar";
import CreatePost from "../components/NewPost";
import PostList from "../components/PostList";
import "../styles/HomePage.css";

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

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

    return (
        <div className="home-container">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <div className="content-wrapper">
                    <CreatePost />
                    <PostList />
                </div>
            </div>
        </div>
    );
};

export default Home;