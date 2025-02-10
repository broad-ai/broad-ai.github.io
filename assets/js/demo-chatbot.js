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
            "question": document.getElementById('chatbox').value + "Just as an FYI, I am from " + (sessionStorage.getItem('usergeo') || 'not available') + ". Selectively use this information only if it is relevant in my case, else ignore it.",
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
const processFileContents = (chunks) => {
    document.getElementById('response').innerHTML = "";
    let processing = false;
    let i = -1;
    let completeResponse = "";
    let intvlProcessChunks = setInterval(() => {
        if (!processing) {
            processing = true;
            i++;
            if (i < chunks.length) {
                document.getElementById('chatbox').value = `Analyze the contents within '>>>' and '<<<' symbols. Take following actions:
1. format it most suitably considering type of information,
2. provide a high-level analysis of the content, and 
3. recommend advice or actions that can be taken utilizing this content.
>>>
`+ chunks[i] + `
<<<
`;
                goChatbot();
                let disabledChatboxIntvl = setInterval(() => {
                    if (document.getElementById('chatbox').disabled == false) {
                        clearInterval(disabledChatboxIntvl);
                        completeResponse += document.getElementById('response').innerHTML;
                        processing = false;
                    }
                }, 100);
            }
            else {
                clearInterval(intvlProcessChunks);
                document.getElementById('response').innerHTML = completeResponse;
            }
        }
    }, 100);
    //     const MAX_TOKENS_LLM = (1024 * 128);
    //     // -- gpt-4o : 128K input tokens & 16K output tokens
    //     // -- assumption: 1 word = 1 token
    //     let packageSize = Math.round(MAX_TOKENS_LLM / (avgWordCountPerLine * avgWordCountPerLine));

    //     let currentPosition = -1;
    //     let fileProcessing = false;

    //     let fileProcessingIntvl = setInterval(() => {
    //         if (!fileProcessing) {
    //             currentPosition++;
    //             fileProcessing = true;
    //             if (currentPosition < knowledge.length) {
    //                 let chunk = "";
    //                 chunk = knowledge.slice(currentPosition, currentPosition + packageSize).join(' ');
    //                 currentPosition = currentPosition + packageSize;
    //                 // prepare chat
    //                 document.getElementById('chatbox').value = `>>>
    //   `+ chunk + `
    //   <<<
    // Read the contents provided within '>>>' and '<<<' symbols. Analyze the content and format it most suitable for it's type. Also provide a high-level analysis of the content and make recommendations on what can be done with this data.
    //     `;
    //                 sessionStorage.clear('conversation');
    //                 goChatbot();
    //                 let disabledChatboxIntvl = setInterval(() => {
    //                     if (document.getElementById('chatbox').disabled == false) {
    //                         clearInterval(disabledChatboxIntvl);
    //                         fileProcessing = false;
    //                     }
    //                 }, 100);
    //             }
    //             else {
    //                 clearInterval(fileProcessingIntvl);
    //             }
    //         }
    //     }, 100);
} // processFileContents