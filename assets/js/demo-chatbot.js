// ------ ..... ------ ..... ------ ..... ------ 
const goChatbot = () => {
    let DOMResponse = document.getElementById('response');
    let DOMStatus = document.getElementById('status');
    let DOMPlan = document.getElementById('plan');
    let DOMAgents = document.getElementById('agents');
    // -- pre-processing DOM adjustments
    DOMResponse.innerHTML = `<div class='p-3'><img src='/assets/images/load-35_128.gif' style='width:60px; height:60px;'><pre class='text-primary'>` + getRandomMessage() + `</pre></p></div>`;
    let intvlResponses = setInterval(() => {
        DOMResponse.innerHTML = `<div class='p-3'><img src='/assets/images/load-35_128.gif' style='width:60px; height:60px;'><pre class='text-primary'>` + getRandomMessage() + `</pre></p></div>`;
    }, 10000);
    let payloads = [];
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
            "question": document.getElementById('chatbox').value,
            "conversation": conversation
        })
    }).then((resp) => {
        let streamReader = resp.body.pipeThrough(new TextDecoderStream()).getReader();
        // -- function: process streamed response
        const processSteam = (reader) => {
            reader.read().then((chunk) => {
                if (!chunk.done) {
                    payloads = processPayload(chunk, DOMResponse, DOMStatus, DOMPlan, DOMAgents);
                    processSteam(streamReader);
                }
                else {
                    // -- post-processing DOM adjustments
                    clearInterval(intvlResponses);
                    console.log(payloads);
                    document.getElementById('btnAsk').disabled = false;
                    document.getElementById('chatbox').disabled = false;
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
  Organize the original content provided within '>>>' and '<<<' symbols in well-structured sections using simple formatting options like titles / subtitles, paragraphs, bullets, tables, etc. If you encounter numeric data, analyze it and provide your insights from it.
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