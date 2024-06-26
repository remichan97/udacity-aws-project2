import express from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles, validateImageUrl } from "./util/util.js";
import { StatusCodes } from "http-status-codes";

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

  const url = req.query.image_url;

  if (!url)
    return res.status(StatusCodes.BAD_REQUEST).send("No image URLs for me to work with. Please provide a URL");

  if (!validateImageUrl(url)) {
    res.status(StatusCodes.BAD_REQUEST).send("Provided link is not an image");
    return;
  }

  filterImageFromURL(url)
    .then(async (image) => {
      res.status(StatusCodes.OK).sendFile(image, (ex) => {
        if (ex) {
          console.log(ex);
          res.status(StatusCodes.FORBIDDEN).send(ex);
        }
        else {
          deleteLocalFiles(image);
        }
      });
    })
    .catch((ex) => {
      res.status(StatusCodes.UNPROCESSABLE_ENTITY).send(ex);
    });
  return;
});

// Start the Server
app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
  console.log(`press CTRL+C to stop server`);
});