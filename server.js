
const { OpenAI } = require("@langchain/openai");
require('dotenv').config();
const express = require ('express');
const bodyParser = require ('body-parser');

// instatiate a new object called MODEL using the OpenAi class
const model = new OpenAI({  
    openAIApiKey: process.env.OPEN_AI_API_KEY, //authorization using our secret key in dotenv.
    temperature: 0, //temperature prop = variability in response word. 0=precision 1=creativity
    modelName: 'gpt-3.5-turbo' //which lang model to use
  });

  const app = express();
  const port = 3000;

  // Middleware to parse the JSON requests
  app.use(bodyParser.json());

 
  // async function res holds response value 

  const promptFunct = async (input) => {
    try {
        const res = await model.invoke(input);
        return res;
    } catch (err) {
        console.error(err);
        throw(err);
    }
  };

// // Test call
// console.log(promptFunct("How do you capitalize all characters of a string in JavaScript?"));

  

