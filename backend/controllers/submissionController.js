import Submission from "../models/Submission.js";
import Registration from "../models/Registration.js";
import Certificate from "../models/Certificate.js";
import { catchAsync } from "../utils/catchAsync.js";

export const submitProject = catchAsync(async (req, res) => {
  const { id } = req.params; // competition id
  const { projectId } = req.body;

  if (!projectId) {
    return res.status(400).json({ success: false, message: "Project ID is required" });
  }

  // Must be registered
  const registration = await Registration.findOne({
    student: req.user._id,
    competition: id
  });

  if (!registration) {
    return res.status(403).json({ success: false, message: "You must register for this competition first" });
  }

  const existingSubmission = await Submission.findOne({
    student: req.user._id,
    competition: id
  });

  if (existingSubmission) {
    return res.status(400).json({ success: false, message: "You have already submitted a project to this competition" });
  }

  const submission = await Submission.create({
    student: req.user._id,
    competition: id,
    project: projectId
  });

  res.status(201).json({ success: true, submission });
});

export const getCompetitionSubmissions = catchAsync(async (req, res) => {
  const submissions = await Submission.find({ competition: req.params.id })
    .populate("student", "fullName schoolName")
    .populate("project", "title slug category status");

  res.json({ success: true, submissions });
});

export const gradeSubmission = catchAsync(async (req, res) => {
  const { id } = req.params; // submission id
  const { awardedRank, feedback } = req.body;

  const submission = await Submission.findByIdAndUpdate(
    id,
    { status: "graded", awardedRank, feedback },
    { new: true }
  );

  if (!submission) {
    return res.status(404).json({ success: false, message: "Submission not found" });
  }

  // Auto-generate certificate if they won or participated
  if (awardedRank !== "none") {
    // Check if certificate already exists
    const existingCert = await Certificate.findOne({ 
      student: submission.student, 
      competition: submission.competition 
    });

    if (!existingCert) {
      await Certificate.create({
        student: submission.student,
        competition: submission.competition,
        type: awardedRank === "participation" ? "participation" : "winner",
        certificateNumber: `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      });
    }
  }

  res.json({ success: true, submission });
});
