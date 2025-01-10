const { body } = require("express-validator");
const { validator } = require("../validator");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.signupRules = [
  body("name").notEmpty().withMessage("name is required"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email")
    .custom(async (value) => {
      if (value) {
        const existingUser = await prisma.user.findUnique({
          where: {
            email: value,
          },
        });

        if (existingUser) {
          throw new Error("Email already exists");
        }
        return true;
      }
    }),
  body("password").notEmpty().withMessage("password is required"),
  validator,
];

exports.loginRules = [
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email")
    .custom(async (value) => {
      // Check if email exists in the database
      if (value) {
        const existingUser = await prisma.user.findUnique({
          where: {
            email: value,
          },
        });
        if (existingUser) {
          return true;
        }
        throw new Error("Email does not exists");
      }
    }),
  body("password").notEmpty().withMessage("password is required"),
  validator,
];
