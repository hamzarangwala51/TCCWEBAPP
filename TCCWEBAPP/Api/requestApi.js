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
    const Questions="Please tell me these features in this ${JSONFormat} format: Outcome of the Case(Winning/Losing/Partially Winning), How many years did the case take, Gender of the Appellant, Gender of the Judge, Type of issue (income tax; excise tax; anything else), Type of taxpayer (individual; corporation) Only include corporations (Inc./Ltd.) if the shareholders are individuals and are named,Initials of the Appellant,Initials of the Judge";
   
    let InputArray = [cit[j] + Questions];
    //let InputArray = [cit[7]+Questions];
    const response = await generateResponse(InputArray,); 
    ResponseFromAi.push(response.toString());
     jsonObject = JSON.parse(ResponseFromAi[j]);
     jsonArray.push(jsonObject);

    if ((j + 1) % requestsPerSet === 0 && j < cit.length-1) {
        console.log(`Waiting for ${longDelayAfterSets / 1000} seconds before the next set of requests`);
        await new Promise(resolve => setTimeout(resolve, longDelayAfterSets));
      }

    }
    return jsonArray;
};

module.exports = makeApiRequests;