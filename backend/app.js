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
const verifyRoutes = require("./routes/verifyRoutes");

const app = express();
const server = http.createServer(app);

// ================= SOCKET.IO =================
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const io = new Server(server, {
    cors: {
        origin: FRONTEND_URL,
        credentials: true
    }
});

io.on("connection", (socket) => {
    socket.on("join", (userId) => {
        socket.join(userId);
        console.log("Socket join stanza");
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

app.set("trust proxy", 1);


app.use(
    cors({
        origin: FRONTEND_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
    })
);

// ================= CSRF PROTECTION =================
const {
    generateToken,
    doubleCsrfProtection,
    invalidCsrfTokenError,
} = doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET || "supersecretkey123",
    cookieName: "x-csrf-token",
    cookieOptions: {
        httpOnly: true,
        sameSite: "none",   // domini diversi (Render <-> Vercel)
        secure: true        // obbligatorio con SameSite=None
    },
    // opzionale ma utile: header standardizzato
    getTokenFromRequest: (req) => req.headers["x-csrf-token"],
});


// Middleware globale CSRF
app.get("/api/csrf-token", (req, res) => {
    try {
        const csrfToken = generateToken(req, res);
        return res.status(200).json({ csrfToken });
    } catch (err) {
        console.error("Errore generazione CSRF:", err);
        return res.status(500).json({ error: "Errore generazione CSRF token" });
    }
});

// Attiva la protezione per le rotte successive
app.use(doubleCsrfProtection);

// (opzionale) handler pulito per errore CSRF
app.use((err, req, res, next) => {
    if (err === invalidCsrfTokenError) {
        return res.status(403).json({ error: "Invalid CSRF token" });
    }
    return next(err);
});

// ================= ROTTE =================
app.use("/api/auth", verifyRoutes);
app.use("/api/users", userRoutes);

app.use("/api/posts", (req, res, next) => {
    req.io = io;
    next();
}, postRoutes);

app.use("/api/notifications", notificationsRoutes);

// ================= DATABASE =================
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

// ================= SERVER =================
const PORT = process.env.PORT || 3000;
server
    .listen(PORT, "0.0.0.0", () => {
        console.log(`Server in ascolto su porta ${PORT}`);
    })
    .on("error", (err) => {
        console.error("Errore durante l'avvio del server:", err);
    });

module.exports = { app, io };
