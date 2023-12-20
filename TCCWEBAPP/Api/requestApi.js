const generateResponse = require('./gptModel');
const fs = require('fs').promises;
const makeApiRequests = async (cit) => {
    let j=0;
    const ResponseFromAi = [];
     //const longDelayAfterSets = 60000;
    //const requestsPerSet = 3;
    let jsonObject=[];
    const jsonArray = [];
    const allResults = [];

    
    for(j=0;j<cit.length;j++){
    let InputArray = [cit[j]];
    //console.log(InputArray);
    //let InputArray = [cit[7]+Questions];
    const JSONFormatIfError = {
      "Outcome of the Case": "Not known",
      "How many years did the case take?": 'Not known',
      "Gender of the Appellant": "MALE",
      "Gender of the Judge": "MALE",
      "Type of issue": "Not known",
      "Initials of the Appellant": "C.W.A",
      "Initials of the Judge": "D.W.B",
    };
    const response = await generateResponse(InputArray); 
    ResponseFromAi.push(response.toString());
    try {
      const jsonString = ResponseFromAi[j].match(/\{.*\}/s)[0];
      console.log('Attempting to parse JSON:', jsonString);
       const jsonObject = JSON.parse(jsonString);
       jsonArray.push(jsonObject);
    } catch (error) {
      jsonArray.push(JSONFormatIfError);
      console.error('Error parsing JSON:', error);

    }

    // if ((j + 1) % requestsPerSet === 0 && j < cit.length-1) {
    //     console.log(`Waiting for ${longDelayAfterSets / 1000} seconds before the next set of requests`);
    //     await new Promise(resolve => setTimeout(resolve, longDelayAfterSets));
    //   }

    }
    allResults.push(...jsonArray);
    const allResultsFileName = 'all_results2020.json';
    await fs.writeFile(allResultsFileName, JSON.stringify(allResults, null, 2));
    return jsonArray;
};

module.exports = makeApiRequests;