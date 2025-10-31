import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../server.js";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Auth API", () => {
  const baseUrl = "/api/auth";

  const userData = {
    name: "Test User",
    email: "test@example.com",
    password: "password123",
  };

  test("✅ should register a new user successfully", async () => {
    const res = await request(app)
      .post(`${baseUrl}/register`)
      .send(userData);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user.email).toBe(userData.email);
  });

  test("❌ should not register with existing email", async () => {
    const res = await request(app)
      .post(`${baseUrl}/register`)
      .send(userData);

    expect(res.statusCode).toBe(400);
   expect(res.body.message).toMatch(/user.*exists/i);
  });

  test("✅ should login with correct credentials", async () => {
    const res = await request(app)
      .post(`${baseUrl}/login`)
      .send({ email: userData.email, password: userData.password });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("❌ should not login with wrong password", async () => {
    const res = await request(app)
      .post(`${baseUrl}/login`)
      .send({ email: userData.email, password: "wrongpassword" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/invalid/i);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
  await new Promise(resolve => setTimeout(resolve, 1000)); // ✅ ensures all async ops stop
});
