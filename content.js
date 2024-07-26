function processResultCard(resultCard) {
  let flight = new Flight();
  flight.price = parseInt(resultCard.querySelector('[data-test="ResultCardPrice"]').textContent.slice(0, -2));
  let startDate = resultCard.querySelectorAll('[data-test="ResultCardSectorDepartureDate"]')[0].textContent.slice(3).replace(".", "").split(" ");
  let endDate = resultCard.querySelectorAll('[data-test="ResultCardSectorDepartureDate"]')[1].textContent.slice(3).replace(".", "").split(" ");
  flight.startDay = parseInt(startDate[0]);
  flight.startMonth = parseInt(startDate[1]);
  flight.endDay = parseInt(endDate[0]);
  flight.endMonth = parseInt(endDate[1]);
  return flight;
}

function scrape() {
  let flights = [];
  let elements = document.querySelectorAll('[data-test="ResultCardWrapper"]');
  for (let element of elements) {
    flights.push(processResultCard(element, flights));
  }
  return flights;
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.action === "scrape") {
        sendResponse({content: scrape()});
      }
      return true;
    }
  );
