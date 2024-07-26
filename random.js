class Flight {
    constructor() {
      this.startDay = 0;
      this.startMonth = 0;
      this.endDay = 0;
      this.endMonth = 0;
      this.price = 0;
      this.fromCode = "";
      this.toCode = "";
      this.fromName = "";
      this.toName = "";
      this.carrierFrom = "";
      this.carrierTo = "";
    }
}

function createLink(flight) {
  if (flight.carrierFrom == "Ryanair") {
    return flight.makeRyanairLink(flight);
  } else {
    return flight.createWizzLink(flight);
  }
}

function dateToString(month, day) {
  return `${monthMap[month.toString()].slice(-4)}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}    

function createWizzLink(flight, fromCode, toCode) {
  const fromDate = dateToString(flight.startMonth, flight.startDay);
  const toDate = dateToString(flight.endMonth, flight.endDay);
  return `https://wizzair.com/sk-sk/booking/select-flight/${fromCode}/${toCode}/${fromDate}/${toDate}/1/0/0/null`;
}

function createRyanairLink(flight, fromCode, toCode) {
  const fromDate = dateToString(flight.startMonth, flight.startDay);
  const toDate = dateToString(flight.endMonth, flight.endDay);
  return `https://www.ryanair.com/sk/en/trip/flights/select?adults=1&dateOut=${fromDate}&dateIn=${toDate}&originIata=${fromCode}&destinationIata=${toCode}`;
}
