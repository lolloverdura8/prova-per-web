const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

router.get("/verify-email", async (req, res) => {
    try {
        const { token } = req.query;
        const user = await User.findOne({ verificationToken: token });
        if (!user) return res.status(400).send("Token non valido o scaduto");

        user.isVerified = true;
        await user.save();
        res.status(200).json({ success: true, message: "Email verificata con successo" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Errore durante la verifica dell'email");
    }
});

module.exports = router;
