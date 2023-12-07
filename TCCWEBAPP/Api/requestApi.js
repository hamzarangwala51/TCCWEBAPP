const generateResponse = require('./gptModel');

const makeApiRequests = async (cit) => {
    let j=0;
    const ResponseFromAi = [];
     const longDelayAfterSets = 60000;
    const requestsPerSet = 3;
    let jsonObject=[];
    const jsonArray = [];

    
    for(j=0;j<cit.length;j++){
      const JSONFormat =
    '{\n' +
   '  "Outcome of the Case": "Losing",\n' +
   '  "How many years did the case take?": 7,\n' +
   '  "Gender of the Appellant": "Female",\n' +
   '  "Gender of the Judge": "Female",\n' +
   '  "Type of issue": "Income Tax",\n' +
   '  "Initials of the Appellant": "C.W.D"\n' +
   '  "Initials of the Judge": "D.W.B"\n' +
   '}';
    const Questions="Please tell me these features in this ${JSONFormat} format: Outcome of the Case(Winning/Losing/Partially Winning), How many years did the case take, Gender of the Appellant, Gender of the Judge, Type of issue (income tax; excise tax; anything else), Type of taxpayer (individual; corporation) Only include corporations (Inc./Ltd.) if the shareholders are individuals and are named, Initials of the Appellant(If it is a corporation take the initials of the Owner of the corporation or Shareholder),Initials of the Judge";
   
    let InputArray = [Questions+cit[j]];
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