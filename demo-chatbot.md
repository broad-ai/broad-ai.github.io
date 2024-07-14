---
layout: demo
title: BroadAI Demonstration | Chatbot
description: BroadAI will utilize appropriate agents based on the question asked.
---

<div class="container mt-5 px-5">
  <div class="row">
    <div class="col-12 px-3 py-3" id="responseChatbot" style="height: calc(50vh - 100px);border: 1px solid #ccc;margin-bottom: 2em;overflow-y: scroll;">
      <!-- chat messages here -->
    </div>
  </div>
  <div class="row">
    <div class="col-9 col-md-11 px-0 text-left">
      <textarea class="form-control" id="chatbox" rows="3" style="border-radius: 8px;box-shadow: 4px 8px 6px #ddd;"></textarea>
    </div>
    <div class="col-3 col-md-1 px-0 text-right">
      <button class="btn btn-lg btn-primary" id="btnGoChatbot" onclick="goChatbot()">Send</button>
    </div>
  </div>
</div>

---
