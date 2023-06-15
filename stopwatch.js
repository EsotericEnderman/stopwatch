// @ts-nocheck
/* eslint-disable no-use-before-define */
/* eslint-disable func-style */
const timerElement = document.querySelector("p.js-time");

let timer = JSON.parse(localStorage.getItem("timer")) ?? 0;
let startTime = timer ? Date.now() - timer : null;

const numberFormat = new Intl.NumberFormat("en-GB", {minimumIntegerDigits: 3})
	.format;

updateTimerElement();

let buttonState = localStorage.getItem("buttonState");

const goButton = document.querySelector("button.js-go-button");
goButton.addEventListener("click", handleGoButtonClick);

let interval;

if (timer && buttonState !== "Go") handleGoButtonClick();

const addLapButton = document.querySelector("button.js-add-lap-button");
const lapList = document.querySelector("ol.js-lap-list");

addLapButton.addEventListener("click", () => {
	lapList.innerHTML += `<li class="lap-item">${formatTime(timer)}</li>`;
});

const resetButton = document.querySelector("button.js-reset-button");

resetButton.addEventListener("click", () => {
	clearInterval(interval);
	interval = null;

	startTime = null;
	timer = 0;

	updateTimerElement();
	if (buttonState === "Stop") handleGoButtonClick();
	lapList.innerHTML = "";
});

function handleGoButtonClick() {
	if (goButton.innerHTML === "Go") {
		startTime = Date.now() - timer;

		interval = setInterval(updateTimerElement, 0);

		goButton.innerHTML = "Stop";
		localStorage.setItem("buttonState", "Stop");
		buttonState = "Stop";
	} else {
		clearInterval(interval);
		interval = null;

		goButton.innerHTML = "Go";
		localStorage.setItem("buttonState", "Go");
		buttonState = "Go";
	}
}

/**
 * Formats a number of milliseconds into hours, minutes, seconds and milliseconds.
 * @param {Number?} time The time to format. If none is specified, then the timer time will be used.
 * @returns {String} The formatted time in hours, minutes, seconds and milliseconds.
 */
function formatTime(time) {
	let ms = time ?? (startTime ? Date.now() - startTime : 0);

	timer = ms;
	localStorage.setItem("timer", JSON.stringify(timer));

	let s = ms / 1000;
	ms = Math.floor(ms % 1000);
	let m = s / 60;
	s = Math.floor(s % 60);
	const h = Math.floor(m / 60);
	m = Math.floor(m % 60);

	return `${h ? `${h}h ` : ""}${m || h ? `${m}m ` : ""}${
		s || m || h ? `${s}s ` : ""
	}${numberFormat(ms)}ms`;
}

function updateTimerElement() {
	timerElement.innerHTML = formatTime();
}
