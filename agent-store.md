---
layout: store
title: BroadAI Agent Store
---

<img src="./assets/images/icon-rocket.png" style="height:1.5em;padding:0;margin:0;"> Interested in publishing your agent? Please [send us a note](mailto:broad.agents.ai@gmail.com?subject=Re%20publishing%20our%20BroadAI%20Agent).

# Published Agents

<!-- {% for agent in site.agents %}

- [{{ agent.agent-name }}](#{{ agent.agent-name | downcase }})

{% endfor %}

--- -->

{% for agent in site.agents %}

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
    </div>
  </div>
</div>

<!-- <div style="margin-top:20px; margin-bottom:40px; padding:1.25em 1em 1.25em 1em; font-weight:400; box-shadow:0 4px 8px 0 #999;">

  <h2 id="{{ agent.agent-name | downcase }}">Agent: {{ agent.agent-name }}</h2>
  <p>{{ agent.capability }}. See usage below for detailed information about package name and agent configuration.</p>
  
  <h4>Skills:</h4>
  <table>
  <tr>
    <th>Skill</th> <th>Objective</th> <th>Parameters</th>
  </tr>
  {% for skill in agent.skills %}
  <tr>
    <td><strong>{{ skill.skill-name }}</strong></td> 
    <td>{{ skill.objective }}</td> 
    <td>
    {% for parameter in skill.parameters %} {{ parameter }} {% endfor %}
    </td>
  </tr>
  {% endfor %}
  </table>
  
  <h4>Usage:</h4>
  <pre><code class="language-javascript">
  // import
  const {{ agent.agent-name | downcase }} = require('broadai-agents/{{ agent.package-name }}');

  // integrate with BroadAI MAS
  const ai = new BroadAI([ {{ agent.agent-name | downcase }}.agent, /* other agents */], /* BroadAIConfiguration */);

  // register
  {{ agent.agent-name | downcase }}.register(ai.config, {{ agent.agent-config }});
  </code></pre>

</div> -->

{% endfor %}

---