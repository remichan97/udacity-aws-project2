import fs from "fs";
import Jimp from "jimp";
import axios from "axios";

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await axios.get(inputURL, {
        responseType: "arraybuffer",
      });
      const photo = await Jimp.read(data?.data);
      const outpath =
        "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(outpath, () => {
          resolve(outpath);
        });
    } catch (error) {
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files) {
  fs.unlink(files, (ex) => {
    if (ex) {
      console.log(ex);
      throw ex;
    }
    else
      console.log("Successfully delete file");
  });
}

export function validateImageUrl(imageUrl) {
  const pattern = /\.(jpg|jpeg|png|webp|avif|gif|svg)$/;
  return pattern.test(imageUrl);
}

