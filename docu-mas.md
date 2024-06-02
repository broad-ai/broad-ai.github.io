---
layout: docs
title: BroadAI MAS Documentation
---

<div style="text-align:right;margin-bottom:20px;">
  <a href="/" class="button">Home</a>
  <a href="/docu-agentic.html" class="button" style="background-color:#12c3e2;">Build Agent</a>
  <a href="/agent-store.html" class="button" style="background-color:#feaf4d;">Agent Store</a>
</div>

# Create BroadAI Multi-Agent System

<img src="./assets/images/mas.png" style="background:transparent;width:80%;margin-left:auto;margin-right:auto;margin:20px;">


The BroadAI Multi-Agent System (MAS) framework is used by application developers to add artificial intelligence capabilities into their applications. This **NodeJS** based framework consumes the registered agents to perform complex tasks collectively leading to the solution for the problem presented to the AI system.

The BroadAI MAS framework relies on Large Language Model's (LLM's) capabilities to develop a step-by-step plan to solve the problem at hand. The developer must provide access to the LLM as well as a list of registered agents that BroadAI MAS will utilize in developing it's approach to solve the given problem.

---

### Installation

Install the `broadai` package locally.

```shell
npm install broadai --save
```

You must then import the package into your application code. 

BroadAI can be used with both ECMAScript as well as TypeScript codebases.

```javascript
/*
  Use only one of the below import statements.
*/

// if using ECMAScript
const BroadAI = require('broadai');

// if using TypeScript
import BroadAI from 'broadai';
```

---

### Creating BroadAI instance (object)

At this point, you are ready to create BroadAI object by passing two parameters to the constructor:

```javascript
// create an instance of BroadAI MAS framework
const ai = new BroadAI([ /* BroadAIAgents */ ], /* BroadAIConfiguration */);
```

- **`BroadAIAgents`** is an array of agents that BroadAI MAS must take into account when addressing the problem statement.

- **`BroadAIConfiguration`** which is providing access and structure to use the Large Language Model (LLM) of your choice. Since the API call signatures differ between different LLM providers, the configuration is flexible to adopt any large language model, including privately hosted models. 

The structure of the ```BroadAIConfiguration``` is below:

```javascript
let broadAIConfiguration = {
  "llmapi": {
    "method": "GET" | "POST" | "PUT" | "DELETE",
    "url": "??",                // -- API endpoint to access the model
    "headers": {                // -- optional headers
      // e.g. "Content-Type": "application/json"
      // e.g. "Authorization": "Bearer <token>"
    },
    "data_template": {          // -- refer further details below
    
    },
    "response_template": "??"     // -- refer further details below
  }
}
```

  **`url`**:
  This refers to the API endpoint where LLM is accessible.

<div markdown="1" style="margin-top:20px; margin-bottom:40px; padding:1.25em 1em 1.25em 1em; font-weight:400; box-shadow:2px 2px 4px 1px #999; border:1px solid;">

  **Example for OpenAI**:
    
  *Refer [OpenAI API Reference](https://platform.openai.com/docs/api-reference/making-requests)*
    
  ```javascript
    "url": "https://api.openai.com/v1/chat/completions"
  ```
    
  **Example for Google Gemini**:
    
  *Refer [Google Gemini API Reference](https://ai.google.dev/api/rest/v1/models/generateContent#http-request)*
    
  ```javascript
    "url": "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent"
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
    
  *Refer [OpenAI API Reference](https://platform.openai.com/docs/api-reference/making-requests)*
    
  ```javascript
  let data_template = {
      "model": "gpt-3.5-turbo-0125",
      "messages": [{
        "role": "system",
        "content": "\{\{system\}\} \{\{context\}\}"
      },
      {
        "role": "user",
        "content": "\{\{task\}\} \{\{format\}\}"
      }]
  }
  ```
    
  **Example for Google Gemini**:
    
  *Refer [Google Gemini API Reference](https://ai.google.dev/api/rest/v1/models/generateContent#request-body)*
    
  ```javascript
  let data_template = {
      "contents": [{
        "parts": [
          { "text": "\{\{system\}\} \{\{context\}\}" },
          { "text": "\{\{task\}\} \{\{format\}\}" }
        ]
      }]
  }
  ```

</div>
    
  **`response_template`**: 
   
  This refers to the <u>dot-path-notation</u> of where LLM's response will be provided. 

<div markdown="1" style="margin-top:20px; margin-bottom:40px; padding:1.25em 1em 1.25em 1em; font-weight:400; box-shadow:2px 2px 4px 1px #999; border:1px solid;">

  **Example for OpenAI**:
    
  *Refer [OpenAI API Reference](https://platform.openai.com/docs/api-reference/making-requests)*
    
  ```javascript
    "response_template": "choices.0.message.content"
  ```
    
  **Example for Google Gemini**:
    
  *Refer [Google Gemini API Reference](https://ai.google.dev/api/rest/v1/GenerateContentResponse)*
    
  ```javascript
    "response_template": "candidates.0.content.parts.0.text"
  ```

</div>

---

### BroadAI MAS Methods

BroadAI MAS provides three methods that must ideally be used together to obtain an optimal developer experience. However, considering needs to use intermittent results from each of these methods, they have been provided as separate capabilities. 

Before diving into the methods, it is essential to know that the BroadAI MAS handles complex problem statements by planning an efficient approach to find a solution to the problem or question. 

BroadAI leverages it's knowledge about the agents that are registered with the BroadAI MAS framework to utilize them efficiently. Once a plan is formulated, BroadAI MAS framework can also execute the plan and collect the results to be used for grounding the final response LLM prompt. 

*Note*: All methods return Promise.

#### Method: `plan(question)`

This method generates a plan to address the problem statement / question. You can choose to generate a refined plan where BroadAI takes an iterative approach to audit it's initial plan and generate an optimized plan. It is highly recommended to generate a refined plan. However note that if `refinedPlan` is set to `true`, naturally more LLM tokens will be consumed.

| Parameter | Type | M / O | Description |
|-----|-----|-----|-----|
| **question** | string | Mandatory | User's question or problem statement. |
| **refinedPlan** | boolean | Mandatory | Indicate whether BroadAI should critically audit it's initial plan and generate an updated plan. |

**Output**: `plan`

**Type**: `Array<any>`

**Usage**: 

```javascript
const ai = new BroadAI([ /* BroadAIAgents */ ], /* BroadAIConfiguration */);

ai.plan(problemStatement, true).then((plan)=>{ 
  console.log(plan);
}).catch((err)=>console.log(err));
```

**Example Output**: 

```json
[
  {
    "sequence": 0,
    "objective": "Find fast food joints around Columbus airport",
    "agent": "Researcher",
    "skill": {
      "name": "findBusinesses",
      "parameters": {
        "term": "fast food",
        "location": "Columbus airport"
      }
    }
  }
]
```

#### Method: `execute(plan)`

This method executes the plan using identified agents and their skills. If a step of the plan cannot be executed, the step will be retained in the results as it may contain useful instructions for `respond` method to generate an optimal response. This method itself does not need LLM, but depending on the agent and the skill used, LLM usage may occur.

| Parameter | Type | M / O | Description |
|-----|-----|-----|-----|
| **plan** | Array<any> | Mandatory | The plan generated by the `plan` method will be executed step-by-step. |

**Output**: `results`

**Type**: `Array<any>`

**Usage**: 

```javascript
const ai = new BroadAI([ /* BroadAIAgents */ ], /* BroadAIConfiguration */);

// ai.plan() ...

  ai.execute(plan).then((results)=>{
    console.log(results);
  }).catch((err)=>console.log(err));    
```

**Example Output**: 

```json
[
  {
    "sequence": 0,
    "objective": "Find fast food joints around Columbus airport",
    "result": "Go Go Gyro and African Grill (4.5 stars) | 134 N Hamilton Rd Gahanna, OH 43230 Ph: (614) 428-4646[alias: go-go-gyro-grill-gahanna-2]\nCity Barbeque (3.9 stars) | 108 S Stygler Rd Gahanna, OH 43230 Ph: (614) 416-8890[alias: city-barbeque-gahanna-2]\nRaising Cane's Chicken Fingers (3.4 stars) | 1320 N Hamilton Rd Gahanna, OH 43230 Ph: (614) 475-1300[alias: raising-canes-chicken-fingers-gahanna]\nChick-fil-A (3.2 stars) | 3940 Morse Rd Columbus, OH 43219 Ph: (614) 414-7222[alias: chick-fil-a-columbus-22]\nSonic Drive-In (1.9 stars) | 2846 Stelzer Rd Columbus, OH 43219 Ph: (614) 532-5738[alias: sonic-drive-in-columbus-17]\nMOD Pizza (4.2 stars) | 333 S Hamilton Rd Gahanna, OH 43230 Ph: (614) 914-4693[alias: mod-pizza-gahanna]"
  }
]
```

#### Method: `respond(results, question)`

This method uses LLM to respond to the user's original question / problem statement using the results for grounding. The output contains suggested HTML tags so you can customize formatting requirements in your application.

| Parameter | Type | M / O | Description |
|-----|-----|-----|-----|
| **results** | Array<any> | Mandatory | The result of the plan execution are used to ground LLM and answer user's question or problem statement.  |
| **question** | string | Mandatory | User's question or problem statement. |

**Output**: `response`

**Type**: `Array<any>`

**Usage**: 

```javascript
const ai = new BroadAI([ /* BroadAIAgents */ ], /* BroadAIConfiguration */);

// ai.plan() ...
  // ai.execute() ...
    
    ai.respond(results, problemStatement).then((response)=>{
      console.log(response);
    }).catch((err)=>console.log(err));    
```

**Example Output**: 

```json
 [
  {
    "html_tag": "p",
    "text": "Certainly! You can find some highly rated fast food joints near Columbus airport. Based on your preference for places with more than 4 stars, I recommend the following:"
  },
  {
    "html_tag": "ul",
    "text": "Go Go Gyro and African Grill (4.5 stars)"
  },
  {
    "html_tag": "ul",
    "text": "MOD Pizza (4.2 stars)"
  }
]
```

---

### BroadAI MAS Configuration

`BroadAIConfiguration` can be accessed with a simple object as shown below. 

```javascript
const BroadAI = require('broadai');
const ai = new BroadAI([ /* BroadAIAgents */ ], /* BroadAIConfiguration */);

/* BroadAIConfiguration can be accessed using */
let broadAIConfig = ai.config;
```

The primary reason for such access is to pass the configuration during agent registration process as shown below.

```javascript
const ai = new BroadAI([ /* BroadAIAgents */ ], /* BroadAIConfiguration */);

// import the required agent. Note: 'agent' below is ficticious
const agent = require('broadai-agents/agent');

/* Register the agent by passing broadAIConfig and optional agentConfig */
agent.register(ai.config, agentConfig?);

```

----

### Full Example

Below is an example showing creation of BroadAI MAS instance using an agent called `researcher`. The BroadAI MAS instance further uses LLM to create a `plan` to solve the given `problemStatement`, `execute` it, and finally uses an LLM to `respond` to the problem statement using the `results` from plan execution. 

```javascript
// import broadai
const BroadAI = require('broadai');

// import broadai-agent :: Researcher
/*  
    This agent is skilled at looking up information from 
    external resources, such as Google Search Engine and Yelp.
*/
const researcher = require('broadai-agents/researcher');

// create an instance of BroadAI MAS framework
const ai = new BroadAI([ researcher.agent, /* array of BroadAI agents */ ], {
  "llmapi": {
    "method": "POST",
    "url": "https://api.openai.com/v1/chat/completions",
    "headers": {
      "Content-Type": "application/json"
      "Authorization": "Bearer $OPENAI_API_KEY"
    },
    "data_template": {
        "model": "gpt-3.5-turbo-0125",
        "messages": [{
          "role": "system",
          "content": "\{\{system\}\} \{\{context\}\}"
        },
        {
          "role": "user",
          "content": "\{\{task\}\} \{\{format\}\}"
        }]
    },
    "response_template": "choices.0.message.content"
  }
});

// register agents
researcher.register(ai.config, agentConfig?);

// problem statement
let problemStatement = "When iPhone was first launched, how was it accepted? Where can I buy one around Columbus airport?";

// use the framework to create a refined plan to answer the given question
ai.plan(problemStatement, true).then((plan)=>{ 
  // execute the generated plan
  ai.execute(plan).then((results)=>{
    // generate a response based on the plan execution results
    ai.respond(results, problemStatement).then((response)=>{
      console.log(response);
    });
  });
 });
```

**Output**:

```json
[
  {
    "html_tag": "h2",
    "text": "Acceptance of the iPhone When First Launched:"
  },
  {
    "html_tag": "p",
    "text": "The iPhone was exceptionally well-accepted when it was first launched. It marked a revolutionary moment in the history of smartphones and consumer technology. With its unique design, intuitive interface, and groundbreaking features, the iPhone quickly gained immense popularity and changed the way people interacted with mobile devices."
  },
  {
    "html_tag": "p",
    "text": "According to Statista, the number of Apple iPhone unit sales dramatically increased between 2007 and 2023, indicating a consistent and strong demand for iPhones over the years."
  },
  {
    "html_tag": "p",
    "text": "Apple's founder, Steve Jobs, was named the 'Most Powerful Person in Business,' which showcases the impact of Apple and its innovative products like the iPhone on the industry and society as a whole."
  },
  {
    "html_tag": "h2",
    "text": "Where to Buy an iPhone Around Columbus Airport:"
  },
  {
    "html_tag": "p",
    "text": "If you are looking to purchase an iPhone around Columbus airport, you have several options:"
  },
  {
    "html_tag": "li",
    "text": "Experimax (4.6 stars) - 1337 Worthington Centre Dr Worthington, OH 43085 - Ph: (614) 396-7090"
  },
  {
    "html_tag": "li",
    "text": "iFixandRepair (4 stars) - 3900 Morse Rd Columbus, OH 43219 - Ph: (614) 470-5242"
  },
  {
    "html_tag": "li",
    "text": "uBreakiFix by Asurion (3.3 stars) - 121 Mill St Ste 116 Gahanna, OH 43230 - Ph: (614) 532-5635"
  },
  {
    "html_tag": "li",
    "text": "SmartFix (2.7 stars) - 1196 N High St Columbus, OH 43201 - Ph: (614) 307-8932"
  },
  {
    "html_tag": "li",
    "text": "CPR Cell Phone Repair Columbus (4.1 stars) - 1426 N High St Columbus, OH 43201 - Ph: (614) 350-3130"
  },
  {
    "html_tag": "li",
    "text": "Apple Easton Town Center (3 stars) - 4210 The Strand Columbus, OH 43219 - Ph: (614) 934-2810"
  }
]
```

---
