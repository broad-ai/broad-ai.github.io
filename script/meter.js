const broadAIapiEndpoint = "https://broadai-7yg2a2s6sq-uc.a.run.app";

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
        Object.keys(metrics).forEach((agent) => {
          html = "<h2>" + agent + "</h2>";
          html += "<code>" + JSON.stringify(metrics[agent], null, 4) + "</code>";
          html += "<p></p>";
        });
        document.getElementById('dashboard').innerHTML = html;
      });
  }, 600);
};
