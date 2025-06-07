// 漢堡選單切換
const menuToggle = document.querySelector(".menu-toggle");
const navbar = document.querySelector("nav.navbar");

menuToggle.addEventListener("click", () => {
  navbar.classList.toggle("active");
});

const cells = document.querySelectorAll("[data-cell]");
const board = document.getElementById("board");
const statusDisplay = document.getElementById("status");
const restartButton = document.getElementById("restartButton");
const X_CLASS = "x";
const O_CLASS = "o";
let oTurn;

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

startGame();

restartButton.addEventListener("click", startGame);

function startGame() {
  oTurn = false;
  cells.forEach((cell) => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(O_CLASS);
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
  });
  setBoardHoverClass();
  statusDisplay.innerText = `輪到 X`;
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = oTurn ? O_CLASS : X_CLASS;
  placeMark(cell, currentClass);
  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
    statusDisplay.innerText = `輪到 ${oTurn ? "O" : "X"}`;
  }
}

function endGame(draw) {
  if (draw) {
    statusDisplay.innerText = "平手！";
  } else {
    statusDisplay.innerText = `${oTurn ? "O" : "X"} 獲勝！`;
  }
  cells.forEach((cell) => {
    cell.removeEventListener("click", handleClick);
  });
}

function isDraw() {
  return [...cells].every((cell) => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
  });
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

function swapTurns() {
  oTurn = !oTurn;
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(O_CLASS);
  // 這部分在目前的 CSS 中沒有作用，但可以保留以便未來擴充懸停樣式
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some((combination) => {
    return combination.every((index) => {
      return cells[index].classList.contains(currentClass);
    });
  });
}
