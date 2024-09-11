let isKiwi = true;

// NOT USED
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
// NOT USED


function makeClickable(link) {
  return "<a href=" + link + ">" + link + "</a>";
}

function printFlightsWithLinks(flights) {
  if (flights[0].carrierFirst !== "Ryanair" && !flights[0].carrierFirst.includes("Wizz")) {
      return printFlightsWithoutLinks(flights);
  }

  let result = "&lt;p&gt;" + "<br>";
  flights.forEach(flight => {
    result += "&lt;a href=" + makeClickable(flight.createLink()) + "&gt;- " + flight.toString() + "&lt;/a&gt;&lt;br /&gt;" + "<br>";
    result = addTime(result, flight);
  });
  result += "&lt;/p&gt;";
  return result;
}

function printFlightsWithoutLinks(flights) {
  let result = "";
  flights.forEach(flight => {
      result += `- ${flight.toString()}` + "<br>";
      result = addTime(result, flight);
  });
  return result;
}

function addTime(flightString, flight) {
  let dayOfWeekStart = dayOfWeekNames[new Date(flight.startYear, flight.startMonth - 1, flight.startDay).getDay()];
  let dayOfWeekEnd = dayOfWeekNames[new Date(flight.endYear, flight.endMonth - 1, flight.endDay).getDay()];

  flightString += "(" + dayOfWeekStart + " " + flight.startStartTime + "-" + flight.startEndTime + " - "
               + dayOfWeekEnd + " " + flight.endStartTime + "-" + flight.endEndTime + ")" + "<br>";

  return flightString;
}

function printData(data) {
  var resultWithLinksDiv = document.getElementById('resultWithLinks');
  var resultWithoutLinksDiv = document.getElementById('resultWithoutLinks');

  let withLinks = printFlightsWithLinks(data);
  let withoutLinks = printFlightsWithoutLinks(data);

  let validAt = "Uvedené ceny sú platné k " + new Date().toLocaleDateString() 
              + " o " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ".";
  withLinks = withLinks + "<br>" + "<br>" + validAt;
  withoutLinks = withoutLinks + "<br>" + validAt;

  resultWithLinksDiv.innerHTML = withLinks;
  resultWithoutLinksDiv.innerHTML = withoutLinks;
}

function sortFlights(flights) {
  return flights.sort((a, b) => 
    a.startYear - b.startYear ||
    a.startMonth - b.startMonth || 
    a.startDay - b.startDay || 
    a.endMonth - b.endMonth ||
    a.endDay - b.endDay ||
    a.price - b.price
  );
}

function deleteDuplicates(flights) {
  sortFlights(flights);
  for (let i = 0; i < flights.length - 1; i++) {
    if (flights[i].startDay === flights[i + 1].startDay && flights[i].startMonth === flights[i + 1].startMonth
      && flights[i].endDay === flights[i + 1].endDay && flights[i].endMonth === flights[i + 1].endMonth) {
      flights.splice(i + 1, 1);
      i--;
    }
  }
}

function processScrapedData(data, offsetPriceBy, priceLimit, maxResults) {
    for (let flight of data) {
      flight.price -= offsetPriceBy;
    }
    data = data.filter(flight => flight.price <= priceLimit);

    deleteDuplicates(data);

    data.sort((a, b) => a.price - b.price);
    data = data.slice(0, maxResults);

    sortFlights(data);

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

function scrape() {
    event.preventDefault();
    var offsetPriceBy = document.getElementById('offsetPriceBy').value;
    var priceLimit = document.getElementById('priceLimit').value;
    var maxResults = document.getElementById('maxResults').value;

    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {action: "scrape"}, function(response) {
              console.log(response)
              let data = castToFlights(response.content);
              processScrapedData(data, offsetPriceBy, priceLimit, maxResults);
            });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('form');
    form.addEventListener('submit', scrape);
    scrape();
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
