// server.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const likeRoutes = require("./routes/likeRoutes");
const {notFoundError,errorHandler} = require("./middlewares/errorHandlingMiddleware");
// const errorHandlingMiddleware = require("./middlewares/errorHandlingMiddleware");

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);

// Error handling middleware
app.use(notFoundError);
app.use(errorHandler);

// Start server
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running`);
});
