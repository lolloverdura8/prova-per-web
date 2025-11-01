// controllers/postController.js
const Post = require("../models/postModel");
const Notification = require("../models/notificationModel");

// ----------------- Helpers comuni -----------------
const parsePagination = (req, { defaultLimit = 10, maxLimit = 50 } = {}) => {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const rawLimit = parseInt(req.query.limit) || defaultLimit;
    const limit = Math.min(Math.max(rawLimit, 1), maxLimit);
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};

const sendPaginated = (res, { data, page, limit, total }) => {
    return res.json({
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

// Popoliamo solo i campi necessari per snellire il payload
const POST_POPULATE = [
    { path: "author", select: "username" },
    { path: "comments.user", select: "username" },
];

// ----------------- Controller -----------------
module.exports = {
    // Crea post
    createPost: async (req, res) => {
        try {
            const newPost = new Post({
                ...req.body,            // description, image, tags, ...
                author: req.user.id,    // from auth middleware
            });
            await newPost.save();

            const populatedPost = await Post.findById(newPost._id).populate(POST_POPULATE);
            return res.status(201).json({ success: true, data: populatedPost });
        } catch (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
    },

    // Lista post (paginata)
    getPosts: async (req, res) => {
        try {
            const { page, limit, skip } = parsePagination(req);

            const [posts, totalPosts] = await Promise.all([
                Post.find()
                    .populate(POST_POPULATE)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                Post.countDocuments(),
            ]);

            return sendPaginated(res, { data: posts, page, limit, total: totalPosts });
        } catch (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
    },

    // Aggiorna post (solo autore)
    updatePost: async (req, res) => {
        try {
            const post = await Post.findOneAndUpdate(
                { _id: req.params.id, author: req.user.id },
                req.body,
                { new: true }
            ).populate(POST_POPULATE);

            if (!post) return res.status(404).json({ success: false, message: "Post non trovato" });
            return res.json({ success: true, data: post });
        } catch (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
    },

    // Elimina post (solo autore)
    deletePost: async (req, res) => {
        try {
            const post = await Post.findOneAndDelete({ _id: req.params.id, author: req.user.id });
            if (!post) return res.status(404).json({ success: false, message: "Post non trovato" });
            return res.json({ success: true, message: "Post eliminato" });
        } catch (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
    },

    // Aggiungi commento
    addComment: async (req, res) => {
        try {
            const { text } = req.body;
            if (!text) return res.status(400).json({ success: false, message: "Comment text is required" });

            const post = await Post.findById(req.params.id);
            if (!post) return res.status(404).json({ success: false, message: "Post not found" });

            post.comments.push({ user: req.user.id, text });
            await post.save();

            // Ottieni commento popolato
            const populatedPost = await Post.findById(post._id).populate(POST_POPULATE);
            const populatedComment = populatedPost.comments[populatedPost.comments.length - 1];

            // Risposta HTTP
            res.status(201).json({ success: true, data: populatedComment });

            // Notifica (se non sei l'autore)
            if (post.author.toString() !== req.user.id.toString()) {
                const preview = text.length > 50 ? text.substring(0, 50) + "..." : text;
                const notif = await Notification.create({
                    userId: post.author,
                    actorId: req.user.id,
                    postId: post._id,
                    type: "comment",
                    preview,
                });

                if (req.io) req.io.to(post.author.toString()).emit("new-notification", notif);
            }

            // Broadcast del commento (room del post)
            if (req.io) req.io.to(post._id.toString()).emit("new-comment", populatedComment);
        } catch (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
    },

    // Lista commenti (popolati)
    getComments: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id).populate({ path: "comments.user", select: "username avatar" });
            if (!post) return res.status(404).json({ success: false, message: "Post not found" });
            return res.json({ success: true, data: post.comments });
        } catch (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
    },

    // Toggle like
    toggleLike: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            if (!post) return res.status(404).json({ success: false, message: "Post not found" });

            const userId = req.user.id.toString();
            const likeIndex = post.likes.findIndex((u) => u.toString() === userId);

            let isLiked;
            if (likeIndex === -1) {
                post.likes.push(req.user.id);
                isLiked = true;
            } else {
                post.likes.splice(likeIndex, 1);
                isLiked = false;
            }

            await post.save();
            res.json({ success: true, data: { likes: post.likes.length, isLiked } });

            // Notifica like (solo se non è l'autore)
            if (post.author.toString() !== userId) {
                const exist = await Notification.findOne({
                    userId: post.author,
                    actorId: req.user.id,
                    postId: post._id,
                    type: "like",
                });

                if (!exist) {
                    const notif = await Notification.create({
                        userId: post.author,
                        actorId: req.user.id,
                        postId: post._id,
                        type: "like",
                    });
                    if (req.io) req.io.to(post.author.toString()).emit("new-notification", notif);
                }
            }
        } catch (err) {
            console.error("Errore in toggleLike:", err);
            return res.status(500).json({ success: false, message: "Errore interno" });
        }
    },

    // Ricerca (paginata)
    searchPosts: async (req, res) => {
        try {
            const { query } = req.query;
            if (!query) return res.status(400).json({ success: false, message: "Parametro di ricerca mancante" });

            const { page, limit, skip } = parsePagination(req);
            const searchRegex = new RegExp(query, "i");

            const mongoQuery = {
                $or: [{ description: { $regex: searchRegex } }, { tags: { $in: [searchRegex] } }],
            };

            const [posts, total] = await Promise.all([
                Post.find(mongoQuery)
                    .populate(POST_POPULATE)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                Post.countDocuments(mongoQuery),
            ]);

            return sendPaginated(res, { data: posts, page, limit, total });
        } catch (error) {
            console.error("Errore durante la ricerca:", error);
            return res.status(500).json({ success: false, message: "Errore del server durante la ricerca" });
        }
    },

    // Filtri (paginati)
    getFilteredPosts: async (req, res) => {
        try {
            const { author, date, tag } = req.query;
            const { page, limit, skip } = parsePagination(req);
            const query = {};

            if (author) {
                const User = require("../models/userModel");
                const user = await User.findOne({ username: author }).select("_id");
                if (!user) return sendPaginated(res, { data: [], page, limit, total: 0 });
                query.author = user._id;
            }

            if (date) {
                const startDate = new Date(date);
                startDate.setHours(0, 0, 0, 0);
                const endDate = new Date(date);
                endDate.setHours(23, 59, 59, 999);
                query.createdAt = { $gte: startDate, $lte: endDate };
            }

            if (tag) query.tags = tag;

            const [posts, total] = await Promise.all([
                Post.find(query)
                    .populate(POST_POPULATE)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                Post.countDocuments(query),
            ]);

            return sendPaginated(res, { data: posts, page, limit, total });
        } catch (err) {
            console.error("Errore durante il filtraggio dei post:", err);
            return res.status(500).json({ success: false, error: err.message });
        }
    },

    // Post salvati (paginati)
    getSavedPosts: async (req, res) => {
        try {
            const userId = req.user.id;
            const { page, limit, skip } = parsePagination(req);

            const query = { saved: userId };
            const [posts, total] = await Promise.all([
                Post.find(query)
                    .populate(POST_POPULATE)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                Post.countDocuments(query),
            ]);

            return sendPaginated(res, { data: posts, page, limit, total });
        } catch (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
    },

    // Post salvati + filtri (paginati)
    getSavedPostsFiltered: async (req, res) => {
        try {
            const { author, date, tag } = req.query;
            const userId = req.user.id;
            const { page, limit, skip } = parsePagination(req);

            const query = { saved: userId };

            if (author) {
                const User = require("../models/userModel");
                const user = await User.findOne({ username: author }).select("_id");
                if (!user) return sendPaginated(res, { data: [], page, limit, total: 0 });
                query.author = user._id;
            }

            if (date) {
                const startDate = new Date(date);
                startDate.setHours(0, 0, 0, 0);
                const endDate = new Date(date);
                endDate.setHours(23, 59, 59, 999);
                query.createdAt = { $gte: startDate, $lte: endDate };
            }

            if (tag) query.tags = tag;

            const [posts, total] = await Promise.all([
                Post.find(query)
                    .populate(POST_POPULATE)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                Post.countDocuments(query),
            ]);

            return sendPaginated(res, { data: posts, page, limit, total });
        } catch (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
    },

    // Toggle salva
    toggleSave: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            if (!post) return res.status(404).json({ success: false, message: "Post not found" });

            const userId = req.user.id.toString();
            const alreadySaved = post.saved.some((u) => u.toString() === userId);

            if (alreadySaved) post.saved.pull(req.user.id);
            else post.saved.push(req.user.id);

            await post.save();

            return res.json({
                success: true,
                data: {
                    isSaved: !alreadySaved,
                    saved: post.saved, // array di userId
                },
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Server error" });
        }
    },
};
