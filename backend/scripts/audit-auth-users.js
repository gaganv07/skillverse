import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";

dotenv.config();

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const targetEmail = process.argv[2]?.toLowerCase().trim();

async function auditAuthUsers() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not configured");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("[AUDIT] Connected to MongoDB");

    const query = targetEmail
      ? { email: new RegExp(`^${escapeRegex(targetEmail)}$`, "i") }
      : {};

    const users = await User.find(query).select("+password").sort({ role: 1, email: 1 });

    if (!users.length) {
      console.log("[AUDIT] No users found for the supplied filter.");
      return;
    }

    for (const user of users) {
      const password = user.password || "";
      console.log(
        JSON.stringify(
          {
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            hasPassword: Boolean(password),
            passwordIsBcryptHash: password.startsWith("$2"),
            normalizedEmail: user.email === user.email?.toLowerCase().trim(),
            hashPrefix: password ? password.slice(0, 7) : null,
            createdAt: user.createdAt
          },
          null,
          2
        )
      );
    }
  } catch (error) {
    console.error("[AUDIT] Failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

auditAuthUsers();
