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
    if (file) {
        // -- engage BroadAI
        let conversation = [];
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
        let conversation = [];
        try { conversation = JSON.parse(sessionStorage.getItem('conversation')); }
        catch { sessionStorage.clear('conversation'); }
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
# Content (Part number ` + (i + 1) + ` of ` + chunks.length + `)
---
`+ chunks[i] + `
---

# Task
Generate a script for my podcast using provided content where I explain it in educational, entertaining, and conversational mode. Give due credit to the authors of the content, if available, or else refer to them and their work in third-person.
Notice the part number of the content and:
- if it is the first part, prepare an intro.
- if it is the last part, prepare and outro.
- for all interim parts, maintain a tone of continuity even if you might not have visibility to previous parts.
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