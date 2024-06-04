---
layout: demo
title: BroadAI | Demonstration
---

<div class="top" style="margin-top:60px;">
  <div class="mission">
  <a class="button" id="btnrandomcase" onclick="randomQ()" style="float:right;">
    <img src="./assets/images/refresh-button.png" style="height:1.5em;padding:0;margin:0;"> Example
  </a>
  <form>
    <h3>
      How may I help you?
    </h3>
    <textarea id="notes" name="notes" rows="6" required style="width:calc(100% - 20px); padding:10px; margin:0.5em 0; border:1px solid #ddd; border-radius:4px; box-sizing:border-box;"></textarea>
    <input type="button" id="btngo" value="Go" onClick="go()" style="font-family: 'Architects Daughter', 'Helvetica Neue', Helvetica, Arial, serif; font-size: 18px; text-align: center; padding: 10px; margin: 0 10px 10px 0; color: #fff; background-color: #2e7bcf; border: none; border-radius: 5px; -moz-border-radius: 5px; -webkit-border-radius: 5px;">
  </form>
  </div>

  <div class="lead" id="lead">
    <div id="message"> <!-- .. result .. --> </div>
  </div>
</div>
