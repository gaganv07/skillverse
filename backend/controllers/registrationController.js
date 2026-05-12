import Registration from "../models/Registration.js";
import Competition from "../models/Competition.js";
import { catchAsync } from "../utils/catchAsync.js";

export const registerForCompetition = catchAsync(async (req, res) => {
  const { id } = req.params; // competition id
  
  const competition = await Competition.findById(id);
  if (!competition) {
    return res.status(404).json({ success: false, message: "Competition not found" });
  }

  // Check deadline
  if (competition.registrationDeadline && new Date() > new Date(competition.registrationDeadline)) {
    return res.status(400).json({ success: false, message: "Registration deadline has passed" });
  }

  const existingRegistration = await Registration.findOne({
    student: req.user._id,
    competition: id
  });

  if (existingRegistration) {
    return res.status(400).json({ success: false, message: "You are already registered for this competition" });
  }

  const registration = await Registration.create({
    student: req.user._id,
    competition: id
  });

  res.status(201).json({ success: true, registration });
});

export const getCompetitionRegistrations = catchAsync(async (req, res) => {
  const registrations = await Registration.find({ competition: req.params.id })
    .populate("student", "fullName schoolName district state avatar");
  
  res.json({ success: true, registrations });
});
