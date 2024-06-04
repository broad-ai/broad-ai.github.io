const broadAIapiEndpoint = "https://broadaidemo-7yg2a2s6sq-uc.a.run.app";

// ------ ..... ------ ..... ------ ..... ------ 
const go = () => {
  let notes = document.getElementById('notes').value; // Get the value from the textbox
  document.getElementById('plan').innerHTML = "";
  document.getElementById('message').innerHTML = "Working ...";
  document.getElementById('notes').disabled = true;
  document.getElementById('btngo').hidden = true;
  // ...
  fetch(broadAIapiEndpoint + "/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "notes": notes
    })
  }).then((response) => response.json())
    .then((data) => {
      document.getElementById('plan').innerHTML = "<hr style='border:0.5px dotted;'> <div>";
      document.getElementById('plan').innerHTML += "<h4>Plan generated by BroadAI:</h4>";
      document.getElementById('plan').innerHTML += "<ol>";
      data.plan.forEach((step) => {
        document.getElementById('plan').innerHTML += "<li>" + step.objective + "</li>";
        document.getElementById('plan').innerHTML += "<pre>" + JSON.stringify(step.result) + "</pre>";
      });
      document.getElementById('plan').innerHTML += "</ol>";
      document.getElementById('plan').innerHTML += "</div>";

      let message = "<div>";
      data.response.forEach((elem) => {
        message += "<" + elem.html_tag + ">" + elem.text + "</" + elem.html_tag + ">";
      });
      message += "</div>"
      document.getElementById('message').innerHTML = message;

      document.getElementById('notes').disabled = false;
      document.getElementById('btngo').hidden = false;
    });
  // ...
}; // go


// ------ ..... ------ ..... ------ ..... ------ 
const randomQ = () => {
  const randomQuestions = [
    // Situation 1
    // Skills used: researchTopic, companyProfile
    "As a financial analyst, I've been tasked with assessing potential investment opportunities in the renewable energy sector. Could you provide me with a list of companies specializing in solar energy production along with their current financial profiles?",
    // Situation 2
    // Skills used: flightDepartures, currentWeather
    "I'm planning a business trip to New York tomorrow morning, but I need to know if there are any delays expected for my outbound flight due to the current weather conditions. Can you check the departure schedule and provide the weather forecast for both my departure and arrival locations?",
    // Situation 3
    // Skills used: findBusinesses, weatherForecast
    "I'm organizing an outdoor event next weekend, but I'm concerned about the weather. Can you help me find a reliable tent rental company in the area and also provide a weather forecast for the event date?",
    // Situation 4
    // Skills used: flightArrivals, companyProfile
    "I'm eagerly awaiting the arrival of a business partner flying in from Singapore. While I wait for their flight to land, could you also provide me with some insights into the latest financial performance of our company's competitors?",
    // Situation 5
    // Skills used: researchTopic, flightStatus
    "I'm planning a vacation to Paris next month and I'm considering booking a specific flight with a long layover. Before I confirm my reservation, could you check the status of that flight number for me and also provide some tips for sightseeing during the layover?",
    // Situation 6
    // Skills used: findBusinesses, historicalStockPrices
    "I'm interested in investing in the tech sector, particularly in companies specializing in artificial intelligence. Could you help me find some AI startups with promising growth potential and also provide their historical stock prices for the past year?",
    // Situation 7
    // Skills used: companyProfile, currentWeather
    "I'm attending a shareholders' meeting for a company located in a region prone to severe weather conditions. Before I head out, can you give me an overview of the company's financial health and also provide the current weather forecast for that area?",
    // Situation 8
    // Skills used: flightDepartures, weatherForecast
    "I'm a pilot preparing for a flight tomorrow morning, but I need to factor in the weather conditions for my route. Can you check the departure schedule for my flight and provide a detailed weather forecast for the entire duration of the journey?",
    // Situation 9
    // Skills used: flightArrivals, findBusinesses
    "I'm expecting an important client to arrive at the airport later today, and I want to make a good impression by taking them to a nice restaurant nearby. Could you check the flight status for me and also recommend some upscale dining options in the vicinity?",
    // Situation 10
    // Skills used: researchTopic, incomeStatement
    "I'm conducting research on the pharmaceutical industry and need to analyze the financial performance of leading drug manufacturers. Can you provide me with the latest income statements of these companies along with any notable trends or developments?",
    // Situation 11
    // Skills used: companyProfile, flightStatus
    "I work for a multinational corporation with frequent business travels. As I'm about to embark on another trip, could you give me an update on our company's financial standing and also check the status of my upcoming flight?",
    // Situation 12
    // Skills used: findBusinesses, cashFlowStatement
    "I'm considering opening a small cafe in my neighborhood, but I need to assess the financial viability of such a venture. Can you help me find similar cafes in the area and also provide insights into their cash flow statements?",
    // Situation 13
    // Skills used: currentWeather, historicalStockPrices
    "I'm a commodities trader specializing in agricultural products, and I need to anticipate market trends based on weather patterns. Can you provide me with both the current weather conditions and historical stock prices for key agricultural commodities?",
    // Situation 14
    // Skills used: flightDepartures, flightArrivals
    "I'm a flight coordinator tasked with managing the arrival and departure schedules at a busy airport. Can you help me coordinate the timing of inbound and outbound flights to minimize delays and maximize efficiency?",
    // Situation 15
    // Skills used: researchTopic, flightStatus
    "I'm a travel blogger planning my next adventure, and I want to feature a lesser-known airline in one of my articles. Could you help me research the safety record and reliability of a specific flight operated by that airline, as well as check its current status?",
    // Situation 16
    // Skills used: findBusinesses, weatherForecast
    "I'm organizing a team-building retreat for my company, and we're considering outdoor activities. Can you recommend some local adventure companies offering activities like hiking or rafting, along with a weather forecast for the retreat dates?",
    // Situation 17
    // Skills used: companyProfile, historicalStockPrices
    "I'm a financial advisor helping a client make informed investment decisions. Can you provide me with the historical stock prices of a particular company over the past decade, along with a comprehensive analysis of its performance and potential future trends?",
    // Situation 18
    // Skills used: flightDepartures, incomeStatement
    "I'm a business executive traveling overseas for an important meeting, but I need to stay updated on our company's financial performance while I'm away. Can you check the departure schedule for my flight and also send me the latest income statement for our company?",
    // Situation 19
    // Skills used: researchTopic, flightArrivals
    "I'm a journalist covering the tourism industry, and I'm interested in the impact of new flight routes on local economies. Could you help me identify recent airline expansions into specific regions and their corresponding economic effects upon arrival?",
    // Situation 20
    // Skills used: findBusinesses, cashFlowStatement
    "I'm a venture capitalist seeking investment opportunities in emerging markets. Can you assist me in identifying promising startups in a particular industry and also provide insights into their cash flow statements to gauge their financial health?",
    // Situation 21
    // Skills used: companyProfile, currentWeather
    "I'm a business owner planning an outdoor promotional event, but I need to consider potential weather disruptions. Can you give me an overview of our company's financial status and also provide the current weather forecast for the event date?",
    // Situation 22
    // Skills used: flightStatus, historicalStockPrices
    "I'm an investor closely monitoring the performance of an airline company in my portfolio. Could you check the status of their recent flights and also provide me with the historical stock prices to help me assess their overall trajectory?",
    // Situation 23
    // Skills used: researchTopic, flightDepartures
    "I'm a travel agent organizing group tours to exotic destinations, and I need to ensure smooth travel experiences for my clients. Can you help me research the best departure times for upcoming flights and advise on any potential scheduling conflicts?",
    // Situation 24
    // Skills used: findBusinesses, weatherForecast
    "I'm planning a romantic getaway and want to surprise my partner with a hot air balloon ride. Can you recommend reputable balloon companies in the area and also provide a weather forecast for the date of our excursion?",
    // Situation 25
    // Skills used: companyProfile, flightArrivals
    "I'm a business consultant meeting with potential clients flying in from different cities. Before I head to the airport, could you provide me with an overview of our company's financial performance and also check the arrival status of my clients' flights?",
  ];
  document.getElementById('notes').value = randomQuestions[(Math.floor(Math.random() * randomQuestions.length))];
}; // randomQ()

