const express = require("express");
const {
  createPost,
  getPosts,
  updatePost,
  deletePost,
} = require("../controllers/postController");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createPostRules,
  updatePostRules,
  deletePostRules,
} = require("../middlewares/validation/post/validationRules");
const router = express.Router();

router.post("/", createPostRules, authMiddleware, createPost);
router.get("/", getPosts);
router.put("/:postId", updatePostRules, authMiddleware, updatePost);
router.delete("/:postId", deletePostRules, authMiddleware, deletePost);

module.exports = router;
