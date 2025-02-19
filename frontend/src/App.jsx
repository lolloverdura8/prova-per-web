import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

const socket = io("http://localhost:5000");

function App() {
    const [messages, setMessages] = useState([]);
    const [count, setCount] = useState(0);

    useEffect(() => {
        socket.on('receiveData', (data) => {
            setMessages((prev) => [...prev, data]);
        });

        return () => socket.off('receiveData');
    }, []);

    const sendMessage = () => {
        const data = { message: "Nuovo aggiornamento!" };
        socket.emit('sendData', data);
    };

    return (
        <>
            <div>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.jsx</code> and save to test HMR
                </p>
            </div>
            <h2>WebApp in Tempo Reale</h2>
            <button onClick={sendMessage}>Invia Dati</button>
            <ul>
                {messages.map((msg, i) => (
                    <li key={i}>{msg.message}</li>
                ))}
            </ul>
        </>
    );
}

export default App;
