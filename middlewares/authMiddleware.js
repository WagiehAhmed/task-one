// authMiddleware.js
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/jwtConfig");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async (req, res, next) => {
  if (req?.cookies?.accessToken) {
    try {
      const decoded = jwt.verify(req.cookies.accessToken, JWT_SECRET);
      if (!decoded) {
        return res.status(401).json({ message: "invalid token" });
      }
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });
      req.user = user;
      return next();
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
  if (!req?.cookies?.accessToken) {
    return res.status(401).json({ message: "unauthorized" });
  }
};
