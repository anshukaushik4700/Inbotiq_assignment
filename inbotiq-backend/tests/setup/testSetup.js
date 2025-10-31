// tests/setup/testSetup.js
import mongoose from "mongoose";

afterAll(async () => {
  // Disconnect Mongoose after all tests finish
  await mongoose.connection.close();
});
