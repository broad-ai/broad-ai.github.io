const broadAIapiEndpoint = "https://broadaidemo-7yg2a2s6sq-uc.a.run.app";

// ------ ..... ------ ..... ------ ..... ------ 
const go = () => {
  let notes = document.getElementById('notes').value; // Get the value from the textbox
  document.getElementById('plan').innerHTML = "";
  document.getElementById('notes').disabled = true;
  document.getElementById('btngo').hidden = true;
  // // ...

  document.getElementById('plan').innerHTML = "<pre style='border:0;margin:0;padding:0;text-wrap:wrap;'>...</pre>";
  document.getElementById('message').innerHTML = "<pre style='border:0;margin:0;padding:0;text-wrap:wrap;'>...</pre>";

  fetch(broadAIapiEndpoint + '/go', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "notes": notes,
      "conversations": JSON.parse(sessionStorage.getItem('conversations')) || []
    })
  }).then((response) => response.json())
    .then((resp) => {
      // -- show logs
      document.getElementById('plan').innerHTML = "<hr style='border:1px dotted;color:#ddd;margin:0.6em;padding:0;'><h3>Plan steps & results:</h3>";
      document.getElementById('plan').innerHTML += "<ol>";
      resp.plan.plan.forEach((step) => {
        document.getElementById('plan').innerHTML += "<li>" + step.objective + "</li>";
        document.getElementById('plan').innerHTML += "<p>Agent: <span style='font-family:monospace;font-size:0.9em;color:#2e7bcf;'>" + step.agent + "</span> <br> Skill: <span style='font-family:monospace;font-size:0.9em;color:#2e7bcf;'>" + step.skill.name + "</span></p>";
        document.getElementById('plan').innerHTML += "<pre>" + JSON.stringify(step.result) + "</pre>";
      });
      document.getElementById('plan').innerHTML += "</ol>";
      document.getElementById('plan').innerHTML += "</div>";
      // -- show results
      let message = "<div>";
      resp.response.response.forEach((elem) => {
        message += "<" + elem.html_tag + ">" + elem.text + "</" + elem.html_tag + ">";
      });
      message += "</div>";
      // -- show conversation history
      if (document.getElementById('history').checked) {
        sessionStorage.setItem('conversations', JSON.stringify(resp.response.conversation) || '[]');
        message += "<hr style='border:1px dotted;color:#ddd;margin:0.6em;padding:0;'>";
        message += "<h4>Conversation History: </h4>";
        JSON.parse(sessionStorage.getItem('conversations')).forEach((c, i) => {
          message += "<pre style='border:0;margin:0;padding:0;text-wrap:wrap;'>" + c + "</pre>";
          if (i % 2 != 0)
            message += "<pre style='border:0;margin:0;padding:0;text-wrap:wrap;'></pre>";
        });
      }
      // -- reset form
      document.getElementById('message').innerHTML = message;
      document.getElementById('notes').disabled = false;
      document.getElementById('btngo').hidden = false;
    });
}; // go

// ------ ..... ------ ..... ------ ..... ------ 
const randomQ = () => {
  const randomQuestions = [
    // Weatherman + NewsReporter
    "I'm writing a newsletter for our community. Can you provide the weather forecast for the next week and a brief summary of the latest local news?",
    "Can you give me the current weather in San Francisco and the latest tech news?",
    "I'm organizing a seminar in Boston. Can you check the weather forecast and provide the latest news from Massachusetts?",
    "I'm planning a holiday in Hawaii. Can you check the weather forecast and provide the latest news from the islands?",
    "Can you provide the latest news headlines from France and the weather forecast for Paris?",

    // Weatherman + FinancialAnalyst
    "I need to keep an eye on the performance of Tesla Inc. Can you provide the latest financial analysis and the current weather in Palo Alto?",
    "Can you give me the financial performance of Amazon and the current weather in Seattle?",
    "I need a report on Google's financial performance and the current weather in Mountain View.",

    // Weatherman + Researcher
    "I'm planning a trip to New York. Can you check the weather forecast and find information on the best places to visit?",
    "I have a meeting in Los Angeles next week. Can you check the weather forecast and find any recent developments about the company I'm meeting?",

    // NewsReporter + FinancialAnalyst
    "Can you provide the latest financial analysis of Microsoft and the current news headlines about the company?",
    "I need to know the financial performance of Apple and the latest news headlines in the tech industry.",

    // NewsReporter + Researcher
    "Can you give me the latest news headlines from Japan and some background information on the top stories?",
    "I need the top news headlines from the tech industry and detailed information on recent major developments.",
    "Can you provide the latest news headlines from Germany and find any significant economic reports?",

    // FinancialAnalyst + Researcher
    "I need a detailed report on Tesla's financial performance and any recent research on their market strategy.",
    "Can you give me the financial performance of Meta and any recent research reports about their new initiatives?",

    // Weatherman only
    "Can you check the weather forecast for my trip to New York next week?",
    "I'm planning a road trip to Los Angeles. Can you provide the weather forecast for the next week?",
    "What's the weather forecast for this weekend in Chicago?",

    // NewsReporter only
    "Can you provide the latest news headlines from Japan?",
    "Can you give me the top news headlines from the tech industry?",
    "What's the latest news from the financial markets today?",

    // Researcher only
    "Can you find detailed information about the recent product launch by Google?",
    "I need a comprehensive report on the latest trends in renewable energy.",

    // Aviator + Weatherman
    "I need to fly from New York to London next week for a business meeting. Can you help me find a suitable flight and check the weather forecast for both cities?",
    "I'm planning a vacation to Tokyo next month. Can you check the current weather forecast and some tips on the best time to book my flight?"
  ];
  document.getElementById('notes').value = randomQuestions[(Math.floor(Math.random() * randomQuestions.length))];
}; // randomQ()

