const subscribe = () => {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  document.getElementById('btnsave').hidden = true;
  fetch("https://aidapter-7yg2a2s6sq-uc.a.run.app/subscribe?app_name=BroadAI&subscriber_name=" + encodeURI(name) + "&subscriber_email=" + encodeURI(email), {
    "method": "GET",
    "headers": {
      "Content-Type": "application/json"
    }
  }).then((resp) => {
    document.getElementById('btnsave').hidden = false;
    if (resp.error)
      alert("Oops! something went wrong. Can you please try again?");
    else
      document.getElementById('lead').innerHTML = "<h2 style='text-align:center;margin-top:auto;margin-bottom:auto;'>Welcome to the community! We will stay in touch.<h2>";
  });

}; // subscribe