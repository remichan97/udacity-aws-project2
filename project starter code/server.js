import express from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util.js";

// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware for post requests
app.use(bodyParser.json());

// Root Endpoint
// Displays a simple message to the user
app.get("/", async (req, res) => {
  res.send("Hello World");
  return;
});

app.get("/filteredimage", async (req, res) => {
  const pattern = /\.(jpg|jpeg|png|webp|avif|gif|svg)$/;
  let imageUrl = req.query.image_url;
  if (!pattern.test(imageUrl)) {
    res.status(400).send("Provided link is not an image");
    return;
  }

  filterImageFromURL(imageUrl)
    .then(async (image) => {
      res.status(200).sendFile(image, (ex) => {
        if (ex) {
          console.log(ex);
          res.status(403).send(ex);
        }
        else {
          deleteLocalFiles(image);
        }
      });
    })
    .catch((ex) => {
      res.status(422).send(ex);
    });
  return;
});

// Start the Server
app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
  console.log(`press CTRL+C to stop server`);
});
