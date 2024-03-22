"use strict";

const mainNav = document.querySelector(".main-nav-links");
const timerTypes = document.querySelector(".timer-types");
const btnTimerTypes = document.querySelectorAll(".btn--timer");
const sectionPomodoro = document.querySelector(".section-pomodoro");

let activeTimer = document.querySelector(".active-timer");

const labelTimer = document.querySelector(".timer-text");

const btnControl = document.querySelector(".btn--control");
const btnSkip = document.querySelector(".btn--skip");
const btnAddTask = document.querySelector(".btn--add-task");

const settingModal = document.querySelector(".modal-setting");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".modal-close");

let timerId;
let timeLeft = 0;
let timerType = activeTimer.dataset.timer;
let isTimerRunning = false;

const pomodoroSettings = {
    pomodoroDuration: 25 * 60,
    shortBreakDuration: 5 * 60,
    longBreakDuration: 15 * 60,
    longBreakInterval: 2,
    autoStartBreak: false,
    autoStartPomodoro: false,
    audioAlarmSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    audioAlarmRepeat: 0,
    audioAlarmVolume: 50,
};

const backgroundColorMap = {
    pomodoro: "#3282B8",
    shortBreak: "#00818A",
    longBreak: "#0A2647",
};

const countdownTimer = function (duration) {
    timeLeft = duration;
    timerId = setInterval(function () {
        if (timeLeft === 0) {
            finishTimer();
            return;
        }

        timeLeft--;
        const { min, sec } = timeFormatting(timeLeft);
        labelTimer.textContent = `${min}:${sec}`;
    }, 1000);
}

const finishTimer = function () {
    isTimerRunning = false;
    stopTimer();
    gotoNextTimer();
    toggleShowSkipButton();

    if ((pomodoroSettings.autoStartBreak && timerType !== "pomodoro")
        || (pomodoroSettings.autoStartPomodoro && timerType === "pomodoro")) controlTimer();
}

let pomodoroCount = 0;
const gotoNextTimer = function () {
    if (timerType !== "pomodoro") {
        timerType = "pomodoro";
    } else {
        console.log(pomodoroCount, pomodoroSettings.longBreakInterval)
        console.log(pomodoroSettings.longBreakInterval === pomodoroCount);
        if (pomodoroCount === pomodoroSettings.longBreakInterval) {
            timerType = "longBreak";
            pomodoroCount = 0;
        } else {
            pomodoroCount++;
            timerType = "shortBreak";
        }
    }
    changeTimerType();
    setBackgroundColor();
    clearTimer();
}

const changeTimerType = function (activeTimer) {
    if (!activeTimer) activeTimer = document.querySelector(`#${timerType}`);

    btnTimerTypes.forEach(btn => btn.classList.remove("active-timer"));
    activeTimer.classList.add("active-timer");

    timerType = activeTimer.dataset.timer;

    stopTimer();
    changeBtnControlText();
    setBackgroundColor();
}

const clearTimer = function () {
    clearInterval(timerId);
    const duration = setDuration()
    let { min, sec } = timeFormatting(duration);
    labelTimer.textContent = `${min}:${sec}`;
}

const stopTimer = function () {
    clearInterval(timerId);
    timeLeft = 0;
    isTimerRunning = false;
}

const setDuration = function () {
    const durationInMinute = pomodoroSettings[`${timerType}Duration`] || 0
    return durationInMinute; // Return 0 if timerType is not found in the map
};

const setBackgroundColor = function () {
    sectionPomodoro.style.backgroundColor = backgroundColorMap[timerType] || "#FFFFFF"; // Use white as default if timerType is not found in the map
};

const timeFormatting = function (duration) {
    const min = String(Math.floor(duration / 60)).padStart(2, "0");
    const sec = String(duration % 60).padStart(2, "0");

    return { min: min, sec: sec };
}

const changeBtnControlText = function () {
    const content = isTimerRunning ? "pause" : "start";
    btnControl.textContent = content;
};

const toggleShowSkipButton = function () {
    if (isTimerRunning) {
        btnSkip.classList.remove("hidden-btn");
    } else {
        btnSkip.classList.add("hidden-btn");
    }
}

const controlTimer = function () {
    if (isTimerRunning) {
        //pause
        isTimerRunning = false;
        clearInterval(timerId);
    } else {
        isTimerRunning = true;
        const duration = setDuration();
        (timeLeft > 0) ? countdownTimer(timeLeft) : countdownTimer(duration);
    }

    changeBtnControlText();
    toggleShowSkipButton();
}


// * DOM FUNCTION
btnControl.addEventListener("click", controlTimer);

btnSkip.addEventListener("click", function () {
    finishTimer();
    toggleShowSkipButton();
});

mainNav.addEventListener("click", function (e) {
    e.preventDefault();

    const target = e.target.closest(".main-nav-link");
    if (!target) return;

    const id = target.id;
    if (id === "image") {

    } else if (id === "settings") {
        settingModal.classList.remove("hidden");
        settingModal.classList.add("show");
        overlay.classList.remove("hidden");
    } else if (id === "about") {

    }
});

timerTypes.addEventListener("click", function (e) {
    e.preventDefault();

    activeTimer = e.target.closest(".btn--timer");
    if (!activeTimer) return;

    changeTimerType(activeTimer);
    clearTimer();
    toggleShowSkipButton();
});

// MODAL
const closeModal = function () {
    settingModal.classList.add("hidden");
    overlay.classList.add('hidden');
};

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !settingModal.classList.contains('hidden')) {
        closeModal();
    }
});

//DROPDOWN
settingModal.addEventListener("click", function (e) {
    const isDropdownButton = e.target.matches("[data-dropdown-button], [data-dropdown-button] *");
    if (!isDropdownButton && e.target.closest("[data-dropdown]") != null) return;

    let currentDropdown;
    if (isDropdownButton) {
        currentDropdown = e.target.closest("[data-dropdown]")
        currentDropdown.classList.toggle("active")
    }

    document.querySelectorAll("[data-dropdown].active").forEach(dropdown => {
        if (dropdown === currentDropdown) return
        dropdown.classList.remove("active")
    })
})

const selected = document.querySelector(".selected");
const selectedSound = document.querySelector("#selected-sound");
const optionsContainer = document.querySelector(".options-container");

const optionsList = document.querySelectorAll(".option");

selected.addEventListener("click", () => {
    optionsContainer.classList.toggle("active");
});

const closeDropdown = function () {
    optionsContainer.classList.remove("active");
}

optionsList.forEach(option => {

    option.addEventListener("click", () => {
        const newOption = option.querySelector("label").innerHTML; //TODO: pake attribute aja
        selectedSound.innerHTML = newOption;
        optionsContainer.classList.remove("active");
    });
});

// volume
const volumeInput = document.querySelector("#audioAlarmVolume");
const volumeLabel = document.querySelector(".volume-value");
volumeInput.addEventListener("input", function () {
    volumeLabel.textContent = this.value;
})

// * Handling input
const getInputValues = function () {
    const inputNodeList = document.querySelectorAll("input");
    const inputArray = Array.from(inputNodeList);
    const inputObject = inputArray.reduce((acc, input) => {
        if (input.type === "checkbox") {
            acc[input.id] = input.checked;
        } else if (input.type === "radio") {
            if (input.checked) acc[input.name] = input.value;
        } else if (input.type === "number") {
            acc[input.id] = Number(input.value);
        }
        return acc;
    }, {});

    for (const key in inputObject) {
        if (Object.hasOwnProperty.call(inputObject, key)) {
            const value = inputObject[key];
            pomodoroSettings[key] = value;
        }
    }
};

const btnSaveSetting = document.querySelector("#btn-save-setting");
btnSaveSetting.addEventListener("click", function () {
    getInputValues();
    closeModal();
    stopTimer();
    clearTimer();
    changeBtnControlText();
    toggleShowSkipButton();
})