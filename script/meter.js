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
        let agents = Object.keys(metrics);
        if (agents.length) {
          html = ``;
          agents.forEach((agent) => {
            html += `
          <table>
          `;
            html += `
            <tr>
              <th colspan="2">`+ agent + `</th>
            </tr>
            `;
            Object.keys(metrics[agent]).forEach((skill) => {
              html += `
            <tr>
              <td style="min-width:90%;">`+ skill + `</td>
              <td  style="max-width:10%;">`+ metrics[agent][skill] + `</td>
            </tr>
            `;
            });
            html += `
          </table>
          `;
          });
        }
        else
          html = "<h2>No usage, so far...</h2> <p>Please refer to the <a href='/docu-mas.html'>documentation</a> to learn how to use BroadAI to build next-gen AI applications, or feel free to <img src='./assets/images/icon-rocket.png' style='height:1.5em; padding: 0; margin: 0'><a href='mailto:broad.agents.ai@gmail.com?subject=Re%20using%20my%20BroadAI%20App%20ID'reach out to us</a>reach out to us.</p>";
        document.getElementById('dashboard').innerHTML = html;
      });
  }, 600);
};
