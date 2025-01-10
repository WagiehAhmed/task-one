const { body, param } = require("express-validator");
const { validator } = require("../validator");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createPostRules = [
  body("title").notEmpty().withMessage("title is required"),
  body("content").notEmpty().withMessage("content is required"),
  validator,
];

exports.deletePostRules = [
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
        throw new Error("Post does not exists");
      }
    }),
  validator,
];

exports.updatePostRules = [
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
        throw new Error("Post does not exists");
      }
    }),
  body("title").optional(),
  body("content").optional(),
  validator,
];
