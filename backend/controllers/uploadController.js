import cloudinary from "../config/cloudinary.js";
import { catchAsync } from "../utils/catchAsync.js";

export const uploadAsset = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  const resourceType = req.file.mimetype.startsWith("video") ? "video" : "auto";
  const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(base64, {
    folder: "skillverse",
    resource_type: resourceType
  });

  res.status(201).json({
    success: true,
    file: {
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type
    }
  });
});
