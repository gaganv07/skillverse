import bcrypt from "bcryptjs";
import User from "../models/User.js";
import StudentProfile from "../models/StudentProfile.js";
import TeacherProfile from "../models/TeacherProfile.js";
import ActivityLog from "../models/ActivityLog.js";
import { catchAsync } from "../utils/catchAsync.js";

/**
 * Admin: Get all users with search, filter, and pagination
 * GET /api/v1/admin/users?search=&role=&status=&page=1&limit=20
 */
export const getAllUsers = catchAsync(async (req, res) => {
  const {
    search = "",
    role = "",
    status = "",
    page = 1,
    limit = 20,
    sort = "-createdAt"
  } = req.query;

  const query = {};

  // Search by name or email
  if (search.trim()) {
    const regex = new RegExp(search.trim(), "i");
    query.$or = [{ fullName: regex }, { email: regex }];
  }

  // Filter by role
  if (role && role !== "all") {
    query.role = role;
  }

  // Filter by active status
  if (status === "active") {
    query.isActive = true;
  } else if (status === "disabled") {
    query.isActive = false;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [users, total] = await Promise.all([
    User.find(query)
      .select("-password")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit)),
    User.countDocuments(query)
  ]);

  res.json({
    success: true,
    users,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

/**
 * Admin: Create a new user (teacher or student)
 * POST /api/v1/admin/users
 */
export const createUser = catchAsync(async (req, res) => {
  const { fullName, email, password, role, schoolName, district, state } = req.body;

  // Validation
  if (!fullName || !email || !password || !role) {
    return res.status(400).json({
      success: false,
      message: "Full name, email, password, and role are required"
    });
  }

  // Only allow creating student and teacher accounts
  const allowedRoles = ["student", "teacher"];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({
      success: false,
      message: "Only student and teacher accounts can be created"
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters"
    });
  }

  // Check for duplicate email
  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    return res.status(409).json({
      success: false,
      message: "An account with this email already exists"
    });
  }

  // Create user (password will be hashed by the pre-save hook)
  const user = await User.create({
    fullName: fullName.trim(),
    email: email.toLowerCase().trim(),
    password,
    role,
    schoolName: schoolName?.trim() || "",
    district: district?.trim() || "",
    state: state?.trim() || "",
    isActive: true,
    isVerified: false
  });

  // Create associated profile
  if (role === "student") {
    await StudentProfile.create({ user: user._id });
  } else if (role === "teacher") {
    await TeacherProfile.create({ user: user._id });
  }

  // Log the action
  await ActivityLog.create({
    admin: req.user._id,
    action: `created_${role}`,
    targetModel: "User",
    targetId: user._id,
    details: `Created ${role} account for ${user.fullName} (${user.email})`
  });

  console.log(`[ADMIN] User created: ${user.email} (${role}) by admin ${req.user.email}`);

  res.status(201).json({
    success: true,
    message: `${role.charAt(0).toUpperCase() + role.slice(1)} account created successfully`,
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      schoolName: user.schoolName,
      district: user.district,
      state: user.state,
      isActive: user.isActive,
      isVerified: user.isVerified,
      createdAt: user.createdAt
    }
  });
});

/**
 * Admin: Update a user's profile information
 * PUT /api/v1/admin/users/:id
 */
export const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { fullName, email, role, schoolName, district, state } = req.body;

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Prevent editing other admins
  if (user.role === "admin" && String(user._id) !== String(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: "Cannot edit another admin account"
    });
  }

  // Check email uniqueness if changing email
  if (email && email.toLowerCase().trim() !== user.email) {
    const emailExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: "This email is already in use by another account"
      });
    }
    user.email = email.toLowerCase().trim();
  }

  // Only allow role changes to student/teacher (never to admin)
  if (role && role !== user.role) {
    if (!["student", "teacher"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role can only be set to student or teacher"
      });
    }
    user.role = role;
  }

  if (fullName) user.fullName = fullName.trim();
  if (schoolName !== undefined) user.schoolName = schoolName.trim();
  if (district !== undefined) user.district = district.trim();
  if (state !== undefined) user.state = state.trim();

  await user.save();

  await ActivityLog.create({
    admin: req.user._id,
    action: "updated_user",
    targetModel: "User",
    targetId: user._id,
    details: `Updated profile for ${user.fullName} (${user.email})`
  });

  res.json({
    success: true,
    message: "User updated successfully",
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      schoolName: user.schoolName,
      district: user.district,
      state: user.state,
      isActive: user.isActive,
      isVerified: user.isVerified,
      createdAt: user.createdAt
    }
  });
});

/**
 * Admin: Reset a user's password
 * PATCH /api/v1/admin/users/:id/reset-password
 */
export const resetUserPassword = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "New password must be at least 6 characters"
    });
  }

  const user = await User.findById(id).select("+password");
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Prevent resetting other admin passwords
  if (user.role === "admin" && String(user._id) !== String(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: "Cannot reset another admin's password"
    });
  }

  // Set password — pre-save hook will hash it
  user.password = newPassword;
  await user.save();

  await ActivityLog.create({
    admin: req.user._id,
    action: "reset_password",
    targetModel: "User",
    targetId: user._id,
    details: `Reset password for ${user.fullName} (${user.email})`
  });

  console.log(`[ADMIN] Password reset for: ${user.email} by admin ${req.user.email}`);

  res.json({
    success: true,
    message: `Password reset successfully for ${user.fullName}`
  });
});

/**
 * Admin: Toggle user active/disabled status
 * PATCH /api/v1/admin/users/:id/status
 */
export const toggleStatus = catchAsync(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Prevent disabling admin accounts
  if (user.role === "admin") {
    return res.status(403).json({
      success: false,
      message: "Cannot disable admin accounts"
    });
  }

  user.isActive = !user.isActive;
  await user.save();

  const action = user.isActive ? "enabled_user" : "disabled_user";

  await ActivityLog.create({
    admin: req.user._id,
    action,
    targetModel: "User",
    targetId: user._id,
    details: `${user.isActive ? "Enabled" : "Disabled"} account for ${user.fullName} (${user.email})`
  });

  res.json({
    success: true,
    message: `User ${user.isActive ? "activated" : "disabled"} successfully`,
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      isVerified: user.isVerified
    }
  });
});

/**
 * Admin: Delete a user permanently
 * DELETE /api/v1/admin/users/:id
 */
export const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Never allow deleting admin accounts
  if (user.role === "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin accounts cannot be deleted"
    });
  }

  // Clean up associated profiles
  if (user.role === "student") {
    await StudentProfile.deleteOne({ user: user._id });
  } else if (user.role === "teacher") {
    await TeacherProfile.deleteOne({ user: user._id });
  }

  await ActivityLog.create({
    admin: req.user._id,
    action: "deleted_user",
    targetModel: "User",
    targetId: user._id,
    details: `Deleted ${user.role} account: ${user.fullName} (${user.email})`
  });

  await user.deleteOne();

  console.log(`[ADMIN] User deleted: ${user.email} (${user.role}) by admin ${req.user.email}`);

  res.json({
    success: true,
    message: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} account deleted successfully`
  });
});

/**
 * Admin: Get a single user's full details
 * GET /api/v1/admin/users/:id
 */
export const getUserDetails = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.json({ success: true, user });
});
