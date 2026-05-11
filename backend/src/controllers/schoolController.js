import School from "../models/School.js";
import { catchAsync } from "../utils/catchAsync.js";

export const createSchool = catchAsync(async (req, res) => {
  const school = await School.create(req.body);
  res.status(201).json({ success: true, school });
});

export const getSchools = catchAsync(async (_req, res) => {
  const schools = await School.find().sort({ name: 1 });
  res.json({ success: true, schools });
});
