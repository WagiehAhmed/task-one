const bcrypt = require("bcrypt");
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRATION } = require("../config/jwtConfig");
const { PrismaClient } = require("@prisma/client"); 
const prisma = new PrismaClient(); 

// Signup handler
exports.signup = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  res
    .status(201)
    .json({ message: "User created successfully", userId: user.id });
});

// Login handler
exports.login = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });
  res.cookie("accessToken", token, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
  });
  res.status(200).json({ token });
});

exports.logout = expressAsyncHandler(async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
  });
  res.status(200).json({ message: "User logged out" });
});
