const expressAsyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.likePost = expressAsyncHandler(async (req, res) => {
  const { postId } = req.params;
  // Check if the user has already liked the post
  const existingLike = await prisma.postLike.findFirst({
    where: {
      userId: req.user.id,
      postId: Number(postId),
    },
  });
  if (existingLike) {
    // If the like exists, delete it (i.e., "unlike" the post)
    await prisma.postLike.delete({
      where: {
        id: existingLike.id, 
      },
    });

    return res.status(200).json({ message: "Post unliked successfully" });
  } else {
    // If the like doesn't exist, create a new like for the post
    await prisma.postLike.create({
      data: {
        userId: req.user.id,
        postId: Number(postId),
      },
    });

    return res.status(200).json({ message: "Post liked successfully" });
  }
});

exports.likeComment = expressAsyncHandler(async (req, res) => {
  const { commentId } = req.params;
  // Check if the user has already liked the comment
  const existingLike = await prisma.commentLike.findFirst({
    where: {
      userId: req.user.id, // Get the user ID from the authenticated user
      commentId: Number(commentId), // Convert commentId to a number if necessary
    },
  });

  if (existingLike) {
    // If the like exists, delete it (i.e., "unlike" the comment)
    await prisma.commentLike.delete({
      where: {
        id: existingLike.id, 
      },
    });

    return res.status(200).json({ message: "Comment unliked successfully" });
  } else {
    // If the like doesn't exist, create a new like for the comment
    await prisma.commentLike.create({
      data: {
        userId: req.user.id,
        commentId: Number(commentId), 
      },
    });

    return res.status(200).json({ message: "Comment liked successfully" });
  }
});
