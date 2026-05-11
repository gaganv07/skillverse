import Certificate from "../models/Certificate.js";
import { catchAsync } from "../utils/catchAsync.js";

export const createCertificate = catchAsync(async (req, res) => {
  const certificate = await Certificate.create(req.body);
  res.status(201).json({ success: true, certificate });
});

export const getCertificates = catchAsync(async (req, res) => {
  const certificates = await Certificate.find({ student: req.params.studentId }).populate("competition");
  res.json({ success: true, certificates });
});
