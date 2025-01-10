const express = require("express");
const {
  getPostComments,
  deleteComment,
  createComment,
  updateComment,
} = require("../controllers/commentController");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createCommentRules,
  getCommentRules,
  deleteCommentRules,
  updateCommentRules,
} = require("../middlewares/validation/comment/validationRules");
const router = express.Router();

// Protect comment routes with authMiddleware
router.post("/", createCommentRules, authMiddleware, createComment);
router.get("/:postId", getCommentRules, getPostComments);
router.delete("/:commentId", deleteCommentRules, authMiddleware, deleteComment);
router.put("/:commentId", updateCommentRules, authMiddleware, updateComment);

module.exports = router;
