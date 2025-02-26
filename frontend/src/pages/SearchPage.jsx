import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/SideBar";
import Navbar from "../components/NavBar";
import Post from "../components/Post";
import { FaSearch, FaTimes } from "react-icons/fa";
import "../styles/SearchPage.css";

const SearchPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Autenticare l'utente quando la pagina si carica
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        }
    }, [navigate]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        setSearched(true);
        setError("");

        try {
            const response = await axios.get(`http://localhost:3000/api/posts/search?query=${encodeURIComponent(searchQuery)}`);
            
            // Assicuriamoci che i commenti abbiano informazioni complete sugli utenti
            const posts = response.data;
            
            // Popolare i commenti con i dati dell'utente per ciascun post
            const populatedPosts = await Promise.all(posts.map(async (post) => {
                if (post.comments && post.comments.length > 0) {
                    try {
                        const commentResponse = await axios.get(`http://localhost:3000/api/posts/${post._id}/comments`);
                        return {
                            ...post,
                            comments: commentResponse.data
                        };
                    } catch (error) {
                        console.error(`Errore nel caricare i commenti per il post ${post._id}:`, error);
                        return post;
                    }
                }
                return post;
            }));
            
            setSearchResults(populatedPosts);
        } catch (error) {
            console.error("Errore durante la ricerca:", error);
            setError("Si è verificato un errore durante la ricerca. Riprova più tardi.");
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchQuery("");
        setSearchResults([]);
        setSearched(false);
        setError("");
    };

    return (
        <div className="home-container">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <div className="content-wrapper">
                    <div className="search-container">
                        <h2>Cerca Post</h2>
                        <form onSubmit={handleSearch} className="search-form">
                            <div className="search-input-container">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cerca nei post..."
                                    className="search-input"
                                />
                                {searchQuery && (
                                    <button 
                                        type="button" 
                                        className="clear-search-btn"
                                        onClick={clearSearch}
                                    >
                                        <FaTimes />
                                    </button>
                                )}
                            </div>
                            <button type="submit" className="search-button">
                                <FaSearch /> Cerca
                            </button>
                        </form>

                        {loading && (
                            <div className="search-loading">
                                Ricerca in corso...
                            </div>
                        )}

                        {error && (
                            <div className="search-error">
                                {error}
                            </div>
                        )}

                        {searched && !loading && !error && (
                            <div className="search-results">
                                <h3>Risultati della ricerca: {searchResults.length} post trovati</h3>
                                {searchResults.length > 0 ? (
                                    <div className="post-list">
                                        {searchResults.map(post => (
                                            <Post key={post._id} post={post} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="no-results">
                                        Nessun post corrisponde alla tua ricerca.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;