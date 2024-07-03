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
    document.getElementById('dashboard').innerHTML = "<div>";
    Object.keys(metrics).forEach((agent) => {
     document.getElementById('dashboard').innerHTML += "<div style='border:1px;border-color:#C0C0C0;'>";
     document.getElementById('dashboard').innerHTML += "<h2>" + agent + "</h2>";
     Object.keys(metrics[agent]).forEach((skill) => {
      document.getElementById('dashboard').innerHTML += "<div style='background-color:#DCDCDC;'>";
      document.getElementById('dashboard').innerHTML += "<span style='float:left;'>" + skill + "</span>";
      document.getElementById('dashboard').innerHTML += "<span style='float:right;font-weight:bold;'>" + metrics[agent][skill] + "</span>";
      document.getElementById('dashboard').innerHTML += "</div>";
     });
     document.getElementById('dashboard').innerHTML += "</div>";
    });
    document.getElementById('dashboard').innerHTML += "</div>";
   });
 }, 600);
};
