import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/SideBar";
import Navbar from "../components/NavBar";
import PostList from "../components/PostList";
import FloatingActionButton from "../components/FloatingActionButton";
import PostModal from "../components/PostModal";
import "../styles/HomePage.css";

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [refreshPosts, setRefreshPosts] = useState(false);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);

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

    const openPostModal = () => {
        setIsPostModalOpen(true);
    };

    const closePostModal = () => {
        setIsPostModalOpen(false);
    };

    return (
        <div className="home-container">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <div className="content-wrapper">
                    <PostList refreshTrigger={refreshPosts} />
                </div>
            </div>
            
            {/* Floating Action Button for creating a new post */}
            <FloatingActionButton onClick={openPostModal} />
            
            {/* Post Creation Modal */}
            <PostModal 
                isOpen={isPostModalOpen} 
                onClose={closePostModal} 
                onPostCreated={handlePostCreated} 
            />
        </div>
    );
};

export default Home;