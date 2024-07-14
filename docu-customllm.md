---
layout: docs
title: BroadAI MAS Documentation | Custom LLM
---

<div style="text-align:right;margin-bottom:20px;">
  <a href="/" class="button">Home</a>
  <a href="/docu-mas.html" class="button" style="background-color:#a534f6;">Build MAS</a>
  <a href="/docu-agentic.html" class="button" style="background-color:#12c3e2;">Build Agent</a>
  <a href="/agent-store.html" class="button" style="background-color:#feaf4d;">Agent Store</a>
  <a href="/demo-landing.html" class="button" style="background-color:#20a18e;">Live Demo</a>
</div>

--- 

# Custom LLM API Endpoint

In order to run BroadAI MAS framework with custom LLM configuration, such as privately hosted LLMs, you can utilize the property `llmapi` within the BroadAIConfiguration as described below. 

**Note:** This property will supercede the `llm` property if it has been set. Technically, you need to provide either `llm` or the `llmapi` property.

- **`BroadAIConfiguration`** which is providing access and structure to use the Large Language Model (LLM) of your choice. Since the API call signatures differ between different LLM providers, the configuration is flexible to adopt any large language model, including privately hosted models. 

Set the `llmapi` property in ```BroadAIConfiguration``` as show below to utilize your custom LLM Endpoint. 

```javascript
let broadAIConfiguration = {

  /* ** LLM API Configuration ** */
  "llmapi": {
    "method": "GET" | "POST" | "PUT" | "DELETE",
    "url": "<https://>",          // -- API endpoint to access the model
    "headers": {                  // -- API headers
      // e.g. "Content-Type": "application/json"
      // e.g. "Authorization": "Bearer <token>"
    },
    "data_template": { ... },               // -- refer further details below
    "response_template": "<dot.notation>"   // -- refer further details below
  }

}
```


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

---