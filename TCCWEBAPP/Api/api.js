const axios = require('axios'); 
const OpenAIApi = require("openai"); 

require("dotenv").config();
// Define your OpenAI API key
//const apiKey="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";
OPENAI_SECRET_KEY="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";
const openAi = new OpenAIApi({
  apiKey: OPENAI_SECRET_KEY,
  }); 

//const openAi = new OpenAIApi(newConfig); 
// Function to make a request to the GPT-3 API
generateResponse=async(inputText)=>{
  try {
    // const response = await axios.post(
    //     'https://api.openai.com/v1/engines/gpt-3.5-turbo',
    //   {
    //     messages:[
    //         {
    //           role: 'system',
    //           content: 'You are a helpful assistant.' // This sets the behavior of the assistant.
    //         },
    //         {
    //           role: 'user',
    //           content: inputText
    //         }
    //       ],
    //     max_tokens: 50, // You can adjust this to control response length
    //   },
    //   {
    //     headers: {
    //       'Authorization': `Bearer${apiKey}`,
    //       'Content-Type': 'application/json',
    //     },
    //   }
    // );
    const GPTOutput = await openAi.chat.completions.create({ 
      model: "gpt-3.5-turbo-16k", 
      messages:  [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: inputText.toString()},
      ] ,
      temperature: 0,
      max_tokens: 256,
    }); 
    return GPTOutput.choices[0].message.content;
  } catch (error) {
    //console.error('Error:', error);
    throw error;
  }
}
module.exports = generateResponse;

// // Example usage
// const prompt = 'Once upon a time';
// generateResponse(prompt)
//   .then(response => {
//     console.log('Generated text:', response);
//   })
//   .catch(err => {
//     console.error('Error:', err);
//   });
