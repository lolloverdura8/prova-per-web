import React, { useState } from "react";
import axios from 'axios';


const CreatePost = ({ onPostCreated }) => {
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const hanldeSubmit = async (e) => {
        e.preventDefault();
        if (!description.trim()) {
            setError('Post cannot be empty');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in to create a post');
                return;
            }
            const response = await axios.post('http://localhost:3000/api/posts', { description }, {
                headers: { 'Authorization': `Bearer ${token}` }
            }
            );
        } catch (error) {

        }
    }
}