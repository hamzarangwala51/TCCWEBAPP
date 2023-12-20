const { json } = require("express");
const OpenAIApi = require("openai");
require("dotenv").config();

// Use environment variable for the API key
OPENAI_SECRET_KEY="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";
const openAi = new OpenAIApi({
  apiKey: OPENAI_SECRET_KEY,
});
const JSONFormat = {
  "Outcome of the Case": "Losing",
  "How many years did the case take?": '7',
  "Gender of the Appellant": "Female",
  "Gender of the Judge": "Female",
  "Type of issue": "Income Tax",
  "Initials of the Appellant": "C.W.D",
  "Initials of the Judge": "D.W.B",
};
const Questions="please tell me these features in this ${JSON.stringify(JSONFormat)} format: Outcome of the Case(Winning/Losing/Partially Winning),How many years did the case take,Initials of the Appellant(If it is a corporation take the initials of the Owner of the corporation or Shareholder),Initials of the Judge,Gender of the Appellant, Gender of the Judge,Type of issue (income tax; excise tax; anything else),Type of taxpayer (individual; corporation) Only include corporations (Inc./Ltd.) if the shareholders are individuals and are named.";


const systemMessage = { role: 'system', content: 'Based on the information provided can you'+(Questions)};

function getResponsefromPrevious(response){
const systemStartChunk = { role: 'system', content: 'Based on the information provided can you keep updating '+(response.toString())+'} only this json format'};
return systemStartChunk;
}
function getResponseforLast(response){
  const systemStartChunk = { role: 'system', content: 'Based on the information provided can you tell me '+(response.toString())+'} only this json format'};
  return systemStartChunk;
  }
const systemChunk = { role: 'system', content:'Continuation of the data for better understanding...'};
const system = { role: 'system', content: 'You are a helpful assistant.'};

async function generateResponse(inputArray,maxTokens) {
  // Ensure input is in an acceptable format (array of strings)
  if (!Array.isArray(inputArray) || inputArray.length === 0 || typeof inputArray[0] !== 'string') {
    throw new Error('Input must be an array of strings.');
  }

  // Tokenize input and check token count
  const inputContent = inputArray[0].toString();
  const tokenCount = countTokens(inputContent);
  console.log(inputContent.length);
  console.log(tokenCount);
  if (tokenCount < 16385) {
    return await getOpenAIResponse(inputContent, systemMessage,maxTokens);
  } else {
    const inputChunks = splitTextIntoChunks(inputContent, 16385);
    const responses = [];
    const chunkresp=[];
    for (const [index, chunk] of inputChunks.entries()) {
      const isLastChunk = index === inputChunks.length - 1;
      const isFirstChunk = index === 0;
      if(isFirstChunk){
         const response = await getOpenAIResponse(chunk,systemMessage,100);
         console.log(response.toString());
         chunkresp.push(response);
          //responses.push(response);
      }else if(isLastChunk){
        sys=getResponseforLast(chunkresp[chunkresp.length-1]);
        console.log(sys);
       const response = await getOpenAIResponse(chunk,sys,150);
        console.log(response.toString());
        responses.push(response);
      }else{
        sys=getResponsefromPrevious(chunkresp[chunkresp.length-1]);
        console.log(sys);
        const response = await getOpenAIResponse(chunk,sys,100);
        console.log(response.toString());
        chunkresp.push(response);
        //responses.push(response);
        //globalContext += response.toString();
      }

    }
    //globalContext='';

    return responses.join(' ');
  }
}

// Function to count the number of tokens in the input text
function countTokens(text) {
  // Here, you would implement logic to count the tokens based on OpenAI's tokenization rules
  // This is a placeholder and should be replaced with actual token counting logic
     const tokens_per_word = 1.3;
     const word_count = text.split(/\s+/).length;
     const estimated_tokens = word_count * tokens_per_word+1700;
  return estimated_tokens; // This is not correct for token counting
}

function splitTextIntoChunks(text, chunkSize) {
  const chunks = [];
  let currentChunk = '';

  for (const word of text.split(/\s+/)) {
    const wordTokenCount = countTokens(word);
    
    if ((currentChunk.length + wordTokenCount) <= chunkSize) {
      currentChunk += `${word} `;
    } else {
      chunks.push(currentChunk.trim());
      currentChunk = `${word} `;
    }
  }

  // Add the last chunk
  if (currentChunk.trim() !== '') {
    chunks.push(currentChunk.trim());
  }
  //console.log(currentChunk.length);
  //console.log(chunks.length);
  return chunks;
}
const getOpenAIResponse = async (content, systemMessage, maxTokens) => {
  if (!getOpenAIResponse.counter) {
    getOpenAIResponse.counter = 0;
  }

  console.log(content.length);

  try {
    const GPTOutput = await openAi.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [systemMessage, { role: 'user', content }],
      temperature: 0.00,
      max_tokens: maxTokens,
      response_format: { type: "json_object" }
    });
    getOpenAIResponse.counter++;

    if (getOpenAIResponse.counter % 3 === 0) {
      console.log('Waiting for 60 seconds...');
      await delay(60000); // Delay for 60 seconds (in milliseconds)
    }
    return GPTOutput.choices[0].message.content;
  } catch (error) {
    console.error("Error in getOpenAIResponse:", error);
    throw error;
  }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));



const processLargeInput = async (inputText,maxTokens) => {
  // Split the text into chunks that are less than the token limit
  // Placeholder for actual token-based splitting
  const tokensPerRequest = 16000;
  const textChunks = inputText.match(new RegExp(`.{1,${tokensPerRequest}}`, 'g'));
  
  let responses = [];
  let updatedSystemMessage = { ...systemMessage };

  for (const chunk of textChunks) {
    const response = await getOpenAIResponse(chunk, updatedSystemMessage,maxTokens);
    responses.push(response);
    updatedSystemMessage.content = response; 
    // Update the system message for the next chunk
  }

  return responses.join(' ');
};

const processLargeInputText = async (inputText, maxTokens) => {
  const JSONFormat = {
    "Outcome of the Case": "Losing",
    "How many years did the case take": "7",
    "Gender of the Appellant": "Female",
    "Gender of the Judge": "Female",
    "Type of issue": "Income Tax",
    'Type of taxpayer': 'Corporation',
    "Initials of the Appellant": "C.W.D",
    "Initials of the Judge": "D.W.B"
  };

  let Result =JSON.stringify(JSONFormat);

  // Now JSONFormat is a JavaScript object representing the JSON data.

  return Result;
};


module.exports = generateResponse;
