const broadAIapiEndpoint = "https://broadaidemo-7yg2a2s6sq-uc.a.run.app";

const subscribe = () => {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const emailRegex = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  if (emailRegex.test(email)) {
    document.getElementById('btnsave').hidden = true;
    document.getElementById('emailvalidation').innerHTML = "";
    fetch(broadAIapiEndpoint + "/connect", {
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
        document.getElementById('btnsave').hidden = false;
        if (resp.error)
          alert("Oops! something went wrong. Can you please try again?");
        else
          document.getElementById('lead').innerHTML = "<h2 style='text-align:center;'>Welcome to the community, " + name + "!</h2> <p style='text-align:center;font-size:1.25em;'>Let's stay in touch.</p>";
      });
  }
  else {
    document.getElementById('emailvalidation').innerHTML = "Please enter a valid email";
  }
}; // subscribe