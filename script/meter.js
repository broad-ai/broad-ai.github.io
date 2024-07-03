const broadAIapiEndpoint = "https://broadai-7yg2a2s6sq-uc.a.run.app";

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
   console.log(resp.data);
  });

};