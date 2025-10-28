import React, { useState, useEffect } from "react";
import { api, /*withAuth*/ } from '../utils/apiClients';
import { Comments, AddComment } from "./Comment";
import { FaHeart, FaRegHeart, FaComment, FaBookmark } from "react-icons/fa";
import '../styles/Post.css';
import { useSocket } from '../context/SocketContext';
// import { authCookies } from '../utils/cookieUtils';
import { useAuth } from "../context/AuthContext";

const Post = ({ post, onDelete }) => {
    const { _id, description, author, createdAt, comments, likes = [], tags = [], saved = [] } = post;
    const [postComments, setPostComments] = useState(comments || []);
    const [showComments, setShowComments] = useState(false);
    const [likesCount, setLikesCount] = useState(likes.length);
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const { socket } = useSocket();
    const { user } = useAuth();
    const isOwner = user && post.author?._id === user._id;
    const isProfilePage = window.location.pathname.includes("/profile");

    // Controlla se l'utente ha già messo like o salvato il post
    useEffect(() => {
        const checkIfSaved = async () => {
            try {
                // const token = authCookies.getAuthToken(); // Ottieni il token da cookies
                // if (!token) return;
                const userData = await api.get('/api/users/profile'); //withAuth(token));

                if (userData.data && userData.data._id) {
                    setIsSaved(saved.includes(userData.data._id)); // Controlla se l'ID dell'utente è nell'array saved e aggiorna lo stato
                }
            } catch (error) {
                console.error('Error checking saved status:', error);
            }
        };
        const checkIfLiked = async () => {
            try {
                // const token = authCookies.getAuthToken(); // Ottieni il token da cookies
                // if (!token) return;

                const userData = await api.get('/api/users/profile'); //withAuth(token));

                if (userData.data && userData.data._id) {
                    setIsLiked(likes.includes(userData.data._id)); // Controlla se l'ID dell'utente è nell'array likes e aggiorna lo stato
                }
            } catch (error) {
                console.error('Error checking like status:', error);
            }
        };

        checkIfLiked();
        checkIfSaved();
    }, [likes, saved]);

    const handleLike = async () => {
        try {
            // Aggiorna subito lo stato locale per feedback immediato
            setIsLiked(prev => !prev);
            setLikesCount(prev => (isLiked ? prev - 1 : prev + 1));

            const response = await api.post(`/api/posts/${_id}/like`);

            // Se il backend ritorna il conteggio aggiornato, aggiorna i valori con quelli "ufficiali"
            if (response.data?.likes !== undefined) {
                setLikesCount(response.data.likes);
            }
            if (response.data?.isLiked !== undefined) {
                setIsLiked(response.data.isLiked);
            }

        } catch (error) {
            console.error("Error liking post:", error);
            // In caso di errore, rollback dello stato locale
            setIsLiked(prev => !prev);
            setLikesCount(prev => (isLiked ? prev + 1 : prev - 1));
        }
    };


    const handleCommentAdded = (newComment) => {
        setPostComments([...postComments, newComment]); // Aggiungi il nuovo commento alla lista dei commenti lasciando invariata la precedente tramite lo spread operator "..."
    };

    // Funzione per formattare la data in modo leggibile
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }; // Opzioni per formattare la data
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleSave = async () => {
        try {
            setIsSaved(prev => !prev); // feedback immediato

            const response = await api.post(`/api/posts/${_id}/save`);

            if (response.data?.isSaved !== undefined) {
                setIsSaved(response.data.isSaved);
            }

        } catch (error) {
            console.error("Error saving post:", error);
            setIsSaved(prev => !prev); // rollback in caso di errore
        }
    };



    // Gestione dei commenti in tempo reale tramite socket
    useEffect(() => {

        if (!socket) return;

        socket.on('new-comment', (newComment) => {
            setPostComments(prev => [...prev, newComment]); // Aggiungi il nuovo commento alla lista dei commenti lasciando invariata la precedente tramite lo spread operator "..."
        });
        return () => socket.off('new-comment'); // Pulisci il listener quando il componente si smonta o socket cambia
    }, [socket]);

    return (
        <div className="post">
            <div className="post-header">
                <span className="post-author">
                    {author?.username || 'Unknown User'}
                </span>
                <span className="post-date">
                    {formatDate(createdAt)}
                </span>
            </div>

            <div className="post-content">
                {description}
            </div>

            {tags && tags.length > 0 && (
                <div className="post-tags">
                    {tags.map((tag, index) => (
                        <span key={index} className="tag">#{tag}</span>
                    ))}
                </div>
            )}

            <div className="post-actions">
                <button
                    className={`action-button ${isLiked ? 'liked' : ''}`}
                    onClick={handleLike}
                    aria-label={isLiked ? "Rimuovi Mi piace" : "Mi piace"}
                >
                    <span className="button-text">Mi piace</span>
                    {isLiked ? (
                        <FaHeart className="action-icon" />
                    ) : (
                        <FaRegHeart className="action-icon" />
                    )}
                    <span className="count-badge">{likesCount}</span>
                </button>

                <button
                    className="action-button"
                    onClick={() => setShowComments(!showComments)}
                >
                    <span className="button-text">Commenti</span>
                    <FaComment className="action-icon" />
                    <span className="count-badge">{postComments.length}</span>
                </button>
                <button className={`action-button ${isSaved ? 'saved' : ''}`} onClick={handleSave}>
                    <span>{isSaved ? "Salvato" : "Salva"}</span>
                    <FaBookmark className="action-icon" />
                </button>
                {isOwner && isProfilePage && (
                    <button
                        className="delete-btn"
                        onClick={() => onDelete(post._id)}
                        title="Elimina post"
                    >
                        <span className="button-text">Elimina</span>
                    </button>
                )}
            </div>

            {showComments && (
                <div className="comments-container">
                    <Comments comments={postComments} />
                    <AddComment postId={_id} onCommentAdded={handleCommentAdded} />
                </div>
            )}
        </div>
    );
};

export default Post;