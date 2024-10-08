function processKiwiResult(resultCard) {
  let flight = new Flight();
  flight.price = parseInt(resultCard.querySelector('[data-test="ResultCardPrice"]').textContent.slice(0, -2));

  let startDate = resultCard.querySelectorAll('[data-test="ResultCardSectorDepartureDate"]')[0].textContent.slice(3).replace(".", "").split(" ");
  let endDate = resultCard.querySelectorAll('[data-test="ResultCardSectorDepartureDate"]')[1].textContent.slice(3).replace(".", "").split(" ");
  flight.startDay = parseInt(startDate[0]);
  flight.startMonth = parseInt(startDate[1]);
  flight.endDay = parseInt(endDate[0]);
  flight.endMonth = parseInt(endDate[1]);

  flight.startStartTime = resultCard.querySelectorAll('[data-test="TripTimestamp"]')[0].textContent;
  flight.startEndTime = resultCard.querySelectorAll('[data-test="TripTimestamp"]')[1].textContent;
  flight.endStartTime = resultCard.querySelectorAll('[data-test="TripTimestamp"]')[2].textContent;
  flight.endEndTime = resultCard.querySelectorAll('[data-test="TripTimestamp"]')[3].textContent;

  flight.fromCode = resultCard.querySelectorAll('[data-test="stationName"]')[0].textContent;
  flight.toCode = resultCard.querySelectorAll('[data-test="stationName"]')[1].textContent;

  flight.carrierFirst = resultCard.querySelector('img').title;
  return flight;
}

function scrapeKiwi() {
  let flights = [];
  let elements = document.querySelectorAll('[data-test="ResultCardWrapper"]');
  for (let element of elements) {
    flights.push(processKiwiResult(element));
  }
  return flights;
}

function processAzairResult(resultElement) {
  let flight = new Flight();

  // Get date there
  const startDate = resultElement.querySelector('span.date').textContent.split(' ')[1];
  let breakChar = ".";
  if (startDate.includes("/")) {
    breakChar = "/";
  }
  flight.startDay = parseInt(startDate.split(breakChar)[0]);
  flight.startMonth = parseInt(startDate.split(breakChar)[1]);

  // Get date back
  const endDate = resultElement.querySelectorAll('span.date')[1].textContent.split(' ')[1];
  flight.endDay = parseInt(endDate.split(breakChar)[0]);
  flight.endMonth = parseInt(endDate.split(breakChar)[1]);

  // Get time there
  flight.startStartTime = resultElement.querySelectorAll('span.from')[0].textContent.split(' ')[0];
  flight.startEndTime = resultElement.querySelectorAll('span.to')[0].textContent.split(' ')[0];

  // Get time back
  flight.endStartTime = resultElement.querySelectorAll('span.from')[2].textContent.split(' ')[0];
  flight.endEndTime = resultElement.querySelectorAll('span.to')[2].textContent.split(' ')[0];

  // Get price
  flight.price = parseInt(resultElement.querySelector('div.totalPrice').textContent.split(' ')[0].slice(1));

  // Get from information
  const fromSpan = resultElement.querySelector('span.from');
  flight.fromCode = fromSpan.querySelector('span.code').textContent.slice(0, 3);
  flight.fromName = fromSpan.textContent.slice(6).trim();

  // Get to information
  const toSpan = resultElement.querySelector('span.to');
  flight.toCode = toSpan.querySelector('span.code').textContent.slice(0, 3);
  flight.toName = toSpan.textContent.slice(6).trim();

  // Get carriers
  const firstDiv = resultElement.querySelectorAll('div.detail')[0].querySelector('p');

  firstDiv.childNodes.forEach(child => {
      if (child.nodeType === Node.ELEMENT_NODE && child.classList.contains('airline')) {
        flight.carrierFirst = child.textContent;
      }
  });

  return flight;
}

function scrapeAzair() {
  let flights = [];
  let elements = document.querySelectorAll('.result');
  for (let element of elements) {
    flights.push(processAzairResult(element));
  }
  return flights;
}

function scrape() {
  if (window.location.href.includes("kiwi")) {
    return scrapeKiwi();
  }
  if (window.location.href.includes("azair")) {
    return scrapeAzair();
  }
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.action === "scrape") {
        sendResponse({content: scrape()});
      }
      return true;
    }
  );
