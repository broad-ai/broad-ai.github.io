const subscribe = () => {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  fetch("https://aidapter-7yg2a2s6sq-uc.a.run.app/subscribe?app_name=BroadAI&aiprovider=GoogleAI&subscriber_name=" + encodeURI(name) + "&subscriber_email=" + encodeURI(email), {
    "method": "GET",
    "headers": {
      "Content-Type": "application/json"
    }
  }).then((resp) => {
    if (resp.error)
      alert(name + " | " + email + ", there was a problem with your request.\nCan you please try again?");
    else
      document.getElementById('lead').innerHTML = resp.message;
  });

}; // subscribe