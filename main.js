import { Words } from "./words";

const gameBox = document.querySelector(".game-box"); 
const layout = document.querySelector(".layout");
const h2 = document.querySelector(".container h2");
const guide = document.querySelector(".guide");
document.querySelector("#cross").onclick = () => {
  guide.style.display = "none";
};
let actual = Words[Math.floor(Math.random() * Words.length)].toLowerCase();
let cache = new Map();
const crossword = Array.from({ length: 6 }, () =>
  Array.from({ length: 3 }, () => 0)
);
const layoutArray = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
];

h2.onclick = () => {
  guide.style.display = "block";
  document.querySelector("#app").style.opacity = 1;
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
    i != 0 ? (cell.disabled = true) : null;
    typer(cell);
  });
});

function getWord(cell) {
  let word = "";
  const parent = cell.parentElement;
  const nextParent = parent.nextElementSibling;
  const wordChars = Array.from(parent.querySelectorAll("input"));
  wordChars.forEach((letter) => {
    word += letter.value;
  });

  if (word.length == 5) checkWord(word, wordChars);
  else return;

  if (cache.size == 0) return;
  const nextCells = Array.from(nextParent.querySelectorAll("input"));
  wordChars.forEach((input) => (input.disabled = true));
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
      cache.clear();
    });
  } else {
    const [target, input] = [[...actual], [...word]];
    const similar = target.filter((char) => input.includes(char));
    greyCells(input, target);
    console.log(target, similar, input);
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
