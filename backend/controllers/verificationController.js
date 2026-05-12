import Verification from "../models/Verification.js";
import User from "../models/User.js";
import School from "../models/School.js";
import Project from "../models/Project.js";
import ActivityLog from "../models/ActivityLog.js";
import { catchAsync } from "../utils/catchAsync.js";

const logAction = async (adminId, action, targetModel, targetId, details) => {
  await ActivityLog.create({ admin: adminId, action, targetModel, targetId, details });
};

// For Users to submit a verification request
export const submitVerificationRequest = catchAsync(async (req, res) => {
  const { targetType, targetId, description, documents } = req.body;

  const request = await Verification.create({
    requestedBy: req.user._id,
    targetType,
    targetId,
    description,
    documents
  });

  res.status(201).json({ success: true, request });
});

// For Admins to get requests
export const getVerificationRequests = catchAsync(async (req, res) => {
  const requests = await Verification.find()
    .populate("requestedBy", "fullName email")
    .sort({ createdAt: -1 });
  
  res.json({ success: true, requests });
});

// For Admins to process request
export const processVerification = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;

  const request = await Verification.findByIdAndUpdate(
    id,
    { status, adminNotes, processedBy: req.user._id },
    { new: true }
  );

  if (!request) return res.status(404).json({ success: false, message: "Verification request not found" });

  if (status === "approved") {
    // Toggle the actual isVerified flag on the target
    if (request.targetType === "user") {
      await User.findByIdAndUpdate(request.targetId, { isVerified: true });
    } else if (request.targetType === "school") {
      await School.findByIdAndUpdate(request.targetId, { isVerified: true });
    } else if (request.targetType === "project") {
      await Project.findByIdAndUpdate(request.targetId, { isVerified: true });
    }
  }

  await logAction(req.user._id, `process_verification_${status}`, "Verification", id, adminNotes);

  res.json({ success: true, request });
});
