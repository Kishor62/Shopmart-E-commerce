import { v2 as cloudinary } from "cloudinary";

export const isCloudinaryConfigured = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );

// Config har call par set hota hai taaki .env load hone ke baad hi use ho
const configure = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
};

// Buffer (multer memory storage) ko Cloudinary par upload karta hai
export const uploadBuffer = (buffer, folder = "shopmart/products") => {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary configure nahi hai (.env mein keys daalo)");
  }
  configure();

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
};

export const deleteImage = async (publicId) => {
  if (!publicId || !isCloudinaryConfigured()) return;
  configure();
  await cloudinary.uploader.destroy(publicId);
};
