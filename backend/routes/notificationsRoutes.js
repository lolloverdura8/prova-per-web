const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const notificationController = require("../controllers/notificationController");

// GET tutte le notifiche dell'utente
router.get("/", auth, notificationController.getUserNotifications);

// PUT una specifica notifica come letta


router.post("/read-all", auth, notificationController.markAllNotificationsAsRead);

module.exports = router;
