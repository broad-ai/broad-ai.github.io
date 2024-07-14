---
layout: docs
title: BroadAI MAS Documentation
---

<div style="text-align:right;margin-bottom:20px;">
  <a href="/" class="button">Home</a>
  <a href="/docu-agentic.html" class="button" style="background-color:#12c3e2;">Build Agent</a>
  <a href="/agent-store.html" class="button" style="background-color:#feaf4d;">Agent Store</a>
  <a href="/demo-landing.html" class="button" style="background-color:#20a18e;">Live Demo</a>
</div>

---

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

  /* ** (3) LLM Configuration ** */
  "llm": {
    "provider": "openai" | "azure-openai" | "google" | "anthropic",
    "model": "<exact model name, e.g. gpt-3.5-turbo-0125>",
    "apikey": "<API Key>",
    "other":{}  // provide hyperscaler-specific details (see below for more details) 
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


### llm

  **`provider`**:

  Possible values: `openai`, `azure-openai`, `google`, `anthropic`.

  BroadAI currently supports following LLM providers:

  - [OpenAI](https://platform.openai.com/docs/models){:target="_blank"}

  - [Microsoft Azure OpenAI](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/models){:target="_blank"}

  - [Google](https://ai.google.dev/gemini-api/docs/models/gemini){:target="_blank"} *(models within v1beta release)*

  - [Anthropic](https://docs.anthropic.com/en/docs/about-claude/models){:target="_blank"}

  - *additional model providers will be added [upon request](mailto:broad.agents.ai@gmail.com?subject=Re%20new%20model%20support%20requested)*
  
  **`model`**:

  Please refer to the appropriate model provider documentation to identify the model you want to choose. All models are generally supported. You must provide the exact model name, such as, `gpt-3.5-turbo-0125` or `gemini-1.5-flash`.

<div markdown="1" style="margin-top:20px; margin-bottom:40px; padding:1.25em 1em 1.25em 1em; font-weight:400; box-shadow:2px 2px 4px 1px #999; border:1px solid;">

  **`azure-openai` specific details**

  If your model provider is Microsoft Azure, select this provider. In this case, the value of the `model` parameter must be the `deployment-id` from Azure OpenAI deployment. In addition, provide following parameters within `other` property:

  ```json
  { 
    "model": "?", // point to azure openai deployment-id, default: 'default'
    ...,
    "other": {
      "azure-resource-name": "?",
      "azure-api-version": "?"  // default: '2024-02-01'
    }
  }
  ``` 

</div>
    
  **`apikey`**: 
   
  Please provide a valid API Key or authorization keys to successfully connect to LLM provider and leverage the specified model. <span style="color:red;"> Please follow secure practices to store API Keys and do not provide them in plain text.</span> You must appropriately access the value and provide that here. 

  For example, if keys are stored in environment variables, access the environment variable and provide the value to this property.

  ```json
    { ..., "apikey": process.env['LLM_API_KEY], ... }
  ```

### Custom LLM API Endpoint

If you need to access a custom LLM endpoint, such as, privately hosted LLM, please refer this [detailed documentation](/docu-customllm.html).  


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
