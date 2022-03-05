const timeZones = {
  tehran: "Asia/Tehran",
  london: "Europe/London",
  berlin: "Europe/Berlin",
};

export default class Clock {
  constructor(city) {
    this.city = city;
    this.EDIT = "EDIT";
    this.NO_EDIT = "NO_EDIT";
    this.state = this.EDIT;
    this.hour = "";
    this.fragment = new DocumentFragment();
    this.container = document.createElement("div");
    this.timeDisplay = document.createElement("div");
    this.cityDisplay = document.createElement("div");
    this.dateDisplay = document.createElement("div");
    this.form = document.createElement("div");
    this.label = document.createElement("label");
    this.input = document.createElement("input");
    this.options = {
      timeZone: "Europe/Berlin",
      timeStyle: "medium",
      hourCycle: "h24",
    };
  }
  setCityTimeZone(city) {
    for (const key in timeZones) {
      if (key.toLowerCase() === city.toLowerCase()) {
        this.options.timeZone = timeZones[key];
      }
    }
  }
  getCurrentTime() {
    // return new Date().toLocaleTimeString("en-US", {
    //   timeZone: "Asia/Tehran",
    //   timeStyle: "medium",
    //   hourCycle: "h24",
    // });
    this.setCityTimeZone(this.city);
    const currentTime = new Date().toLocaleTimeString("en-US", this.options);
    this.hour = currentTime.substring(0, 2);

    return currentTime;
  }

  tick() {
    setInterval(() => {
      this.timeDisplay.textContent = this.getCurrentTime();
    }, 500);
  }

  tickHour() {
    setInterval(() => {
      if (this.hour >= 1 && this.hour <= 12) {
        this.container.classList.add("night");
      } else {
        this.container.classList.remove("night");
      }
    }, 1000);
  }

  Draw() {
    this.container.className = "clock-container";
    this.timeDisplay.className = "clock-time-display";
    this.cityDisplay.className = "clock-city";
    this.dateDisplay.className = "clock-date";

    this.timeDisplay.textContent = this.getCurrentTime();
    this.cityDisplay.textContent = this.city;
    this.dateDisplay.textContent = new Date().toLocaleDateString();

    this.container.append(this.timeDisplay, this.cityDisplay, this.dateDisplay);

    const noedit = document.createElement("p");

    if (this.state === this.NO_EDIT) {
      noedit.textContent = "No edit";
    } else if (this.state === this.EDIT) {
      noedit.textContent = "Edit";
    }
    this.container.appendChild(noedit);

    this.fragment.appendChild(this.container);

    this.tick();
    this.tickHour();
    return this.fragment;
  }
}
