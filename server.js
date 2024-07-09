
const { OpenAI } = require("@langchain/openai");
require('dotenv').config();
const express = require ('express');
const bodyParser = require ('body-parser');
const { StructuredOutputParser } = require ("langchain/output_parsers");

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

  // StructurdParser defines a schema for the ouput and uses an outofbox method auch as fromnamesandDescriptions and getFormatInstructions
const parser = StructuredOutputParser.fromNamesAndDescriptions({
  code: "Javascript code that answers the user's question",
  explanation: "detailed explanation of the example code provided"
});

// under the new instatiated object we create a new variable that holds the value of formatInstructions, this is passed
// to our template for how we want the final response to be strcutured
const formatInstructions = parser.getFormatInstructions();


  // The promptTemplate object takes in a combination of user input along with a fixed 
// template string thereby allowing developers to set hard-coded parameters but at the 
// same time accepting dynamic user input. Additionally, the promptTemplate object contains 
// out-of-the-box methods provided by LangChain including the .format() method that we will 
// use to add variables to our templates! FOR MODEL CONTEXT
const { PromptTemplate } = require("@langchain/core/prompts");

// Instantiation of a new object called "prompt" using the "PromptTemplate" class
const prompt = new PromptTemplate ({
  // provides context to the ai- allows dev to pass instructional prompts
  // the template property is where we inject the user input using \n immediately followed by curly braces surrounding a variable name. 
  // The variable name is defined in the next property, inputVariables. The inputVariables property is an array and so, if we wanted, 
  // we could set that array to multiple variables and use all of them in the template.
  template: "You are a programming expert and will answer the users coding questions as thoroughly as possible using JavaScript. If the question is unrelated to coding, do not answer.\n{format_instructions}\n{question}",
  // inserts the input directly into template context
  inputVariables: ['question'],
  partialVariables: { format_instructions: formatInstructions}
});

  // async function res holds response value 
  const promptFunc = async (input) => {
    try {
      // format the prompt with user input
      // We use the .format() method on our instantiated prompt object to pass in user input to our template. 
      // Take note that the key of the object being passed into the format() method matches the variable name, 
      // question, and the value is the user input captured.
      const promptInput = await prompt.format({
        question: input
      });

      // Call the model with the formatted prompt
        const res = await model.invoke(promptInput);

        // for non coding q's model returns error message causing parse() to throw an dexeption
        // In this case, return the error message instead of the parsed results

        try{
          const parsedResults = await parser.parse(res);
          return parsedResults;
        } catch (err) {
          return res;
        }
    } 
    catch (err) {
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
  const result = await promptFunc(userQuestion);
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

  

