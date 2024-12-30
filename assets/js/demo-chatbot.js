// ------ ..... ------ ..... ------ ..... ------ 
const goChatbot = () => {
    let DOMResponse = document.getElementById('response');
    let DOMStatus = document.getElementById('status');
    let DOMPlan = document.getElementById('plan');
    let DOMAgents = document.getElementById('agents');
    DOMStatus.innerHTML = "";
    DOMPlan.innerHTML = "";
    DOMAgents.innerHTML = "";
    // -- pre-processing DOM adjustments
    DOMResponse.innerHTML = `<div class='p-3'><img src='/assets/images/load-35_128.gif' style='width:60px; height:60px;'><pre class='text-primary'>` + getRandomMessage() + `</pre></p></div>`;
    let intvlResponses = setInterval(() => {
        DOMResponse.innerHTML = `<div class='p-3'><img src='/assets/images/load-35_128.gif' style='width:60px; height:60px;'><pre class='text-primary'>` + getRandomMessage() + `</pre></p></div>`;
    }, 10000);
    let payload = {};
    document.getElementById('btnAsk').disabled = true;
    document.getElementById('chatbox').disabled = true;
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
            "question": document.getElementById('chatbox').value + "\nMy location: " + (sessionStorage.getItem('usergeo') || 'not available'),
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
                    clearInterval(intvlResponses);
                    document.getElementById('btnAsk').disabled = false;
                    document.getElementById('chatbox').disabled = false;
                    document.getElementById('chatbox').value = "";
                }
            });
        }; // processSteam
        processSteam(streamReader);
    }); // fetch
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
Read the contents provided within '>>>' and '<<<' symbols. Then structure the information so that it is easy to comprehend and follow-up questions can be asked. It is therefore important that no information from the content can be skipped.
    `;
                sessionStorage.clear('conversation');
                goChatbot();
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