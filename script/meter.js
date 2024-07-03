const broadAIapiEndpoint = "http://localhost:8080";
// const broadAIapiEndpoint = "https://broadai-7yg2a2s6sq-uc.a.run.app";

const fetchUsage = () => {
 const searchParams = new URLSearchParams(window.location.search);
 let appid = searchParams.get('appid');
 let html = "...";
 setTimeout(() => {
  document.getElementById('dashboard').innerHTML = html;
  fetch(broadAIapiEndpoint + '/app/metering/' + appid, {
   method: 'GET',
   headers: {
    'Content-Type': 'application/json',
   }
  }).then((response) => response.json())
   .then((metrics) => {
    html = JSON.stringify(metrics, null, 4);

    document.getElementById('dashboard').innerHTML = html;
   });
 }, 600);
};
