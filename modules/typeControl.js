import {
    words
} from './wordList.js';

// Load on window load
window.onload = () => {
    // Setup dark mode
    const mode = localStorage.getItem("darkMode");
    if (mode === "false") {
        toggleDarkMode(true);
    } else {
        toggleDarkMode(false);
    }

    // Setup last score
    var stats = localStorage.getItem("stats")
    stats = stats ? JSON.parse(stats) : undefined;

    if (stats) {
        document.getElementById("wpm").innerText = Math.floor(stats.wpm);
        document.getElementById("mistakes").innerText = Math.floor(stats.mistakes);
    }
}

var darkMode;

const dmtb = document.getElementById("dark-mode-control");
const wordList = document.getElementById("wordlist");
const wordsDiv = document.getElementById("words");
const toType = document.getElementById("toType");
const doneTyping = document.getElementById("doneTyping");
const stats = document.querySelectorAll('[aria-controls]');

function toggleDarkMode(dm) {

    function changeClass(el, modeToChange) {
        el.className = modeToChange;
    }
    let dmel = ""

    switch (dm) {
        case false:
            // Toggle dark mode on
            darkMode = true;
            dmtb.innerHTML = '<i class="fas fa-moon"></i>';

            dmel = document.getElementsByClassName("light");

            while (dmel.length > 0) {
                changeClass(dmel[0], "dark")
            }
            break;

        case true:
            // Toggle dark mode off
            darkMode = false;
            dmtb.innerHTML = '<i class="fas fa-sun"></i>';

            dmel = document.getElementsByClassName("dark");

            while (dmel.length > 0) {
                changeClass(dmel[0], "light")
            }
            break;
    }
}

// Control typing
let wpm = 0;
let mistakes = 0;
let total = 0;
let charsToTypeArr = [];
let charsTyped = [];
let playing = false;
let seconds = 0;

setInterval(() => {
    if (seconds > 60) {
        wordsDiv.remove();
    } else {
        if (playing) return seconds++;
    }
}, 1000);

dmtb.addEventListener("click", (e) => {
    // dodelat dark mode
    var darkMode = localStorage.getItem("darkMode") === "false" ? darkMode = false : darkMode = true;
    localStorage.setItem("darkMode", darkMode ? "false" : "true");
    toggleDarkMode(darkMode);
})

function updateStats(mistakes, total, wpm) {
    localStorage.setItem("stats", JSON.stringify({
        mistakes: mistakes,
        wpm: wpm
    }));
    stats[0].innerText = mistakes;
    stats[1].innerText = total;
}

function countWpm() {
    wpm = (pos / seconds) * 60
    if (!wpm) wpm = 1;
    stats[2].innerText = Math.floor(wpm);
    setTimeout(() => {
        countWpm();
    }, 1000);
}

// Pick random words
let randWords = []

function generateWords() {
    let picked = [];

    for (let index = 0; index < 50; index++) {
        let word = words[Math.floor(Math.random() * words.length)];
        if (word.match(/^[a-zA-Z]+$/)) picked.push(word);
    }

    randWords = picked
    picked = picked.join(" ").split("");

    charsToTypeArr.push(picked);
}

generateWords();

// Display typed words to uswer
function displayWords(charsToTypeArr, charsTyped) {
    // Display chars that has been typed
    doneTyping.innerText = charsTyped.join("")

    // Display chars that user need to type
    toType.innerText = charsToTypeArr[0].join("")
}


displayWords(charsToTypeArr, charsTyped);

// Work with user input

let pos = 0
let char = 0

document.addEventListener("keydown", (key) => {
    if ((key.key.match(/^[a-zA-Z]+$/) && key.key.length == 1) || key.key == " ") {

        if (playing == false) {
            playing = true;
            countWpm();
            console.log('playing');
        }

        if (randWords[pos].split("")[char]) {
            if (key.key == randWords[pos].split("")[char]) {
                char++
                charsTyped.push(key.key)
                charsToTypeArr[0].shift();
                displayWords(charsToTypeArr, charsTyped);


            } else {
                mistakes++
            }
        } else {
            if (key.key == " ") {
                char = 0
                pos++
                charsTyped.push(key.key)
                charsToTypeArr[0].shift();
                displayWords(charsToTypeArr, charsTyped);
            } else {
                mistakes++
            }
        }
    }
})



setInterval(() => {
    if (playing) {
        updateStats(mistakes, pos, wpm);
    }
}, 1000);