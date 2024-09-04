---
layout: store
title: BroadAI Agent Store
---

<img src="./assets/images/icon-rocket.png" style="height:1.5em;padding:0;margin:0;"> Interested in publishing your agent? Please [reach out to us](mailto:broad.agents.ai@gmail.com?subject=Re%20publishing%20our%20BroadAI%20Agent).

---

<div class="container">
  <input type="text" id="searchBox" placeholder="Search...">
</div>

{% for agent in site.data.agents %}
<p>{{agent}}</p>
{% endfor %}

<!-- {% for agent in site.agents %}

<div class="container">
  <div class="card" id="{{ agent.agent-name | downcase }}">
    <h2>{{ agent.agent-name }}</h2>
    <p>{{ agent.capability }}</p>
    <div>
      {% for skill in agent.skills %}
        <div class="sub-category">
          <h4>{{ skill.skill-name }}</h4>
          <p>{{ skill.objective }}</p>
          <ul>
            {% for parameter in skill.parameters %}
              <li>{{ parameter[0] }}: {{ parameter[1] }}</li>
            {% endfor %}
          </ul>
        </div>
      {% endfor %}
      <h4>Usage:</h4>
<pre><code class="language-javascript">
// import agent
const {{ agent.agent-name | downcase }} = require('broadai-agents/{{ agent.package-name }}');
// integrate with BroadAI MAS object
const broadai = new BroadAI([ {{ agent.agent-name | downcase }}.agent, /* other agents */ ], /* BroadAIConfiguration */);
// register agent with BroadAI MAS object
{{ agent.agent-name | downcase }}.register(broadai.config, {{ agent.agent-config }});
</code></pre>
    </div>
  </div>
</div>

{% endfor %} -->

---