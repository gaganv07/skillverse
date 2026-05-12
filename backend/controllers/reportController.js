import Report from "../models/Report.js";
import { catchAsync } from "../utils/catchAsync.js";

export const createReport = catchAsync(async (req, res) => {
  const { targetType, targetId, reason, description } = req.body;

  const report = await Report.create({
    reportedBy: req.user._id,
    targetType,
    targetId,
    reason,
    description
  });

  res.status(201).json({ success: true, report });
});
