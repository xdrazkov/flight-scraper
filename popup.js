let isKiwi = true;
const newline = "newline";

function escapeHtml(text) {
  return text
      .replaceAll('&euro;', "€")
      .replaceAll(/&/g, "&amp;")
      .replaceAll(/</g, "&lt;")
      .replaceAll(/>/g, "&gt;")
      .replaceAll(/"/g, "&quot;")
      .replaceAll(/'/g, "&#039;")
      .replaceAll('€', "&euro;")
      .replaceAll(/newline/g, "<br>");
}

function printFlightsWithLinks(flights) {
  if (flights[0].carrierFirst !== "Ryanair" && !flights[0].carrierFirst.includes("Wizz")) {
      return printFlightsWithoutLinks(flights);
  }

  let result = "<p>";
  flights.forEach(flight => {
    result += "<a href=" + flight.createLink() + ">- " + flight.toString() + "</a>" + newline;
  });
  result += "</p>";
  return result;
}

function printFlightsWithoutLinks(flights) {
  let result = "";
  flights.forEach(flight => {
      result += `- ${flight.toString()}` + newline;
  });
  return result;
}

function printData(data) {
  var resultWithLinksDiv = document.getElementById('resultWithLinks');
  var resultWithoutLinksDiv = document.getElementById('resultWithoutLinks');

  let withLinks = printFlightsWithLinks(data);
  let withoutLinks = printFlightsWithoutLinks(data);

  resultWithLinksDiv.innerHTML = escapeHtml(withLinks);
  resultWithoutLinksDiv.innerHTML = escapeHtml(withoutLinks);
}

function processScrapedData(data, offsetPriceBy) {
    for (let flight of data) {
      flight.price -= offsetPriceBy;
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

      var offsetPriceBy = document.getElementById('offsetPriceBy').value;

      chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {action: "scrape"}, function(response) {
                console.log(response)
                let data = castToFlights(response.content);
                processScrapedData(data, offsetPriceBy);
              });
      });
    });
  });

function copyContents(element) {
  var range = document.createRange();
  range.selectNode(element);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  document.execCommand("copy");
  window.getSelection().removeAllRanges();
}

function copyWithLinks() {
  var resultWithLinksDiv = document.getElementById('resultWithLinks');
  copyContents(resultWithLinksDiv);
}

function copyWithoutLinks() {
  var resultWithoutLinksDiv = document.getElementById('resultWithoutLinks');
  copyContents(resultWithoutLinksDiv);
}

document.getElementById('copyWithLinks').addEventListener('click', copyWithLinks);
document.getElementById('copyWithoutLinks').addEventListener('click', copyWithoutLinks);
