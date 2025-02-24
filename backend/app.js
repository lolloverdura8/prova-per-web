require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
//const http = require('http');
//const { Server } = require('socket.io');
//rotta di user
const userRoutes = require("./routes/usersRoutes");

const app = express();

app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    }),
);

//rotta di user
app.use("/api/users", userRoutes);

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

// Avvio Server
app.listen(3000, "0.0.0.0", () => {
    console.log("app in ascolto su porta 3000");
});
