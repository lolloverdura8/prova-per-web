const Post = require("../models/postModel");

module.exports = {
    createPost: async (req, res) => {
        try {
            const newPost = new Post({
                ...req.body,
                author: req.user.id // Assumendo che l'utente sia autenticato
            });
            await newPost.save();
            res.status(201).json(newPost);
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
    }
};
