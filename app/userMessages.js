// userMessage.js
const dataset = `{
  "003d3079450031983d2f": {
    "Year": "2017-HT-KVA5",
    "Quest. Number": 26,
    "Question": "Anna och Bea startade samtidigt och båda cyklade 30 km med konstant hastighet. **Vilken medelhastighet hade Anna?**",
    "Information (1)": "Anna kom fram 30 minuter före Bea.",
    "Information (2)": "När Anna kom fram hade Bea 7,5 km kvar att cykla.",
    "Correct Answer": "C",
    "Type": "Aritmetik",
    "Solution":"",
    "Solution Method": null
  }
}`;

export const parsedDataset = JSON.parse(dataset);

export const userMessages = { role: "user", content: dataset };
