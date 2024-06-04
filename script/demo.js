const broadAIapiEndpoint = "http://localhost:8080";

// ------ ..... ------ ..... ------ ..... ------ 
const go = () => {
  let notes = document.getElementById('notes').value; // Get the value from the textbox
  document.getElementById('message').innerHTML = "";
  document.getElementById('notes').disabled = true;
  document.getElementById('btngo').disabled = true;
  // ...
  fetch(broadAIapiEndpoint + "/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "notes": notes
    }),
    mode: "cors"
  }).then((response) => response.json())
    .then((data) => {
      let message = "<div>";
      data.forEach((elem) => {
        if (elem.html_tag == "li" || elem.html_tag == "td")
          elem.html_tag = "p";
        message += "<" + elem.html_tag + ">" + elem.text + "</" + elem.html_tag + ">";
      });
      message += "</div>"
      document.getElementById('message').innerHTML = message;
      document.getElementById('notes').disabled = false;
      document.getElementById('btngo').disabled = false;
    });
  // ...
}; // go


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

    // Arrivals and departures from a major airport
    "I'm picking up a friend from JFK Airport tomorrow. Can you provide me with the arrivals schedule for tomorrow morning?",
    "I have a flight to catch from Heathrow Airport. Can you give me the departure schedule for my flight?",
    "I'm expecting a package through air freight. Can you help me track its arrival at O'Hare International Airport?"
  ];
  document.getElementById('notes').value = randomQuestions[(Math.floor(Math.random() * randomQuestions.length))];
}; // randomQ()
