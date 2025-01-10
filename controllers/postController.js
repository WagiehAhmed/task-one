const expressAsyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new post
exports.createPost = expressAsyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const post = await prisma.post.create({
    data: {
      title,
      content,
      userId: req.user.id,
    },
  });
  res.status(201).json(post);
});

// Get all posts
exports.getPosts = expressAsyncHandler(async (req, res) => {
  const posts = await prisma.post.findMany({
    include: {
      user: true,
    },
  });
  res.status(200).json(posts);
});

// Update a post
exports.updatePost = expressAsyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;
  const post = await prisma.post.update({
    where: { id: Number(postId) },
    data: { title, content },
  });

  res.status(200).json(post);
});

// Delete a post
exports.deletePost = expressAsyncHandler(async (req, res) => {
  const { postId } = req.params;
  await prisma.comment.deleteMany({
    where: {
      postId: Number(postId),
    },
  });
  const post = await prisma.post.delete({
    where: { id: Number(postId) },
  });
  res.status(200).json({ message: "Post deleted", post });
});
