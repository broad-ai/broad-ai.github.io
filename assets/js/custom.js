
/************************************** */

const broadAIDemoapiEndpoint = "https://broadaidemo-7yg2a2s6sq-uc.a.run.app";
const broadAIapiEndpoint = "https://broadai-7yg2a2s6sq-uc.a.run.app";

/************************************** */

// ------ ..... ------ ..... ------ ..... ------ 
  // HANDLE AUTH CODE for OAUTH2 HANDSHAKE
// ------ ..... ------ ..... ------ ..... ------ 
  
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const codeParam = urlParams.get('code');
if (codeParam) {
  // If the 'code' parameter exists, attempt to copy its value to the clipboard.
  let copySuccessful = false;
  try {
    // Use the modern, asynchronous Clipboard API.
    // This method is more reliable and secure than document.execCommand.
    await navigator.clipboard.writeText(codeParam);
    copySuccessful = true;
  } catch (err) {
      console.error('Failed to copy text to clipboard:', err);
  }
  
  // Display a status message to the user.
  if (copySuccessful) {
      alert('Code copied to clipboard! You may close this window.');
      // Attempt to close the window after a short delay to give the user time to read the message.
      // Note: Most modern browsers will only allow a script to close a window that it opened.
      setTimeout(() => {
          window.close();
      }, 2000);
  } else {
      alert('Failed to copy code to clipboard. Please copy manually:\n' + codeParam);
  }
}


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
}; // registerApp

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
}; // fetchUsage


// ------ ..... ------ ..... ------ ..... ------ 
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






