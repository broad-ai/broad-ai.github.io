---
layout: demo
title: BroadAI | Demonstration
---

---

# Watch BroadAI in Live Action!

Here are some ideas to help you get a first-hand experience with Multi-Agent AI Systems implemented using **BroadAI**'s wide capabilities.

### Examples

| **Chatbot** | **Concierge** | **MovFlick** |
| Basic use-case | Advanced use-case | Advanced use-case |
| A typical chatbot application using Generative AI, with a twist that it utilizes multiple agents. | Planning trips is more than just purchasing tickets. This application emulates a concierge service that will guide you with additional information around booking tickets. | Yes, this application is drawn from a typical streaming service and will help you find your pick(s) for the day. | 
| With specific capabilities, such as, looking up weather, financial statements and stock prices of companies, etc., BroadAI will utilize appropriate agents based on the question asked. | This multi-agent system will seek help of other agents such as researcher, weather, etc. to plan your trip. Heck! it will also draft a social media message on your behalf using a trained writer agent. | This advanced use-case of BroadAI utilizes an agent that leverages Knowledge Graphs in a RAG pattern to pick recommendations. It then utilizes the writer agent from another BroadAI MAS system to write a fictional story based on the plot of the movie you pick! |
| Multiple agents | Multiple agents | Multiple BroadAI MAS |
| Contextual conversation | Utility application example | RAG using dynamic Knowledge Graph queries |
| Zero-prompting | Minimal prompting | Extended prompting |


---

<div class="top">
  <div class="mission">
    <h3 id="chatbot">
      Chatbot
    </h3>
    <form>
      <div style="display:inline;float:left;">
      <!-- form elements here -->
      </div>
      <!--  -->
      <div style="display:inline;float:right;">
        <input type="button" value="Go" onClick="goChatbot()">
      </div>
    </form>
    <div style='display:block;' id="planChatbot"> <!-- .. plan .. --> </div>
  </div>

  <div class="lead">
    <div id="responseChatbot"> <!-- .. response .. --> </div>
  </div>
</div>

---

<div class="top">
  <div class="mission">
    <h3 id="concierge">
      Concierge
    </h3>
    <form>
      <div style="display:inline;float:left;">
      <!-- form elements here -->
      </div>
      <!--  -->
      <div style="display:inline;float:right;">
        <input type="button" value="Go" onClick="goConcierge()">
      </div>
    </form>
    <div style='display:block;' id="planConcierge"> <!-- .. plan .. --> </div>
  </div>

  <div class="lead">
    <div id="responseConcierge"> <!-- .. response .. --> </div>
  </div>
</div>

---

<div class="top">
  <div class="mission">
    <h3 id="movflick">
      MovFlick
    </h3>
    <form>
      <div style="display:inline;float:left;">
      <!-- form elements here -->
      </div>
      <!--  -->
      <div style="display:inline;float:right;">
        <input type="button" value="Go" onClick="goMovflick()">
      </div>
    </form>
    <div style='display:block;' id="planMovflick"> <!-- .. plan .. --> </div>
  </div>

  <div class="lead">
    <div id="responseMovflick"> <!-- .. response .. --> </div>
  </div>
</div>

---



<!-- 

<textarea id="notes" name="notes" rows="6" required style="width:calc(100% - 20px); padding:10px; margin:0.5em 0; border:1px solid #ddd; border-radius:4px; box-sizing:border-box;"></textarea>
<div style='padding:0;width:100%;margin-bottom:2em;'>
  <div style="display:inline;float:left;">
    <input type="checkbox" id="history" name="history" style="margin-right: 10px;">
    <label for="history">Enable follow up</label>
  </div>
  <div style="display:inline;float:right;">
    <input type="button" id="btngo" value="Go" onClick="go()" style="font-family: 'Architects Daughter', 'Helvetica Neue', Helvetica, Arial, serif; font-size: 18px; text-align: center; padding: 10px; margin: 0 10px 10px 0; color: #fff; background-color: #2e7bcf; border: none; border-radius: 5px; -moz-border-radius: 5px; -webkit-border-radius: 5px;">
  </div>
</div>

-->