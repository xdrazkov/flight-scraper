monthMap = {
    '1': 'január 2025', '2': 'február 2025', '3': 'marec 2025',
    '4': 'apríl 2025', '5': 'máj 2025', '6': 'jún 2025',
    '7': 'júl 2024', '8': 'august 2024', '9': 'september 2024',
    '10': 'október 2024', '11': 'november 2024', '12': 'december 2024'
}
const euro = "&euro;";

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
      this.carrierFirst = "";
    }

    copy(flight) {
      this.startDay = flight.startDay;
      this.startMonth = flight.startMonth;
      this.endDay = flight.endDay;
      this.endMonth = flight.endMonth;
      this.price = flight.price;
      this.fromCode = flight.fromCode;
      this.toCode = flight.toCode;
      this.fromName = flight.fromName;
      this.toName = flight.toName;
      this.carrierFirst = flight.carrierFirst;
    }

    toString() {
        if (this.startMonth === this.endMonth) {
            return `${this.startDay}. - ${this.endDay}. ${monthMap[this.startMonth.toString()]} za ${this.price}` + euro;
        } else {
            return `${this.startDay}. ${monthMap[this.startMonth.toString()]} - ${this.endDay}. ${monthMap[this.endMonth.toString()]} za ${this.price}` + euro;
        }
    }

    createLink() {
      if (this.carrierFirst == "Ryanair") {
        return this.createRyanairLink();
      } else {
        return this.createWizzLink();
      }
    }

    dateToString(month, day) {
      return `${monthMap[month.toString()].slice(-4)}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }    

    createWizzLink() {
      const fromDate = this.dateToString(this.startMonth, this.startDay);
      const toDate = this.dateToString(this.endMonth, this.endDay);
      return `https://wizzair.com/sk-sk/booking/select-flight/${this.fromCode}/${this.toCode}/${fromDate}/${toDate}/1/0/0/null`;
    }

    createRyanairLink() {
      const fromDate = this.dateToString(this.startMonth, this.startDay);
      const toDate = this.dateToString(this.endMonth, this.endDay);
      return `https://www.ryanair.com/sk/en/trip/flights/select?adults=1&dateOut=${fromDate}&dateIn=${toDate}&originIata=${this.fromCode}&destinationIata=${this.toCode}`;
    }
  }
