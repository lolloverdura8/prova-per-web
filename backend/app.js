require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const http = require("http");
const { Server } = require("socket.io");
const { doubleCsrf } = require("csrf-csrf");

// Import delle rotte
const userRoutes = require("./routes/usersRoutes");
const postRoutes = require("./routes/postRoutes");
const notificationsRoutes = require("./routes/notificationsRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// ================= SOCKET.IO =================
io.on("connection", (socket) => {
    socket.on("join", (userId) => {
        socket.join(userId);
        console.log("Socket", socket.id, "join stanza", userId);
    });
    socket.on("connect", () => console.log("Socket connesso!"));
});

app.set("io", io);

// ================= MIDDLEWARE GLOBALI =================
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
    })
);

// ================= CSRF PROTECTION =================
const { generateToken, doubleCsrfProtection } = doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET || "supersecretkey123",
    cookieName: "x-csrf-token",
    cookieOptions: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    },
});

// Middleware globale per protezione CSRF
app.use(doubleCsrfProtection);

// Endpoint per fornire il token CSRF al frontend
app.get("/api/csrf-token", (req, res) => {
    const csrfToken = generateToken(res, req);
    res.json({ csrfToken });
});

// ================= ROTTE =================
app.use("/api/users", userRoutes);

app.use("/api/posts", (req, res, next) => {
    req.io = io;
    next();
}, postRoutes);

app.use("/api/notifications", notificationsRoutes);

// ================= DATABASE =================
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// ================= SERVER =================
const PORT = process.env.PORT || 3000;
server
    .listen(PORT, "0.0.0.0", () => {
        console.log(`🚀 Server in ascolto su porta ${PORT}`);
    })
    .on("error", (err) => {
        console.error("Errore durante l'avvio del server:", err);
    });

module.exports = { app, io };
