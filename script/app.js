const broadAIapiEndpoint = "https://broadai-7yg2a2s6sq-uc.a.run.app";

const registerApp = () => {
  let appname = document.getElementById('appname').value;

  let ownername = document.getElementById('ownername').value;

  let owneremail = document.getElementById('owneremail').value;
  const emailRegex = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

  let purpose = document.getElementById('purpose').value;

  // // ...
  if (emailRegex.test(owneremail)) {
    document.getElementById('appname').disabled = true;
    document.getElementById('ownername').disabled = true;
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
          "name": ownername,
          "email": owneremail
        },
        "purpose": purpose,
      })
    }).then((response) => response.json())
      .then((resp) => {
        if (resp.status == "registered") {
          document.getElementById('appname').disabled = false;
          document.getElementById('ownername').disabled = false;
          document.getElementById('owneremail').disabled = false;
          document.getElementById('purpose').disabled = false;
          document.getElementById('btnregister').hidden = false;

          document.getElementById('message').innerHTML = "<p style='color:#006400;'>" + resp.status + "</p>";
          document.getElementById('message').innerHTML += "<p><strong style='color:#2e7bcf;'> App ID:</strong></p>";
          document.getElementById('message').innerHTML += "<code style='font-size:3em;'>" + resp.appid + "</code>";

          document.getElementById('message').innerHTML += "<p style='color:#006400;'>" + resp.reason + "</p>";
        }
        else {
          document.getElementById('appname').disabled = false;
          document.getElementById('ownername').disabled = false;
          document.getElementById('owneremail').disabled = false;
          document.getElementById('purpose').disabled = false;
          document.getElementById('btnregister').hidden = false;

          document.getElementById('message').innerHTML = "<p style='color:red;'>" + resp.status + "</p>";
          document.getElementById('message').innerHTML += "<p><strong style='color:#696969;'> App ID:</strong></p>";
          document.getElementById('message').innerHTML += "<code style='font-size:3em;color:#C0C0C0;'>(not generated)</code>";

          document.getElementById('message').innerHTML += "<p style='color:red;'>" + resp.reason + "</p>";
        }
      });
  }
  else {
    document.getElementById('emailvalidation').innerHTML = "Please enter a valid email";
  }
};