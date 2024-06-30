---
layout: docs
title: BroadAI MAS Documentation
---

<div style="text-align:right;margin-bottom:20px;">
  <a href="/" class="button">Home</a>
  <a href="/docu-mas.html" class="button" style="background-color:#a534f6;">Build MAS</a>
  <a href="/agent-store.html" class="button" style="background-color:#feaf4d;">Agent Store</a>
  <a href="/demo.html" class="button" style="background-color:#20a18e;">Live Demo</a>
</div>

# Create BroadAI Agents

<img src="./assets/images/agentic.png" style="background:transparent;width:80%;margin-left:auto;margin-right:auto;margin:20px;">

Agents are the core building-blocks of the BroadAI framework. This is why BroadAI provides a framework to create productive Agents in a standardized manner. This standardization is analogous to any factory model where expert agents can be built and shared amongst different BroadAI MAS applications.

So, whether you are developing an agent for your specific use-case, or for wider consumption via our [Agent Store](./agent-store.html), your experience in both, developing and consuming the agent stays consistent.

---

### Installation

Install the `broadai` package locally.

```shell
npm install broadai --save
```

You must import only the `agentic` package into your application code as it provides all the tooling to create an Agent. 

```javascript
const Agentic = require('broadai/agentic');

// Note: You will create an Agentic instance in the *register* method later.
```

---

### Creating an Agent

BroadAI Agents must be created as a module. We highly recommend that you should use ECMAScript to create your agent. It is also **critical** to know that there is a mandatory structure you need to follow when defining your agent. 

On a high-level there are <u>two</u> important elements you should be aware of when creating your agent. These are:

1. You must define the **`register`** **method** which must accept the `broadAIConfig` and an optional `agentConfig` JSON object depending on your agent requirements.

2. You must define the **`agent`** **object** with a specific structure that defines agent capabilities and skills it would possess.

Following example code snippet shows the recommended structure. 

```javascript
// import agentic package
const Agentic = require('broadai/agentic');

// placeholder for agentic instance
let agentic;
// placehoder for agentConfig
let config;

/* Create Agent module */
module.exports = {

  register: (broadAIConfig, agentConfig) =>{
    // -- create Agentic instance
    agentic = new Agentic(broadAIConfig);
    // -- config
    config = agentConfig;
  }, 

  agent: {
    // -- read further
  }

};
```

<div style="margin-top:40px; margin-bottom:40px; padding:1.25em 1em 1.25em 1em; font-weight:400; box-shadow:0 4px 8px 0 #999;">

  <p>
    You may download the <a href="./assets/docs/agentic_template.js" target="_blank">BroadAI Agentic template</a> and customize per your requirements. 
  </p>

  <p>
    <img src="./assets/images/icon-rocket.png" style="height:1.5em;padding:0;margin:0;"> Need support to create an agent? Please <a href="mailto:broad.agents.ai@gmail.com?subject=Re%20creating%20our%20BroadAI%20Agent">send us a note</a>.
  </p>

</div>

#### Agent Definition

With a standardization mindset to allow seamless integration of all agents within the BroadAI MAS application, we recommend you to follow the structure outlined below.

```javascript
/* 
  ** Skill actions are JavaScript functions that must be defined here. **
  ** Note ** : parameter names must exactly match the parameter keys described in the agent definition below.
*/
function researchTopic(topic) { /* function definition behind the action key below */ };
function findBusinesses(term, location) { /* function definition behind the action key below */ };


/* 
  ** Create Agent module ** 
*/
module.exports = {

  register: (broadAIConfig, agentConfig) =>{ /* refer previous code snippet */ }, 

  // shows an example of Researcher agent that provides two skills:
  // - researchTopic : that searches internet
  // - findBusinesses : that searches businesses in specific location
  agent: {
    "agent-name": "Researcher",
    "capability": "Looks up information using external information providers",
    "skills": [
      {
        "skill-name": "researchTopic",
        "objective": "Search internet for information about the given topic",
        "action": researchTopic,  // -- see function definition above
        "parameters": {
          "topic": "string | topic that must be researched"
        }
      },
      {
        "skill-name": "findBusinesses",
        "objective": "Search specific business type around a 10 mile radius of a given location",
        "action": findBusinesses,  // -- see function definition above
        "parameters": {
          "term": "string | business type, e.g. diner, coffee, tailor, etc.",
          "location": "string | address or landmark within a city and state"
        }
      }
    ]
  }

};
```

| Key | Description | Example |
|-----|----------|-----|
| **agent-name** | Define the agent as a persona. | ConciergeAgent, AirlineBookingAgent, etc. |
| **capability** | Provide a brief description of the capabilities this Agent provides. | Recommends best mode of transportation |
| **skills** | Array of following elements. |  |
| **skill-name** | Define the skill. | searchFlights, searchRentals, etc. |
| **objective** | Provide a specific description of what this skill will help the agent achieve. | Searches for available flights between two cities |
| **action** | This is the function that will be executed when the agent determines that this skill must be involved in it's plan to arrive at a solution to answer user's question. **It is crucial that the `skill-name` matches with the `action` function name**. Also note that the function specified as action must return a promise containing response strictly in string type. | searchFlights, searchRentals, etc. |
| **parameters** | This is a key-value pair of all the parameters the action for this skill will need to execute and provide results. **It is crucial that these exact parameter keys are used in function definitions**. We recommend a `type \| description` pattern to define the parameters. This will help the LLM determine appropriate values based on available information. In addition, providing a few examples will also help increase accuracy of parameter and value determination during the planning process.  | { "start": "string \| start address", "destination": "string \| destination address", "max_stops": "number \| maximum number of stops acceptable to reach the destination"  } |

---

### Agentic Methods

The BroadAI Agentic framework provides some useful methods that accelerate development of agents. These methods largely have to do with ability to quickly build a prompt, call LLM or other APIs, etc.

---
#### createPrompt()

If your agent is going to use a LLM, you will need to first create a prompt. The following accelerator function helps you create a well-engineered prompt in one single step.

Note: A well-engineered LLM prompt in BroadAI's sense contains following elements:

- **system**: Used to set high-level guidelines for the LLM to work with. This is where you may set role, personality and expectations from the LLM. See full example below for more details.

- **context**: Provide grounding context here. This may be as simple as the placeholder for BroadAI to fill in the appropriate context. See full example below for more details.

- **task**: Clearly specify the actions or guidelines LLM must follow to provide you the results you expect. See full example below for more details.

- **format**: As a best-practice, always specify the expected formatting, even if it is plain text. As a general BroadAI recommendation, request response in JSON structure. See full example below for more details.

| Agentic Method |  Input Parameters | Expected Output | Purpose |
|----|----|----|----|----|
| **createPrompt** | system: string, context: string, task: string, format: string, params: Record<string, any> | Response consists of JSON object containing four key elements - `system`, `context`, `task`, `format` - which together form a complete well-engineered prompt populated with context, specific output format, etc. Regarding `format`, we recommend asking for a JSON format with fields per your requirements. | Create a well-engineered prompt object | 

##### Example

```javascript
const prompt = agentic.createPrompt(
  // system
  `You are an airline agent that can explain flight status' in simple language.`,
  // context
  `\{\{flights\}\}`,
  // task
  `Use only the provided context to provide details about the flights departing from the airport, also  mentioned in the context.`,
  // format
  `Explain the details in simple language. However, generate the response strictly in JSON format using the structure provided below:
  ~~~json:
  {
    "list": [ "<use the provided context to create a simple list>", ... ] // must be an array
  }
  ~~~`,
  // params (data)
  {
    "flights": flights,
    "question": "What is the status of flight UA1234?"
  }
);
```

In above example, the contents of the context `\{\{\flights}\}` will be replaced by values in the **flights** provided as data. **It is essential to note that the keys of the `params` must match any variablized values (i.e. between double-brace-brackets) in the prompt**.

**Output**:

```json
{
  "system": "\n\n# System\nYou are an airline agent that can explain flight status' in simple language.\n",

  "context": "\n\n# Context\n{\"pagination\":{\"limit\":100,\"offset\":0,\"count\":2,\"total\":2},\"data\":[{\"flight_date\":\"2024-05-31\",\"flight_status\":\"landed\",\"departure\":{\"airport\":\"Newark Liberty International\",\"timezone\":\"America/New_York\",\"iata\":\"EWR\",\"icao\":\"KEWR\",\"terminal\":\"C\",\"gate\":\"110\",\"delay\":16,\"scheduled\":\"2024-05-31T07:00:00+00:00\",\"estimated\":\"2024-05-31T07:00:00+00:00\",\"actual\":\"2024-05-31T07:15:00+00:00\",\"estimated_runway\":\"2024-05-31T07:15:00+00:00\",\"actual_runway\":\"2024-05-31T07:15:00+00:00\"},\"arrival\":{\"airport\":\"Austin-bergstrom International\",\"timezone\":\"America/Chicago\",\"iata\":\"AUS\",\"icao\":\"KAUS\",\"terminal\":\"S\",\"gate\":\"25\",\"baggage\":\"1\",\"delay\":null,\"scheduled\":\"2024-05-31T09:51:00+00:00\",\"estimated\":\"2024-05-31T09:51:00+00:00\",\"actual\":\"2024-05-31T09:38:00+00:00\",\"estimated_runway\":\"2024-05-31T09:38:00+00:00\",\"actual_runway\":\"2024-05-31T09:38:00+00:00\"},\"airline\":{\"name\":\"United Airlines\",\"iata\":\"UA\",\"icao\":\"UAL\"},\"flight\":{\"number\":\"1234\",\"iata\":\"UA1234\",\"icao\":\"UAL1234\",\"codeshared\":null},\"aircraft\":null,\"live\":null},{\"flight_date\":\"2024-05-30\",\"flight_status\":\"landed\",\"departure\":{\"airport\":\"Newark Liberty International\",\"timezone\":\"America/New_York\",\"iata\":\"EWR\",\"icao\":\"KEWR\",\"terminal\":\"A\",\"gate\":\"23\",\"delay\":3,\"scheduled\":\"2024-05-30T07:00:00+00:00\",\"estimated\":\"2024-05-30T07:00:00+00:00\",\"actual\":\"2024-05-30T07:02:00+00:00\",\"estimated_runway\":\"2024-05-30T07:02:00+00:00\",\"actual_runway\":\"2024-05-30T07:02:00+00:00\"},\"arrival\":{\"airport\":\"Austin-bergstrom International\",\"timezone\":\"America/Chicago\",\"iata\":\"AUS\",\"icao\":\"KAUS\",\"terminal\":\"S\",\"gate\":\"29\",\"baggage\":\"1\",\"delay\":null,\"scheduled\":\"2024-05-30T09:51:00+00:00\",\"estimated\":\"2024-05-30T09:51:00+00:00\",\"actual\":\"2024-05-30T09:34:00+00:00\",\"estimated_runway\":\"2024-05-30T09:34:00+00:00\",\"actual_runway\":\"2024-05-30T09:34:00+00:00\"},\"airline\":{\"name\":\"United Airlines\",\"iata\":\"UA\",\"icao\":\"UAL\"},\"flight\":{\"number\":\"1234\",\"iata\":\"UA1234\",\"icao\":\"UAL1234\",\"codeshared\":null},\"aircraft\":null,\"live\":null}]}\n",

  "task": "\n\n# Task\nUse only the provided context to provide details about the flight number, also  mentioned in the context.\n",

  "format": "\n\n# Format\nExplain the details in simple language.\n        ---\n What is the status of flight UA1234?\n ---\n However, generate the response strictly in JSON format using the structure provided below:\n          ~~~json:\n {\n \"text\": \"<complete flight status information in plain text>\"\n }\n ~~~\n"
}
```

---

#### getGenAIResponse()

Once the prompt object is created, it can be used to feed into another agentic method called `getGenAIResponse(prompt)` which is described next.

| Agentic Method |  Input Parameters | Expected Output | Purpose |
|----|----|----|----|----|
| **getGenAIResponse** | prompt: any | This method calls the LLM as specified in the BroadAIConfiguration. The response from LLM is provided back here. | Accelerator to call LLM using BroadAI configuration supplied in the BroadAI MAS application, without the need to write the entire LLM API call. | 

##### Example

```javascript
const prompt = agentic.createPrompt(/* system, context, task, format */);

agentic.getGenAIResponse(prompt)
  .then((llmResponse) => console.log(JSON.stringify(llmResponse)))  
  .catch((err) => reject({ "error": true, "details": err }));
```

**Output**:

```json
{
 "text": "Flight UA1234 with United Airlines has landed. Here are the details for the last two flights:\n\n1. Flight on May 31, 2024:\n- Departure: Newark Liberty International Airport (EWR) from Terminal C, Gate 110.\n- Scheduled Departure: 7:00 AM (New York time)\n- Actual Departure: 7:15 AM\n- Arrival: Austin-Bergstrom International Airport (AUS) at Terminal S, Gate 25\n- Scheduled Arrival: 9:51 AM (Chicago time)\n- Actual Arrival: 9:38 AM\n\n2. Flight on May 30, 2024:\n- Departure: Newark Liberty International Airport (EWR) from Terminal A, Gate 23.\n- Scheduled Departure: 7:00 AM (New York time)\n- Actual Departure: 7:02 AM\n- Arrival: Austin-Bergstrom International Airport (AUS) at Terminal S, Gate 29\n- Scheduled Arrival: 9:51 AM (Chicago time)\n- Actual Arrival: 9:34 AM\n\nBoth flights arrived earlier than their scheduled arrival times."
}
```

---

#### callExternalResource()

The final accelerator method provided by BroadAI Agentic framework is to accelerate calling external APIs. 

| Agentic Method |  Input Parameters | Expected Output | Purpose |
|----|----|----|----|----|
| **callExternalResource** | {"method": "GET"\|"POST"\|"PUT"\|"DELETE", "url":string, "headers"?:Record<string,string>, "data"?:any}
 | Response from the external API (refer appropriate documentation by the API provider) | Accelerator to call external API. | 

##### Example

```javascript
agentic.callExternalResource({
  "method": "GET",
  "url": "http://api.aviationstack.com/v1/flights?flight_iata=UA1234&access_key=XXXX",
  "headers": {
    "Content-Type": "application/json"
  }
}).then((flights) => { /* handle as per aviationstack's API documentation */ });
```

**Output**:

Refer Aviationstack's API documentation.

---

### Full Example (FlightControl Agent)

In this example, we are defining an agent called FlightControl with three skills to look for flights arriving and departing from a specific airport, and flight status. 

```javascript
// import Agentic framework
const Agentic = require('broadai/agentic');

// variable to allow global access to Agentic instance
let agentic;

// variable to allow global access to agentConfig
let cfg = {};

// -- Action: flightStatus --
// note: 'iata_flight_number' must match 'parameters.iata_flight_number'
const flightStatus = (iata_flight_number) => {
  return new Promise((resolve, reject) => {
    agentic.callExternalResource({
      "method": "GET",
      "url": "http://api.aviationstack.com/v1/flights?flight_iata=" + iata_flight_number + "&access_key=" + cfg.aviationstack.api_key,
      "headers": {
        "Content-Type": "application/json"
      }
    }).then((flight) => {
      resolve(flight);
      const prompt = agentic.createPrompt(
        `You are an airline agent that can explain flight status' in simple language.`,
        `{{flight}}`,
        `Use only the provided context to provide details about the flight number, also  mentioned in the context.`,
        `Explain the details in simple language. However, generate the response strictly in JSON format using the structure provided below:
          ~~~json:
          {
            "text": "<complete flight status information in plain text>"
          }
          ~~~`,
        {
          "flight": flight
        });

      // call LLM to respond to the prompt
      agentic.getGenAIResponse(prompt)
        .then((resp) => resolve(resp.text)) // accessing the 'text' field form JSON response generated by LLM
        .catch((err) => reject({ "error": true, "details": err }));
    }).catch((err) => reject({ "error": true, "details": err }));
  });
}; // flightStatus

// -- Action: flightDepartures --
// note: 'iata_airport_code' must match 'parameters.iata_airport_code'
const flightDepartures = (iata_airport_code) => { /* implement */ } // flightDepartures

// -- Action: flightArrivals --
// note: 'iata_airport_code' must match 'parameters.iata_airport_code'
const flightArrivals = (iata_airport_code) => { /* implement */ } // flightArrivals

// -- Agent: FlightControl --
module.exports = {
  register: (broadaiConfig, agentConfig) => {
    agentic = new Agentic(broadaiConfig);
    cfg = agentConfig; 
    /*
      agentConfig = {
        "aviationstack": { "api_key": "???" }
      }
    */
  },

  agent: {
    "agent-name": "FlightControl",
    "capability": "Flight marshall can tell about inbound and outbound flights into or out of an airport",
    "skills": [
      {
        "skill-name": "flightDepartures",
        "objective": "Identify nearest major IATA airport code for a given location and retrieve flights departing / leaving from that airport",
        "action": flightDepartures,
        "parameters": {
          "iata_airport_code": "string | must be an IATA airport code, e.g. CMH for Port Columbus International Airport"
        }
      },
      {
        "skill-name": "flightArrivals",
        "objective": "Identify nearest major IATA airport code for a given location and retrieve flights arriving into that airport",
        "action": flightArrivals,
        "parameters": {
          "iata_airport_code": "string | must be an IATA airport code, e.g. CMH for Port Columbus International Airport"
        }
      },
      {
        "skill-name": "flightStatus",
        "objective": "Identify IATA flight number for a given flight and retrieve it's details",
        "action": flightStatus,
        "parameters": {
          "iata_flight_number": "string | must be an IATA flight number, e.g. IATA flight number for flight 'United 5532' is 'UA5532'"
        }
      }
    ]
  }
}; // module end
```

---
