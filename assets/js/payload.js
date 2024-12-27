
// ------ ..... ------ ..... ------ ..... ------ 
const getRandomMessage = () => {
    const waitMessages = [
        "Processing...",
        "Loading...",
        "Please wait...",
        "In progress...",
        "Working on it...",
        "Fetching data...",
        "One moment...",
        "Executing request...",
        "Hang tight...",
        "Updating...",
        "Retrieving information...",
        "Getting things ready...",
        "Hold tight...",
        "Setting things up...",
        "Just a sec...",
        "Running tasks...",
        "Preparing data...",
        "Analyzing...",
        "Communicating with server...",
        "Performing operation..."
    ];
    return waitMessages[Math.floor(Math.random() * waitMessages.length)];
}; // getRandomMessage

// ------ ..... ------ ..... ------ ..... ------ 
const clearChat = () => {
    sessionStorage.clear('conversation');
    document.getElementById('response').innerHTML = "";
    document.getElementById('status').innerHTML = "";
    document.getElementById('plan').innerHTML = "";
    document.getElementById('agents').innerHTML = "";
}; // clearChat

/** Utility functions */
const renderStatus = (status) => {
    let html = `
<table class='table mb-1'>
  <tbody>
    <tr>
      <td><strong>Status:</strong> <span class='text-danger'>`+ status + `</span></td>
    </tr>
  </tbody>
</table>`;
    return html;
};  // renderStatus

const renderPlan = (plan) => {
    let html = ``;
    plan.forEach((step) => {
        html += `
    <table class='table mt-1'>
      <thead>
        <tr>
            <th>`+ (step.sequence + 1) + `.  <span class='text-info'>` + step.objective + `</span></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class='py-0'><span class='text-muted'>Agent &rarr; Skill</span>&emsp;|&emsp;<span class='text-success'>`+ step.agent + ` </span> &rarr; <span class='text-success'>` + step.skill.name + `</span></td>
        </tr>
        <tr>
          <td class='text-muted'>`+ (step.result ? (typeof step.result == 'object' ? JSON.stringify(step.result) : step.result) : '...') + `</td>
        </tr>
      </tbody>
    </table>`;
    });
    return html;
}; // renderPlan

const renderAgents = (agents) => {
    let html = `
    <h3 style='margin-top:auto;margin-bottom:auto;'>
      Available Agents:
    </h3>
    <div class='row'>`;
    agents.forEach((agent) => {
        html += `
        <div class='col-12 col-sm-6 col-md-4 col-lg-3'>
            <table class='table mt-1'>
                <thead>
                    <tr>
                        <th><strong>Agent:</strong> <span class='text-info'>` + agent.agent + `</span></th>
                    </tr>
                    <tr>
                        <td><span class='text-muted'>` + agent.capability + `</span></td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class='text-muted'>
                            <ol>`;
        agent.skills.forEach((skill) => {
            html += `
                                <li class='mb-1'><strong>`+ skill.skill + `</strong>: <span class='text-mute'>` + skill.objective + `</span></li>
                        `;
        });
        html += `
                            </ol>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
      `;
    });
    html += `
    </div>`;
    return html;
}; // renderAgents

const renderResponse = (question, response) => {
    let html = `
    <div style='text-align:right;margin-bottom:1em;'>
        <pre><a href='javascript:clearChat();'>Clear</a></pre>
    </div>`;
    html += `
    <h3 style='color:black;background:#eee;padding:1em;'>` + question + `</h3>`;
    response.forEach((line) => {
        html += `
            <` + line.html_tag + ` style='text-align:left;color:#6a5acd;'>`
            + line.text +
            `</` + line.html_tag + `>`;
    });
    return html;
}; // renderResponse

const renderConversation = (conversation) => {
    let html = `<hr class='mt-2'>`;
    if (conversation.length) {
        html += `
    <pre class='text-danger'><strong>Conversation History:</strong></pre>
    <ul class='mb-5'>`;
        conversation.forEach((chat) => {
            if (chat.indexOf('?:') >= 0)
                html += `
        <li>
            <strong class='text-info'>` + chat.replaceAll('?:', '<br>Q:') + `</strong>
        </li>`;
            else if (chat.indexOf('>:') >= 0)
                html += `
        <li>
            <span class='text-muted'>` + chat.replaceAll('>:', '=>') + `</span>
        </li>`;
            else
                html += `
        <li>
            <span class='text-muted'>` + chat + `</span>
        </li>`;
        });
        html += `
    </ul>`;
    }
    return html;
}; // renderConversation


// ------ ..... ------ ..... ------ ..... ------ 
const processPayload = (chunk, DOMResponse, DOMStatus, DOMPlan, DOMAgents) => {
    /**
     * ** Response Structure ** *
     * ------------------------------*
    {
        status: "Final response",
        result: {
            question: question,
            plan: planResults,
            response: resp.response,
            conversation: conversation
        }
    }
    * ------------------------------* */
    let payload = [];
    if (!chunk.done) {
        try {
            payload.push(JSON.parse(chunk.value));
        }
        catch {
            let packets = chunk.value.replaceAll('}{', '}}|{{').split('}|{');
            packets.forEach((packet) => {
                try { payload.push(JSON.parse(packet)); }
                catch { console.log("Discarding packet", packet) }
            });
        }
        console.log("Received", payload.length, "packet(s) for processing");
        payload.forEach((p) => {
            // -- STATUS
            if (p.status)
                DOMStatus.innerHTML = renderStatus(p.status);

            if (p.result) {

                // -- AGENTS
                if (p.result.agents)
                    DOMAgents.innerHTML = renderAgents(p.result.agents);

                // -- PLAN
                if (p.result.plan)
                    DOMPlan.innerHTML = renderPlan(p.result.plan);

                // -- RESPONSE
                if (p.result.question && p.result.response) {
                    DOMResponse.innerHTML = renderResponse(p.result.question, p.result.response);
                    if (p.result.conversation) {
                        sessionStorage.setItem('conversation', JSON.stringify(p.result.conversation));
                        DOMResponse.innerHTML += renderConversation(p.result.conversation);
                    }
                }

                // -- CATCH ALL
                if (!p.result.question && !p.result.plan && !p.result.response && !p.result.conversation)
                    DOMStatus.innerHTML += `
                <table class='table mt-1'>
                    <tbody>
                        <tr>
                            <td class='text-muted'>
                                <pre>`+ JSON.stringify(p.result, null, 2) + `</pre>
                            </td>
                        </tr>
                    </tbody>
                </table>
                `;
            }
            else {
                html = `
            <h4 style='text-align:left;color:#6a5acd;'>
                Oops! Something didn't work right.
            </h4>
            <p>
                Would you please mind try again?
            </p>`;
            }
        });
        return payload;
    }
}; // processPayload
