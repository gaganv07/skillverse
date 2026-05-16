import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { catchAsync } from "../utils/catchAsync.js";

/**
 * Bootstrap seed endpoint — creates the initial admin account
 * Only works if NO admin exists yet in the database
 * POST /api/v1/auth/seed-admin
 */
export const seedAdmin = catchAsync(async (req, res) => {
  const { email, password, fullName, seedSecret } = req.body;

  // Require a seed secret to prevent abuse
  const expectedSecret = process.env.SEED_SECRET || "skillverse_seed_2026";
  if (seedSecret !== expectedSecret) {
    return res.status(403).json({
      success: false,
      message: "Invalid seed secret"
    });
  }

  if (!email || !password || !fullName) {
    return res.status(400).json({
      success: false,
      message: "email, password, and fullName are required"
    });
  }

  // Only allow seeding if no admin account exists
  const existingAdmin = await User.findOne({ role: "admin" });
  if (existingAdmin) {
    return res.status(409).json({
      success: false,
      message: "Admin account already exists. Use the admin dashboard to manage users."
    });
  }

  // Check for duplicate email
  const existingEmail = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingEmail) {
    return res.status(409).json({
      success: false,
      message: "An account with this email already exists"
    });
  }

  // Create admin user (pre-save hook will hash the password)
  const admin = await User.create({
    fullName: fullName.trim(),
    email: email.toLowerCase().trim(),
    password,
    role: "admin",
    isActive: true,
    isVerified: true,
    emailVerified: true,
    schoolName: "SkillVerse Administration",
    district: "Bengaluru",
    state: "Karnataka"
  });

  console.log(`[SEED] Admin account created: ${admin.email}`);

  res.status(201).json({
    success: true,
    message: "Admin account created successfully",
    user: {
      _id: admin._id,
      fullName: admin.fullName,
      email: admin.email,
      role: admin.role
    }
  });
});
