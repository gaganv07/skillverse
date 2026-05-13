/**
 * Admin Password Reset Script
 * 
 * Usage: node scripts/reset-admin-password.js [newPassword]
 * 
 * If no password is provided, defaults to 'Admin@123'
 * This script updates the admin account (gagangowdabm27@gmail.com)
 * with a fresh bcrypt-hashed password.
 */
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

dotenv.config();

const ADMIN_EMAIL = "gagangowdabm27@gmail.com";
const NEW_PASSWORD = process.argv[2] || "Admin@123";

async function resetAdminPassword() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected.");

    const db = mongoose.connection.db;
    const usersCollection = db.collection("users");

    // Find the admin user
    const admin = await usersCollection.findOne({ email: ADMIN_EMAIL });
    
    if (!admin) {
      console.error(`No user found with email: ${ADMIN_EMAIL}`);
      process.exit(1);
    }

    console.log(`Found admin user: ${admin.fullName} (${admin.email})`);
    console.log(`  Role: ${admin.role}`);
    console.log(`  Current password hash prefix: ${admin.password?.substring(0, 7)}`);

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(NEW_PASSWORD, salt);

    // Update the password
    await usersCollection.updateOne(
      { email: ADMIN_EMAIL },
      { $set: { password: hashedPassword } }
    );

    // Verify the update
    const verify = await bcrypt.compare(NEW_PASSWORD, hashedPassword);
    console.log(`\nPassword updated successfully!`);
    console.log(`  New password: ${NEW_PASSWORD}`);
    console.log(`  Hash: ${hashedPassword.substring(0, 15)}...`);
    console.log(`  Verification: ${verify ? "PASS" : "FAIL"}`);

    await mongoose.disconnect();
    console.log("\nDone. You can now login with the new password.");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

resetAdminPassword();
