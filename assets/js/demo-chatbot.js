// ------ ..... ------ ..... ------ ..... ------ 
const goChatbot = (file) => {
    let DOMResponse = document.getElementById('response');
    let DOMStatus = document.getElementById('status');
    let DOMPlan = document.getElementById('plan');
    let DOMAgents = document.getElementById('agents');
    DOMResponse.style.paddingBottom = "3em";
    let payload = {};
    document.getElementById('btnAsk').disabled = true;
    document.getElementById('chatbox').disabled = true;
    let conversation = [];
    try { conversation = JSON.parse(sessionStorage.getItem('conversation')); }
    catch { sessionStorage.clear('conversation'); }
    if (file) {
        // -- engage BroadAI
        fetch(broadAIDemoapiEndpoint + '/analyzefile', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "question": document.getElementById('chatbox').value,
                "conversation": conversation
            })
        }).then((resp) => {
            let streamReader = resp.body.pipeThrough(new TextDecoderStream()).getReader();
            // -- function: process streamed response
            let buffer = '';
            const processSteam = (reader) => {
                reader.read().then((chunk) => {
                    if (!chunk.done) {
                        if (chunk.value.indexOf('\n') == -1)
                            buffer += chunk.value;
                        else {
                            buffer += chunk.value;
                            let cutoffat = buffer.indexOf('\n');
                            try {
                                let obj = JSON.parse(buffer.slice(0, cutoffat));
                                buffer = buffer.slice(cutoffat + 1);
                                console.log("Parsed chunk: ", obj);
                                payload = processPayload(obj, DOMResponse, DOMStatus, DOMPlan, DOMAgents);
                            }
                            catch {
                                console.log("Could not parse JSON object: ", buffer, cutoffat, buffer.slice(0, cutoffat));
                            }
                        }
                        processSteam(streamReader);
                    }
                    else {
                        // -- post-processing DOM adjustments
                        document.getElementById('btnAsk').disabled = false;
                        document.getElementById('chatbox').disabled = false;
                        document.getElementById('chatbox').value = "";
                    }
                });
            }; // processSteam
            processSteam(streamReader);
        }); // fetch
    }
    else {
        DOMStatus.innerHTML = "";
        DOMPlan.innerHTML = "";
        DOMAgents.innerHTML = "";
        // -- engage BroadAI
        fetch(broadAIDemoapiEndpoint + '/go', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "question": document.getElementById('chatbox').value,
                "conversation": conversation
            })
        }).then((resp) => {
            let streamReader = resp.body.pipeThrough(new TextDecoderStream()).getReader();
            // -- function: process streamed response
            let buffer = '';
            const processSteam = (reader) => {
                reader.read().then((chunk) => {
                    if (!chunk.done) {
                        if (chunk.value.indexOf('\n') == -1)
                            buffer += chunk.value;
                        else {
                            buffer += chunk.value;
                            let cutoffat = buffer.indexOf('\n');
                            try {
                                let obj = JSON.parse(buffer.slice(0, cutoffat));
                                buffer = buffer.slice(cutoffat + 1);
                                console.log("Parsed chunk: ", obj);
                                payload = processPayload(obj, DOMResponse, DOMStatus, DOMPlan, DOMAgents);
                            }
                            catch {
                                console.log("Could not parse JSON object: ", buffer, cutoffat, buffer.slice(0, cutoffat));
                            }
                        }
                        processSteam(streamReader);
                    }
                    else {
                        // -- post-processing DOM adjustments
                        document.getElementById('btnAsk').disabled = false;
                        document.getElementById('chatbox').disabled = false;
                        document.getElementById('chatbox').value = "";
                    }
                });
            }; // processSteam
            processSteam(streamReader);
        }); // fetch   
    }
}; // goChatbot

// ------ ..... ------ ..... ------ ..... ------ 
const processFileContents = (chunks) => {
    let i = -1;
    let fileProcessing = false;
    let fileProcessingIntvl = setInterval(() => {
        if (!fileProcessing) {
            i++;
            fileProcessing = true;
            if (i < chunks.length) {
                document.getElementById('chatbox').value = `
# Content
---
## Part ` + (i + 1) + ` of ` + chunks.length + `
`+ chunks[i] + `
---

# Core Directives:
1.  Audience-Centric: Write for an audio-only format. Focus on clarity, conciseness, and conversational flow.
2.  Educational & Engaging: Maintain an informative yet captivating tone. Explain technical terms simply.
3.  Credit & Attribution: If author details are provided, credit them by name. Otherwise, use third-person references (e.g., "researchers suggest," "studies indicate").
4.  No Redundancy: Synthesize information; do not repeat content unnecessarily across segments.
5.  Active Voice: Prioritize active voice for dynamic delivery.

# Content Structure Directives (based on part number and total parts):
- First Part:
    * Intro: Craft a compelling intro that hooks the listener, briefly introduces the topic, and sets the episode's stage.
    * No Outro unless this is the only part
- Interim Parts:
    * Continuity: Seamlessly transition from the previous segment, maintaining a consistent flow and building on the established topic.
    * No Intro/Outro
- Last Part:
    * Continuity: Maintain flow from previous segments, if any.
    * Outro: Develop a strong outro that summarizes key takeaways, reinforces the main message, and provides a clear conclusion. You may suggest further engagement (e.g., "learn more at our website").
`;
                goChatbot(true);
                let disabledChatboxIntvl = setInterval(() => {
                    if (document.getElementById('chatbox').disabled == false) {
                        clearInterval(disabledChatboxIntvl);
                        fileProcessing = false;
                    }
                }, 100);
            }
            else {
                clearInterval(fileProcessingIntvl);
            }
        }
    }, 100);
}; // processFileContents