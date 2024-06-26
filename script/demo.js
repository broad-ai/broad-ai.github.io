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
  }).then((resp) => {
    console.log(resp.plan);
    console.log(resp.response);
    console.log(resp.history);
    // -- show logs
    document.getElementById('plan').innerHTML += "<hr style='border:1px dotted;color:#ddd;margin:0.6em;padding:0;'><h3>Plan steps & results:</h3>";
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
      sessionStorage.setItem('conversations', JSON.stringify(resp.history));
      message += "<hr style='border:1px dotted;color:#ddd;margin:0.6em;padding:0;'>";
      message += "<h4>Conversation History: </h4>";
      resp.history.forEach((c, i) => {
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
    "I am in NYC downtown today and it's dinner time. Recommend something for me that is a popular place and should not be missed.",
    "Which is the best day weatherwise to travel to New York? I dont like rain and also very high temperatures.",
    "I am planning a trip from Los Angeles to New York next week. Can you find the best flights for me and also give me the weather forecast for New York for the next 5 days?",
    "I need to know the current time and weather conditions in Tokyo, Japan. Can you help me with this?",
    "Can you provide a detailed company profile and the latest income statement for Apple Inc.?",
    "I'm visiting Paris for a week. Can you suggest some good cafes nearby the Eiffel Tower and also give me the weather forecast for the week?",
    "I have a flight from Chicago to Miami. Can you find my flight details for United 5532 and also give me the current weather in Miami?",
    "I am conducting research on Tesla Inc. Can you find the company's balance sheet and cash flow statement for the last year?",
    "I need to find a tailor shop within 10 miles of Times Square in New York City. Can you help me find one and also check if it is currently open?",
    "Can you extract the list of all the shareholders from the latest annual report of Microsoft Inc.?",
    "What is the current weather in London, and can you also tell me the local time there?",
    "I am researching the latest trends in AI technology. Can you find some relevant articles and summarize their key points for me?",
    "Can you find the historical stock prices for Google over the past month and also give me the company's current market capitalization?",
    "I'm planning to visit San Francisco. Can you recommend some popular diners around the Golden Gate Bridge and provide the current weather forecast?",
    "Can you provide the income statement and balance sheet for Amazon Inc. for the past fiscal year?",
    "I need to know the flight details for Delta 1234 from Atlanta to New York and the weather forecast in New York for the day.",
    "Can you research the latest news on renewable energy and summarize the key points?",
    "I need a list of coffee shops within 5 miles of Central Park in New York City. Can you help me find them and also provide the weather forecast for the day?",
    "What are the current weather conditions in Sydney, Australia, and the local time there?",
    "Can you find some good places to eat around the Louvre Museum in Paris and provide the current weather in Paris?",
    "I am conducting a market analysis on Facebook Inc. Can you provide the company's cash flow statement and historical stock prices for the last year?",
    "Can you find the details of all flights between JFK Airport and LAX Airport and give me the current weather forecast for Los Angeles?",
    "I need to find a bookstore within 10 miles of the Statue of Liberty in New York City. Can you help me locate one and check if it is currently open?",
    "What is the weather forecast for Miami for the next week, and what are the best days to visit considering I don't like rain?",
    "Can you extract the list of all board members from the latest annual report of Tesla Inc.?",
    "I am researching cloud computing trends. Can you find some relevant articles and summarize their key points?",
    "What is the current weather in Berlin, Germany, and the local time there?",
    "Can you find a list of Italian restaurants within 10 miles of the Empire State Building in New York City and provide the current weather forecast?",
    "I need the latest income statement and balance sheet for IBM. Can you provide them?",
    "Can you find the details for flight AA101 from Dallas to Chicago and the current weather in Chicago?",
    "I need to research the latest trends in blockchain technology. Can you find some relevant articles and summarize their key points for me?",
    "Can you provide the cash flow statement and income statement for Microsoft Inc. for the last fiscal year?",
    "What is the current weather in Toronto, Canada, and the local time there?",
    "Can you find some popular seafood restaurants around Fisherman's Wharf in San Francisco and provide the current weather forecast?",
    "I need to know the flight details for Southwest 5678 from Las Vegas to Denver and the weather forecast in Denver for the day.",
    "Can you find the historical stock prices for Netflix over the past three months and provide the company's current market capitalization?",
    "What is the weather forecast for Seattle for the next week, and what are the best days to visit considering I don't like very high temperatures?",
    "Can you extract the list of all major projects from the latest annual report of Google Inc.?",
    "I am researching the latest advancements in AI. Can you find some relevant articles and summarize their key points?",
    "What is the current weather in Madrid, Spain, and the local time there?",
    "Can you find some good places to eat around Buckingham Palace in London and provide the current weather in London?",
    "I need to find a pharmacy within 10 miles of the White House in Washington, D.C. Can you help me locate one and check if it is currently open?"
  ];
  document.getElementById('notes').value = randomQuestions[(Math.floor(Math.random() * randomQuestions.length))];
}; // randomQ()

