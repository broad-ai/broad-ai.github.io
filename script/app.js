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
    "ownername": ownername,
    "owneremail": owneremail
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
    document.getElementById('message').innerHTML += "<code>" + resp.appid + "</code>";

    fetch(broadAIapiEndpoint + "/app/notify", {
     "method": "POST",
     "headers": {
      "Content-Type": "application/json"
     },
     "body": JSON.stringify({
      "name": ownername,
      "email": owneremail,
     })
    }).then((response) => response.json())
     .then((resp) => {
      if (resp.error)
       document.getElementById('message').innerHTML += "<hr style='margin-top:50px;'><p style='color:red;'>We could not send this App ID via email. Please copy and save it right now!</p>";
      else
       document.getElementById('message').innerHTML += "<hr style='margin-top:50px;'><p>App ID has been sent via email.</p>";
     });
   }
   else {
    document.getElementById('appname').disabled = false;
    document.getElementById('ownername').disabled = false;
    document.getElementById('owneremail').disabled = false;
    document.getElementById('purpose').disabled = false;
    document.getElementById('btnregister').hidden = false;

    document.getElementById('message').innerHTML = resp.reason;
   }
  });

};