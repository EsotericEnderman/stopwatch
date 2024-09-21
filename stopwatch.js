const timerElement = document.querySelector("p.js-time");

let timer = JSON.parse(localStorage.getItem("timer")) ?? 0;
let startTime = timer ? Date.now() - timer : null;

const numberFormat = new Intl.NumberFormat("en-GB", { minimumIntegerDigits: 3 })
	.format;

updateTimerElement();

let buttonState = localStorage.getItem("buttonState");

const goButton = document.querySelector("button.js-go-button");
goButton.addEventListener("click", handleGoButtonClick);

let interval;

if (timer && buttonState !== "Go") handleGoButtonClick();

const addLapButton = document.querySelector("button.js-add-lap-button");
const lapList = document.querySelector("ol.js-lap-list");

addLapButton.addEventListener("click", addLap);

const resetButton = document.querySelector("button.js-reset-button");

document.body.addEventListener("keydown", (event) => {
	switch (event.key) {
		case "g":
			if (buttonState === "Go") handleGoButtonClick();
			break;
		case "s":
			if (buttonState === "Stop") handleGoButtonClick();
			break;
		case "a":
			addLap();
			break;
		case "Backspace":
			showResetConfirmation();
			break;
		case "r":
			showResetConfirmation();
			break;
		case "y":
			document.querySelector("button.js-yes-button") &&
				(clearConfirmation() || resetTimer());
			break;
		case "n":
			document.querySelector("button.js-no-button") && clearConfirmation();
			break;
	}
});

resetButton.addEventListener("click", showResetConfirmation);

const confirmationContainer = document.querySelector(
	"div.js-confirmation-container",
);

function handleGoButtonClick() {
	if (goButton.innerHTML === "Go (G)") {
		startTime = Date.now() - timer;

		interval = setInterval(updateTimerElement, 0);

		goButton.innerHTML = "Stop (S)";
		localStorage.setItem("buttonState", "Stop");
		buttonState = "Stop";
	} else {
		clearInterval(interval);
		interval = null;

		goButton.innerHTML = "Go (G)";
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

	return `${h ? `${h}h ` : ""}${m || h ? `${m}m ` : ""}${s || m || h ? `${s}s ` : ""}${numberFormat(ms)}ms`;
}

function updateTimerElement() {
	timerElement.innerHTML = formatTime();
}

function addLap() {
	lapList.innerHTML += `<li class="lap-item">${formatTime(timer)}</li>`;
}

function resetTimer() {
	clearInterval(interval);
	interval = null;

	startTime = null;
	timer = 0;

	updateTimerElement();
	if (buttonState === "Stop") handleGoButtonClick();
	lapList.innerHTML = "";
}

function showResetConfirmation() {
	confirmationContainer.innerHTML = `

	<div>Are you sure you want to reset the timer?</div>
	<button class="yes-button js-yes-button">Yes (Y)</button>
	<button class="no-button js-no-button">No (N)</button>

	`;

	const noButton = document.querySelector("button.js-no-button");

	noButton.addEventListener("click", clearConfirmation);

	const yesButton = document.querySelector("button.js-yes-button");

	yesButton.addEventListener("click", () => {
		clearConfirmation();

		resetTimer();
	});
}

function clearConfirmation() {
	confirmationContainer.innerHTML = "";
}
