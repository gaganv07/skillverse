import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config();

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const emailArg = process.argv[2]?.toLowerCase().trim();
const newPassword = process.argv[3];

async function repairUserPassword() {
  try {
    if (!emailArg || !newPassword) {
      throw new Error("Usage: node scripts/repair-user-password.js <email> <newPassword>");
    }

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not configured");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("[REPAIR] Connected to MongoDB");

    const user = await User.findOne({
      email: new RegExp(`^${escapeRegex(emailArg)}$`, "i")
    }).select("+password");

    if (!user) {
      throw new Error(`No user found for ${emailArg}`);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          email: emailArg,
          password: hashedPassword,
          isActive: true
        }
      }
    );

    const verification = await bcrypt.compare(newPassword, hashedPassword);

    console.log("[REPAIR] Updated user:", user.email);
    console.log("[REPAIR] Role:", user.role);
    console.log("[REPAIR] Hash prefix:", hashedPassword.slice(0, 7));
    console.log("[REPAIR] Verification:", verification ? "PASS" : "FAIL");
  } catch (error) {
    console.error("[REPAIR] Failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

repairUserPassword();
