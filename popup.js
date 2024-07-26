let isKiwi = true;

function printFlightsWithLinks(flights) {
  if (flights[0].carrierFrom !== "Ryanair" && !flights[0].carrierFrom.includes("Wizz")) {
      return printFlightsWithoutLinks(flights);
  }

  let result = "<p>";
  flights.forEach(flight => {
      result += `<a href="${flight.createLink()}">- ${flight.toString()}</a><br />\n`;
  });
  result += "</p>\n";
  return result;
}

function printFlightsWithoutLinks(flights) {
  let result = "";
  flights.forEach(flight => {
      result += `- ${flight.toString()}\n`;
  });
  return result;
}

function printData(data) {
  var resultDiv = document.getElementById('result');

  let withLinks = printFlightsWithLinks(data);
  let withoutLinks = printFlightsWithoutLinks(data);

  resultDiv.innerHTML = withLinks + "\n" + withoutLinks;
}

function processScrapedData(data, carrier, from, to) {
  if (isKiwi) {
    for (let flight of data) {
      flight.carrier = carrier;
      flight.fromCode = from;
      flight.toCode = to;
    }
  }

  printData(data);
}

function castToFlights(data) {
  let flights = [];
  for (let flight of data) {
    let newFlight = new Flight();
    newFlight.copy(flight);
    flights.push(newFlight);
  }
  return flights;
}

document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('form');

    form.addEventListener('submit', function(event) {
      event.preventDefault();

      var carrier = document.querySelector('input[name="carrier"]:checked').value;
      var from = document.getElementById('from').value;
      var to = document.getElementById('to').value;

      chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {action: "scrape"}, function(response) {
                console.log(response)
                let data = castToFlights(response.content);
                processScrapedData(data, carrier, from, to);
              });
      });
    });
  });
