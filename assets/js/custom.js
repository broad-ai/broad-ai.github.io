(function ($) {

  "use strict";

  // Header Type = Fixed
  $(window).scroll(function () {
    var scroll = $(window).scrollTop();
    var box = $('.header-text').height();
    var header = $('header').height();

    if (scroll >= box - header) {
      $("header").addClass("background-header");
    } else {
      $("header").removeClass("background-header");
    }
  });


  $('.loop').owlCarousel({
    center: true,
    items: 1,
    loop: true,
    autoplay: true,
    nav: true,
    margin: 0,
    responsive: {
      1200: {
        items: 3
      },
      992: {
        items: 3
      },
      760: {
        items: 2
      }
    }
  });

  $('.no-loop').owlCarousel({
    center: false,
    items: 1,
    loop: false,
    autoplay: false,
    nav: true,
    margin: 0,
    responsive: {
      1200: {
        items: 3
      },
      992: {
        items: 3
      },
      760: {
        items: 2
      }
    }
  });


  // Menu Dropdown Toggle
  if ($('.menu-trigger').length) {
    $(".menu-trigger").on('click', function () {
      $(this).toggleClass('active');
      $('.header-area .nav').slideToggle(200);
    });
  }


  // Menu elevator animation
  $('.scroll-to-section a[href*=\\#]:not([href=\\#])').on('click', function () {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        var width = $(window).width();
        if (width < 991) {
          $('.menu-trigger').removeClass('active');
          $('.header-area .nav').slideUp(200);
        }
        $('html,body').animate({
          scrollTop: (target.offset().top) + 1
        }, 700);
        return false;
      }
    }
  });

  $(document).ready(function () {
    $(document).on("scroll", onScroll);

    //smoothscroll
    $('.scroll-to-section a[href^="#"]').on('click', function (e) {
      e.preventDefault();
      $(document).off("scroll");

      $('.scroll-to-section a').each(function () {
        $(this).removeClass('active');
      })
      $(this).addClass('active');

      var target = this.hash,
        menu = target;
      var target = $(this.hash);
      $('html, body').stop().animate({
        scrollTop: (target.offset().top) + 1
      }, 500, 'swing', function () {
        window.location.hash = target;
        $(document).on("scroll", onScroll);
      });
    });
  });

  function onScroll(event) {
    var scrollPos = $(document).scrollTop();
    $('.nav a').each(function () {
      var currLink = $(this);
      var refElement = $(currLink.attr("href"));
      if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
        $('.nav ul li a').removeClass("active");
        currLink.addClass("active");
      }
      else {
        currLink.removeClass("active");
      }
    });
  }


  // Acc
  $(document).on("click", ".naccs .menu div", function () {
    var numberIndex = $(this).index();

    if (!$(this).is("active")) {
      $(".naccs .menu div").removeClass("active");
      $(".naccs ul li").removeClass("active");

      $(this).addClass("active");
      $(".naccs ul").find("li:eq(" + numberIndex + ")").addClass("active");

      var listItemHeight = $(".naccs ul")
        .find("li:eq(" + numberIndex + ")")
        .innerHeight();
      $(".naccs ul").height(listItemHeight + "px");
    }
  });


  // Page loading animation
  $(window).on('load', function () {

    $('#js-preloader').addClass('loaded');

  });



  // Window Resize Mobile Menu Fix
  function mobileNav() {
    var width = $(window).width();
    $('.submenu').on('click', function () {
      if (width < 767) {
        $('.submenu ul').removeClass('active');
        $(this).find('ul').toggleClass('active');
      }
    });
  }

})(window.jQuery);


const broadAIDemoapiEndpoint = "https://broadaidemo-7yg2a2s6sq-uc.a.run.app";
const broadAIapiEndpoint = "https://broadai-7yg2a2s6sq-uc.a.run.app";


// ------ ..... ------ ..... ------ ..... ------ 
const subscribe = () => {
  const name = document.getElementById('username').value;
  const email = document.getElementById('useremail').value;
  const emailRegex = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  if (emailRegex.test(email)) {
    document.getElementById('btnsubscribe').disabled = true;
    document.getElementById('emailvalidation_subs').innerHTML = "";
    fetch(broadAIapiEndpoint + "/connect", {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json"
      },
      "body": JSON.stringify({
        "name": name,
        "email": email,
      })
    }).then((response) => response.json())
      .then((resp) => {
        document.getElementById('btnsubscribe').disabled = false;
        if (resp.error)
          document.getElementById('subscribed').innerHTML = "<h2 style='text-align:center;'>Oops!</h2> <p style='text-align:center;font-size:1.25em;'>Something went wrong. Can you please try again?</p>";
        else
          document.getElementById('subscribed').innerHTML = "<h2 style='text-align:center;'>Welcome to the community, " + name + "!</h2> <p style='text-align:center;font-size:1.25em;'>Let's stay in touch.</p>";
      });
  }
  else {
    document.getElementById('emailvalidation_subs').innerHTML = "Please enter a valid email";
  }
}; // subscribe

// ------ ..... ------ ..... ------ ..... ------ 
const registerApp = () => {
  let appname = document.getElementById('appname').value;
  let owneremail = document.getElementById('owneremail').value;
  const emailRegex = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  let purpose = document.getElementById('purpose').value;
  // // ...
  if (emailRegex.test(owneremail)) {
    document.getElementById('appname').disabled = true;
    document.getElementById('owneremail').disabled = true;
    document.getElementById('purpose').disabled = true;
    document.getElementById('btnregister').hidden = true;
    document.getElementById('message').innerHTML = "<p>Working...</p>";
    document.getElementById('emailvalidation').innerHTML = "";
    fetch(broadAIapiEndpoint + '/app/register', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "appname": appname,
        "owner": {
          "email": owneremail
        },
        "purpose": purpose,
      })
    }).then((response) => response.json())
      .then((resp) => {
        if (resp.status == "registered") {
          document.getElementById('appname').disabled = false;
          document.getElementById('owneremail').disabled = false;
          document.getElementById('purpose').disabled = false;
          document.getElementById('btnregister').hidden = false;

          document.getElementById('message').innerHTML = "<div class='col-12' style='border-style:dotted;border-width:1px;background-color:#fff;'>";
          document.getElementById('message').innerHTML += "<p>AppID: <span style='color:#00500d;font-weight:600;background-color:#ffffe7;'>" + resp.appid + "</span> <br> <small>" + resp.reason + "</small></p>";
          document.getElementById('message').innerHTML += "<p>Dashboard URL: <a href = 'https://broad-ai.github.io/metering.html?appid=" + resp.appid + "' target='_blank'>https://broad-ai.github.io/metering.html?appid=" + resp.appid + "</a></p>";
          document.getElementById('message').innerHTML += "</div>";
        }
        else {
          document.getElementById('appname').disabled = false;
          document.getElementById('owneremail').disabled = false;
          document.getElementById('purpose').disabled = false;
          document.getElementById('btnregister').hidden = false;

          document.getElementById('message').innerHTML = "<div class='col-12' style='border-style:dotted;border-width:1px;background-color:#fff;'>";
          document.getElementById('message').innerHTML += "<p><span style='color:#ff654c;'>" + resp.reason + "</span></p>";
          document.getElementById('message').innerHTML += "</div>";
        }
      });
  }
  else {
    document.getElementById('emailvalidation').innerHTML = "Please enter a valid email";
  }
};


// ------ ..... ------ ..... ------ ..... ------ 
const goChatbot = () => {
  // -- pre results formatting
  document.getElementById('btnGoChatbot').disabled = true;
  document.getElementById('chatbox').disabled = true;
  document.getElementById('logs').innerHTML = "";
  document.getElementById('responseChatbot').scrollTop = document.getElementById('responseChatbot').scrollHeight;

  // --- ask
  fetch(broadAIDemoapiEndpoint + '/go', {
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
      let messages = "<p style='text-align:right;color:black;'>" + document.getElementById('chatbox').value.trim() + "</p>";
      data.response.response.forEach((line) => {
        messages += "<" + line.html_tag + " style='text-align:left;color:#6a5acd;'>" + line.text + "</" + line.html_tag + ">";
      });
      document.getElementById('responseChatbot').innerHTML += messages + "<hr>";
      document.getElementById('responseChatbot').scrollTop = document.getElementById('responseChatbot').scrollHeight;

      // -- post results formatting
      document.getElementById('btnGoChatbot').disabled = false;
      document.getElementById('chatbox').disabled = false;
      document.getElementById('chatbox').value = "";

      // -- Logs
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
  task.push(`sometime next week.`);
  if (document.getElementById('notes').value) {
    task.push(`Consider following request and provide support:`);
    task.push(`"` + document.getElementById('notes').value + `"
    `);
    if (document.getElementById('radioBusiness').checked) {
      task.push(`If I mentioned a company name above, provide a summary of their business profile and latest financial performance. If I mentioned a meeting purpose, recommend talking points or an agenda outline for the meeting.
      `);
    }
  }
  if (document.getElementById('destinationCity').value) {
    task.push(`In addition, I will greatly benefit if you can provide following information for my destination city, ` + document.getElementById('destinationCity').value + `:
        `);
    task.push(`- Connected airports
        `);
    task.push(`- Dressing accessories to consider based on weather conditions (e.g. sunglasses, umbrella, light jacket, shoes, etc.)
        `);
    task.push(`- If an international city, provide exchange rate (use USD as base currency) 
        `);
    if (document.getElementById('radioPersonal').checked) {
      task.push(`- Interesting / historical significance
          `);
      task.push(`- Must visit local attractions (ensure that recommendations are accurate and verify their relevance)
          `);
      task.push(`- A draft social media message letting my contacts know I will be in the city
          `);
    }
  }
  if (document.getElementById('originCity').value) {
    task.push(`If possible, include following my city of origin, ` + document.getElementById('originCity').value + `:
        `);
    task.push(`- Best day to travel weather-wise
        `);
  }
  document.getElementById('task').value = task.join(' ')
}; // updateTask


// ------ ..... ------ ..... ------ ..... ------ 
const goConcierge = () => {
  // -- pre results formatting
  document.getElementById('results').innerHTML = "<p style='color:black;font-size:2em;'>...</p>";
  document.getElementById('btnGoConcierge').disabled = true;

  document.getElementById('logs').innerHTML = "<h4>Task:</h4><p>" + document.getElementById('task').value.replaceAll('\n', '<br>') + "</p>";

  fetch(broadAIDemoapiEndpoint + '/go', {
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
  document.getElementById('story').innerHTML = "<h3 style='color:#C39BD3;'>Okay! Please hang on!</h3><p style='color:#6C3483;'>Finding other movies like <strong>" + currentMovie.title + "</strong> which you might also enjoy...</p>";
  // --- ask
  fetch(broadAIDemoapiEndpoint + '/movflick', {
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
Find similar movies based on similar genre or director. For each movie, you must extract 'movie title', 'director', 'year of release', 'IMDB rating', 'url for poster image', and the 'movie plot', as specified in response format requirements below.

## Response Format
You are expected to respond in a specific format in addition to any other response you may generate. One of the 'text' fields of the response structure must be formatted as stringified array of JSON objects as shown below. The 'html_tag' for that response element can be set to 'pre':
~~~json.stringify
"[ { \"title\": \"<movie title>\", \"director\": \"<director name>\", \"year\": \"<year>\", \"imdb_rating\": \"<imdbRating>\", \"poster\": \"<poster url>\", \"plot\": \"<movie plot>\" }, ... ]"
~~~
`,
    })
  })
    .then((resp) => resp.json())
    .then((data) => {
      let recommendations = [];
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
          if (recommendation.title && recommendation.director && recommendation.year && recommendation.imdb_rating && recommendation.poster && recommendation.plot) {
            html += `
            <div class="col-12 col-md-6">
              <div class="row mt-5">
                <div class="col-12 text-center">
                  <button class="btn btn-success" type="button" onclick="writeSimilarStory('`+ encodeURIComponent(recommendation.title) + `', '` + encodeURIComponent(recommendation.director) + `', '` + encodeURIComponent(recommendation.year) + `', '` + encodeURIComponent(recommendation.imdb_rating) + `', '` + encodeURIComponent(recommendation.poster) + `', '` + encodeURIComponent(recommendation.plot) + `')">Create
                    Story</button>
                  <p><small>inspired by this plot</small></p>
                </div>
              </div>
              <div class="card px-3 py-3">
                <img src="`+ recommendation.poster + `" onerror="this.src='` + ['assets/images/popcorn-972047_1280.png', 'assets/images/ticket-33657_1280.png', 'assets/images/popcorn-898154_1280.png', 'assets/images/popcorn-576599_1280.png'][Math.floor(Math.random() * 4)] + `'" class="card-img-top" alt="...">
                <div class="card-body">
                  <div class="row">
                    <span class="col-6 text-left">
                      <img
                        src="assets/images/star.png" alt="IMDB rating">
                      <span>`+ recommendation.imdb_rating + `</span>
                    </span>
                    <span class="col-6 text-right">
                      <span>`+ recommendation.year + `</span>
                    </span>
                  </div>
                  <div class="mt-2">
                    <h2><span>`+ recommendation.title + `</span></h2>
                  </div>
                  <div class="mt-2">
                    <p>`+ "Director: " + recommendation.director + `</span></p>
                  </div>
                </div>
                <div class="px-3 py-2">`+ recommendation.plot + `</div>
              </div>
            </div>
            `;
          }
        });
      }
      else {
        document.getElementById('story').innerHTML = "<h3 style='color:#C39BD3;'>Sorry! No recommendations</h3><p style='color:#6C3483;'>I could not find anything similar like <strong>" + currentMovie.title + "</strong> that you might enjoy...</p>";
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
  fetch(broadAIDemoapiEndpoint + '/movflick', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "notes": `## Specific Task
Find exactly one random movie from the 9125 choices.
Hint (Cypher): 'MATCH (g:Genre)<-[:IN_GENRE]-(m:Movie)<-[:DIRECTED]-(d:Director) RETURN m.title, d.name, ... ORDER BY rand() LIMIT 1'
You must extract 'movie title', 'director', 'year of release', 'IMDB rating', 'url for poster image', and the 'movie plot', as specified in response format requirements below.

## Response Format
You are expected to respond in a specific format in addition to any other response you may generate. One of the 'text' fields of the response structure must be formatted as stringified JSON object as shown below. The 'html_tag' for that response element can be set to 'pre':
~~~json.stringify
"{ \"title\": \"<movie title>\", \"director\": \"<director name>\", \"year\": \"<year>\", \"imdb_rating\": \"<imdbRating>\", \"poster\": \"<poster url>\", \"plot\": \"<movie plot>\" }"
~~~
`,
    })
  })
    .then((resp) => resp.json())
    .then((data) => {
      document.getElementById('story').innerHTML = "<h3 style='color:#C39BD3;'>Enjoy!</h3><p style='color:#6C3483;'>Find similar movies or request a new story based on the theme of the picked movie.</p>";
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
      document.getElementById('pickDirector').innerHTML = "Director: " + details.director;
      document.getElementById('pickPoster').setAttribute('src', details.poster);
      document.getElementById('pickPoster').setAttribute('onerror', 'this.src="' + ['assets/images/popcorn-972047_1280.png', 'assets/images/ticket-33657_1280.png', 'assets/images/popcorn-898154_1280.png', 'assets/images/popcorn-576599_1280.png'][Math.floor(Math.random() * 4)] + '"');
      document.getElementById('pickRating').innerHTML = details.imdb_rating;
      document.getElementById('pickYear').innerHTML = details.year;
    });
}; // pickRandomMovie

// ------ ..... ------ ..... ------ ..... ------ 
const writeSimilarStory = (title, director, year, imdb_rating, poster, plot) => {
  document.getElementById('btnFindSimilarMovies').disabled = true;
  document.getElementById('btnWriteNewStory').disabled = true;
  document.getElementById('story').innerHTML = "<h4>Thinking of a story based on the plot</h4>";
  // -- show cover of selected movie
  let _title = title ? decodeURIComponent(title) : document.getElementById('pickTitle').innerHTML;
  document.getElementById('pickTitle').innerHTML = _title;
  let _director = director ? decodeURIComponent(director) : document.getElementById('pickDirector').innerHTML;
  document.getElementById('pickDirector').innerHTML = _director;
  let _year = year ? decodeURIComponent(year) : document.getElementById('pickYear').innerHTML;
  document.getElementById('pickYear').innerHTML = _year;
  let _imdb_rating = imdb_rating ? decodeURIComponent(imdb_rating) : document.getElementById('pickRating').innerHTML;
  document.getElementById('pickRating').innerHTML = _imdb_rating;
  let _poster = poster ? decodeURIComponent(poster) : document.getElementById('pickPoster').getAttribute('src').value;
  if (_poster) {
    document.getElementById('pickPoster').setAttribute('src', _poster);
    document.getElementById('pickPoster').setAttribute('onerror', 'this.src="' + ['assets/images/popcorn-972047_1280.png', 'assets/images/ticket-33657_1280.png', 'assets/images/popcorn-898154_1280.png', 'assets/images/popcorn-576599_1280.png'][Math.floor(Math.random() * 4)] + '"');
  }
  let _plot = plot ? decodeURIComponent(plot) : document.getElementById('plot').innerHTML;
  document.getElementById('plot').innerHTML = _plot;
  // --- ask
  fetch(broadAIDemoapiEndpoint + '/go', {
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


// ------ ..... ------ ..... ------ ..... ------ 
const fetchUsage = () => {
  const searchParams = new URLSearchParams(window.location.search);
  let appid = searchParams.get('appid');
  let html = "...";
  setTimeout(() => {
    document.getElementById('dashboard').innerHTML = html;
    fetch(broadAIapiEndpoint + '/app/metering/' + appid, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then((response) => response.json())
      .then((metrics) => {
        let agents = Object.keys(metrics);
        if (agents.length) {
          html = `
          <table class="table">
            <thead>
                <tr>
                  <th scope="col">Skill Name</th>
                  <th scope="col"># Calls</th>
                </tr>
              </thead>`;
          agents.forEach((agent) => {
            if (agent != 'app') {
              html += `
            <tr>
              <th colspan="2" style="background-color:#f0f0f0;"></th>
            </tr>
            <tr>
              <th colspan="2" style="color:#4da6e7;">`+ agent + `</th>
            </tr>
            <tbody>
            `;
              Object.keys(metrics[agent]).forEach((skill) => {
                html += `
              <tr>
                <td>`+ skill + `</td>
                <td>`+ metrics[agent][skill] + `</td>
              </tr>
            `;
              });
              html += `
            </tbody>
          `;
            }
          });
          html += `
          </table>
          `;
        }
        else
          html = "<h2>No usage, so far...</h2>";
        document.getElementById('dashboard').innerHTML = html;
      });
  }, 600);
};
