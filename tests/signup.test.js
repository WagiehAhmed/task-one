const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const express = require("express");
const request = require("supertest");
const { signup } = require("../controllers/authController");

jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    user: {
      create: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mPrismaClient),
  };
});

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

describe("Signup Handler Tests (Unit)", () => {
  let app;
  const mockPrisma = new PrismaClient();

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.post("/signup", signup);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 201 and user created successfully", async () => {
    bcrypt.hash.mockResolvedValue("hashed_password");
    const mockUser = {
      id: 1,
      name: "Test User",
      email: "testuser@example.com",
      password: "hashed_password",
    };
    mockPrisma.user.create.mockResolvedValue(mockUser);
    const response = await request(app).post("/signup").send({
      name: "Test User",
      email: "testuser@example.com",
      password: "password123",
    });

    // Check if the response status is 201 and the response body is correct
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User created successfully");
    expect(response.body.userId).toBe(mockUser.id);

    // Ensure bcrypt.hash and prisma.user.create were called correctly
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10); // Check that bcrypt.hash was called with the correct password
    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: {
        name: "Test User",
        email: "testuser@example.com",
        password: "hashed_password", // Make sure the password is hashed
      },
    });
  });
});
