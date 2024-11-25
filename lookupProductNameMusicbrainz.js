const axios = require("axios");

// Function to sanitize strings to be safe for filenames and directories
function sanitizeForFilename(value) {
  return value.replace(/[<>:"/\\|?*]/g, "-");
}
// Function to look up the product name using a barcode (via MusicBrainz API)
async function lookupProductNameMusicbrainz(barcode) {
  const url = `https://musicbrainz.org/ws/2/release?query=barcode:${barcode}&fmt=json`;
  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.releases.length > 0) {
      const release = data.releases[0];
      const artistCredit = release["artist-credit"];

      let title = release.title.trim();
      let artistName = "";

      if (artistCredit && artistCredit.length > 0) {
        artistName = artistCredit[0].name.trim();
      }

      title = sanitizeForFilename(title);
      artistName = sanitizeForFilename(artistName);

      return { musicBrainzData: `${artistName} - ${title} - ${barcode}`, isAlbumDataRecieved: true };
    } else {
      return { musicBrainzData: null, isAlbumDataRecieved: false };
    }
  } catch (e) {
    console.error(`Error looking up barcode ${barcode} in MusicBrainz: ${e}`);
    return { musicBrainzData: null, isAlbumDataRecieved: false };
  }
}

module.exports = { lookupProductNameMusicbrainz };
