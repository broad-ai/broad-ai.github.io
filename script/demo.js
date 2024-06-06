const broadAIapiEndpoint = "https://broadaidemo-7yg2a2s6sq-uc.a.run.app";

// ------ ..... ------ ..... ------ ..... ------ 
const go = () => {
  let notes = document.getElementById('notes').value; // Get the value from the textbox
  document.getElementById('plan').innerHTML = "";
  document.getElementById('message').innerHTML = "<pre style='border:0;margin:0;padding:0;text-wrap:wrap;'>Working ...</pre>";
  document.getElementById('notes').disabled = true;
  document.getElementById('btngo').hidden = true;
  // ...

  document.getElementById('plan').innerHTML = "<hr style='border:1px dotted;color:#ddd;margin:0.6em;padding:0;'><pre style='border:0;margin:0;padding:0;text-wrap:wrap;'>Planning ...</pre>";

  let p = [];

  fetch(broadAIapiEndpoint + "/plan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "notes": notes
    })
  }).then((response) => response.json())
    .then((plan) => {

      document.getElementById('plan').innerHTML = "<hr style='border:1px dotted;color:#ddd;margin:0.6em;padding:0;'><pre style='border:0;margin:0;padding:0;text-wrap:wrap;'>Plan " + plan.status + ".</pre>";
      document.getElementById('plan').innerHTML += "<hr style='border:1px dotted;color:#ddd;margin:0.6em;padding:0;'><pre style='border:0;margin:0;padding:0;text-wrap:wrap;'>" + plan.reason + "</pre>";
      document.getElementById('plan').innerHTML += "<hr style='border:1px dotted;color:#ddd;margin:0.6em;padding:0;'><pre style='border:0;margin:0;padding:0;text-wrap:wrap;'>Executing " + plan.plan.length + " steps of the plan.</pre>";

      plan.plan.forEach((step) => {
        let s = {
          "step": step.objective,
          "action": step.skill ? step.skill.name : "none"
        };
        if (step.skill) {
          if (step.skill.parameters) {
            s.action += "(";
            let p = [];
            Object.keys(step.skill.parameters).forEach((param) => {
              p.push(param + ":" + step.skill.parameters[param]);
            });
            s.action += p.join(', ');
            s.action += ")";
          }
          else
            s.action += "()";
        }
        p.push(s);
      });

      fetch(broadAIapiEndpoint + "/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "plan": plan.plan
        })
      }).then((response) => response.json())
        .then((results) => {

          document.getElementById('plan').innerHTML += "<hr style='border:1px dotted;color:#ddd;margin:0.6em;padding:0;'><h4>Plan steps & results:</h4>";
          document.getElementById('plan').innerHTML += "<ol>";
          results.forEach((step, i) => {
            document.getElementById('plan').innerHTML += "<li>" + p[i].step + "::" + p[i].action + "</li>";
            document.getElementById('plan').innerHTML += "<pre>" + JSON.stringify(step.result) + "</pre>";
          });
          document.getElementById('plan').innerHTML += "</ol>";
          document.getElementById('plan').innerHTML += "</div>";

          document.getElementById('message').innerHTML = "<pre style='border:0;margin:0;padding:0;text-wrap:wrap;'>Almost done ...</pre>";

          fetch(broadAIapiEndpoint + "/response", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              "results": results,
              "notes": notes
            })
          }).then((response) => response.json())
            .then((resp) => {

              let message = "<div>";
              resp.response.forEach((elem) => {
                message += "<" + elem.html_tag + ">" + elem.text + "</" + elem.html_tag + ">";
              });
              message += "</div>"
              message += "<hr style='border:1px dotted;color:#ddd;margin:0.6em;padding:0;'><pre style='border:0;margin:0;padding:0;text-wrap:wrap;'>Response: " + resp.status + "</pre>";
              message += "<pre style='border:0;margin:0;padding:0;text-wrap:wrap;'>" + resp.reason + "</pre>";
              document.getElementById('message').innerHTML = message;

              document.getElementById('notes').disabled = false;
              document.getElementById('btngo').hidden = false;

            }).catch((err) => {
              document.getElementById('message').innerHTML = "<h4 style='color:red;'>Uh! Oh!! Something went wrong as I was responding to your question.</h4>";
              document.getElementById('plan').innerHTML = "<h4 style='color:red;'>ABORTED!</h4>";
              document.getElementById('notes').disabled = false;
              document.getElementById('btngo').hidden = false;
            });

        }).catch((err) => {
          document.getElementById('plan').innerHTML = "<h4 style='color:red;'>Uh! Oh!! Something went wrong as I was executing my plan to answer your question.</h4>";
          document.getElementById('notes').disabled = false;
          document.getElementById('btngo').hidden = false;
        });

    }).catch((err) => {
      document.getElementById('plan').innerHTML = "<h4 style='color:red;'>Uh! Oh!! Something went wrong as I was creating a plan to respond to your question.</h4>";
      document.getElementById('notes').disabled = false;
      document.getElementById('btngo').hidden = false;
    });

}; // go

// ...

//   fetch(broadAIapiEndpoint + "/ask", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       "notes": notes
//     })
//   }).then((response) => response.json())
//     .then((data) => {
//       document.getElementById('plan').innerHTML = "<hr style='border:0.5px dotted;'> <div>";
//       document.getElementById('plan').innerHTML += "<h4>Plan generated by BroadAI:</h4>";
//       document.getElementById('plan').innerHTML += "<ol>";
//       data.plan.forEach((step) => {
//         document.getElementById('plan').innerHTML += "<li>" + step.objective + "</li>";
//         document.getElementById('plan').innerHTML += "<pre>" + JSON.stringify(step.result) + "</pre>";
//       });
//       document.getElementById('plan').innerHTML += "</ol>";
//       document.getElementById('plan').innerHTML += "</div>";

//       let message = "<div>";
//       data.response.forEach((elem) => {
//         message += "<" + elem.html_tag + ">" + elem.text + "</" + elem.html_tag + ">";
//       });
//       message += "</div>"
//       document.getElementById('message').innerHTML = message;

//       document.getElementById('notes').disabled = false;
//       document.getElementById('btngo').hidden = false;
//     });
// }; // go


// ------ ..... ------ ..... ------ ..... ------ 
const randomQ = () => {
  const randomQuestions = [
    // Time in a particular major world city
    "I have a business meeting scheduled in Tokyo tomorrow. Can you tell me what time it will be there?",
    "I'm planning a trip to London next week. What time is it currently in London?",
    "I have a friend traveling to Sydney. Could you let me know the current time there for me to coordinate with them?",

    // Current weather conditions in a major US city
    "I'm flying to Los Angeles tomorrow. Can you provide me with the current weather forecast for Los Angeles?",
    "I'm thinking about going for a run in Central Park later today. What's the weather like in New York City right now?",
    "I have a business trip to Chicago next week. Could you tell me what the weather will be like during my stay?",

    // News headlines in general, business, and technology categories for any large country
    "I need to stay updated on current events. Can you give me the latest general news headlines for the United States?",
    "I'm interested in investing in the stock market. What are the top business news headlines in the UK today?",
    "I work in the tech industry and want to know the latest developments. Could you provide me with the technology news headlines in India?",

    // Company profile such as its business, HQ, board members, etc.
    "I'm considering applying for a job at Microsoft. Can you give me an overview of the company's profile and its business areas?",
    "I'm researching Tesla for a project. Could you provide me with details about its headquarters location and key executives?",
    "I'm curious about Apple Inc.'s board of directors. Can you list the current members and their backgrounds?",

    // Company's stock price and details from financial statements such as profit/loss/income, equity, cash-flow, etc.
    "I'm an investor and want to track Google's performance. What is Google's current stock price?",
    "I'm analyzing potential investments. Can you provide me with Apple Inc.'s latest financial statements, including profit, loss, and cash flow?",
    "I'm considering purchasing shares of Amazon. Could you give me an overview of its equity and financial health?",

    // Lookup EV charging stations in a major US city
    "I recently got an electric car and need to charge it during my trip to San Francisco. Can you help me find EV charging stations in the city?",
    "I'm planning a road trip with my electric vehicle. Could you provide me with a list of EV charging stations in Los Angeles?",
    "I'm attending a conference in Austin and need to charge my electric vehicle. Where can I find EV charging stations near the convention center?",

    // Arrivals and departures from a major airport
    "I'm picking up a friend from JFK Airport tomorrow. Can you provide me with the arrivals schedule for tomorrow morning?",
    "I have a flight to catch from Heathrow Airport. Can you give me the departure schedule for my flight?",
    "I'm expecting a package through air freight. Can you help me track its arrival at O'Hare International Airport?"
  ];
  document.getElementById('notes').value = randomQuestions[(Math.floor(Math.random() * randomQuestions.length))];
}; // randomQ()

