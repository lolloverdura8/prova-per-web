import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Comments, AddComment } from "./Comment";
import { FaHeart, FaRegHeart, FaComment, FaBookmark } from "react-icons/fa";
import '../styles/Post.css';
import { useSocket } from '../context/SocketContext';

const Post = ({ post }) => {
    const { _id, description, author, createdAt, comments, likes = [], tags = [], saved = [] } = post;
    const [postComments, setPostComments] = useState(comments || []);
    const [showComments, setShowComments] = useState(false);
    const [likesCount, setLikesCount] = useState(likes.length);
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const { socket } = useSocket();

    // Controlla se l'utente ha già messo like o salvato il post
    useEffect(() => {
        const checkIfSaved = async () => {
            try {
                const token = localStorage.getItem('token'); // Ottieni il token da localStorage per l'autenticazione
                if (!token) return;
                const userData = await axios.get('http://localhost:3000/api/users/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (userData.data && userData.data._id) {
                    setIsSaved(saved.includes(userData.data._id)); // Controlla se l'ID dell'utente è nell'array saved e aggiorna lo stato
                }
            } catch (error) {
                console.error('Error checking saved status:', error);
            }
        };
        const checkIfLiked = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const userData = await axios.get('http://localhost:3000/api/users/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

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
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await axios.post(
                `http://localhost:3000/api/posts/${_id}/like`,
                {},
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            if (response.data) {
                setLikesCount(response.data.likes); // Aggiorna il conteggio dei like
                setIsLiked(response.data.isLiked); // Aggiorna lo stato isLiked 
                post.likes = response.data.likes; // aggiorna il campo likes
            }
        } catch (error) {
            console.error('Error liking post:', error);
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
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await axios.post(
                `http://localhost:3000/api/posts/${_id}/Save`,
                {}, // Corpo della richiesta vuoto
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            if (response.data) {
                setIsSaved(response.data.isSaved);
                post.saved = response.data.saved; // aggiorna il campo saved
            }
        } catch (error) {
            console.error('Error saving post:', error);
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