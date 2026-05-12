import User from "../models/User.js";
import Project from "../models/Project.js";
import Competition from "../models/Competition.js";
import School from "../models/School.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getDashboardAnalytics = catchAsync(async (req, res) => {
  const [
    totalUsers,
    totalStudents,
    totalTeachers,
    totalSchools,
    totalProjects,
    totalCompetitions,
    verifiedUsers,
    projectCategories
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "student" }),
    User.countDocuments({ role: "teacher" }),
    School.countDocuments(),
    Project.countDocuments(),
    Competition.countDocuments(),
    User.countDocuments({ isVerified: true }),
    Project.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])
  ]);

  res.json({
    success: true,
    analytics: {
      overview: {
        totalUsers,
        totalStudents,
        totalTeachers,
        totalSchools,
        totalProjects,
        totalCompetitions,
        verifiedUsers
      },
      categories: projectCategories
    }
  });
});
