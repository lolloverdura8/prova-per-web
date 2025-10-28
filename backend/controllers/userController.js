const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();

module.exports = {
    register: async (req, res) => {
        const { username, email, password } = req.body;
        try {
            const newUser = new User({ username, email, password });
            await newUser.save();
            res.status(201).json({ message: "Utente registrato" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(400).json({ message: "Credenziali errate" });
            }

            // Rimuovi la password dall'oggetto utente
            const userObj = user.toObject();
            delete userObj.password;

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "7d",
            });
            res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 });
            res.json({ token, user: userObj });
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