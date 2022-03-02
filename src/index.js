import Clock from "./Clock.js";

const clock = new Clock("Berlin");
clock.state = "NO_EDIT";
const clock2 = new Clock("London");
clock2.state = "EDIT";
const clock3 = new Clock("Tehran");
clock3.state = "NO_EDIT";

const wrapper = document.getElementById("clock-wrapper");

wrapper.appendChild(clock.Draw());
wrapper.appendChild(clock2.Draw());
wrapper.appendChild(clock3.Draw());

const add = document.getElementById("addClock");
add.addEventListener("click", addClock);

function addClock(event) {
  const clock = new Clock("Tehran");
  clock.state = "NO_EDIT";
  wrapper.append(clock.Draw());
}
