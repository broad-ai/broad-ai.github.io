---
layout: docs
title: BroadAI MAS Documentation
---

<div style="text-align:right;margin-bottom:20px;">
  <a href="/" class="button">Home</a>
  <a href="/docu-agentic.html" class="button" style="background-color:#12c3e2;">Build Agent</a>
  <a href="/agent-store.html" class="button" style="background-color:#feaf4d;">Agent Store</a>
  <a href="/demo.html" class="button" style="background-color:#20a18e;">Live Demo</a>
</div>

# Create BroadAI Multi-Agent System

<img src="./assets/images/mas.png" style="background:transparent;width:80%;margin-left:auto;margin-right:auto;margin:20px;">


The BroadAI Multi-Agent System (MAS) framework is used by application developers to add artificial intelligence capabilities into their applications. This **NodeJS** based framework consumes the registered agents to perform complex tasks collectively leading to the solution for the problem presented to the AI system.

The BroadAI MAS framework relies on Large Language Model's (LLM's) capabilities to develop a step-by-step plan to solve the problem at hand. The developer must provide access to the LLM as well as a list of registered agents that BroadAI MAS will utilize in developing it's approach to solve the given problem.

---

## Register Your App (FREE & OPTIONAL)

Register your application to generate a unique **App ID**. If you do not provide `appid` in your BroadAIConfiguration, BroadAI will be able to use only the in-built General Assistant agent. All other registered agents will be ignored until a valid `appid` is provided in the BroadAIConfiguration.

<div class="top">
  <div class="mission">
  <form>
    <h3>
      Please tell us about your App
    </h3>
    <div style='padding:0;width:100%;margin-bottom:2em;'>
      <div style="display:inline;float:left;">
        <input type="text" id="appname" name="appname" placeholder="App name, e.g. CustomerCaseFinder" required style="width:calc(100% - 20px); padding:10px; margin:0.5em 0; border:1px solid #ddd; border-radius:4px; box-sizing:border-box;">
        <input type="text" id="ownername" name="ownername" placeholder="Your name, e.g. John Doe" required style="width:calc(100% - 20px); padding:10px; margin:0.5em 0; border:1px solid #ddd; border-radius:4px; box-sizing:border-box;">
        <input type="text" id="owneremail" name="owneremail" placeholder="Your email, e.g. johndoe@example.com" required style="width:calc(100% - 20px); padding:10px; margin:0.5em 0; border:1px solid #ddd; border-radius:4px; box-sizing:border-box;">
        <div id="emailvalidation" style="color:red;"></div>
        <textarea id="purpose" name="purpose" rows="6" required placeholder="Briefly describe how you will use BroadAI in your application" style="width:calc(100% - 20px); padding:10px; margin:0.5em 0; border:1px solid #ddd; border-radius:4px; box-sizing:border-box;"></textarea>
      </div>
      <div style="display:inline;float:right;">
        <input type="button" id="btnregister" value="Register" onClick="registerApp()" style="font-family: 'Architects Daughter', 'Helvetica Neue', Helvetica, Arial, serif; font-size: 18px; text-align: center; padding: 10px; margin: 0 10px 10px 0; color: #fff; background-color: #2e7bcf; border: none; border-radius: 5px; -moz-border-radius: 5px; -webkit-border-radius: 5px;">
      </div>
    </div>
  </form>
  </div>

  <div class="lead" id="lead">
    <div id="message"> 
    <span style="font-size:0.8em;">
    We will use this App ID to track anonymous engagement metrics, such as number of calls to agents registered in your application for monitoring usage, billing, etc. We will not collect any of your user's information - not even their emailIDs. We leave the application monitoring on your shoulders!
    </span>
    <!-- .. result .. --> 
    </div>
  </div>
</div>

---

## Installation

Install the `broadai` package locally.

```shell
npm install broadai --save
```

You must then import the package into your application code. 

BroadAI can be used with both ECMAScript as well as TypeScript codebases.

```javascript
// if using ECMAScript
const BroadAI = require('broadai');

// if using TypeScript
import BroadAI from 'broadai';
```

---

## Creating BroadAI instance (object)

At this point, you are ready to create BroadAI object by passing two parameters to the constructor:

```javascript
// create an instance of BroadAI MAS framework
const ai = new BroadAI([ /* BroadAIAgents */ ], /* BroadAIConfiguration */);
```

- **`BroadAIAgents`** is an array of agents that BroadAI MAS must take into account when addressing the problem statement. Each agent has a `agent` property, which must be supplied during instantiation of BroadAI MAS object. Make sure to register the agent and pass BroadAI configuration property, `config` along with agent-specific configuration.

Install the `broadai-agents` package locally.

```shell
npm install broadai-agents --save
```

```javascript
// import required agent (e.g. researcher)
import researcher from 'broadai-agents/researcher';

// supply agent property when creating BroadAI instance (object)
const ai = new BroadAI([ research.agent ], /* BroadAIConfiguration */);

// register the agent along with agent-specific configuration (as provided in agent documentation)
researcher.register(ai.config, agentConfig?); // note we are passing BroadAI configuration (ai.config)
```

- **`BroadAIConfiguration`** which is providing access and structure to use the Large Language Model (LLM) of your choice. Since the API call signatures differ between different LLM providers, the configuration is flexible to adopt any large language model, including privately hosted models. 

The structure of the ```BroadAIConfiguration``` is below:

```javascript
let broadAIConfiguration = {

  /* ** (1) BroadAI Personality ** */
  "appid": "XXXXXXXX",
  
  /* ** (2) BroadAI Personality ** */
  "personality":{
    "name": "<name>",                         // -- default: Sutradhar, meaning conductor
    "role": "<role>",                         // -- default: analyst
    "pov": "first-person |or| third-person",  // -- default: first-person
  },

  /* ** (3) LLM API Configuration ** */
  "llmapi": {
    "method": "GET" | "POST" | "PUT" | "DELETE",
    "url": "<https://>",          // -- API endpoint to access the model
    "headers": {                  // -- API headers
      // e.g. "Content-Type": "application/json"
      // e.g. "Authorization": "Bearer <token>"
    },
    "data_template": { ... },               // -- refer further details below
    "response_template": "<dot.notation>"   // -- refer further details below
  },

  /* ** (4) Conversation History Configuration ** */
  "history": {
    "enabled": true,            // -- whether conversation history should be enabled
    "max_exchanges": 5          // -- number of Q & A exchanges that must be retained (1 exchange = 1 user question + 1 BroadAI answer)
  }
}
```

### appid

  Use the `appid` received after registering your application. Each BroadAI MAS application must be registered with a new `appid`. This is an optional field and if not provided, all registered agents in your app will be ignored until a valid `appid` is provided in the BroadAIConfiguration.

### personality

  **`name`**:

  A BroadAI system runs as a singular entity and uses agents to acquaint skills. This parameter will help identify the MAS system with a persoanable name.

  **`role`**:

  What role does your BroadAI system play? e.g. Analyst, Stock broker, News reporter, etc.

  **`pov`**:

  What point-of-view (pov) should BroadAI use when responding? Choose between 'first-person' or 'third-person'.

### llmapi


  **`url`**:

  This refers to the API endpoint where LLM is accessible.
  
  **`method`**:

  This refers to the HTTP method used by the LLM API endpoint. 

<div markdown="1" style="margin-top:20px; margin-bottom:40px; padding:1.25em 1em 1.25em 1em; font-weight:400; box-shadow:2px 2px 4px 1px #999; border:1px solid;">

  **Example for OpenAI**:
    
  *Refer [OpenAI API Reference](https://platform.openai.com/docs/api-reference/making-requests){:target="_blank"}*
    
  ```javascript
    "method": "POST",
    "url": "https://api.openai.com/v1/chat/completions",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer <OPENAI_KEY>"
    }
  ```
    
  **Example for Google Gemini**:
    
  *Refer [Google Gemini API Reference](https://ai.google.dev/api/rest/v1/models/generateContent#http-request){:target="_blank"}*
    
  ```javascript
    "method": "POST",
    "url": "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=<GOOGLEAI_KEY>",
    "headers": {
      "Content-Type": "application/json"
    }
  ```

  **Example for Anthropic**:
    
  *Refer [Anthropic API Reference](https://docs.anthropic.com/en/api/messages){:target="_blank"}*
    
  ```javascript
    "method": "POST",
    "url": "https://api.anthropic.com/v1/messages",
    "headers": {
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01",
      "x-api-key": "<CLAUDEAI_KEY>"
    }
  ```

</div>

  **`data_template`**:
  
  This refers to the data that must be sent to the API endpoint as per the LLM provider's documentation. This is where the prompt gets supplied dynamically for the LLM to respond. Hence the configuration must specify prompt elements (`system`, `context`, `task`, and `format`) them as placeholders.

  *Note:* The Prompt elements - `system`, `context`, `task`, and `format` - must be passed in here within double-brace-brackets - \{\{ and \}\}. Escaping the brace-brackets is not required. Read more about this in the [Create BroadAI Agents](/docu-agentic.html) section since this background information is greatly relevant when you are developing an agent.
  
  e.g. **\{\{system\}\}** is valid, while **\\\{\\\{system\\\}\\\}** is invalid. 
  
  *Also note:* There must be no spaces between the brace-brackets and prompt part. 
  
  e.g. **\{\{system\}\}** is valid, while **\{\{ system \}\}** is invalid.

<div markdown="1" style="margin-top:20px; margin-bottom:40px; padding:1.25em 1em 1.25em 1em; font-weight:400; box-shadow:2px 2px 4px 1px #999; border:1px solid;">
 
  **Example for OpenAI**:
    
  *Refer [OpenAI API Reference](https://platform.openai.com/docs/api-reference/making-requests){:target="_blank"}*
    
  ```javascript
  let data_template = {
    "model": "gpt-3.5-turbo-0125",
    "messages": [{
      "role": "system",
      "content": [{
        "type": "text",
        "text": "\{\{system\}\} \{\{context\}\}"
      }]
    },
    {
      "role": "user",
      "content": [{
        "type": "text",
        "text": "\{\{task\}\} \{\{format\}\}"
      }]
    }]
  }
  ```
    
  **Example for Google Gemini**:
    
  *Refer [Google Gemini API Reference](https://ai.google.dev/api/rest/v1/models/generateContent#request-body){:target="_blank"}*
    
  ```javascript
  let data_template ={
   "contents": [{
    "role": "user",
    "parts": [{
      "text": "\{\{system\}\} \{\{context\}\}",
     },
     {
      "text": "\{\{task\}\} \{\{format\}\}",
     }]
   }]
  }
  ```

  **Example for Anthropic**:
    
  *Refer [Anthropic API Reference](https://docs.anthropic.com/en/api/messages){:target="_blank"}*
    
  ```javascript
  let data_template = {
    "model": "claude-3-haiku-20240307",
    "messages": [{
      "role": "user",
      "content": [{
          "type": "text", 
          "text": "\{\{system\}\} \{\{context\}\}"
        },
        {
          "type": "text", 
          "text": "\{\{task\}\} \{\{format\}\}"
        }]
    }]
  }
  ```

</div>
    
  **`response_template`**: 
   
  This refers to the <u>dot-path-notation</u> of where LLM's response will be provided. 

<div markdown="1" style="margin-top:20px; margin-bottom:40px; padding:1.25em 1em 1.25em 1em; font-weight:400; box-shadow:2px 2px 4px 1px #999; border:1px solid;">

  **Example for OpenAI**:
    
  *Refer [OpenAI API Reference](https://platform.openai.com/docs/api-reference/making-requests){:target="_blank"}*
    
  ```javascript
    "response_template": "choices.0.message.content"
  ```
    
  **Example for Google Gemini**:
    
  *Refer [Google Gemini API Reference](https://ai.google.dev/api/rest/v1/GenerateContentResponse)*
    
  ```javascript
    "response_template": "candidates.0.content.parts.0.text"
  ```

  **Example for Anthropic**:
    
  *Refer [Anthropic API Reference](https://docs.anthropic.com/en/api/messages)*
    
  ```javascript
    "response_template": "content.0.text"
  ```

</div>

### history

  **`enabled`**:

  Whether BroadAI should collect history of conversations.

  **`max_exchanges`**:

  If BroadAI must remember conversations, this parameter defines how many exchanges should it maintain. Note: 1 exchange is a rountrip of 1 user question and 1 response.

---

## BroadAI MAS Method

BroadAI MAS provides a method that orchestrates the entire planning, refining, execution, and response generation process utilizing the registered agents. This is by-far the greatest value provided by BroadAI framework because it greatly simplifies the entire process of incorporating GenAI in your application. 

*Note*: Method returns Promise.

### Go: 

This single method generates a plan to address the problem statement / question. You can choose to have BroadAI audit the initial plan and refine it further. It is highly recommended to generate a refined plan. However note that if `refinedPlan` is set to `true`, naturally more LLM tokens will be consumed. Lastly, you may also supply a history of conversation from previous responses so that BroadAI can emulate a chat-like experience by using context from previous conversations.

`go(question, refinedPlan, conversations)`

| Parameter | Type | M / O | Description |
|-----|-----|-----|-----|
| **question** | string | Mandatory | User's question or problem statement. |
| **refinedPlan** | boolean | Mandatory | Indicate whether BroadAI should critically audit it's initial plan and generate an updated plan. |
| **conversations** | Array | Optional | Provide conversation history (if enabled). Conversation history is an array of Q & A exchanges between user and BroadAI. |

**Output**: 

```json
{
  "plan": {
    "status": "status",
    "plan": [{
      "sequence": 0,
      "objective": "objective",
      "agent": "AgentName",
      "skill": {
          "name": "skillName",
          "parameters": {
              "param": "value"
          }
      },
      "result": "result of step execution"
    }, ...],
  "reason": "reason"
  },
  "response": {
    "status": "status",
    "response": [
        {
            "html_tag": "tag",
            "text": "text"
        }, ...
    ],
    "conversation": [ ],
    "reason": "reason"
  }
}

```

**Usage**: 

```javascript
const ai = new BroadAI([ /* BroadAIAgents */ ], /* BroadAIConfiguration */);

ai.go(problemStatement, true, conversations).then((response)=>{ 
  console.log(response);
}).catch((err)=>console.log(err));
```

**Example Output**: 

```json
{
  "plan": {
    "status": 'refined',
    "plan": [
      {
        "sequence": 0,
        "objective": 'Find the latitude and longitude coordinates of Columbus airport',
        "agent": 'Researcher',
        "skill": {
          "name": 'findBusinesses',
          "parameters": { "term": 'fast food', "location": 'Columbus airport' }
        },
        "result": 'City Barbeque (3.9 stars) | 108 S Stygler Rd Gahanna, OH 43230 Ph: (614) 416-8890[alias: city-barbeque-gahanna-2]\n' +
          "Raising Cane's Chicken Fingers (3.4 stars) | 1320 N Hamilton Rd Gahanna, OH 43230 Ph: (614) 475-1300[alias: raising-canes-chicken-fingers-gahanna]\n" +
          'Chick-fil-A (3.2 stars) | 3940 Morse Rd Columbus, OH 43219 Ph: (614) 414-7222[alias: chick-fil-a-columbus-22]\n' +
          'Sonic Drive-In (1.9 stars) | 2846 Stelzer Rd Columbus, OH 43219 Ph: (614) 532-5738[alias: sonic-drive-in-columbus-17]\n' +
          'MOD Pizza (4.2 stars) | 333 S Hamilton Rd Gahanna, OH 43230 Ph: (614) 914-4693[alias: mod-pizza-gahanna]\n' +
          "McDonald's (1.3 stars) | 4250 International Gtwy Columbus, OH 43219 Ph: (614) 236-6066[alias: mcdonalds-columbus-79]"
      }
    ],
    "reason": 'Already optimal.'
  },
  "response": {
    "status": 'complete',
    "response": [
      {
        "html_tag": 'p',
        "text": 'To find the latitude and longitude coordinates of the fast food joints around Columbus airport, I would need the specific addresses of the fast food locations near the airport. Once provided, I can extract the coordinates based on the addresses provided.'
      }
    ],
    "conversation": [
      '> Q: Find fast food joints around Columbus airport',
      '> A: To find the latitude and longitude coordinates of the fast food joints around Columbus airport, I would need the specific addresses of the fast food locations near the airport. Once provided, I can extract the coordinates based on the addresses provided.'
    ],
    "reason": 'Utilized the plan results which highlighted the need for addresses to determine the latitude and longitude coordinates of the fast food joints.'
  }
}
```

---
