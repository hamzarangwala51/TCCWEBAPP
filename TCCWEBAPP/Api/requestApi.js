const generateResponse = require('./gptModel');

const makeApiRequests = async (cit) => {
    let j=0;
    const ResponseFromAi = [];
     const longDelayAfterSets = 60000;
    const requestsPerSet = 3;
    let jsonObject=[];
    const jsonArray = [];

    
    for(j=0;j<cit.length;j++){
    let InputArray = [cit[j]];
    //let InputArray = [cit[7]+Questions];
    const response = await generateResponse(InputArray); 
    ResponseFromAi.push(response.toString());
    try {
      const jsonString = ResponseFromAi[j].match(/\{.*\}/s)[0];
      console.log('Attempting to parse JSON:', jsonString);
      const jsonObject = JSON.parse(jsonString);
      jsonArray.push(jsonObject);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      // Handle the error, e.g., log it or take appropriate action
    }

    if ((j + 1) % requestsPerSet === 0 && j < cit.length-1) {
        console.log(`Waiting for ${longDelayAfterSets / 1000} seconds before the next set of requests`);
        await new Promise(resolve => setTimeout(resolve, longDelayAfterSets));
      }

    }
    return jsonArray;
};

module.exports = makeApiRequests;