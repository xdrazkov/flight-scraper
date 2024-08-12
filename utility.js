monthNames = ["Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December"];
const euro = "&euro;";

class Flight {
    constructor() {
      this.startDay = 0;
      this.startMonth = 0;
      this.endDay = 0;
      this.endMonth = 0;
      this.startYear = 0;
      this.endYear = 0;
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
      this.startYear = flight.startYear;
      this.endYear = flight.endYear;
      this.setYear();
    }

    setYear() {
      // If the Flight's month is less than the current month,
      // then it is in the next year, else it is in the current year
      const currentMonth = new Date().getMonth() + 1;
      this.startYear = this.startMonth <= currentMonth ? new Date().getFullYear() + 1 : new Date().getFullYear();
      this.endYear = this.endMonth <= currentMonth ? new Date().getFullYear() + 1 : new Date().getFullYear();
    }

    toString() {
        if (this.startMonth === this.endMonth) {
            return `${this.startDay}. - ${this.endDay}. ${monthNames[this.startMonth - 1]} ${this.startYear} za ${this.price}` + euro;
        } else {
            return `${this.startDay}. ${monthNames[this.startMonth - 1]} ${this.startYear} - ${this.endDay}. ${monthNames[this.endMonth - 1]} ${this.endYear} za ${this.price}` + euro;
        }
    }

    createLink() {
      if (this.carrierFirst == "Ryanair") {
        return this.createRyanairLink();
      } else {
        return this.createWizzLink();
      }
    }

    dateToString(year, month, day) {
      return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }

    createWizzLink() {
      const fromDate = this.dateToString(this.startYear, this.startMonth, this.startDay);
      const toDate = this.dateToString(this.endYear, this.endMonth, this.endDay);
      return `https://wizzair.com/sk-sk/booking/select-flight/${this.fromCode}/${this.toCode}/${fromDate}/${toDate}/1/0/0/null`;
    }

    createRyanairLink() {
      const fromDate = this.dateToString(this.startYear, this.startMonth, this.startDay);
      const toDate = this.dateToString(this.endYear, this.endMonth, this.endDay);
      return `https://www.ryanair.com/sk/en/trip/flights/select?adults=1&dateOut=${fromDate}&dateIn=${toDate}&originIata=${this.fromCode}&destinationIata=${this.toCode}`;
    }
  }
