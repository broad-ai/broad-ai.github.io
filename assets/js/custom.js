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
    autoplayTimeout: 8200,
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
    fetch(broadAIapiEndpoint + "/community/subscribe", {
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
        if (resp.status == "aborted")
          document.getElementById('subscribed').innerHTML = "<h6 class='p-2' style='background-color:#ff654c;color:#fff;'>Oops! " + name + ",</h6> <p><small>" + resp.reason + "</small></p>";
        else
          document.getElementById('subscribed').innerHTML = "<h6 class='p-2' style='background-color:#00500d;color:#fff;'>Welcome to the community, " + name + "!</h6> <p><small>Let's stay in touch.</small></p>";
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
const getRandomMessage = () => {
  const waitMessages = [
    "Processing...",
    "Loading...",
    "Please wait...",
    "In progress...",
    "Working on it...",
    "Fetching data...",
    "One moment...",
    "Executing request...",
    "Hang tight...",
    "Updating...",
    "Retrieving information...",
    "Getting things ready...",
    "Hold tight...",
    "Setting things up...",
    "Just a sec...",
    "Running tasks...",
    "Preparing data...",
    "Analyzing...",
    "Communicating with server...",
    "Performing operation..."
  ];
  return waitMessages[Math.floor(Math.random() * waitMessages.length)];
}; // getRandomMessage

const clearChat = () => {
  sessionStorage.clear('conversation');
  document.getElementById('chat').innerHTML = "";
  document.getElementById('logs').innerHTML = "";
  document.getElementById('agents').innerHTML = "";
}; // clearChat

const goChatbot = () => {
  // -- pre results formatting
  document.getElementById('chat').innerHTML = "<div class='p-3'><img src='/assets/images/load-35_128.gif' style='width:60px; height:60px;'><pre class='text-primary'>" + getRandomMessage() + "</pre></p></div>";
  let intvlMsgs = setInterval(() => {
    document.getElementById('chat').innerHTML = "<div class='p-3'><img src='/assets/images/load-35_128.gif' style='width:60px; height:60px;'><pre class='text-primary'>" + getRandomMessage() + "</pre></p></div>";
  }, 10000);
  document.getElementById('btnAsk').disabled = true;
  document.getElementById('chatbox').disabled = true;

  // --- ask
  fetch(broadAIDemoapiEndpoint + '/go', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "question": document.getElementById('chatbox').value,
      "conversation": JSON.parse(sessionStorage.getItem('conversation')) || []
    })
  })
    .then((resp) => {
      let reader = resp.body.pipeThrough(new TextDecoderStream()).getReader();
      let payload = {};
      const readStream = (reader) => {
        reader.read().then((r) => {
          if (r.done) {
            // -- showing results
            let messages = "<div style='text-align:right;margin-bottom:1em;'><a href='javascript:clearChat();'>Clear</a></pre></div>"
            messages += "<h3 style='color:black;background:#eee;padding:1em;'>" + (payload.result.question || document.getElementById('chatbox').value) + "</h3>";
            if (payload.result.response) {
              payload.result.response.forEach((line) => {
                messages += "<" + line.html_tag + " style='text-align:left;color:#6a5acd;'>" + line.text + "</" + line.html_tag + ">";
              });
            }
            if (payload.result.conversation) {
              sessionStorage.setItem('conversation', JSON.stringify(payload.result.conversation));
              messages += "<hr class='mt-2'><pre class='text-danger'><strong>Conversation History:</strong></pre>";
              messages += "<ul class='mb-5'>";
              payload.result.conversation.forEach((talk) => {
                if (talk.indexOf('?:') >= 0)
                  messages += "<li><strong class='text-info'>" + talk.replaceAll('?:', '<br>Q:') + "</strong></li>";
                else if (talk.indexOf('>:') >= 0)
                  messages += "<li><span class='text-muted'>" + talk.replaceAll('>:', '=>') + "</span></li>";
                else
                  messages += "<li><span class='text-muted'>" + talk + "</span></li>";
              });
              messages += "</ul>";
            }
            document.getElementById('chat').innerHTML = messages;
            document.getElementById('chatbox').value = "";
            // -- post results formatting
            clearInterval(intvlMsgs);
            document.getElementById('btnAsk').disabled = false;
            document.getElementById('chatbox').disabled = false;
            document.getElementById('chatbox').value = "";
            return;
          }
          try {
            payload = JSON.parse(r.value)
          }
          catch {
            console.log(r.value);
          }
          let logs = `
          <table class='table mb-1'>
            <tbody>
              <tr>
                <td><strong>Status:</strong> <span class='text-danger'>`+ payload.status + `</span></td>
              </tr>
            </tbody>
          </table>`;
          if (payload.result.plan) {
            payload.result.plan.forEach((step) => {
              logs += `
            <table class='table mt-1'>
              <thead>
                <tr>
                <th>`+ (step.sequence + 1) + `.  <span class='text-info'>` + step.objective + `</span></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class='py-0'><span class='text-muted'>Agent &rarr; Skill</span>&emsp;|&emsp;<span class='text-success'>`+ step.agent + ` </span> &rarr; <span class='text-success'>` + step.skill.name + `</span></td>
                </tr>
                <tr>
                  <td class='text-muted'>`+ (step.result ? (typeof step.result == 'object' ? JSON.stringify(step.result) : step.result) : '...') + `</td>
                </tr>
              </tbody>
            </table>
              `;
            });
          }
          else if (payload.result.agents) {
            let agents = `
            <div class='col-12 col-sm-6 col-md-4 col-lg-3'>
              <h3 style='margin-top:auto;margin-bottom:auto;'>
                Available Agents:
              </h3>
            </div>
              `;
            payload.result.agents.forEach((agent) => {
              agents += `
          <div class='col-12 col-sm-6 col-md-4 col-lg-3'>
            <table class='table mt-1'>
              <thead>
                <tr>
                <th><strong>Agent:</strong> <span class='text-info'>` + agent.agent + `</span></th>
                </tr>
                <tr>
                <td>` + agent.capability + `</span></td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class='text-muted'>
                    <ol>`;
              agent.skills.forEach((skill) => {
                agents += `
                <li class='mb-1'><strong>`+ skill.skill + `</strong>: <span class='text-meta'>` + skill.objective + `</span></li>
                `;
              });
              agents += `
                      </ol>
                    </td>
                </tr>
              </tbody>
            </table>
          </div>
              `;
            });
            document.getElementById('agents').innerHTML = agents;
          }
          else {
            logs += `
            <table class='table mt-1'>
              <tbody>
                <tr>
                  <td class='text-muted'><pre>`+ JSON.stringify(payload.result, null, 2) + `</pre></td>
                </tr>
              </tbody>
            </table>
              `;
          }
          document.getElementById('logs').innerHTML = logs;
          readStream(reader);
        });
      }; // readStream
      readStream(reader);
    });
}; // goChatbot

// ------ ..... ------ ..... ------ ..... ------ 
const goConcierge = () => {
  // -- pre results formatting
  document.getElementById('chat').innerHTML = "<div class='p-3'><img src='/assets/images/load-35_128.gif' style='width:60px; height:60px;'><pre class='text-primary'>" + getRandomMessage() + "</pre></p></div>";
  let intvlMsgs = setInterval(() => {
    document.getElementById('chat').innerHTML = "<div class='p-3'><img src='/assets/images/load-35_128.gif' style='width:60px; height:60px;'><pre class='text-primary'>" + getRandomMessage() + "</pre></p></div>";
  }, 10000);
  document.getElementById('btnGoConcierge').disabled = true;

  // -- formulate question
  let origin = document.getElementById('origin').value;
  let destination = document.getElementById('destination').value;
  let notes = document.getElementById('notes').value;
  let question = `Help me plan a trip from ` + origin + ` to ` + destination + `. I need a complete itinerary. `;
  if (notes)
    question += `Take following preferences into consideration:
- `+ notes + `
- Trip must begin next week and number of days will depend on things to do.
- Avoid rain, long wait times, delays.
- Airlines is preferred over driving and driving is preferred over trains.
- Prefer start journey before first day of the trip.
- Only focus on must-see attractions. Include Park and Museum operating hours.
  `;

  fetch(broadAIDemoapiEndpoint + '/go', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "question": question,
      "conversations": []
    })
  })
    .then((resp) => {
      let reader = resp.body.pipeThrough(new TextDecoderStream()).getReader();
      let payload = {};
      const readStream = (reader) => {
        reader.read().then((r) => {
          if (r.done) {
            // -- showing results
            let messages = "<div style='text-align:right;margin-bottom:1em;'><a href='javascript:clearChat();'>Clear</a></pre></div>"
            messages += "<h3 style='color:black;background:#eee;padding:1em;'>" + (payload.result.question || document.getElementById('chatbox').value) + "</h3>";
            if (payload.result.response) {
              payload.result.response.forEach((line) => {
                messages += "<" + line.html_tag + " style='text-align:left;color:#6a5acd;'>" + line.text + "</" + line.html_tag + ">";
              });
            }
            // if (payload.result.conversation) {
            //   sessionStorage.setItem('conversation', JSON.stringify(payload.result.conversation));
            //   messages += "<hr class='mt-2'><pre class='text-danger'><strong>Conversation History:</strong></pre>";
            //   messages += "<ul class='mb-5'>";
            //   payload.result.conversation.forEach((talk) => {
            //     if (talk.indexOf('?:') >= 0)
            //       messages += "<li><strong class='text-info'>" + talk.replaceAll('?:', '<br>Q:') + "</strong></li>";
            //     else if (talk.indexOf('>:') >= 0)
            //       messages += "<li><span class='text-muted'>" + talk.replaceAll('>:', '=>') + "</span></li>";
            //     else
            //       messages += "<li><span class='text-muted'>" + talk + "</span></li>";
            //   });
            //   messages += "</ul>";
            // }
            document.getElementById('chat').innerHTML = messages;
            // -- post results formatting
            clearInterval(intvlMsgs);
            document.getElementById('btnGoConcierge').disabled = true;
            return;
          }
          try {
            payload = JSON.parse(r.value)
          }
          catch {
            console.log(r.value);
          }
          let logs = `
          <table class='table mb-1'>
            <tbody>
              <tr>
                <td><strong>Status:</strong> <span class='text-danger'>`+ payload.status + `</span></td>
              </tr>
            </tbody>
          </table>`;
          if (payload.result.plan) {
            payload.result.plan.forEach((step) => {
              logs += `
            <table class='table mt-1'>
              <thead>
                <tr>
                <th>`+ (step.sequence + 1) + `.  <span class='text-info'>` + step.objective + `</span></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class='py-0'><span class='text-muted'>Agent &rarr; Skill</span>&emsp;|&emsp;<span class='text-success'>`+ step.agent + ` </span> &rarr; <span class='text-success'>` + step.skill.name + `</span></td>
                </tr>
                <tr>
                  <td class='text-muted'>`+ (step.result ? (typeof step.result == 'object' ? JSON.stringify(step.result) : step.result) : '...') + `</td>
                </tr>
              </tbody>
            </table>
              `;
            });
          }
          else if (payload.result.agents) {
            let agents = `
            <div class='col-12 col-sm-6 col-md-4 col-lg-3'>
              <h3 style='margin-top:auto;margin-bottom:auto;'>
                Available Agents:
              </h3>
            </div>
              `;
            payload.result.agents.forEach((agent) => {
              agents += `
          <div class='col-12 col-sm-6 col-md-4 col-lg-3'>
            <table class='table mt-1'>
              <thead>
                <tr>
                <th><strong>Agent:</strong> <span class='text-info'>` + agent.agent + `</span></th>
                </tr>
                <tr>
                <td>` + agent.capability + `</span></td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class='text-muted'>
                    <ol>`;
              agent.skills.forEach((skill) => {
                agents += `
                <li class='mb-1'><strong>`+ skill.skill + `</strong>: <span class='text-meta'>` + skill.objective + `</span></li>
                `;
              });
              agents += `
                      </ol>
                    </td>
                </tr>
              </tbody>
            </table>
          </div>
              `;
            });
            document.getElementById('agents').innerHTML = agents;
          }
          else {
            logs += `
            <table class='table mt-1'>
              <tbody>
                <tr>
                  <td class='text-muted'><pre>`+ JSON.stringify(payload.result, null, 2) + `</pre></td>
                </tr>
              </tbody>
            </table>
              `;
          }
          document.getElementById('logs').innerHTML = logs;
          readStream(reader);
        });
      }; // readStream
      readStream(reader);
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
    "rating": document.getElementById('pickRating').innerHTML,
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
      "notes": `## Specific Task
Using your own descretion, find movies similar to the one provided within >>> and <<< symbols. Extract fields as specified in response format requirements below.

>>> 
`+ JSON.stringify(currentMovie) + `
<<<

## Response Format
Respond using exact JSON structure shown below with references to the nodes and fields provided between /* and */ symbols. Make sure you pick exact values from the context including URLs:
~~~json
{
  "movies":[
    { "title": "/* :Movie.title */", "director": "/* :Director.name */", "year": /* :Movie.year */, "rating": /* :Movie.imdbRating */, "poster": "/* :Movie.poster */", "plot": "/* :Movie.plot */" },
     ... ]
}
~~~
`,
    })
  })
    .then((resp) => resp.json())
    .then((data) => {
      let recommendations = [];
      data.response.response.forEach((element) => {
        if (element.text.indexOf('[') >= 0 && element.text.indexOf(']') > 0) {
          let r = [];
          try {
            r = JSON.parse(element.text.substring(element.text.indexOf('['), element.text.lastIndexOf(']') + 1));
          }
          catch {
            r = [];
          }
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
          if (recommendation.title && recommendation.director && recommendation.year && recommendation.rating && recommendation.poster && recommendation.plot) {
            html += `
            <div class="col-12 col-md-6">
              <div class="row mt-5">
                <div class="col-12 text-center">
                  <button class="btn btn-success" type="button" onclick="writeSimilarStory('`+ encodeURIComponent(recommendation.title) + `', '` + encodeURIComponent(recommendation.director) + `', '` + encodeURIComponent(recommendation.year) + `', '` + encodeURIComponent(recommendation.rating) + `', '` + encodeURIComponent(recommendation.poster) + `', '` + encodeURIComponent(recommendation.plot) + `')">Create
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
                      <span>`+ recommendation.rating + `</span>
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
Suggest one movie from the 9125 choices and extract fields as specified in response format requirements below.

## Response Format
Respond using exact JSON structure shown below with references to the nodes and fields provided between /* and */ symbols. Make sure you pick exact values from the context including URLs:
~~~json
{ "title": "/* :Movie.title */", "director": "/* :Director.name */", "year": /* :Movie.year */, "rating": /* :Movie.imdbRating */, "poster": "/* :Movie.poster */", "plot": "/* :Movie.plot */" }
~~~
`,
    })
  })
    .then((resp) => resp.json())
    .then((data) => {
      document.getElementById('story').innerHTML = "<h3 style='color:#C39BD3;'>Enjoy!</h3><p style='color:#6C3483;'>Find similar movies or request a new story based on the theme of the picked movie.</p>";
      let details = {};
      data.response.response.forEach((element) => {
        if (element.text.indexOf('{') >= 0 && element.text.indexOf('}') > 0) {
          try {
            details = JSON.parse(element.text.substring(element.text.indexOf('{'), element.text.lastIndexOf('}') + 1));
          }
          catch {
            details = {
              "title": "...", "director": "...", "year": "...", "rating": "...", "poster": ['assets/images/popcorn-972047_1280.png', 'assets/images/ticket-33657_1280.png', 'assets/images/popcorn-898154_1280.png', 'assets/images/popcorn-576599_1280.png'][Math.floor(Math.random() * 4)], "plot": "..."
            };
          }
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
      document.getElementById('pickRating').innerHTML = details.rating;
      document.getElementById('pickYear').innerHTML = details.year;
    });
}; // pickRandomMovie

// ------ ..... ------ ..... ------ ..... ------ 
const writeSimilarStory = (title, director, year, rating, poster, plot) => {
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
  let _rating = rating ? decodeURIComponent(rating) : document.getElementById('pickRating').innerHTML;
  document.getElementById('pickRating').innerHTML = _rating;
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