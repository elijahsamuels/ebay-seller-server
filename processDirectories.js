const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { lookupProductNameDiscogs } = require("./lookupProductNameDiscogs");
const { lookupProductNameMusicbrainz } = require("./lookupProductNameMusicbrainz");

// Function to sanitize strings to be safe for filenames and directories
function sanitizeForFilename(value) {
  return value.replace(/[<>:"/\\|?*]/g, "-");
}

// Main function to process the directories and rename them
async function processDirectories(baseDirectory) {
  for await (const folder of fs.readdirSync(baseDirectory)) {
    const folderPath = path.join(baseDirectory, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;
    const barcode = folder;
    let newFolderName = lookupProductNameMusicbrainz(barcode);
    if (!newFolderName) {
      console.log(`No info found in MusicBrainz for barcode ${barcode}. Trying Discogs...`);
      newFolderName = lookupProductNameDiscogs(barcode);
      if (!newFolderName) {
        console.log(`Skipping ${folderPath} (No info found for barcode ${barcode})`);
        continue;
      }
    }
    newFolderName = sanitizeForFilename(newFolderName);
    const newFolderPath = path.join(baseDirectory, newFolderName);
    try {
      fs.renameSync(folderPath, newFolderPath);
      console.log(`Renamed: ${folderPath} -> ${newFolderPath}`);
    } catch (e) {
      console.error(`Error renaming ${folderPath} to ${newFolderPath}: ${e}`);
    }
  }
}

processDirectories("/Users/elijahsamuels/Downloads/@ Things to sell - new/TEMP");
