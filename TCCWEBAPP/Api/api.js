const OpenAIApi = require("openai");
require("dotenv").config();

OPENAI_SECRET_KEY="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";
const openAi = new OpenAIApi({
  apiKey: OPENAI_SECRET_KEY,
});

const systemMessage = { role: 'system', content: 'You are a helpful assistant.' };
console.time("HAMZA");
const generateResponse = async (inputText) => {
  try {
    const GPTOutput = await openAi.chat.completions.create({ 
      model: "gpt-3.5-turbo-16k", 
      messages: [systemMessage, { role: 'user', content: inputText }],
      temperature: 0,
    }); 
    return GPTOutput.choices[0].message.content;
  } catch (error) {
    throw error;
  }
};
console.timeEnd("HAMZA")
module.exports = generateResponse;
