import React, { useEffect, useState } from "react";
import axios from 'axios';
import Post from "./Post";
import Autocomplete from "./AutoComplete";
import { FaTimes } from "react-icons/fa";
import '../styles/PostList.css';

const PostList = ({ refreshTrigger }) => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filter states
    const [userFilter, setUserFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [tagFilter, setTagFilter] = useState('');

    // Get unique authors from posts
    const uniqueAuthors = [...new Set(posts.map(post => post.author?.username).filter(Boolean))];

    // Get unique tags from posts
    const uniqueTags = [...new Set(posts.flatMap(post => post.tags || []).filter(Boolean))];

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get('http://localhost:3000/api/posts');
                if (response.data) {
                    setPosts(response.data);
                    setFilteredPosts(response.data);
                } else {
                    setError('No posts found');
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
                setError('Failed to load posts. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [refreshTrigger]); // Re-fetch when refreshTrigger changes

    // Apply filters whenever filter states or posts change
    useEffect(() => {
        let result = [...posts];

        // Filter by user
        if (userFilter) {
            result = result.filter(post =>
                post.author?.username?.toLowerCase() === userFilter.toLowerCase()
            );
        }

        // Filter by date
        if (dateFilter) {
            const filterDate = new Date(dateFilter);
            result = result.filter(post => {
                const postDate = new Date(post.createdAt);
                return (
                    postDate.getFullYear() === filterDate.getFullYear() &&
                    postDate.getMonth() === filterDate.getMonth() &&
                    postDate.getDate() === filterDate.getDate()
                );
            });
        }

        // Filter by tag
        if (tagFilter) {
            result = result.filter(post =>
                post.tags && post.tags.includes(tagFilter)
            );
        }

        setFilteredPosts(result);
    }, [posts, userFilter, dateFilter, tagFilter]);

    const clearFilters = () => {
        setUserFilter('');
        setDateFilter('');
        setTagFilter('');
    };

    const formatDate = (date) => {
        if (!date) return '';
        // Format date as DD/MM/YYYY
        const d = new Date(date);
        return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
    };

    if (loading) return <div className="loading-container">Caricamento post...</div>;
    if (error) return <div className="error-container">{error}</div>;

    return (
        <div className="post-list-container">
            <div className="filter-container">
                <h3>Filtra Post</h3>
                <div className="filter-controls">
                    <Autocomplete
                        id="user-filter"
                        options={uniqueAuthors}
                        value={userFilter}
                        onChange={setUserFilter}
                        placeholder="Cerca un autore..."
                        label="Per Autore:"
                    />

                    <div className="filter-group">
                        <label htmlFor="date-filter">Per Data:</label>
                        <input
                            type="date"
                            id="date-filter"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                        />
                    </div>

                    <Autocomplete
                        id="tag-filter"
                        options={uniqueTags}
                        value={tagFilter}
                        onChange={setTagFilter}
                        placeholder="Cerca un tag..."
                        label="Per Tag:"
                    />

                    <button
                        className="clear-filters-btn"
                        onClick={clearFilters}
                    >
                        Cancella Filtri
                    </button>
                </div>
            </div>

            <div className="post-list">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map(post => (<Post key={post._id} post={post} />))
                ) : (
                    <div className="no-posts">
                        {userFilter || dateFilter || tagFilter
                            ? "Nessun post corrisponde ai tuoi filtri. Prova con criteri diversi."
                            : "Nessun post disponibile ancora. Sii il primo a crearne uno!"}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostList;