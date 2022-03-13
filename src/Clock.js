const timeZones = {
  tehran: "Asia/Tehran",
  berlin: "Europe/Berlin",
  london: "Europe/London",
  "new york": "America/New_York",
  toronto: "America/Toronto",
  tokyo: "Asia/Tokyo",
  istanbul: "Asia/Istanbul",
};

const weekDays = ["Son", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
class WorldClock extends HTMLElement {
  static get observedAttributes() {
    return ["city"];
  }

  #EDIT = "EDIT";
  #NO_EDIT = "NO_EDIT";
  #state;
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

    this.#state = this.#EDIT;
    this.time = newClock.querySelector(".world-clock-time");
    this.city = newClock.querySelector(".world-clock-city");
    this.cityList = newClock.querySelector("#city-list");
    this.date = newClock.querySelector(".world-clock-date");
    this.btnEdit = newClock.querySelector(".button-edit");
    this.btnDelete = newClock.querySelector(".button-delete");
    this.citySelect = newClock.getElementById("city");

    const date = new Date();
    this.date.textContent =
      weekDays[date.getDay()] + " " + date.toLocaleDateString();

    //this.cityList.replaceChildren(...this.getCityList(timeZones));
    const cities = this.getCityList(timeZones);
    this.cityList.replaceChildren(...cities);

    this.citySelect.focus();
    this.citySelect.addEventListener("input", (event) => {
      //this.setAttribute("city", citySelect.value);
    });

    this.btnEdit.addEventListener("click", (event) => {
      event.preventDefault();
      if (this.citySelect.value) {
        if (this.#state === this.#EDIT) {
          this.setAttribute("city", this.citySelect.value);
          this.#state = this.#NO_EDIT;
          this.citySelect.disabled = true;
          this.btnEdit.textContent = "Edit";
        } else {
          this.#state = this.#EDIT;
          this.citySelect.disabled = false;
          this.btnEdit.textContent = "Save";
          this.citySelect.focus();
        }
      }
    });

    this.btnDelete.addEventListener("click", (event) => {
      event.preventDefault();
      this.remove();
      const deleteEvent = new CustomEvent("deleted", {
        detail: {
          id: this.getAttribute("id"),
        },
      });
      this.dispatchEvent(deleteEvent);
    });

    shadow.appendChild(newClock);
  }

  connectedCallback() {}

  disconnectedCallback() {}

  adoptedCallback() {}

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "city") {
      this.setCityTimeZone();
      //this.city.textContent = newValue;
    }
  }

  setState(state) {}

  getCityList(list) {
    const collection = [];
    for (const key in list) {
      const option = new Option();
      option.value = key;
      collection.push(option);
    }
    return collection;
  }

  getCityList(list) {
    const collection = [];
    for (const key in list) {
      const option = new Option();
      option.value = key;
      collection.push(option);
    }
    return collection;
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
}

customElements.define("world-clock", WorldClock);

const wrapper = document.getElementById("clock-wrapper");
const add = document.getElementById("addClock");

add.addEventListener("click", addClock);
window.addEventListener("DOMContentLoaded", load);

function load(event) {
  addClock(event);
}

let clockCollection = {};
addClock.nextIndex = 0;
function addClock(event) {
  const clock = document.createElement("world-clock");
  clock.setAttribute("city", "tehran");
  clockCollection[addClock.nextIndex] = clock;
  clock.setAttribute("id", addClock.nextIndex++);

  clock.addEventListener("deleted", (event) => {
    const deletedItemId = event.detail.id;
    delete clockCollection[deletedItemId];
  });

  wrapper.append(clock);
}

function timerTick() {
  for (key in clockCollection) {
    clockCollection[key].displayTime();
  }
}

setInterval(timerTick, 500);
