import openai from "./config.js";
import { systemMessages } from "./systemMessages.js";
import dataset from "./dataset.json" assert { type: "json" };
import fs from "fs";

async function demo() {
  // loop through dataset and send each question to the API
  for (let key in dataset) {
    const questString = JSON.stringify(dataset[key]);
    const questObj = dataset[key];
    await openai
      .createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [systemMessages, { role: "user", content: questString }],
        temperature: 0,
      })
      .then((response) => {
        questObj["Solution"] = response.data.choices[0].message.content;
        //console.log(response.data.choices[0].message.content);
      })
      .catch((err) => console.log(err));
  }

  console.log(dataset);

  // create new file with updated dataset
  fs.writeFileSync("newDataset.json", JSON.stringify(dataset, null, 2));
}

export default demo;
