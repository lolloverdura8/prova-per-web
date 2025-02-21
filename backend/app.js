//require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
//const { Server } = require('socket.io');
//rotta di user
const userRoutes = require('./routes/userRoutes');

const app = express();


app.use(express.json());
app.use(cors());

//rotta di user
app.use('/api/users', userRoutes);

// Connessione a MongoDB

// WebSocket

// Avvio Server
app.listen(3000, () => {
    console.log('app in ascolto su porta 3000');
})
