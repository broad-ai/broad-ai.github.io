const broadAIapiEndpoint = "https://broadaidemo-7yg2a2s6sq-uc.a.run.app";

// ------ ..... ------ ..... ------ ..... ------ 
const goChatbot = () => {
  // -- pre results formatting
  document.getElementById('responseChatbot').innerHTML += "<h4>...</h4>";
  document.getElementById('btnGoChatbot').disabled = true;
  document.getElementById('chatbox').disabled = true;

  // --- ask
  fetch(broadAIapiEndpoint + '/go', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "question": document.getElementById('chatbox').value,
      "conversations": JSON.parse(sessionStorage.getItem('conversations')) || []
    })
  })
    .then((resp) => resp.json())
    .then((data) => {
      // -- showing results
      sessionStorage.setItem('conversations', JSON.stringify(data.response.conversation));
      let message = "<p style='text-align:right;color:black;'>" + document.getElementById('chatbox').value.trim() + "</p>";
      data.response.response.forEach((line) => {
        message += "<" + line.html_tag + " style='text-align:left;color:#6a5acd;'>" + line.text + "</" + line.html_tag + ">";
      });
      message += "<hr>";
      if (sessionStorage.getItem('chat'))
        sessionStorage.setItem('chat', sessionStorage.getItem('chat') + message);
      else
        sessionStorage.setItem('chat', message);
      document.getElementById('responseChatbot').innerHTML = sessionStorage.getItem('chat') ? sessionStorage.getItem('chat') : "";

      document.getElementById('logs').innerHTML = "<h4>Plan:</h4>";
      document.getElementById('logs').innerHTML += "<div><p>" + data.plan.reason + "</p></div>";
      let html = "<div>";
      data.plan.plan.forEach((step, s) => {
        html += "<p style='margin-top:2em;'>Step <strong>" + (s + 1) + "</strong>: " + step.objective + "</p>";
        html += "<p>Agent.Skill: <strong>" + (step.agent || 'none') + "." + (step.skill ? step.skill.name : 'none') + "</strong></p>";
        html += "<p><strong>Result</strong>: <pre>" + step.result ? JSON.stringify(step.result, null, 2) : 'none' + "</pre></p>";
      });
      html += "</div>";
      document.getElementById('logs').innerHTML += html;

      document.getElementById('logs').innerHTML += "<hr>";

      document.getElementById('logs').innerHTML += "<h4>Response:</h4>";
      document.getElementById('logs').innerHTML += "<div><p>" + data.response.reason + "</p></div>";


      // -- post results formatting
      document.getElementById('btnGoChatbot').disabled = false;
      document.getElementById('chatbox').disabled = false;
      document.getElementById('chatbox').value = "";

    });
}; // goChatbot

// ------ ..... ------ ..... ------ ..... ------ 
const updateTask = () => {
  if (document.getElementById('radioBusiness').checked) {
    document.getElementById('instructions').innerHTML = "<h4>Please provide any additional details so I can help you with this trip.</h4>";
    document.getElementById('notes').setAttribute('placeholder', `e.g. I will be meeting the CEO of XYZ to discuss our strategic alliance.`);
  }
  if (document.getElementById('radioPersonal').checked) {
    document.getElementById('instructions').innerHTML = "<h4>What would you like to do on this personal trip?</h4>";
    document.getElementById('notes').setAttribute('placeholder', `e.g. I'd like to visit popular attractions, go to popular restaurants and enjoy local cuisine.`);
  }
  let task = [];
  task.push(`I am taking a`);
  task.push(
    document.getElementById('radioBusiness').checked ? `business trip`
      : (document.getElementById('radioPersonal').checked ? `personal trip` : `trip`)
  );
  if (document.getElementById('originCity').value)
    task.push(
      `from ` + document.getElementById('originCity').value
    );
  if (document.getElementById('destinationCity').value)
    task.push(
      `to ` + document.getElementById('destinationCity').value
    );
  task.push(`over next week for 5 days.`);
  if (document.getElementById('notes').value) {
    task.push(`Consider following request and provide support:`);
    task.push(`"` + document.getElementById('notes').value + `"
`);
    if (document.getElementById('radioBusiness').checked) {
      task.push(`If I mentioned a company name above, provide a summary of their business profile and latest financial performance. If I mentioned a meeting purpose, recommend talking points or an agenda outline for the meeting.
  `);
    }
    else if (document.getElementById('radioPersonal').checked) {
      task.push(`If you could recommend an itinerary of places I should visit and delicacies I must try, please help me plan those.
        `);
    }
  }
  if (document.getElementById('originCity').value && document.getElementById('destinationCity').value) {
    task.push(`Could you possibly find flight options leaving ` + document.getElementById('originCity').value + ` and arrive into ` + document.getElementById('destinationCity').value + `.
    `);
  }
  if (document.getElementById('destinationCity').value) {
    task.push(`In addition, I will greatly benefit if you can provide following information for my destination city, ` + document.getElementById('destinationCity').value + `:
    `);
    task.push(`- How I should pack depending on weather conditions expected (e.g. sunglasses, umbrella, light jacket, shoes, etc.)
    `);
    if (document.getElementById('radioPersonal').checked) {
      task.push(`- Interesting / historical significance
      `);
      task.push(`- Draft a social media message so I can let my contacts know I will be in the city
      `);
    }
  }
  document.getElementById('task').value = task.join(' ')
}; // updateTask


// ------ ..... ------ ..... ------ ..... ------ 
const goConcierge = () => {
  // -- pre results formatting
  document.getElementById('results').innerHTML = "<p style='color:black;font-size:2em;'>...</p>";
  document.getElementById('btnGoConcierge').disabled = true;

  document.getElementById('logs').innerHTML = "<h4>Task:</h4><p>" + document.getElementById('task').value.replaceAll('\n', '<br>') + "</p>";

  fetch(broadAIapiEndpoint + '/go', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "question": document.getElementById('task').value,
      "conversations": []
    })
  })
    .then((resp) => resp.json())
    .then((data) => {
      // -- showing results
      document.getElementById('results').innerHTML = "<div>";
      data.response.response.forEach((element) => {
        document.getElementById('results').innerHTML += "<" + element.html_tag + ">" + element.text + "</" + element.html_tag + ">";
      });
      document.getElementById('results').innerHTML += "</div>";

      document.getElementById('logs').innerHTML = "<h4>Plan:</h4>";
      document.getElementById('logs').innerHTML += "<div><p>" + data.plan.reason + "</p></div>";
      let html = "<div>";
      data.plan.plan.forEach((step, s) => {
        html += "<p style='margin-top:2em;'>Step <strong>" + (s + 1) + "</strong>: " + step.objective + "</p>";
        html += "<p>Agent.Skill: <strong>" + (step.agent || 'none') + "." + (step.skill ? step.skill.name : 'none') + "</strong></p>";
        html += "<p><strong>Result</strong>: <pre>" + step.result ? JSON.stringify(step.result, null, 2) : 'none' + "</pre></p>";
      });
      html += "</div>";
      document.getElementById('logs').innerHTML += html;

      document.getElementById('logs').innerHTML += "<hr>";

      document.getElementById('logs').innerHTML += "<h4>Response:</h4>";
      document.getElementById('logs').innerHTML += "<div><p>" + data.response.reason + "</p></div>";

      // -- post results formatting
      document.getElementById('btnGoConcierge').disabled = false;
    });
}; // goConcierge

// ------ ..... ------ ..... ------ ..... ------ 
const findSimilarMovies = (movie) => {
  document.getElementById('btnFindSimilarMovies').disabled = true;
  document.getElementById('btnWriteNewStory').disabled = true;

  const currentMovie = movie || {
    "title": document.getElementById('pickTitle').innerHTML,
    "director": document.getElementById('pickDirector').innerHTML,
    "year": document.getElementById('pickYear').innerHTML,
    "imdb_rating": document.getElementById('pickRating').innerHTML,
    "plot": document.getElementById('plot').innerHTML
  };
  document.getElementById('story').innerHTML = "<p style='color:#999;margin-bottom:20px;'>Okay!</p><h3 style='color:#C39BD3;'>Please hang on!</h3><p style='color:#6C3483;'>Finding other movies like " + currentMovie.title + " which you might also enjoy...</p>";
  // --- ask
  fetch(broadAIapiEndpoint + '/movflick', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "notes": `## Movie Recommended
--- 
`+ JSON.stringify(currentMovie) + `
---

## Specific Task
First, find similar movies based on similar genre or director. For each movie, extract 'movie title', 'director', 'year of release', 'IMDB rating', 'url for poster image', and the 'movie plot', as specified in response format requirements below.
Hint (Cypher): 'MATCH (g:Genre)<-[:IN_GENRE]-(m:Movie)<-[:DIRECTED]-(d:Director) WHERE d.name = "?" OR g.name = "?" RETURN m.title, d.name, ... LIMIT 3'

## Response Format
Then, using all the movies listed in the context, generate your final response within 'text' field in stringified JSON structure shown below. It is critical that response is only in this specified format:
~~~json
[{
  "html_tag": "p",
  "text": (stringified JSON) "[{ \"title\": <movie title>, \"director\": <director name>, \"year\": <year>, \"imdb_rating\": <imdbRating>, \"poster\": <poster url>, \"plot\": <movie plot> }, ...]"
}]
~~~
`,
    })
  })
    .then((resp) => resp.json())
    .then((data) => {
      let recommendations = [];
      let details = {
        "title": "...", "director": "...", "year": "...", "imdb_rating": "...", "poster": ['assets/images/popcorn-972047_1280.png', 'assets/images/ticket-33657_1280.png', 'assets/images/popcorn-898154_1280.png', 'assets/images/popcorn-576599_1280.png'][Math.floor(Math.random() * 4)], "plot": "..."
      };
      data.response.response.forEach((element) => {
        if (element.text.indexOf('[') >= 0 && element.text.indexOf(']') > 0) {
          r = JSON.parse(element.text.substring(element.text.indexOf('['), element.text.lastIndexOf(']') + 1)) || [];
          r.forEach((rr) => recommendations.push(rr));
        }
      });
      // -- showing results
      document.getElementById('btnFindSimilarMovies').disabled = false;
      document.getElementById('btnWriteNewStory').disabled = false;
      let html = `
          <div class="row">`;
      if (recommendations.length) {
        recommendations.forEach((recommendation) => {
          html += `
            <div class="col-12 col-md-4">
              <div class="row mt-5">
                <div class="col-12 text-center">
                  <button class="btn btn-success" type="button" onclick="writeSimilarStory('`+ encodeURIComponent(recommendation.title) + `', '` + encodeURIComponent(recommendation.director) + `', '` + encodeURIComponent(recommendation.year) + `', '` + encodeURIComponent(recommendation.imdb_rating) + `', '` + encodeURIComponent(recommendation.poster) + `', '` + encodeURIComponent(recommendation.plot) + `')">Create
                    Story</button>
                  <p><small>inspired by this plot</small></p>
                </div>
              </div>
              <div class="card">
                <img src="`+ recommendation.poster + `" onerror="this.src='` + ['assets/images/popcorn-972047_1280.png', 'assets/images/ticket-33657_1280.png', 'assets/images/popcorn-898154_1280.png', 'assets/images/popcorn-576599_1280.png'][Math.floor(Math.random() * 4)] + `'" class="card-img-top" alt="...">
                <div class="card-body">
                  <p class="row card-text">
                    <span class="col-6 text-left">
                      <img
                        src="assets/images/star.png" style="height:1em;"
                        alt="IMDB rating">
                      <span>`+ recommendation.imdb_rating + `</span>
                    </span>
                    <span class="col-6 text-right">
                      <span>`+ recommendation.year + `</span>
                    </span>
                  </p>
                  <h2 class="card-title">
                    <span>`+ recommendation.title + `</span>
                  </h2>
                  <h4 class="card-title">
                    <strong>Directed by: </strong>
                    <span>`+ recommendation.director + `</span>
                  </h4>
                </div>
                <div class="px-3 py-2">`+ recommendation.plot + `</div>
              </div>
            </div>
            `;
        });
      }
      else {
        html += `
            <div class="col-12 col-md-4">
              <div class="card">
                <img src="`+ ['assets/images/popcorn-972047_1280.png', 'assets/images/ticket-33657_1280.png', 'assets/images/popcorn-898154_1280.png', 'assets/images/popcorn-576599_1280.png'][Math.floor(Math.random() * 4)] + `" class="card-img-top" alt="...">
                <div class="card-body">
                  <p class="row card-text">
                    <span class="col-6 text-left">
                      <img
                        src="assets/images/star.png" style="height:1em;"
                        alt="IMDB rating">
                      <span>-</span>
                    </span>
                    <span class="col-6 text-right">
                      <span>----</span>
                    </span>
                  </p>
                  <h2 class="card-title">
                    <span>Nothing else here!</span>
                  </h2>
                  <h4 class="card-title">
                    <strong>Directed by: </strong>
                    <span>-</span>
                  </h4>
                </div>
                <div class="px-3"><p>No further recommendations.</p></div>
              </div>
            </div>
            `;
      }
      html += `
          </div>`;
      document.getElementById('story').innerHTML = html;
    });
}; // findSimilarMovies

// ------ ..... ------ ..... ------ ..... ------ 
const pickRandomMovie = () => {
  document.getElementById('story').innerHTML = "<h3 style='color:#C39BD3;'>Welcome!</h3><p style='color:#6C3483;'>Picking a movie might like...</p>";
  document.getElementById('btnFindSimilarMovies').disabled = true;
  document.getElementById('btnWriteNewStory').disabled = true;
  // --- ask
  fetch(broadAIapiEndpoint + '/movflick', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "notes": `## Specific Task
First, find one random movie from the 9125 choices.
Hint (Cypher): 'MATCH (g:Genre)<-[:IN_GENRE]-(m:Movie)<-[:DIRECTED]-(d:Director) RETURN m.title, d.name, ... ORDER BY rand() LIMIT 1'
You must extract 'movie title', 'director', 'year of release', 'IMDB rating', 'url for poster image', and the 'movie plot', as specified in response format requirements below.

## Response Format
Then, using all the movies listed in the context, generate your final response within 'text' field in stringified JSON structure shown below. It is critical that response is only in this specified format:
~~~json
[{
  "html_tag": "p",
  "text": (stringified JSON) "{ \"title\": <movie title>, \"director\": <director name>, \"year\": <year>, \"imdb_rating\": <imdbRating>, \"poster\": <poster url>, \"plot\": <movie plot> }"
}]
~~~
`,
    })
  })
    .then((resp) => resp.json())
    .then((data) => {
      let details = {
        "title": "...", "director": "...", "year": "...", "imdb_rating": "...", "poster": ['assets/images/popcorn-972047_1280.png', 'assets/images/ticket-33657_1280.png', 'assets/images/popcorn-898154_1280.png', 'assets/images/popcorn-576599_1280.png'][Math.floor(Math.random() * 4)], "plot": "..."
      };
      data.response.response.forEach((element) => {
        if (element.text.indexOf('{') >= 0 && element.text.indexOf('}') > 0) {
          details = JSON.parse(element.text.substring(element.text.indexOf('{'), element.text.lastIndexOf('}') + 1));
        }
      });
      // -- showing results
      document.getElementById('btnFindSimilarMovies').disabled = false;
      document.getElementById('btnWriteNewStory').disabled = false;
      document.getElementById('plot').innerHTML = details.plot;
      document.getElementById('pickTitle').innerHTML = details.title;
      document.getElementById('pickDirector').innerHTML = details.director;
      document.getElementById('pickPoster').setAttribute('src', details.poster);
      document.getElementById('pickPoster').setAttribute('onerror', 'this.src="' + ['assets/images/popcorn-972047_1280.png', 'assets/images/ticket-33657_1280.png', 'assets/images/popcorn-898154_1280.png', 'assets/images/popcorn-576599_1280.png'][Math.floor(Math.random() * 4)] + '"');
      document.getElementById('pickRating').innerHTML = details.imdb_rating;
      document.getElementById('pickYear').innerHTML = details.year;

      findSimilarMovies(details);

    });
}; // pickRandomMovie

// ------ ..... ------ ..... ------ ..... ------ 
const writeSimilarStory = (title, director, year, imdb_rating, poster, plot) => {
  document.getElementById('btnFindSimilarMovies').disabled = true;
  document.getElementById('btnWriteNewStory').disabled = true;
  document.getElementById('story').innerHTML = "<h4>Thinking of a story based on the plot</h4>";
  // -- show cover of selected movie
  if (plot)
    document.getElementById('plot').innerHTML = decodeURIComponent(plot);
  if (title)
    document.getElementById('pickTitle').innerHTML = decodeURIComponent(title);
  if (director)
    document.getElementById('pickDirector').innerHTML = decodeURIComponent(director);
  if (poster) {
    document.getElementById('pickPoster').setAttribute('src', decodeURIComponent(poster));
    document.getElementById('pickPoster').setAttribute('onerror', 'this.src="' + ['assets/images/popcorn-972047_1280.png', 'assets/images/ticket-33657_1280.png', 'assets/images/popcorn-898154_1280.png', 'assets/images/popcorn-576599_1280.png'][Math.floor(Math.random() * 4)] + '"');
  }
  if (imdb_rating)
    document.getElementById('pickRating').innerHTML = decodeURIComponent(imdb_rating);
  if (year)
    document.getElementById('pickYear').innerHTML = decodeURIComponent(year);
  // --- ask
  fetch(broadAIapiEndpoint + '/go', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "question": `Take a look at this plot below:
~~~
`+ document.getElementById('plot').innerHTML + `
~~~
Based on the theme of the plot above, write a catchy story in about 600 words.
`,
    })
  })
    .then((resp) => resp.json())
    .then((data) => {
      let html = "<div style='color:#999;font-family:courier;'>";
      data.response.response.forEach((element) => {
        if (element.html_tag != "pre")
          html += "<" + element.html_tag + ">" + element.text + "</" + element.html_tag + ">";
      });
      html += "</div>";
      document.getElementById('btnFindSimilarMovies').disabled = false;
      document.getElementById('btnWriteNewStory').disabled = false;
      document.getElementById('story').innerHTML = html;
    });
}; // writeSimilarStory
