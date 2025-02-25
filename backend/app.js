require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
//const http = require('http');
//const { Server } = require('socket.io');

const userRoutes = require("./routes/usersRoutes");
const postRoutes = require("./routes/postRoutes");


const app = express();

app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    }),
);


app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);


mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

/* WebSocket da implementare più tardi
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('Client connected');
});
*/
const PORT = process.env.PORT || 3000;
// Avvio Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server in ascolto su porta ${PORT}`);
}).on('error', (err) => {
    console.error('Errore durante l\'avvio del server:', err);
});
