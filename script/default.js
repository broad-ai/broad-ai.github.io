const subscribe = () => {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  document.getElementById('btnsave').disabled = true;
  fetch("https://aidapter-7yg2a2s6sq-uc.a.run.app/subscribe?app_name=BroadAI&subscriber_name=" + encodeURI(name) + "&subscriber_email=" + encodeURI(email), {
    "method": "GET",
    "headers": {
      "Content-Type": "application/json"
    }
  }).then((resp) => {
    if (resp.error) {
      document.getElementById('btnsave').disabled = false;
      alert(name + " | " + email + ", there was a problem with your request.\nCan you please try again?");
    }
    else {
      let intvl = setInterval(() => {
        if (resp.message) {
          if (resp.message.ai_response) {
            document.getElementById('lead').innerHTML = resp.message.ai_response;
            clearInterval(intvl);
          }
          else
            document.getElementById('lead').innerHTML = "Almost done!";
        }
        else
          document.getElementById('lead').innerHTML = "Almost done!";
      }, 600);
    }
  });

}; // subscribe