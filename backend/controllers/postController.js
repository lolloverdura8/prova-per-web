const Post = require("../models/postModel");

module.exports = {
    createPost: async (req, res) => {
        try {
            const newPost = new Post({
                ...req.body,
                author: req.user.id // From auth middleware
            });
            await newPost.save();

            // Populate author for immediate display
            const populatedPost = await Post.findById(newPost._id)
                .populate('author', 'username');

            res.status(201).json(populatedPost);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getPosts: async (req, res) => {
        try {
            const posts = await Post.find()
                .populate('author', 'username')
                .populate('comments.user', 'username')
                .sort({ createdAt: -1 });
            res.json(posts);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    updatePost: async (req, res) => {
        try {
            const post = await Post.findOneAndUpdate(
                { _id: req.params.id, author: req.user.id },
                req.body,
                { new: true }
            );
            if (!post) return res.status(404).json({ message: "Post non trovato" });
            res.json(post);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    deletePost: async (req, res) => {
        try {
            const post = await Post.findOneAndDelete({
                _id: req.params.id,
                author: req.user.id
            });
            if (!post) return res.status(404).json({ message: "Post non trovato" });
            res.json({ message: "Post eliminato" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // New methods for comments and likes
    addComment: async (req, res) => {
        try {
            const { text } = req.body;
            if (!text) {
                return res.status(400).json({ message: "Comment text is required" });
            }

            const post = await Post.findById(req.params.id);
            if (!post) {
                return res.status(404).json({ message: "Post not found" });
            }

            post.comments.push({
                user: req.user.id,
                text
            });

            await post.save();

            // Get the newly added comment with populated user
            const newComment = post.comments[post.comments.length - 1];
            const populatedPost = await Post.findById(post._id)
                .populate('comments.user', 'username');

            const populatedComment = populatedPost.comments.id(newComment._id);

            res.status(201).json(populatedComment);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getComments: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id)
                .populate('comments.user', 'username');

            if (!post) {
                return res.status(404).json({ message: "Post not found" });
            }

            res.json(post.comments);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    toggleLike: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            if (!post) {
                return res.status(404).json({ message: "Post not found" });
            }

            const userId = req.user.id;
            const likeIndex = post.likes.indexOf(userId);

            // Toggle like
            if (likeIndex === -1) {
                // Add like
                post.likes.push(userId);
            } else {
                // Remove like
                post.likes.splice(likeIndex, 1);
            }

            await post.save();
            res.json({ likes: post.likes.length, isLiked: likeIndex === -1 });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Ricerca post per contenuto
    searchPosts : async (req, res) => {
        try {
            const { query } = req.query;
            
            if (!query) {
                return res.status(400).json({ message: "Parametro di ricerca mancante" });
            }
            
            // Crea un'espressione regolare case-insensitive per la ricerca
            const searchRegex = new RegExp(query, 'i');
            
            // Cerca nei post per descrizione o tag che corrispondono alla query
            const posts = await Post.find({
                $or: [
                    { description: { $regex: searchRegex } },
                    { tags: { $in: [searchRegex] } }
                ]
            })
            .populate('author', 'username avatar')
            .populate('comments.user', 'username avatar')
            .sort({ createdAt: -1 }); // Ordina per i più recenti prima
            
            res.json(posts);
        } catch (error) {
            console.error("Errore durante la ricerca:", error);
            res.status(500).json({ message: "Errore del server durante la ricerca" });
        }
    },
};