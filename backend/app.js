require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); 
const { Server } = require('socket.io');
//rotta di user
const userRoutes = require('./routes/userRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });


app.use(express.json());
app.use(cors());

//rotta di user
app.use('/api/users', userRoutes);

// Connessione a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connesso'))
.catch(err => console.log(err));

// WebSocket
io.on('connection', (socket) => {
    console.log('Utente connesso:', socket.id);

    socket.on('sendData', (data) => {
        io.emit('receiveData', data);
    });

    socket.on('disconnect', () => console.log('Utente disconnesso:', socket.id));
});

// Avvio Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server in ascolto sulla porta ${PORT}`));
