
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
        "Setting things upayload...",
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
<table class='table table-responsive mb-1'>
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
    plan.forEach((step, s) => {
        html += `
    <table class='table table-responsive mt-1'>
      <thead>
        <tr>
            <th>`+ (s + 1) + `.  <span class='text-info'>` + step.objective + `</span></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class='py-0'><span class='text-muted'>Agent &rarr; Skill</span>&emsp;|&emsp;<span class='text-success'>`+ step.agent + ` </span> &rarr; <span class='text-success'>` + (step.skill.name || step.skill) + `</span></td>
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
    return JSON.stringify(agents, null, 3);
}; // renderAgents

const renderResponse = (question, response) => {
    let speechResponse = ``;
    let html = ``;
    response.forEach((line) => {
        html += `
            <` + line.html_tag + `>`
            + line.text +
            `</` + line.html_tag + `>`;
        speechResponse += line.text;
    });
    // -- trigger for speaking the output
    document.getElementById('speak').addEventListener('click', () => {
        document.getElementById('speak').disabled = true;
        puter.ai.txt2speech(speechResponse, {
            language: 'en-US',
            engine: 'neural',
            voice: 'Joanna'
        }).then((audio) => {
            audio.play();
            document.getElementById('speak').disabled = false;
        });
    }); // addEventListener
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
const processPayload = (payload, DOMResponse, DOMStatus, DOMPlan, DOMAgents) => {
    /**
     * ** Response Structure ** *
     * ------------------------------*
    {
        status: "Final response",
        result: {
            question: question,
            plan: planResults,
            response: respayload.response,
            conversation: conversation
        }
    }
    * ------------------------------* */
    // -- STATUS
    if (payload.status) {
        DOMStatus.innerHTML = renderStatus(payload.status);
        // DOMResponse.innerHTML += `<br class='mt-2'><em class='text-muted' style='font-size:1.2em;font-weight:300;'>` + payload.status + `</em>`;
    }

    if (payload.result) {

        // -- AGENTS
        if (payload.result.agents)
            console.log(renderAgents(payload.result.agents));

        // -- PLAN
        if (payload.result.plan)
            DOMPlan.innerHTML = renderPlan(payload.result.plan);

        // -- RESPONSE
        if (payload.result.question && payload.result.response) {
            let currentResponse = renderResponse(payload.result.question, payload.result.response);
            DOMResponse.innerHTML += currentResponse;
        }

        // -- CATCH ALL
        if (!payload.result.question && !payload.result.plan && !payload.result.response && !payload.result.conversation)
            DOMStatus.innerHTML += `
                <table class='table mt-1'>
                    <tbody>
                        <tr>
                            <td class='text-muted'>
                                <pre>`+ JSON.stringify(payload.result, null, 1) + `</pre>
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
    return payload;
}; // processPayload
