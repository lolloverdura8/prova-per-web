import React from "react";
import Sidebar from "../components/SideBar";
import Navbar from "../components/NavBar";
import "../styles/HomePage.css";
import PostList from "../components/PostList";

const Home = () => {
    return (
        <div className="home-container">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <PostList />
            </div>
        </div>
    );
};

export default Home;
