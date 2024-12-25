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
            console.log(r);
            payload = { status: "Please wait...", result: null };
          }
          if (payload.result) {
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
          }
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

  fetch(broadAIDemoapiEndpoint + '/plan', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "origin": origin,
      "destination": destination,
      "notes": notes
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
            if (payload.result.response) {
              payload.result.response.forEach((line) => {
                messages += "<" + line.html_tag + " style='text-align:left;color:#6a5acd;'>" + line.text + "</" + line.html_tag + ">";
              });
            }
            document.getElementById('chat').innerHTML = messages;
            // -- post results formatting
            clearInterval(intvlMsgs);
            document.getElementById('btnGoConcierge').disabled = false;
            document.getElementById('origin').value = "";
            document.getElementById('destination').value = "";
            document.getElementById('notes').value = "";
            return;
          }
          try {
            payload = JSON.parse(r.value)
          }
          catch {
            payload = { status: "Please wait...", result: null };
          }
          if (payload.result) {
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
          }
          readStream(reader);
        });
      }; // readStream
      readStream(reader);
    });
}; // goConcierge

// ------ ..... ------ ..... ------ ..... ------ 
const goMovies = () => {
  // -- pre results formatting
  document.getElementById('chat').innerHTML = "<div class='p-3'><img src='/assets/images/load-35_128.gif' style='width:60px; height:60px;'><pre class='text-primary'>" + getRandomMessage() + "</pre></p></div>";
  let intvlMsgs = setInterval(() => {
    document.getElementById('chat').innerHTML = "<div class='p-3'><img src='/assets/images/load-35_128.gif' style='width:60px; height:60px;'><pre class='text-primary'>" + getRandomMessage() + "</pre></p></div>";
  }, 10000);

  fetch(broadAIDemoapiEndpoint + '/recommend', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then((resp) => {
      let reader = resp.body.pipeThrough(new TextDecoderStream()).getReader();
      let payload = {};
      const readStream = (reader) => {
        reader.read().then((r) => {
          if (r.done) {
            let movies = [];

            // -- showing results
            let messages = "<div style='text-align:right;margin-bottom:1em;'><a href='javascript:clearChat();'>Clear</a></pre></div>"
            if (payload.result.response) {
              payload.result.response.forEach((line) => {
                // -- extracting JSON response from results
                if (line.text.indexOf('{') >= 0 && line.text.lastIndexOf('}') > 0) {
                  let jsnResp = line.text.substring(line.text.indexOf('{'), line.text.lastIndexOf('}') + 1);
                  jsnResp = jsnResp.replaceAll(new RegExp('/\\*[\\s\\S]*?\\*/', 'gm'), '');
                  try {
                    jsnResp = JSON.parse(jsnResp);
                  }
                  catch {
                    jsnResp = { movies: [] };
                  }
                  jsnResp.movies.forEach((movie) => movies.push(movie));
                }
                else
                  messages += "<" + line.html_tag + " style='text-align:left;color:#6a5acd;'>" + line.text + "</" + line.html_tag + ">";
              });
              messages = "<pre>" + JSON.stringify(jsnResp, null, 2) + "</pre>";
            }
            document.getElementById('chat').innerHTML = messages;
            // -- post results formatting
            clearInterval(intvlMsgs);
            return;
          }
          try {
            payload = JSON.parse(r.value)
          }
          catch {
            payload = { status: "Please wait...", result: null };
          }
          if (payload.result) {
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
          }
          readStream(reader);
        });
      }; // readStream
      readStream(reader);
    });
}; // goMovies


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