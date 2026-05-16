import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";

dotenv.config();

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const emailArg = process.argv[2]?.toLowerCase().trim();

async function normalizeLegacyUser() {
  try {
    if (!emailArg) {
      throw new Error("Usage: node scripts/normalize-legacy-user.js <email>");
    }

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not configured");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("[NORMALIZE] Connected to MongoDB");

    const usersCollection = mongoose.connection.collection("users");
    const legacyUser = await usersCollection.findOne({
      email: new RegExp(`^${escapeRegex(emailArg)}$`, "i")
    });

    if (!legacyUser) {
      throw new Error(`No user found for ${emailArg}`);
    }

    const fullName = legacyUser.fullName || legacyUser.name;
    const schoolName = legacyUser.schoolName || legacyUser.school || "";

    if (!fullName) {
      throw new Error("Legacy user does not contain a fullName or name field");
    }

    await usersCollection.updateOne(
      { _id: legacyUser._id },
      {
        $set: {
          email: emailArg,
          fullName,
          schoolName
        },
        $unset: {
          name: "",
          school: ""
        }
      }
    );

    const normalizedUser = await User.findById(legacyUser._id).select("-password");

    console.log("[NORMALIZE] Updated user:", normalizedUser.email);
    console.log("[NORMALIZE] fullName:", normalizedUser.fullName);
    console.log("[NORMALIZE] schoolName:", normalizedUser.schoolName);
    console.log("[NORMALIZE] role:", normalizedUser.role);
  } catch (error) {
    console.error("[NORMALIZE] Failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

normalizeLegacyUser();
