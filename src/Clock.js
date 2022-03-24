const timeZones = {
	tehran: "Asia/Tehran",
	berlin: "Europe/Berlin",
	london: "Europe/London",
	new_york: "America/New_York",
	toronto: "America/Toronto",
	tokyo: "Asia/Tokyo",
	istanbul: "Asia/Istanbul",
	baku: "Asia/Baku",
	paris: "Europe/Paris",
	sydney: "Australia/Sydney",
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

		this.#state = this.#NO_EDIT;
		this.time = newClock.querySelector(".world-clock-time");
		this.city = newClock.querySelector(".world-clock-city");
		this.cityList = newClock.querySelector("#city-list");
		this.date = newClock.querySelector(".world-clock-date");
		this.btnEdit = newClock.querySelector(".button-edit");
		this.btnDelete = newClock.querySelector(".button-delete");
		this.citySelect = newClock.getElementById("city");
		this.hr = newClock.getElementById("hr");
		this.mn = newClock.getElementById("mn");
		this.sc = newClock.getElementById("sc");

		const date = new Date();
		this.date.textContent =
			weekDays[date.getDay()] + " " + date.toLocaleDateString();

		//this.cityList.replaceChildren(...this.getCityList(timeZones));
		// const cities = this.getCityList(timeZones);
		// this.cityList.replaceChildren(...cities);

		this.citySelect.focus();
		this.citySelect.addEventListener("input", (event) => {
			//this.setAttribute("city", citySelect.value);
		});

		this.btnEdit.addEventListener("click", (event) => {
			event.preventDefault();
			if (this.citySelect.value) {
				if (this.#state === this.#EDIT) {
					this.setAttribute("city", this.citySelect.value.replace(" ", "_"));
					this.#state = this.#NO_EDIT;
					this.citySelect.disabled = true;
					this.btnEdit.textContent = "🖊";
				} else {
					this.#state = this.#EDIT;
					this.citySelect.disabled = false;
					this.btnEdit.textContent = "✔";
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
			this.citySelect.value = newValue.replace("_", " ");
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
		//this.time.textContent = this.getCurrentTime();
		const deg = 6;
		const day = this.getCurrentTime();

		let hh = day.substring(0, 2) * 30;
		let mm = day.substring(3, 5) * deg;
		let ss = day.substring(6, 8) * deg;

		// let hh = day.getHours() * 30;
		// let mm = day.getMinutes() * deg;
		// let ss = day.getSeconds() * deg;
		this.hr.style.transform = `rotateZ(${hh + mm / 12}deg)`;
		this.mn.style.transform = `rotateZ(${mm}deg)`;
		this.sc.style.transform = `rotateZ(${ss}deg)`;
	};
}

customElements.define("world-clock", WorldClock);

const wrapper = document.getElementById("clock-wrapper");

//const add = document.getElementById("addClock");
//add.addEventListener("click", addClock);

window.addEventListener("DOMContentLoaded", load);

function load(event) {
	addClock(event, "tehran");
	addClock(event, "berlin");
	addClock(event, "new_york");
	addClock(event, "tokyo");
	createCityList(timeZones);
}

let clockCollection = {};
addClock.nextIndex = 0;
function addClock(event, city) {
	const clock = document.createElement("world-clock");
	clock.setAttribute("city", city);
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

// Populate list with city names

function createCityList(list) {
	const keys = Object.keys(list);
	let fragment = new DocumentFragment();
	const ul = document.getElementById("cityList");

	keys.forEach((key) => {
		const li = document.createElement("li");
		const button = document.createElement("button");
		button.setAttribute("value", key);
		button.textContent = key.replace("_", " ");
		button.addEventListener("click", (e) => {
			e.stopPropagation();
			addClock(this, key);
		});
		li.appendChild(button);
		fragment.appendChild(li);
	});
	ul.replaceChildren(fragment);
}

// City search list

const cityInput = document.getElementById("cityInput");
cityInput.addEventListener("keyup", searchCity);

function searchCity(event) {
	let i, btn, textValue;
	const input = event.target;
	const filter = input.value.toUpperCase(0);
	const ul = document.getElementById("cityList");
	const li = ul.getElementsByTagName("li");
	for (i = 0; i < li.length; i++) {
		btn = li[i].getElementsByTagName("button")[0];
		textValue = btn.textContent.toUpperCase() || btn.innerText.toUpperCase();
		if (textValue.startsWith(filter)) {
			li[i].style.display = "";
		} else {
			li[i].style.display = "none";
		}
	}
}

// city list show hide
const btnOpen = document.getElementById("openCityList");
list = document.getElementById("cityContainer");

btnOpen.addEventListener("click", openCityList);

function openCityList(e) {
	e.stopPropagation();
	const listHeight = "300px";
	if (list.style.height === listHeight) {
		list.style.height = "0";
		btnOpen.children[0].className = "fa fa-plus";
	} else {
		list.style.height = listHeight;
		btnOpen.children[0].className = "fa fa-close";
	}
}

document.addEventListener("click", (e) => {
	list.style.height = 0;
	btnOpen.children[0].className = "fa fa-plus";
});
