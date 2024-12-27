// ------ ..... ------ ..... ------ ..... ------ 
const renderMovieCards = (payloads, DOMResponse) => {
    let movies = [];
    payloads.forEach((payload) => {
        if (payload.result) {
            if (payload.result.response) {
                DOMResponse.innerHTML = ``;
                payload.result.response.forEach((line) => {
                    // -- extracting JSON response from results
                    let jsnMovies = { "movies": [] };
                    if (line.text.indexOf('{') >= 0 && line.text.lastIndexOf('}') > 0) {
                        try {
                            jsnMovies = JSON.parse(line.text.substring(line.text.indexOf('{'), line.text.lastIndexOf('}') + 1).replaceAll(new RegExp('/\\*[\\s\\S]*?\\*/', 'gm'), ''));
                        }
                        catch {
                            console.log(line.text);
                        }
                        if (jsnMovies.movies)
                            jsnMovies.movies.forEach((movie) => movies.push(movie));
                    }
                });
                // -- render all movies in cards
                if (movies.length) {
                    let html = `
                  <div class='row p-1'>`;
                    movies.forEach((movie) => {
                        html += `
                      <div class="col-12 col-sm-12 col-md-6 col-lg-6">
                      <div class="card">
                          <img src="`+ movie.image + `" class="card-img-top" alt="` + movie.name + `">
                          <div class="card-body">
                          <h2 class="card-title">`+ movie.name + `</h2>
                          <h4 class="card-subtitle mb-2 text-muted">`+ movie.director + `</h4>
                          <hr>
                          <div class='row'>
                              <div class='col text-start'><span class='text-muted'>Release Year: </span>`+ movie.year + `</div>
                              <div class='col text-end'><span class='text-muted'>IMDB Rating: </span>`+ movie.rating + `</div>
                          </div>
                          <hr>  
                          <div class='row'>
                              <div class='col'><span class='text-muted'>`+ movie.plot + `</span></div>
                          </div>
                          <hr>  
                          <div class='row'>
                              <div class='col text-center'><a href='javascript:goSimilarMovies(\"`+ encodeURI(movie.name) + `\", \"` + encodeURI(movie.director) + `\", \"` + movie.year + `\", \"` + movie.rating + `\");'>Find similar</a></div>
                          </div>
                          </div>
                      </div>
                      </div>`;
                    });
                    html += `</div>`;
                    DOMResponse.innerHTML += html;
                }
            }
            else {
                DOMResponse.innerHTML += `
                    <h3>Oops! Something didn't go as well as expected.</h3>
                    <p>Do you mind <a href='javascript:window.location.reload();'>refreshing</a> this page again?</p>
                    <hr>
                    <small>
                        <pre>`+ JSON.stringify(payload, null, 2) + `</pre>
                    </small>`;
            }
        }
    }); // forEach
}; // renderMovieCards

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
    let payloads = [];
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
                        renderMovieCards(payloads, DOMResponse);
                    }
                });
            }; // processSteam
            processSteam(streamReader);
        }); // fetch
    }); // fetch 
}; // goMovies


// ------ ..... ------ ..... ------ ..... ------ 
const goSimilarMovies = (movie, director, year, rating) => {
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
    // -- engage BroadAI
    let conversation = [];
    try { conversation = JSON.parse(sessionStorage.getItem('conversation')); }
    catch { sessionStorage.clear('conversation'); }
    fetch(broadAIDemoapiEndpoint + '/movie/similar', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "movie": movie,
            "director": director,
            "year": year,
            "rating": rating
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
                    renderMovieCards(payloads, DOMResponse);
                }
            });
        }; // processSteam
        processSteam(streamReader);
    }); // fetch
}; // goSimilarMovies
