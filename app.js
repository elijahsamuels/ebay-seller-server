const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;
const { lookupProductNameDiscogs } = require("./lookupProductNameDiscogs");
const { lookupProductNameMusicbrainz } = require("./lookupProductNameMusicbrainz");

app.use(cors());
app.use(express.json());

const axios = require("axios");

// app.get("/", (req, res) => {
//   res.send({ message: "hello" });
// });

app.post("/add-barcode", async (req, res) => {
  const { barcode } = req.body;

  let isAlbumDataRecieved = false;
  let albumData = null;
  if (barcode) {
    const musicBrainzRes = await lookupProductNameMusicbrainz(barcode);

    albumData = musicBrainzRes.musicBrainzData;
    isAlbumDataRecieved = musicBrainzRes.isAlbumDataRecieved;
  }

  if (isAlbumDataRecieved === false && barcode) {
    console.log("MusicBrainz returned nothing");
    const discogsRes = await lookupProductNameDiscogs(barcode);
    albumData = discogsRes.discogsData;
    isAlbumDataRecieved = discogsRes.isAlbumDataRecieved;
  }

  if (!isAlbumDataRecieved) {
    res.send({ albumData: `No metadata from MusicBrainz or Discogs for ${barcode}` });
    return;
  }

  if (!barcode) {
    res.send({ albumData: "Missing barcode!" });
    return;
  }

  res.send({ albumData });
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}.`);
});
