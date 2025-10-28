// controllers/notificationController.js
const mongoose = require("mongoose");
const Notification = require("../models/notificationModel");

// Helpers comuni per paginazione
const parsePagination = (req, { defaultLimit = 10, maxLimit = 50 } = {}) => {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const rawLimit = parseInt(req.query.limit) || defaultLimit;
    const limit = Math.min(Math.max(rawLimit, 1), maxLimit);
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};

const sendPaginated = (res, { data, page, limit, total }) => {
    return res.status(200).json({
        success: true,
        data,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            pageSize: limit,
        },
    });
};

module.exports = {
    // GET /api/notifications?page=&limit=
    async getUserNotifications(req, res) {
        try {
            const userId = req.user.id;
            const { page, limit, skip } = parsePagination(req);

            const query = { userId: new mongoose.Types.ObjectId(userId) };

            const [notifications, total] = await Promise.all([
                Notification.find(query)
                    .populate("actorId", "username avatar")
                    .populate("postId", "_id")
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                Notification.countDocuments(query),
            ]);

            return sendPaginated(res, { data: notifications, page, limit, total });
        } catch (error) {
            console.error("Error fetching notifications:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    },

    // PATCH /api/notifications/read-all
    async markAllNotificationsAsRead(req, res) {
        try {
            const userId = req.user.id;
            await Notification.updateMany(
                { userId: new mongoose.Types.ObjectId(userId), isRead: false },
                { $set: { isRead: true } }
            );
            return res.status(200).json({ success: true, message: "Notifiche segnate come lette" });
        } catch (error) {
            console.error("Error marking notifications as read:", error);
            return res.status(500).json({ success: false, message: "Errore interno" });
        }
    },
};
