import { v2 as cloudinary } from "cloudinary";
import { ENV } from "./env.js";

const isCloudinaryConfigured = Boolean(
  ENV.CLOUDINARY_CLOUD_NAME && ENV.CLOUDINARY_API_KEY && ENV.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
    api_key: ENV.CLOUDINARY_API_KEY,
    api_secret: ENV.CLOUDINARY_API_SECRET,
  });
}

const isCloudinaryUrl = (value = "") =>
  typeof value === "string" && value.includes("res.cloudinary.com");

export const uploadProfileImage = async (image, userId) => {
  if (!image) return null;
  if (!isCloudinaryConfigured) {
    throw new Error("Cloudinary is not configured");
  }

  const result = await cloudinary.uploader.upload(image, {
    folder: ENV.CLOUDINARY_FOLDER,
    public_id: `user_${userId}_${Date.now()}`,
    overwrite: true,
    resource_type: "image",
    transformation: [
      { width: 512, height: 512, crop: "fill", gravity: "face" },
      { quality: "auto", fetch_format: "auto" },
    ],
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
};

export const deleteProfileImage = async (publicId) => {
  if (!publicId || !isCloudinaryConfigured) return;
  await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
};

export const resolveProfileImageUpdate = async ({ incomingImage, existingImage, existingPublicId, userId }) => {
  if (incomingImage === undefined) {
    return null;
  }

  if (!incomingImage) {
    if (existingPublicId) await deleteProfileImage(existingPublicId);
    return { profileImage: "", profileImagePublicId: "" };
  }

  if (incomingImage === existingImage || isCloudinaryUrl(incomingImage)) {
    return {
      profileImage: incomingImage,
      profileImagePublicId: existingPublicId || "",
    };
  }

  const uploaded = await uploadProfileImage(incomingImage, userId);
  if (existingPublicId) await deleteProfileImage(existingPublicId);

  return {
    profileImage: uploaded.url,
    profileImagePublicId: uploaded.publicId,
  };
};
