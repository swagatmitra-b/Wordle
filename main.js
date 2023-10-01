import { Words } from "./words.js";


const gameBox = document.querySelector(".game-box");
const layout = document.querySelector(".layout");
const h2 = document.querySelector(".container h2");
const guide = document.querySelector(".guide");
const playAgain = document.querySelector("h3.again");
const lose = document.querySelector("h3.lose");
const answer = document.querySelector("h3.answer");
const container=document.getElementById('Contai');
var body = document.body;

const how_to_play=document.getElementById("how_to_play");

let actual = Words[Math.floor(Math.random() * Words.length)].toLowerCase();
let cache = new Map();
const crossword = Array.from({ length: 6 }, () =>
  Array.from({ length: 5 }, () => 0)
);
const layoutArray = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
];

h2.onclick = (e) => {
  e.stopPropagation();
  guide.style.display = "block";
  body.style.backgroundColor ="rgb(0, 0,0,0.6)";
  body.style.cursor = "pointer"; 
  layout.style.filter="blur(5px)";
  container.style.filter="blur(5px)";
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".guide")) {
      guide.style.display = "none";
      body.style.backgroundColor = "white";
      layout.style.filter="blur(0)";
      container.style.filter="blur(0px)";
    }
  });
};

playAgain.onclick = () => {
  window.location.reload();
};

crossword.forEach((row, i) => {
  gameBox.innerHTML += `
  <div class="row" id="${i + 1}">
  ${row
    .map(
      () => `
    <input type="text" class="cell" maxlength="1"/>
    `
    )
    .join("")}
  </div>
  `;
});

layoutArray.forEach((row, i) => {
  layout.innerHTML += `
  <div class="layout-row" id="${i + 1}">
  ${row
    .map(
      (_, cellIndex) => `
    <div class="alpha">
      ${String.fromCharCode(97 + i * 10 + cellIndex)}
    </div>
  `
    )
    .join("")}
  </div>
  `;
});

function typer(cell) {
  cell.addEventListener("keyup", (e) => {
    const nextCell = cell.nextElementSibling;
    if (nextCell != null) {
      nextCell.disabled = false;
      nextCell.focus();
    } else {
      if (e.key == "Enter") {
        getWord(cell);
      }
    }
    if (e.key == "Backspace") {
      cell.value = "";
      const prevCell = cell.previousElementSibling;
      if (prevCell !== null) {
        prevCell.focus();
      } else cell.focus();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  console.log(actual);
  const cells = Array.from(document.querySelectorAll("input"));
  cells.forEach((cell, i) => {
    i != 0 ? (cell.disabled = true) : cell.focus();
    typer(cell);
  });
});

function getWord(cell) {
  let word = "";
  const parent = cell.parentElement;
  const nextParent = parent.nextElementSibling;
  const wordChars = Array.from(parent.querySelectorAll("input"));
  wordChars.forEach((letter) => {
    word += letter.value.toLowerCase();
  });

  if (word.length == 5) checkWord(word, wordChars);
  else return;

  if (cache.size == 0) return;
  wordChars.forEach((input) => (input.disabled = true));
  if (!nextParent) {
    lose.style.display = "block";
    playAgain.style.display = "block";
    answer.innerHTML = `The answer was <strong style="color: #FF8C00">${actual}<strong>`;
    return;
  }
  const nextCells = Array.from(nextParent.querySelectorAll("input"));
  nextCells.forEach((cell, i) => {
    i != 0 ? (cell.disabled = true) : (cell.disabled = false);
    cell.focus();
    typer(cell);
  });
}

function checkWord(word, wordChars) {
  if (word == actual) {
    wordChars.forEach((cell) => {
      cell.style.backgroundColor = "#F9EB70";
      cell.disabled = true;
      answer.innerHTML = `You guessed right!`
      answer.style.left = '3.5rem';
      playAgain.style.display = "block";
      cache.clear();
    });
  } else {
    const [target, input] = [[...actual], [...word]];
    greyCells(input, target);
    input.forEach((char, i) => {
      if (char === target[i]) {
        const rightPlaceCells = wordChars.filter((cell) => cell.value === char);
        rightPlaceCells.forEach((cell) => {
          cell.style.backgroundColor = "#7BF970";
        });
      } else {
        const rightCharIndex = target.indexOf(
          char,
          (cache.get(char) || -1) + 1
        );
        cache.set(char, rightCharIndex);
        if (rightCharIndex !== -1) {
          const wrongPlaceCells = wordChars.filter(
            (cell) => cell.value === char
          );
          wrongPlaceCells.forEach((cell) => {
            cell.style.backgroundColor = "#70D4F9";
          });
        }
      }
    });
  }
}

function greyCells(inputArr, target) {
  const filtered = inputArr.filter((char) => !target.includes(char));
  const keyArray = Array.from(document.querySelectorAll(".alpha"));
  for (const char of filtered) {
    for (const letter of keyArray) {
      if (letter.innerText == char) {
        letter.style.backgroundColor = "grey";
      }
    }
  }
}
