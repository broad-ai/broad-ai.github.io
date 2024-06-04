import express from 'express';
import bodyParser from 'body-parser';
import cors from "cors";

const app = express();
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors())

// Import BroadAI
import BroadAI from "broadai";

// -- Published BroadAI Agents
import aviator from 'broadai-agents/aviator';
import financialAnalyst from 'broadai-agents/financial-analyst';
import researcher from 'broadai-agents/researcher';
import weatherman from 'broadai-agents/weatherman';


// -- Create BroadAI MAS instance
const broadAIConfiguration = {
  "llmapi": {
    "method": "POST",
    "url": "https://api.openai.com/v1/chat/completions",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + process.env['OPENAI_KEY']
    },
    "data_template": {
      "model": "gpt-3.5-turbo-0125",
      "messages": [{
        "role": "system",
        "content": "{{system}} {{context}}"
      },
      {
        "role": "user",
        "content": "{{task}} {{format}}"
      }]
    },
    "response_template": "choices.0.message.content"
  }
};
const broadai = new BroadAI([aviator.agent, financialAnalyst.agent, researcher.agent, weatherman.agent], broadAIConfiguration);

// -- Register agents
aviator.register(broadai.config, { "aviationstack": { "api_key": process.env['aviationstack'] } });
financialAnalyst.register(broadai.config, { "financialmodelingprep": { "api_key": process.env['financialmodelingprep'] } });
researcher.register(broadai.config, { "google_search_engine": { "api_key": process.env['google_search_engine'], "programmable_search_engine_id": process.env['programmable_search_engine_id'] }, "yelp": { "api_key": process.env['yelp'] } });
weatherman.register(broadai.config, { "openweathermap": { "api_key": process.env['openweathermap'] } });

// -- Ask BroadAI
app.post('/ask', (req, res) => {
  let notes = req.body['notes'];
  console.log("[LOG]", "Problem statement: \n", notes);
  // plan
  broadai.plan(notes, true)
    .then((plan) => {
      console.log("[LOG]", "Plan: \n", JSON.stringify(plan, null, 2));
      // execute
      broadai.execute(plan)
        .then((results) => {
          console.log("[LOG]", "Plan results: \n", JSON.stringify(results, null, 2));
          // respond
          broadai.respond(results)
            .then((response) => {
              console.log("[LOG]", "Final Response: \n", JSON.stringify(response, null, 2));
              res.json(response);
            }).catch((err) => res.json({ "html_tag": "p", "text": "Response generation FAILED" }));
        }).catch((err) => res.json({ "html_tag": "p", "text": "Plan execution FAILED" }));
    }).catch((err) => res.json({ "html_tag": "p", "text": "Plan generation FAILED" }));
});


// -- Ping
app.get('/', (req, res) => {
  res.json({ "ping": "success", "params": req.params, "query": req.query, "body": req.body });
});


// Start the server
app.listen(process.env['PORT'] || 8080, async () => {
  console.log("---\n", "Server is running on port", process.env['PORT'] || 8080);
  // console.log(process.env, "\n---");
});
