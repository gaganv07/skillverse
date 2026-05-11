import { catchAsync } from "../utils/catchAsync.js";

export const uploadAsset = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  // multer-storage-cloudinary automatically uploads the file and attaches the URL to req.file.path
  res.status(201).json({
    success: true,
    fileUrl: req.file.path
  });
});
