import User from "../models/User.js";
import Project from "../models/Project.js";
import School from "../models/School.js";
import Talent from "../models/Talent.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getLeaderboards = catchAsync(async (_req, res) => {
  const [topStudents, topProjects, topTalents, topSchools] = await Promise.all([
    User.find({ role: "student" })
      .sort({ "stats.followersCount": -1, "stats.projectsCount": -1 })
      .limit(10)
      .select("fullName avatar schoolName stats district state"),
    Project.find().sort({ "metrics.likes": -1 }).limit(10).populate("student", "fullName schoolName"),
    Talent.find().sort({ "metrics.likes": -1 }).limit(10).populate("student", "fullName schoolName"),
    School.find().sort({ "stats.awards": -1, "stats.projects": -1 }).limit(10)
  ]);

  res.json({
    success: true,
    leaderboards: { topStudents, topProjects, topTalents, topSchools }
  });
});
