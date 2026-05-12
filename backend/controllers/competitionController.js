import Competition from "../models/Competition.js";
import Registration from "../models/Registration.js";
import Submission from "../models/Submission.js";
import { catchAsync } from "../utils/catchAsync.js";

export const createCompetition = catchAsync(async (req, res) => {
  const competition = await Competition.create({
    ...req.body,
    organizer: req.user._id
  });
  res.status(201).json({ success: true, competition });
});

export const getCompetitions = catchAsync(async (_req, res) => {
  const competitions = await Competition.find({ isPublished: true })
    .populate("organizer", "fullName role")
    .sort({ startDate: 1 });
  res.json({ success: true, competitions });
});

export const getCompetitionById = catchAsync(async (req, res) => {
  const competition = await Competition.findById(req.params.id)
    .populate("organizer", "fullName role");
  
  if (!competition) {
    return res.status(404).json({ success: false, message: "Competition not found" });
  }

  // Fetch some basic stats
  const registrationsCount = await Registration.countDocuments({ competition: req.params.id });
  const submissionsCount = await Submission.countDocuments({ competition: req.params.id });

  let userRegistration = null;
  let userSubmission = null;

  if (req.user) {
    userRegistration = await Registration.findOne({ competition: req.params.id, student: req.user._id });
    userSubmission = await Submission.findOne({ competition: req.params.id, student: req.user._id })
      .populate("project", "title");
  }

  res.json({ 
    success: true, 
    competition, 
    stats: { registrationsCount, submissionsCount },
    userState: {
      isRegistered: !!userRegistration,
      registration: userRegistration,
      hasSubmitted: !!userSubmission,
      submission: userSubmission
    }
  });
});

