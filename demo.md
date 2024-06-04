---
layout: demo
title: BroadAI | Demonstration
---

# BroadAI in Action

This is a <span style="color:#feaf4d;">LIVE</span> demonstration of an Application built using BroadAI MAS Framework. It is integrated with following agents built using BroadAI Agentic Framework. So please feel free to ask any question around these agents (or not!).

To help you get some ideas, the demo is pre-populated with some examples.

### Agents in Action

| **Researcher** | **Aviator** | **Weatherman** | **FinancialAnalyst** |
| Looks up information using external information providers. | Tells about inbound and outbound flights into or out of an airport, as well as flight status' for known flight numbers. | Reports current weather conditions as well as forecast. | Research the company fundamentals to help analyze company's performance. |

---

<div class="top">
  <div class="mission">
  <a class="button" id="btnrandomcase" onclick="randomQ()" style="float:right;background-color:transparent;color:#2e7bcf;">
    <img src="./assets/images/refresh-button.png" style="height:1.5em;padding:0;margin:0;"> Example
  </a>
  <form>
    <h3>
      How may I help you?
    </h3>
    <textarea id="notes" name="notes" rows="6" required style="width:calc(100% - 20px); padding:10px; margin:0.5em 0; border:1px solid #ddd; border-radius:4px; box-sizing:border-box;"></textarea>
    <input type="button" id="btngo" value="Go" onClick="go()" style="font-family: 'Architects Daughter', 'Helvetica Neue', Helvetica, Arial, serif; font-size: 18px; text-align: center; padding: 10px; margin: 0 10px 10px 0; color: #fff; background-color: #2e7bcf; border: none; border-radius: 5px; -moz-border-radius: 5px; -webkit-border-radius: 5px;">
  </form>
  <div id="plan"> <!-- .. result .. --> </div>
  </div>

  <div class="lead" id="lead">
    <div id="message"> <!-- .. result .. --> </div>
  </div>
</div>

---

**NOTE**: This demo uses [Google Gemini Pro](https://deepmind.google/technologies/gemini/pro/). Results can vary based on use of other models.

---
