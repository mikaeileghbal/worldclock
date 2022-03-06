const timeZones = {
  tehran: "Asia/Tehran",
  london: "Europe/London",
  berlin: "Europe/Berlin",
};

class WorldClock extends HTMLElement {
  static get observedAttributes() {
    return ["city"];
  }

  #EDIT = "EDIT";
  #NO_EDIT = "NO_EDIT";
  #options = {
    timeZone: "Europe/Berlin",
    timeStyle: "medium",
    hourCycle: "h24",
  };

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    const template = document.getElementById("world-clock-template").content;
    const newClock = template.cloneNode(true);

    this.time = newClock.querySelector(".world-clock-time");
    this.city = newClock.querySelector(".world-clock-city");
    this.date = newClock.querySelector(".world-clock-date");
    this.btnEdit = newClock.querySelector(".button-edit");
    this.btnDelete = newClock.querySelector(".button-delete");
    const citySelect = newClock.getElementById("city");

    this.date.textContent = new Date().toLocaleDateString();

    citySelect.addEventListener("input", (event) => {
      this.setAttribute("city", citySelect.value);
    });

    this.btnEdit.addEventListener("click", (event) => {
      event.preventDefault();
      console.log("edit mode");
    });

    this.btnDelete.addEventListener("click", (event) => {
      event.preventDefault();
      console.log("delete");
      this.remove();
    });

    shadow.appendChild(newClock);
    this.tick();
  }

  connectedCallback() {}

  disconnectedCallback() {}

  adoptedCallback() {}

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "city") {
      this.setCityTimeZone();
      this.city.textContent = newValue;
    }
  }

  setCityTimeZone() {
    for (const key in timeZones) {
      if (key.toLowerCase() === this.getAttribute("city").toLowerCase()) {
        this.#options.timeZone = timeZones[key];
      }
    }
  }

  getCurrentTime() {
    const currentTime = new Date().toLocaleTimeString("en-US", this.#options);
    return currentTime;
  }

  displayTime = () => {
    this.time.textContent = this.getCurrentTime();
  };

  tick() {
    setInterval(this.displayTime, 50);
  }
}

customElements.define("world-clock", WorldClock);

const wrapper = document.getElementById("clock-wrapper");

const add = document.getElementById("addClock");

add.addEventListener("click", addClock);

window.addEventListener("DOMContentLoaded", load);

function load(event) {
  addClock(event);
}

function addClock(event) {
  const clock = document.createElement("world-clock");
  clock.setAttribute("city", "tehran");
  wrapper.append(clock);
}

// export default class Clock {
//   constructor(city) {
//     this.city = city;
//     this.EDIT = "EDIT";
//     this.NO_EDIT = "NO_EDIT";
//     this.state = this.EDIT;
//     this.hour = "";
//     this.fragment = new DocumentFragment();
//     this.container = document.createElement("div");
//     this.timeDisplay = document.createElement("div");
//     this.cityDisplay = document.createElement("div");
//     this.dateDisplay = document.createElement("div");
//     this.form = document.createElement("div");
//     this.label = document.createElement("label");
//     this.input = document.createElement("input");
//
//   }
//

//   tickHour() {
//     setInterval(() => {
//       if (this.hour >= 1 && this.hour <= 12) {
//         this.container.classList.add("night");
//       } else {
//         this.container.classList.remove("night");
//       }
//     }, 1000);
//   }

//   Draw() {
//     this.container.className = "clock-container";
//     this.timeDisplay.className = "clock-time-display";
//     this.cityDisplay.className = "clock-city";
//     this.dateDisplay.className = "clock-date";

//     this.timeDisplay.textContent = this.getCurrentTime();
//     this.cityDisplay.textContent = this.city;
//     this.dateDisplay.textContent = new Date().toLocaleDateString();

//     this.container.append(this.timeDisplay, this.cityDisplay, this.dateDisplay);

//     const noedit = document.createElement("p");

//     if (this.state === this.NO_EDIT) {
//       noedit.textContent = "No edit";
//     } else if (this.state === this.EDIT) {
//       noedit.textContent = "Edit";
//     }
//     this.container.appendChild(noedit);

//     this.fragment.appendChild(this.container);

//     this.tick();
//     this.tickHour();
//     return this.fragment;
//   }
// }
