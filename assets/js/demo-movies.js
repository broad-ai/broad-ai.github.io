// ------ ..... ------ ..... ------ ..... ------ 
const goMovies = () => {
    let DOMResponse = document.getElementById('response');
    let DOMStatus = document.getElementById('status');
    let DOMPlan = document.getElementById('plan');
    let DOMAgents = document.getElementById('agents');
    // -- pre-processing DOM adjustments
    DOMResponse.innerHTML = `<div class='p-3'><img src='/assets/images/load-35_128.gif' style='width:60px; height:60px;'><pre class='text-primary'>` + getRandomMessage() + `</pre></p></div>`;
    let intvlResponses = setInterval(() => {
        DOMResponse.innerHTML = `<div class='p-3'><img src='/assets/images/load-35_128.gif' style='width:60px; height:60px;'><pre class='text-primary'>` + getRandomMessage() + `</pre></p></div>`;
    }, 10000);
    let payload = {};
    // -- get location data for weather and news
    fetch("https://ipinfo.io/json").then((resp) => resp.json()).then((geo) => {
        // -- engage BroadAI
        let conversation = [];
        try { conversation = JSON.parse(sessionStorage.getItem('conversation')); }
        catch { sessionStorage.clear('conversation'); }
        fetch(broadAIDemoapiEndpoint + '/movie/recommend', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "city": geo.city + ", " + geo.region,
                "country": geo.country,
                "zip": geo.postal
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
                    }
                });
            }; // processSteam
            processSteam(streamReader);
        }); // fetch
    }); // fetch 
}; // goMovies