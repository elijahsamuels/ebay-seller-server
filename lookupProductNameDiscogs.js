const axios = require("axios");
require("dotenv").config();

const DISCOGS_API_TOKEN = process.env.DISCOGS_API_TOKEN;
// Function to sanitize strings to be safe for filenames and directories
function sanitizeForFilename(value) {
  return value.replace(/[<>:"/\\|?*]/g, "-");
}

// Function to look up the product name using a barcode (via Discogs API)
async function lookupProductNameDiscogs(barcode) {
  const url = `https://api.discogs.com/database/search?barcode=${barcode}&token=${DISCOGS_API_TOKEN}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.results.length > 0) {
      const title = data.results[0].title || "Unknown Title";

      return { discogsData: `${title} - ${barcode}`, isAlbumDataRecieved: true };
    } else {
      console.log("Discogs returned nothing");
      return { discogsData: null, isAlbumDataRecieved: false };
    }
  } catch (e) {
    console.error(`Error looking up barcode ${barcode} in Discogs: ${e}`);
    return { discogsData: null, isAlbumDataRecieved: false };
  }
}

module.exports = { lookupProductNameDiscogs };
