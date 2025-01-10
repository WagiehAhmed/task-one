const { body, param } = require("express-validator");
const { validator } = require("../validator");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createCommentRules = [
  body("postId")
    .notEmpty()
    .withMessage("post id is required")
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
        throw new Error("post does not exists");
      }
    }),
  body("content").notEmpty().withMessage("content is required"),
  validator,
];

exports.deleteCommentRules = [
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
exports.updateCommentRules = [
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
        throw new Error("Comment does not exist");
      }
    }),
  body("title").optional(),
  body("content").optional(),
  validator,
];
exports.getCommentRules = [
  param("postId")
    .notEmpty()
    .withMessage("post id is required")
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
        throw new Error("post does not exists");
      }
    }),
  validator,
];
