const express = require("express");
const { likePost, likeComment } = require("../controllers/likeController");
const authMiddleware = require("../middlewares/authMiddleware");
const { likeCommentRules, likePostRules } = require("../middlewares/validation/like/validationRules");

const router = express.Router();
router.post("/post/:postId", likePostRules, authMiddleware, likePost);  
router.post("/comment/:commentId", likeCommentRules, authMiddleware, likeComment); 
module.exports = router;
