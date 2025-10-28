import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { api } from "../utils/apiClients";
import Post from "./Post";
import Autocomplete from "./AutoComplete";
import "../styles/PostList.css";

const DEFAULT_LIMIT = 10;

const PostList = ({ refreshTrigger, savedMode }) => {
    // Data
    const [filteredPosts, setFilteredPosts] = useState([]);

    // UI state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Filters
    const [userFilter, setUserFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [tagFilter, setTagFilter] = useState("");
    const [dateInput, setDateInput] = useState(null);

    // Facets (autocomplete)
    const [uniqueAuthors, setUniqueAuthors] = useState([]);
    const [uniqueTags, setUniqueTags] = useState([]);

    // Pagination
    const [page, setPage] = useState(1);
    const [limit] = useState(DEFAULT_LIMIT);
    const [hasMore, setHasMore] = useState(true);

    // Guard
    const fetchingRef = useRef(false);

    const basePath = savedMode ? "/api/posts/saved" : "/api/posts";

    // ------- Helpers -------
    const buildQuery = () => {
        const params = new URLSearchParams();
        if (userFilter) params.append("author", userFilter);
        if (dateFilter) params.append("date", dateFilter);
        if (tagFilter) params.append("tag", tagFilter);
        params.append("page", page);
        params.append("limit", limit);
        return params.toString();
    };

    const updateFacetsFrom = (items) => {
        const authors = [...new Set(items.map(p => p.author?.username).filter(Boolean))];
        const tags = [...new Set(items.flatMap(p => p.tags || []).filter(Boolean))];
        setUniqueAuthors(prev => [...new Set([...prev, ...authors])]);
        setUniqueTags(prev => [...new Set([...prev, ...tags])]);
    };

    const appendFromResponse = (respData) => {
        // Backend shape: { success, data, pagination: { currentPage, totalPages, totalItems, pageSize } }
        const newPosts = respData?.data || [];
        const pagination = respData?.pagination;

        setFilteredPosts(prev => [...prev, ...newPosts]);
        updateFacetsFrom(newPosts);

        if (pagination) {
            setHasMore(pagination.currentPage < pagination.totalPages);
        } else {
            // fallback se manca pagination
            setHasMore(newPosts.length === limit);
        }
    };

    const resetList = () => {
        setFilteredPosts([]);
        setUniqueAuthors([]);
        setUniqueTags([]);
        setPage(1);
        setHasMore(true);
        setError("");
    };

    // ------- Fetchers -------
    const fetchPage = async () => {
        if (fetchingRef.current || !hasMore) return;
        fetchingRef.current = true;
        setLoading(true);
        setError("");

        try {
            const hasFilters = !!(userFilter || dateFilter || tagFilter);
            const qs = buildQuery();
            const url = hasFilters ? `${basePath}/filter?${qs}` : `${basePath}?${qs}`;

            const resp = await api.get(url);
            appendFromResponse(resp.data);
        } catch (err) {
            console.error("Error fetching posts:", err);
            setError("Errore nel caricamento dei post.");
        } finally {
            setLoading(false);
            fetchingRef.current = false;
        }
    };

    // ------- Effects -------
    // 1) Cambio savedMode / refresh esterno → reset e ricarica pagina 1
    useEffect(() => {
        resetList();
        // page cambia a 1, l'effetto sotto farà fetch
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [savedMode, refreshTrigger]);

    // 2) Cambio date picker → aggiorna dateFilter (string YYYY-MM-DD)
    const onDateChange = (date) => {
        setDateInput(date);
        if (date) {
            const formatted = date.toISOString().slice(0, 10);
            setDateFilter(formatted);
        } else {
            setDateFilter("");
        }
    };

    // 3) Cambio filtri → reset e ricarica pagina 1
    useEffect(() => {
        resetList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userFilter, dateFilter, tagFilter]);

    // 4) Ogni volta che cambia page → carica quella pagina
    useEffect(() => {
        fetchPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    // ------- Infinite scroll (opzionale) -------
    const sentinelRef = useRef(null);
    useEffect(() => {
        if (!sentinelRef.current) return;
        const io = new IntersectionObserver(
            entries => {
                const first = entries[0];
                if (first.isIntersecting && hasMore && !loading) {
                    setPage(p => p + 1);
                }
            },
            { rootMargin: "200px" }
        );
        io.observe(sentinelRef.current);
        return () => io.disconnect();
    }, [hasMore, loading]);

    // ------- Handlers -------
    const clearFilters = () => {
        setUserFilter("");
        setDateFilter("");
        setDateInput(null);
        setTagFilter("");
    };

    // ------- Render -------
    const showEmpty = !loading && filteredPosts.length === 0;

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
                        <DatePicker
                            id="date-filter"
                            selected={dateInput}
                            onChange={onDateChange}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Seleziona una data"
                            isClearable
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

                    <button className="clear-filters-btn" onClick={clearFilters}>
                        Cancella Filtri
                    </button>
                </div>
            </div>

            <div className="post-list">
                {filteredPosts.map((post) => (
                    <Post key={post._id} post={post} />
                ))}

                {loading && <div className="loading-container">Caricamento post...</div>}
                {error && !loading && <div className="error-container">{error}</div>}
                {showEmpty && (
                    <div className="no-posts">
                        {userFilter || dateFilter || tagFilter
                            ? "Nessun post corrisponde ai tuoi filtri. Prova con criteri diversi."
                            : "Nessun post disponibile ancora. Sii il primo a crearne uno!"}
                    </div>
                )}

                {/* Bottone fallback se vuoi evitare lo scroll automatico (puoi tenerlo anche insieme) */}
                {!loading && hasMore && (
                    <button className="load-more-btn" onClick={() => setPage(p => p + 1)}>
                        Carica altri
                    </button>
                )}

                {/* Sentinel per l'infinite scroll (opzionale) */}
                <div ref={sentinelRef} />
            </div>
        </div>
    );
};

export default PostList;
