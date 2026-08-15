require('dotenv').config();
const axios = require('axios');

(async () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const params = new URLSearchParams();
  params.append('file', 'https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png');
  params.append('folder', 'pixelforge-image-upload-test');

  try {
    const res = await axios.post(url, params.toString(), {
      auth: { username: apiKey, password: apiSecret },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      maxBodyLength: Infinity,
    });
    console.log('REST Upload OK', res.status, res.data.public_id);
  } catch (err) {
    if (err.response) console.error('REST Upload ERR', err.response.status, err.response.data);
    else console.error('REST Upload ERR', err.message);
  }
})();
