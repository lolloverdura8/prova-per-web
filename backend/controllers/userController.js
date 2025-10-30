const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();
const crypto = require("crypto");
const nodemailer = require("nodemailer");

module.exports = {
    register: async (req, res) => {
        const { username, email, password } = req.body;
        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Email già in uso" });
            }
            const verificationToken = crypto.randomBytes(32).toString('hex');
            const newUser = new User({ username, email, password });
            await newUser.save();
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
            const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Verifica la tua email',
                html: `<p>Clicca sul link per verificare la tua email: <a href="${verificationLink}">${verificationLink}</a></p>`,
            });
            res.status(201).json({
                message: "Registrazione avvenuta! Controlla la tua email per verificare l'account."
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            console.log("User found for login:", user);
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(400).json({ message: "Credenziali errate" });
            } else if (!user.isVerified) {
                return res.status(400).json({ message: "Account non verificato. Controlla la tua email." });
            }

            console.log("Password verified for user:", user._id);
            // Rimuovi la password dall'oggetto utente
            const userObj = user.toObject();
            delete userObj.password;

            console.log("Generating JWT token for user:", user._id);

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "7d",
            });
            console.log("Login successful, token generated");
            res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 });
            console.log("Cookie set for token");
            res.json({ token, user: userObj });
            console.log("Login response sent");
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    checkuser: async (req, res) => {
        try {
            const users = await User.find({}, { password: 0 });
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getProfile: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password');
            if (!user) {
                return res.status(404).json({ message: 'Utente non trovato' });
            }
            res.json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    updateProfile: async (req, res) => {
        try {
            // Campi consentiti per l'aggiornamento
            const { username, email } = req.body;
            const updateData = {};

            if (username) updateData.username = username;
            if (email) updateData.email = email;

            // Se non ci sono dati da aggiornare
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ message: "Nessun dato da aggiornare" });
            }

            const user = await User.findByIdAndUpdate(
                req.user.id,
                updateData,
                { new: true }
            ).select('-password');

            if (!user) {
                return res.status(404).json({ message: "Utente non trovato" });
            }

            res.json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    logout: (req, res) => {
        res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Lax' });
        res.json({ message: 'Logout effettuato con successo' });
        console.log("Logout effettuato con successo");
    }
};