require('dotenv').config();
const axios = require('axios');

(async () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.error('Missing CLOUDINARY env vars');
    process.exit(1);
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/list`;
  try {
    const res = await axios.get(url, {
      auth: { username: apiKey, password: apiSecret },
      params: { max_results: 1 },
    });
    console.log('API OK:', res.status, res.data.resources?.length);
  } catch (err) {
    if (err.response) {
      console.error('API ERR:', err.response.status, err.response.data || err.response.statusText);
    } else {
      console.error('API ERR:', err.message);
    }
  }
})();
