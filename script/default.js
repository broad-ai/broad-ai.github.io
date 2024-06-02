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
    console.log(resp);
  });

}; // subscribe