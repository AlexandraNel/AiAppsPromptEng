
const { OpenAI } = require("@langchain/openai");
require('dotenv').config();
const express = require ('express');
const bodyParser = require ('body-parser');

const app = express();
const port = 3000;

 // Middleware to parse the JSON requests
 app.use(bodyParser.json());

// instatiate a new object called MODEL using the OpenAi class
const model = new OpenAI({  
    openAIApiKey: process.env.OPEN_AI_API_KEY, //authorization using our secret key in dotenv.
    temperature: 0, //temperature prop = variability in response word. 0=precision 1=creativity
    modelName: 'gpt-3.5-turbo' //which lang model to use
  });

  // async function res holds response value 

  const promptFunc = async (input) => {
    try {
        const res = await model.invoke(input);
        return res;
    } catch (err) {
        console.error(err);
        throw(err);
    }
  };

  // Endpoint to manage request
app.post('/ask', async (req, res) => {
  try {
    const userQuestion = req.body.question;

    if (!userQuestion) {
      return res.status(400).json ({ error: 'Please provide a question in the request body.'});
    }
  const result = await promptFunc(text);
res.json({ result });
  } catch (error) {
    console.error ('Error', error.message);
    res.status(500).json({ error: 'Internal Sever Error' });
  }
  });

  // Start the Server

  app.listen(port, () => {
    console.log(`Server is running on localhost: ${port}`);
  });

// // Test call
// console.log(promptFunct("How do you capitalize all characters of a string in JavaScript?"));

  

