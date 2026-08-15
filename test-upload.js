require("dotenv").config();
const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

(async () => {
  try {
    console.log("Testing Cloudinary credentials...");
    const res = await cloudinary.uploader.upload(
      "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png",
      { folder: "pixelforge-image-upload-test" },
    );
    console.log("Upload OK:", res.public_id, res.secure_url);
  } catch (err) {
    console.error("Upload ERR:", err);
  }
})();
