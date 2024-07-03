const broadAIapiEndpoint = "http://localhost:8080";
// const broadAIapiEndpoint = "https://broadai-7yg2a2s6sq-uc.a.run.app";

const getDetails = () => {
 const searchParams = new URLSearchParams(window.location.search);

 let appid = searchParams.get('appid');
 fetch(broadAIapiEndpoint + '/app/metering/' + appid, {
  method: "GET",
  headers: {
   "Content-Type": "application/json",
  }
 }).then((response) => response.json())
  .then((resp) => {
   let usage = `<div class="container">`;
   let metrics = resp.data;
   console.log(metrics);
   Object.keys(metrics).forEach((agent) => {
    console.log(agent, metrics[agent]);
    usage += `<div class="card">`;
    usage += `<h2>` + agent + `</h2>`;
    Object.keys(metrics[agent]).forEach((skill) => {
     console.log(skill, metrics[agent][skill]);
     usage += `<div class="sub-category">`;
     usage += `<span style="float:left;">` + skill + `</span>`;
     usage += `<span style="float:right;font-size:3em;font-weight:bold;">` + metrics[agent][skill] + `</span>`;
     usage += `</div>`;
    });
    usage += `</div>`;
   });
   usage += `</div>`;
  });
 console.log(usage);
 document.getElementById('usage').innerHTML = usage;
};
