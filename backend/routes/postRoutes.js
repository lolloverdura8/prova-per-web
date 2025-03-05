const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const auth = require("../middleware/auth");

router.post("/", auth, postController.createPost);
router.get("/", postController.getPosts);
router.put("/:id", auth, postController.updatePost);
router.delete("/:id", auth, postController.deletePost);

router.post("/:id/comments", auth, postController.addComment);
router.post("/:id/like", auth, postController.toggleLike);
router.get("/:id/comments", postController.getComments);
router.get('/search', postController.searchPosts);
router.get('/filter', postController.getFilteredPosts);


module.exports = router;