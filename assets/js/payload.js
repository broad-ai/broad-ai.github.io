
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

const renderResponse = (response, speakid) => {
    let speechResponse = "";
    let html = `
        <div style="text-align:right;">
            <button type="button" id="`+ speakid + `" class="btn btn-primary align-items-center mb-3">
                <img src="/assets/images/speaker-xxl.png" style="width:20px; height:20px;" alt="Speak"> &nbsp;Listen
            </button>
        </div>
    `;
    response.forEach((line) => {
        html += `
            <` + line.html_tag + `>`
            + line.text +
            `</` + line.html_tag + `>`;
        if (line.text.indexOf('References') == -1 || line.text.indexOf('Disclaimer') == -1)
            speechResponse += (JSON.stringify(line.text) + " ");
    });
    return { html: html, speak: speechResponse };
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
            let speakid = "speak-" + new Date().getTime();
            let response = renderResponse(payload.result.response, speakid);
            DOMResponse.innerHTML += response.html;
            // -- trigger for speaking the output
            fetch(broadAIDemoapiEndpoint + '/speak', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "text": response.speak
                })
            }).then((resp) => {
                // Optional: Log the raw Response object if you want to inspect headers, status, etc.
                console.log("Raw Response object:", resp);

                // Check if the response was successful (e.g., status 200-299)
                if (!resp.ok) {
                    // You might want to parse error messages here
                    return resp.json().then(errorData => {
                        throw new Error(`API error! Status: ${resp.status}, Message: ${errorData.message || JSON.stringify(errorData)}`);
                    });
                }
                // Parse the response body as JSON
                return resp.json();
            }).then((data) => {
                console.log(data);
                const speakButton = document.getElementById(speakid);
                if (speakButton) { // Always good to check if the element exists before trying to manipulate it
                    speakButton.disabled = false;
                    speakButton.addEventListener('click', () => {
                        speakButton.disabled = true;
                        // let audio = new Audio(data.speech);
                        // audio.play()
                        //     .then(() => console.log("Speaking..."))
                        //     .catch((e) => console.log(e));
                        puter.ai.txt2speech(response.speak).then((audio) => {
                            audio.play();
                            speakButton.disabled = false;
                        });
                    }); // addEventListener
                }
                else
                    console.log("No speech button");
            });
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
