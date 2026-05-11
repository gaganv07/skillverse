import User from "../models/User.js";
import Project from "../models/Project.js";
import Talent from "../models/Talent.js";
import School from "../models/School.js";
import { catchAsync } from "../utils/catchAsync.js";

export const globalSearch = catchAsync(async (req, res) => {
  const q = req.query.q || "";
  const regex = { $regex: q, $options: "i" };

  const [students, projects, talents, schools] = await Promise.all([
    User.find({ role: "student", $or: [{ fullName: regex }, { skills: regex }, { schoolName: regex }] })
      .select("fullName avatar schoolName district state skills"),
    Project.find({ $or: [{ title: regex }, { category: regex }, { schoolName: regex }] }).limit(10),
    Talent.find({ $or: [{ title: regex }, { category: regex }] }).limit(10),
    School.find({ $or: [{ name: regex }, { district: regex }, { state: regex }] }).limit(10)
  ]);

  res.json({ success: true, results: { students, projects, talents, schools } });
});
