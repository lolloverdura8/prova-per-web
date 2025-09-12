import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/SideBar";
import Navbar from "../components/NavBar";
import PostList from "../components/PostList";
import FloatingActionButton from "../components/FloatingActionButton";
import PostModal from "../components/PostModal";
import "../styles/HomePage.css";
import { authCookies } from "../utils/cookieUtils";

const Saved = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [refreshPosts, setRefreshPosts] = useState(false);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);

    // Redirect se non autenticato
    useEffect(() => {
        if (!user && !authCookies.getAuthToken()) {
            navigate('/');
        }
    }, [user, navigate]);

    if (!user && authCookies.getAuthToken()) {
        return <div className="loading">Loading...</div>;
        // Mostra un indicatore di caricamento se l'utente non è ancora caricato
    }

    const handlePostCreated = () => setRefreshPosts(prev => !prev);
    const openPostModal = () => setIsPostModalOpen(true);
    const closePostModal = () => setIsPostModalOpen(false);

    return (
        <div className="home-container">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <div className="content-wrapper">
                    <h2>Post salvati</h2>
                    <PostList savedMode refreshTrigger={refreshPosts} />
                </div>
            </div>
            <FloatingActionButton onClick={openPostModal} />
            <PostModal
                isOpen={isPostModalOpen}
                onClose={closePostModal}
                onPostCreated={handlePostCreated}
            />
        </div>
    );
};

export default Saved;