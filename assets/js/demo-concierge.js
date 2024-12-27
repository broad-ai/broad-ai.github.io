// ------ ..... ------ ..... ------ ..... ------ 
const goConcierge = () => {
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
    document.getElementById('btnGoConcierge').disabled = true;
    document.getElementById('origin').disabled = true;
    document.getElementById('destination').disabled = true;
    document.getElementById('notes').disabled = true;
    // -- engage BroadAI
    let conversation = [];
    try { conversation = JSON.parse(sessionStorage.getItem('conversation')); }
    catch { sessionStorage.clear('conversation'); }
    fetch(broadAIDemoapiEndpoint + '/plan', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "origin": document.getElementById('origin').value,
            "destination": document.getElementById('destination').value,
            "notes": document.getElementById('notes').value
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
                    document.getElementById('btnGoConcierge').disabled = false;
                    document.getElementById('origin').disabled = false;
                    document.getElementById('destination').disabled = false;
                    document.getElementById('notes').disabled = false;
                }
            });
        }; // processSteam
        processSteam(streamReader);
    }); // fetch
}; // goConcierge
