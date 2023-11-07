const OpenAIApi = require("openai");
require("dotenv").config();

// Use environment variable for the API key
OPENAI_SECRET_KEY="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";
const openAi = new OpenAIApi({
  apiKey: OPENAI_SECRET_KEY,
});

const systemMessage = { role: 'system', content: 'You are a helpful assistant.' };

async function generateResponse(inputArray) {
  // Ensure input is in an acceptable format (array of strings)
  if (!Array.isArray(inputArray) || inputArray.length === 0 || typeof inputArray[0] !== 'string') {
    throw new Error('Input must be an array of strings.');
  }

  // Tokenize input and check token count
  const inputContent = inputArray[0].toString();
  const tokenCount = countTokens(inputContent);
  console.log(tokenCount);
  if (tokenCount < 40000) {
    return await getOpenAIResponse(inputContent, systemMessage);
  } else {
    return await processLargeInput(inputContent);
  }
}

// Function to count the number of tokens in the input text
function countTokens(text) {
  // Here, you would implement logic to count the tokens based on OpenAI's tokenization rules
  // This is a placeholder and should be replaced with actual token counting logic
    const tokens_per_word=1.3;
    word_count = text.length;
    estimated_tokens = word_count * tokens_per_word
  return estimated_tokens; // This is not correct for token counting
}

const getOpenAIResponse = async (content, systemMessage) => {
  try {
    const GPTOutput = await openAi.chat.completions.create({
      model: "gpt-3.5-turbo-16k",
      messages: [systemMessage, { role: 'user', content }],
      temperature: 0.7,
    });
    return GPTOutput.choices[0].message.content;
  } catch (error) {
    console.error("Error in getOpenAIResponse:", error);
    throw error;
  }
};

const processLargeInput = async (inputText) => {
  // Split the text into chunks that are less than the token limit
  // Placeholder for actual token-based splitting
  const tokensPerRequest = 38000;
  const textChunks = inputText.match(new RegExp(`.{1,${tokensPerRequest}}`, 'g'));
  
  let responses = [];
  let updatedSystemMessage = { ...systemMessage };

  for (const chunk of textChunks) {
    const response = await getOpenAIResponse(chunk, updatedSystemMessage);
    responses.push(response);
    updatedSystemMessage.content = response; // Update the system message for the next chunk
  }

  return responses.join(' ');
};

module.exports = generateResponse;
