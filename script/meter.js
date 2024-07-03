const broadAIapiEndpoint = "http://localhost:8080";
// const broadAIapiEndpoint = "https://broadai-7yg2a2s6sq-uc.a.run.app";

const fetchUsage = () => {
 const searchParams = new URLSearchParams(window.location.search);
 let appid = searchParams.get('appid');
 setTimeout(() => {
  document.getElementById('dashboard').innerHTML = "...";
  fetch(broadAIapiEndpoint + '/app/metering/' + appid, {
   method: 'GET',
   headers: {
    'Content-Type': 'application/json',
   }
  }).then((response) => response.json())
   .then((metrics) => {
    document.getElementById('dashboard').innerHTML = "";
    Object.keys(metrics).forEach((agent) => {
     document.getElementById('dashboard').innerHTML += "<h2>" + agent + "</h2>";
     document.getElementById('dashboard').innerHTML += "<ul>";
     Object.keys(metrics[agent]).forEach((skill) => {
      document.getElementById('dashboard').innerHTML += "<li>";
      document.getElementById('dashboard').innerHTML += skill + "&nbsp;";
      document.getElementById('dashboard').innerHTML += "&emsp;" + metrics[agent];
      document.getElementById('dashboard').innerHTML += "<li>";
     });
     document.getElementById('dashboard').innerHTML += "</ul>";
    });
   });
 }, 600);
};
