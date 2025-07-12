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
        // -- pre-processing DOM adjustments
        DOMResponse.innerHTML = `<img class='m-2 float-end' src='/assets/images/load-35_128.gif' style='width:3em; height:3em;'>`;
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
const processFileContents = (knowledge, avgWordCountPerLine) => {
    const MAX_TOKENS_LLM = (1024 * 128);
    // -- gpt-4o : 128K input tokens & 16K output tokens
    // -- assumption: 1 word = 1 token
    let packageSize = Math.round(MAX_TOKENS_LLM / (avgWordCountPerLine * avgWordCountPerLine));

    let currentPosition = -1;
    let fileProcessing = false;

    let fileProcessingIntvl = setInterval(() => {
        if (!fileProcessing) {
            currentPosition++;
            fileProcessing = true;
            if (currentPosition < knowledge.length) {
                let chunk = "";
                chunk = knowledge.slice(currentPosition, currentPosition + packageSize).join(' ');
                currentPosition = currentPosition + packageSize;
                // prepare chat
                document.getElementById('chatbox').value = `>>>
  `+ chunk + `
<<<
Using contents provided within '>>>' and '<<<' symbols, generate a script for my podcast show where I explain the content in educational mode. Make it entertaining, conversational, and informational. Give due credit to the authors of the content, if available, or else refer to them and their work in third-person.
    `;
                sessionStorage.clear('conversation');
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
} // processFileContents

document.addEventListener('response-ready', (evt) => {
    console.log(evt);
});