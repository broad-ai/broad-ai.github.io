const broadAIapiEndpoint = "https://broadaidemo-7yg2a2s6sq-uc.a.run.app";

// ------ ..... ------ ..... ------ ..... ------ 
const refreshChat = () => {
  let messages = "";
  if (sessionStorage.getItem('conversations'))
    JSON.parse(sessionStorage.getItem('conversations')).forEach((qa, i) => {
      messages += "<p style='text-align:" + ((i % 2 == 0) ? "right" : "left") + ";color:" + ((i % 2 == 0) ? "black" : "blue") + ";'>" + qa.replace('?: ', '').replace('>: ', '').replaceAll('\n', '<br>') + "</p>"
    });
  document.getElementById('chat').innerHTML = messages;
}; // refreshChat

// ------ ..... ------ ..... ------ ..... ------ 
const goChatbot = () => {
  // -- pre results formatting
  document.getElementById('chat').innerHTML += "<p style='text-align:right;color:black;font-size:2em;'>...</p>";
  document.getElementById('btnGoChatbot').disabled = true;
  document.getElementById('chatbox').disabled = true;

  // --- ask
  fetch(broadAIapiEndpoint + '/go', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "question": document.getElementById('chatbox').value,
      "conversations": JSON.parse(sessionStorage.getItem('conversations')) || []
    })
  })
    .then((resp) => resp.json())
    .then((data) => {
      // -- showing results
      sessionStorage.setItem('conversations', JSON.stringify(data.response.conversation));
      refreshChat();

      // -- post results formatting
      document.getElementById('btnGoChatbot').disabled = false;
      document.getElementById('chatbox').disabled = false;
      document.getElementById('chatbox').value = "";

    });
}; // goChatbot

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
    "I'm planning a vacation to Tokyo next month. Can you check the current weather forecast and some tips on the best time to book my flight?",

    // Weatherman + NewsReporter
    "I'm organizing a community event next week. Can you provide the weather forecast for the event day and a brief summary of the latest local news to include in our newsletter?",
    "Can you give me the weather forecast for San Francisco and the latest tech news for my presentation?",
    "I'm planning a seminar in Boston. Can you check the weather forecast and provide the latest news from Massachusetts to discuss during the seminar?",
    "I'm going on a holiday to Hawaii. Can you check the weather forecast and provide the latest news from the islands to help me plan my activities?",
    "Can you provide the weather forecast for Paris and the latest news headlines from France to prepare for my trip?",

    // Weatherman + FinancialAnalyst
    "I need to prepare for a meeting with Tesla in Palo Alto. Can you provide the latest financial analysis of Tesla and the weather forecast for Palo Alto?",
    "Can you give me the financial performance of Amazon and the weather forecast in Seattle for my upcoming visit?",
    "I need a report on Google's financial performance and the weather forecast in Mountain View for my trip next week.",

    // Weatherman + Researcher
    "I'm planning a trip to New York. Can you check the weather forecast and find information on the best tourist attractions to visit?",
    "I have a business meeting in Los Angeles next week. Can you check the weather forecast and find recent developments about the company I'll be meeting?",

    // NewsReporter + FinancialAnalyst
    "Can you provide the latest financial analysis of Microsoft and the current news headlines about the company?",
    "I need to know the financial performance of Apple and the latest news headlines in the tech industry for my investment analysis.",

    // NewsReporter + Researcher
    "Can you give me the latest news headlines from Japan and some background information on the top stories for my report?",
    "I need the top news headlines from the tech industry and detailed information on recent major developments for my blog post.",
    "Can you provide the latest news headlines from Germany and find any significant economic reports to prepare for my meeting?",

    // FinancialAnalyst + Researcher
    "I need a detailed report on Tesla's financial performance and any recent research on their market strategy for my presentation.",
    "Can you give me the financial performance of Meta and any recent research reports about their new initiatives for my analysis?",

    // Weatherman only
    "Can you check the weather forecast for my trip to New York next week to help me pack appropriately?",
    "I'm planning a road trip to Los Angeles. Can you provide the weather forecast for the next week to help me plan my route?",
    "What's the weather forecast for this weekend in Chicago? I need to plan my outdoor activities.",

    // NewsReporter only
    "Can you provide the latest news headlines from Japan? I need to stay updated on international news.",
    "Can you give me the top news headlines from the tech industry for my weekly newsletter?",
    "What's the latest news from the financial markets today? I need to update my investment portfolio.",

    // Researcher only
    "Can you find detailed information about the recent product launch by Google for my market analysis?",
    "I need a comprehensive report on the latest trends in renewable energy for my research project.",

    // Aviator + Weatherman
    "I need to fly from New York to London next week for a business meeting. Can you help me find a suitable flight and check the weather forecast for both cities to plan my trip?",
    "I'm planning a vacation to Tokyo next month. Can you check the current weather forecast and suggest the best time to book my flight?"
  ];
  document.getElementById('notes').value = randomQuestions[(Math.floor(Math.random() * randomQuestions.length))];
}; // randomQ()

