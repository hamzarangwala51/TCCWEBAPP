const { response } = require('express');
const generateResponse = require('./gptModel');
const fs = require('fs').promises;

const makeApiRequests = async (cit) => {
  const ResponseFromAi = [];
  const jsonArray = [];
  const allResults = [];

  for (let j = 0; j < cit.length; j++) {
    let InputArray = [cit[j]];

    const JSONFormatIfError = {
      "Outcome of the Case": "Not known",
      "How many years did the case take?": 'Not known',
      "Gender of the Appellant": "MALE",
      "Gender of the Judge": "MALE",
      "Type of issue": "Not known",
      "Initials of the Appellant": "H.A.M",
      "Initials of the Judge": "Found Not",
    };
    try {
      const response = await generateResponse(InputArray);
      ResponseFromAi.push(response.toString());
      const jsonString = ResponseFromAi[j].match(/\{.*\}/s)[0];
      console.log('Attempting to parse JSON:', jsonString);
      const jsonObject = JSON.parse(jsonString);
      jsonArray.push(jsonObject);
    } catch (error) {
      jsonArray.push(JSONFormatIfError);
      console.error('Error during response generation:', error);
    }
  }

  const allResultsFileName = 'all_results2004_722.json';
  allResults.push(...jsonArray);

  try {
    await fs.writeFile(allResultsFileName, JSON.stringify(allResults, null, 2));
    console.log('File written successfully:', allResultsFileName);
  } catch (error) {
    console.error('Error writing to file:', error);
  } finally {
    return jsonArray;
  }
};

module.exports = makeApiRequests;
