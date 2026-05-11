import Competition from "../models/Competition.js";
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

export const registerForCompetition = catchAsync(async (req, res) => {
  const competition = await Competition.findById(req.params.id);
  competition.registrations.push({
    student: req.user._id,
    project: req.body.project,
    submittedAt: new Date(),
    status: "registered"
  });
  await competition.save();
  res.json({ success: true, competition });
});

export const announceWinner = catchAsync(async (req, res) => {
  const competition = await Competition.findById(req.params.id);
  competition.winners.push(req.body);
  await competition.save();
  res.json({ success: true, competition });
});
