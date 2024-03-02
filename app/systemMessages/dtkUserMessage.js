import https from "https";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import url from "url"; // Node's URL module for parsing URLs
import { fileURLToPath } from "url"; // Import the function to convert URL to path

// Determine the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Function to download an image and optionally convert SVG to PNG
const downloadImageAndMetadata = (imageUrl) => {
  return new Promise((resolve, reject) => {
    https.get(imageUrl, (response) => {
      const chunks = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", async () => {
        let buffer = Buffer.concat(chunks);
        try {
          if (
            response.headers["content-type"] === "image/svg+xml" ||
            imageUrl.endsWith(".svg")
          ) {
            // If SVG, convert to PNG
            buffer = await sharp(buffer, { density: 300 })
              .png()
              .flatten({ background: "white" }) // Ensure white background
              .toBuffer();
          }
          resolve(buffer);
        } catch (error) {
          reject(error);
        }
      });
      response.on("error", reject);
    });
  });
};

// Main function that handles the image processing
export const dtkUserMessage = async (imageUrl, newWidth = 2000) => {
  try {
    const buffer = await downloadImageAndMetadata(imageUrl);

    // Resize the image with newWidth while maintaining aspect ratio and convert it to base64
    const base64Image = await sharp(buffer)
      .resize(newWidth)
      .flatten({ background: "white" }) // Apply white background for images with transparency
      .toBuffer()
      .then((outputBuffer) => outputBuffer.toString("base64"));

    // Produce image locally here
    // const parsedUrl = new URL(imageUrl);
    // let filename = parsedUrl.pathname.split("/").slice(2).join("_"); // Adjusted to include the entire path
    // filename = filename.replace(/\.svg$/i, ".png"); // Change the extension from .svg to .png
    // const directory = path.join(__dirname, "image");
    // if (!fs.existsSync(directory)) {
    //   fs.mkdirSync(directory, { recursive: true });
    // }
    // const outputPath = path.join(directory, filename); // Define the output file path
    // fs.writeFileSync(outputPath, Buffer.from(base64Image, "base64"));
    // console.log(`Image saved for inspection at: ${outputPath}`);

    // Inspect the resized image metadata
    sharp(Buffer.from(base64Image, "base64"))
      .metadata()
      .then((metadata) => {
        console.log(`Width: ${metadata.width}, Height: ${metadata.height}`);
        // Here you can also confirm the width is as expected

        // If you're interested in the file size as a rough indicator of quality/density:
        const imageSize = Buffer.byteLength(Buffer.from(base64Image, "base64"));
        console.log(`Approximate Image File Size: ${imageSize} bytes`);
      });

    const content = [
      {
        type: "text",
        text: "Hur löser man uppgiften på mest effektiva sätt och under 1minut?",
      },
      {
        type: "image_url",
        image_url: `data:image/png;base64,${base64Image}`,
      },
    ];

    console.log("Image processing complete");
    return { role: "user", content: content };
  } catch (error) {
    console.error("Error processing image:", error);
    throw error;
  }
};

export default dtkUserMessage;
