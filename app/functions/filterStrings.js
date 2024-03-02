function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function parseResponse(response, dataset) {
  // Step 1: Split the string into individual options
  // We use a regular expression to split the string by either '\n' or ', '
  const options = response.split(/\n|, /);

  // Initialize an empty object to store the final output
  let result = {};

  // Step 2 and 3: Iterate through each option
  for (let option of options) {
    // Split each option into a key and a value based on the ') ' delimiter
    let [key, value] = option.split(") ");

    // Insert the key-value pair into the object
    result[key] = value;
  }

  // Capitalize the first letter of each value in result
  for (let key in result) {
    result[key] = capitalizeFirstLetter(result[key]);
  }

  // Combine dataset values and result object
  result = {
    Question: capitalizeFirstLetter(dataset.Question),
    ...result,
    "Correct Answer": capitalizeFirstLetter(dataset["Correct Answer"]),
    Solution: dataset.Solution,
  };

  // Now, shuffle the values of A, B, C, D, E while keeping the keys the same

  // const choices = ["A", "B", "C", "D", "E"];
  // const values = choices.map((key) => result[key]);
  // for (let i = values.length - 1; i > 0; i--) {
  //   const j = Math.floor(Math.random() * (i + 1));
  //   [values[i], values[j]] = [values[j], values[i]]; // Swap the values
  // }

  // // Reassign the shuffled values back to the result object
  // choices.forEach((key, i) => {
  //   result[key] = values[i];
  // });

  // Test the function
  console.log(result);
  return result;
}

export default parseResponse;
