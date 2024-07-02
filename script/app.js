const broadAIapiEndpoint = "https://broadaidemo-7yg2a2s6sq-uc.a.run.app";

const registerApp = () => {
  let appname = document.getElementById('appname').value;
  document.getElementById('appname').disabled = true;

  let ownername = document.getElementById('ownername').value;
  document.getElementById('ownername').disabled = true;

  let owneremail = document.getElementById('owneremail').value;
  document.getElementById('owneremail').disabled = true;

  let purpose = document.getElementById('purpose').value;
  document.getElementById('purpose').disabled = true;

  document.getElementById('btnregister').hidden = true;
  // // ...

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
        document.getElementById('message').innerHTML += "<p>" + resp.notification + "</p>";
      }
      else {
        document.getElementById('appname').disabled = false;
        document.getElementById('ownername').disabled = false;
        document.getElementById('owneremail').disabled = false;
        document.getElementById('purpose').disabled = false;
        document.getElementById('btnregister').hidden = false;

        document.getElementById('message').innerHTML = "<p style='color:red;'>" + resp.reason + "</p>";
      }
    });

};