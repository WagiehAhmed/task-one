const expressAsyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a comment
exports.createComment = expressAsyncHandler(async (req, res) => {
  const { postId, content } = req.body;
  const comment = await prisma.comment.create({
    data: {
      content,
      postId: Number(postId),
      userId: req.user.id,
    },
  });
  res.status(201).json(comment);
});

// Get all comments for a post
exports.getPostComments = expressAsyncHandler(async (req, res) => {
  const { postId } = req.params;
  const comments = await prisma.comment.findMany({
    where: { postId: Number(postId) },
    include: {
      user: true, 
    },
  });
  res.status(200).json(comments);
});

// Delete a comment
exports.deleteComment = expressAsyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const comment = await prisma.comment.delete({
    where: { id: Number(commentId) },
  });
  res.status(200).json({ message: "Comment deleted", comment });
});

// update a comment
exports.updateComment = expressAsyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const comment = await prisma.comment.update({
    where: { id: Number(commentId) },
    data: { ...req.body },
  });
  res.status(200).json({ message: "Comment updated", comment });
});
