const express = require("express");
const request = require("supertest");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { login } = require("../controllers/authController");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mPrismaClient),
  };
});


describe("Login Handler Tests", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.post("/login", login);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if the user does not exist", async () => {
    // Mock the prisma call to return null (user not found)
    prisma.user.findUnique.mockResolvedValue(null);

    const response = await request(app)
      .post("/login")
      .send({ email: "user1@gmail.com", password: "user1" });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");
  });

  it("should return 401 if the password is incorrect", async () => {
    const mockUser = {
      id: 1,
      email: "user1@gmail.com",
      password: "$2b$10$ok15ejg/zF6I4nw2KFkJN.XwrcddaJk70Qtlbv/MKCI/MpdEwMsWK",
    };

    // Mock the prisma call to return a user
    prisma.user.findUnique.mockResolvedValue(mockUser);

    // Mock bcrypt.compare to return false (password mismatch)
    bcrypt.compare.mockResolvedValue(false);

    const response = await request(app)
      .post("/login")
      .send({ email: "user1@gmail.com", password: "incorrectPassword" });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");
  });

  it("should return 200 and a token on successful login", async () => {
    const mockUser = {
      email: "user1@gmail.com",
      password: "$2b$10$HvOeUcUL3IkUTGgsBlEVZO80LCjpP4rr/xbOeKq4BkZ1TwEbR86W2"
    };

    // Mock the prisma call to return a user
    prisma.user.findUnique.mockResolvedValue(mockUser);

    // Mock bcrypt.compare to return true (password match)
    bcrypt.compare.mockResolvedValue(true);

    // Mock jwt.sign to return a token
    jwt.sign.mockReturnValue("mockToken");

    const response = await request(app)
      .post("/login")
      .send({ email: "user1@gmail.com", password: "user1" });
    expect(response.status).toBe(200);
    expect(response.body.token).toBe("mockToken");
    expect(response.headers["set-cookie"][0]).toMatch(/accessToken/);
  });
});
