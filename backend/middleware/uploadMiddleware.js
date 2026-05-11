import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const allowedFolders = [
      "skillverse/profiles",
      "skillverse/projects",
      "skillverse/talents",
      "skillverse/documents"
    ];
    let folder = req.body.folder || "skillverse/documents";
    if (!allowedFolders.includes(folder)) {
      folder = "skillverse/documents";
    }

    let resource_type = "auto";
    if (file.mimetype.startsWith("video/")) {
      resource_type = "video";
    } else if (file.mimetype === "application/pdf") {
      resource_type = "raw";
    }

    return {
      folder: folder,
      resource_type: resource_type,
      allowed_formats: ["jpg", "jpeg", "png", "webp", "mp4", "pdf"]
    };
  }
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB validation limit
  }
});
