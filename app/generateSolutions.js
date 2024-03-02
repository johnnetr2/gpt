import openai from "./config.js";
import dtkSystem from "./systemMessages/dtkSystemMessage.js";
import dtkUserMessage from "./systemMessages/dtkUserMessage.js";
import dataset from "./genData/dtk.json" assert { type: "json" };
import { promises as fs } from "fs";
import { promisify } from "util";
import { setTimeout } from "timers";

const delay = promisify(setTimeout);
const outputPath = "./app/output/generatedSolutions.json";

async function ensureDir(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function loadExistingSolutions() {
  try {
    const rawData = await fs.readFile(outputPath, "utf-8");
    return JSON.parse(rawData);
  } catch (err) {
    return {}; // Return empty object if file does not exist yet
  }
}

async function generateSolutions() {
  // Ensure the output directory exists
  await ensureDir("./app/output");

  const existingSolutions = await loadExistingSolutions();

  for (let key in dataset) {
    if (existingSolutions[key]) {
      console.log(`Skipping already solved question with key: ${key}`);
      continue; // Skip already solved questions
    }

    const fullQuestion = dataset[key];
    //console.log(dtkSystem(fullQuestion));
    let retries = 5;
    const imageUrl = (fullQuestion.questionMultipart.match(/\((.*?)\)/) ||
      [])[1];
    await console.log(imageUrl);

    while (retries > 0) {
      try {
        // Assuming the imageUrl is part of your fullQuestion object or similarly accessible
        // Adjust according to your data structure
        const userMessage = await dtkUserMessage(imageUrl); // Wait for the base64 conversion and message preparation

        const response = await openai.createChatCompletion({
          model: "gpt-4-vision-preview",
          messages: [
            await dtkSystem(fullQuestion),
            userMessage, // Use the awaited userMessage
          ],
          max_tokens: 6000,
          temperature: 0,
        });
        // Save solution to existing solutions and write to file
        existingSolutions[key] = {
          ...dataset[key],
          answer: response.data.choices[0].message.content,
        };
        await fs.writeFile(
          outputPath,
          JSON.stringify(existingSolutions, null, 2)
        );
        console.log(`Success for key ${key}`);
        console.log(response.data, response.data.choices[0].message.content);

        break; // success, exit the loop
      } catch (err) {
        // Error handling remains the same
      }
    }
    await delay(100);
  }
  //console.log(existingSolutions);
}

export default generateSolutions;
