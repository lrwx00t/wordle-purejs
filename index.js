"use strict";

let grid = document.getElementById("grid");
let done = false;

function buildGrid() {
  for (let i = 0; i < 6; i++) {
    let row = document.createElement("div");
    for (let j = 0; j < 5; j++) {
      let cell = document.createElement("div");
      cell.className = "cell";
      cell.textContent = "";
      row.appendChild(cell);
    }
    grid.appendChild(row);
  }
}

buildGrid();

let wordList = ["patio", "darts", "piano", "horse"];

let randomIndex = Math.floor(Math.random() * wordList.length);
let secret = wordList[randomIndex];

let attempts = [];
let currentAttempt = "";
let counter = 0;

function handleKeyDown(e) {
  if (done) {
    return;
  }
  console.log(e);
  let letter = e.key.toLowerCase();
  console.log(letter);
  if (letter === "enter") {
    // let than 5, can't add anything
    if (currentAttempt.length < 5) {
      return;
    }
    if (!wordList.includes(currentAttempt)) {
      alert("not available");
      currentAttempt = "";
      return;
    }
    attempts.push(currentAttempt);
    currentAttempt = "";
  } else if (letter === "backspace") {
    currentAttempt = currentAttempt.slice(0, currentAttempt.length - 1);
  } else if (letter === "meta" || letter === "alt") {
    return;
  } else if (/[a-z]/.test(letter)) {
    if (currentAttempt.length < 5) {
      currentAttempt += letter;
    }
  }
  updateGrid();
}

function updateGrid() {
  let row = grid.firstChild;
  let result = false;
  for (let attempt of attempts) {
    drawPastAttempt(row, attempt);
    row = row.nextSibling;
  }
  drawCurrentAttempt(row, currentAttempt);
  if (counter === 0 && done) {
    console.log("I am done here");
    sleep(500).then(() =>
      alert("Congrats! Please refresh to start a new game")
    );
    counter = 100;
  } else {
    console.log("NOT DONE");
  }
}

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function drawPastAttempt(row, attempt) {
  let counter = 0;
  for (let i = 0; i < 5; i++) {
    sleep(100 * i).then(() => {
      let cell = row.children[i];
      if (attempt[i] !== undefined) {
        cell.textContent = attempt[i] ?? "";
      } else {
        cell.innerHTML = '<div style="opacity: 0">X</div>';
      }
      cell.className = "cell cell-flip";
      let bgcolor = getBgColor(attempt, i);
      cell.style.backgroundColor = bgcolor;
      console.log(bgcolor);
      if (bgcolor === "#538d4e") {
        console.log("increment..", counter);
        counter++;
        if (counter === 4) {
          done = true;
          console.log("done is true now..");
          counter = 0;
          updateGrid();
        }
      }
    });
  }
}

function drawCurrentAttempt(row, attempt) {
  for (let i = 0; i < 5; i++) {
    let cell = row.children[i];
    if (attempt[i] !== undefined) {
      cell.textContent = attempt[i];
    } else {
      cell.innerHTML = '<div style="opacity: 0">X</div>';
    }
  }
}

document.addEventListener("keydown", handleKeyDown);

function getBgColor(attempt, i) {
  let correctLetter = secret[i];
  let attemptLetter = attempt[i];
  if (attemptLetter === undefined || secret.indexOf(attemptLetter) === -1) {
    return "darkgrey";
  }
  //green
  if (correctLetter === attemptLetter) {
    return "#538d4e";
  }
  //yellow
  return "#b59f3b";
}
