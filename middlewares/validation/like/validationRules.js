const { param } = require("express-validator");
const { validator } = require("../validator");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.likePostRules = [
  param("postId")
    .notEmpty()
    .withMessage("Post id is required")
    .custom(async (value) => {
      if (value) {
        // Check if post exists in the database
        const existingPost = await prisma.post.findUnique({
          where: {
            id: Number(value),
          },
        });
        if (existingPost) {
          return true;
        }
        throw new Error("Post does not exists");
      }
    }),
  validator,
];

exports.likeCommentRules = [
  param("commentId")
    .notEmpty()
    .withMessage("Comment id is required")
    .custom(async (value) => {
      if (value) {
        // Check if comment exists in the database
        const existingComment = await prisma.comment.findUnique({
          where: {
            id: Number(value),
          },
        });
        if (existingComment) {
          return true;
        }
        throw new Error("Comment does not exists");
      }
    }),
  validator,
];
