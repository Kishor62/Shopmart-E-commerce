import multer from "multer";
import ApiError from "../utils/ApiError.js";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) return cb(null, true);
  cb(new ApiError(400, "Sirf image files allowed hain"));
};

// Maximum 3 images, har ek 5MB tak
export const uploadProductImages = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 3 },
}).array("images", 3);
