const menuToggle = document.getElementById("menu-toggle");
const navbar = document.getElementById("navbar");
menuToggle.addEventListener("click", () => {
  navbar.classList.toggle("active");
});

const SIZE = 5;
const MAX_NUMBER = 75;

let playerBoard, computerBoard;
let playerMarked, computerMarked;
let calledNumbers = new Set();
let isPlayerTurn = true;
let gameEnded = false;
let difficulty = "easy";
let winCount = 0;
let loseCount = 0;

const playerBoardDiv = document.getElementById("player-board");
const computerBoardDiv = document.getElementById("computer-board");
const turnIndicator = document.getElementById("turn-indicator");
const messageDiv = document.getElementById("message");
const restartBtn = document.getElementById("restart-btn");
const difficultySelect = document.getElementById("difficulty");
const winCounter = document.getElementById("win-count");
const loseCounter = document.getElementById("lose-count");

function generateBoard() {
  let nums = [];
  while (nums.length < SIZE * SIZE) {
    let n = Math.floor(Math.random() * MAX_NUMBER) + 1;
    if (!nums.includes(n)) nums.push(n);
  }
  let board = [];
  let idx = 0;
  for (let i = 0; i < SIZE; i++) {
    let row = [];
    for (let j = 0; j < SIZE; j++) {
      row.push(nums[idx++]);
    }
    board.push(row);
  }
  return board;
}

function init() {
  playerBoard = generateBoard();
  computerBoard = generateBoard();
  playerMarked = Array(SIZE)
    .fill(0)
    .map(() => Array(SIZE).fill(false));
  computerMarked = Array(SIZE)
    .fill(0)
    .map(() => Array(SIZE).fill(false));
  calledNumbers.clear();
  isPlayerTurn = true;
  gameEnded = false;
  messageDiv.textContent = "";
  turnIndicator.textContent = "玩家回合，請點選你要叫的號碼";
  restartBtn.style.display = "none";
  renderBoards();
  updateScore();
}

difficultySelect.addEventListener("change", () => {
  difficulty = difficultySelect.value;
});

function renderBoards() {
  renderBoard(playerBoardDiv, playerBoard, playerMarked, false);
  renderBoard(computerBoardDiv, computerBoard, computerMarked, true);
}

function renderBoard(container, board, marked, isComputer) {
  container.innerHTML = "";
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.textContent = board[i][j];
      if (marked[i][j])
        cell.classList.add(isComputer ? "computer-marked" : "marked");

      if (!isComputer && !marked[i][j] && !gameEnded) {
        cell.style.cursor = "pointer";
        cell.addEventListener("click", () => playerPickNumber(board[i][j]));
      } else {
        cell.style.cursor = "default";
      }

      container.appendChild(cell);
    }
  }
}

// ★ 新增：玩家點號碼觸發函式
function playerPickNumber(num) {
  if (gameEnded) return;
  if (!isPlayerTurn) return;
  if (calledNumbers.has(num)) return;

  callNumber(num, "玩家");
  isPlayerTurn = false;
  turnIndicator.textContent = "電腦回合，請稍候...";
  setTimeout(() => {
    computerPickNumber();
  }, 1000);
}

function computerPickNumber() {
  if (gameEnded) return;
  let num;

  if (difficulty === "hard") {
    const winningMove = findWinningMove(computerMarked, computerBoard);
    if (winningMove) {
      num = computerBoard[winningMove[0]][winningMove[1]];
    } else {
      const blockMove = findWinningMove(playerMarked, playerBoard);
      if (blockMove) {
        num = playerBoard[blockMove[0]][blockMove[1]];
      } else {
        let candidates = [];
        for (let i = 0; i < SIZE; i++) {
          for (let j = 0; j < SIZE; j++) {
            let candidateNum = computerBoard[i][j];
            if (!calledNumbers.has(candidateNum) && !computerMarked[i][j]) {
              candidates.push(candidateNum);
            }
          }
        }
        if (candidates.length === 0) return;
        num = candidates[Math.floor(Math.random() * candidates.length)];
      }
    }
  } else {
    let candidates = [];
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        let candidateNum = computerBoard[i][j];
        if (!calledNumbers.has(candidateNum) && !computerMarked[i][j]) {
          candidates.push(candidateNum);
        }
      }
    }
    if (candidates.length === 0) return;
    num = candidates[Math.floor(Math.random() * candidates.length)];
  }

  callNumber(num, "電腦");
  isPlayerTurn = true;
  if (!gameEnded) turnIndicator.textContent = "玩家回合，請點選你要叫的號碼";
}

function callNumber(num, caller) {
  calledNumbers.add(num);
  markNumber(playerBoard, playerMarked, num);
  markNumber(computerBoard, computerMarked, num);
  renderBoards();
  messageDiv.textContent = `${caller} 叫了號碼：${num}`;

  if (checkBingo(playerMarked)) {
    messageDiv.textContent = "玩家獲勝！";
    winCount++;
    endGame();
  } else if (checkBingo(computerMarked)) {
    messageDiv.textContent = "電腦獲勝！";
    loseCount++;
    endGame();
  }
}

function markNumber(board, marked, number) {
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      if (board[i][j] === number) marked[i][j] = true;
    }
  }
}

function checkBingo(marked) {
  let count = 0;
  for (let i = 0; i < SIZE; i++) {
    if (marked[i].every((v) => v)) count++;
    if (marked.map((row) => row[i]).every((v) => v)) count++;
  }
  if ([...Array(SIZE).keys()].every((i) => marked[i][i])) count++;
  if ([...Array(SIZE).keys()].every((i) => marked[i][SIZE - 1 - i])) count++;
  return count >= 3;
}

function endGame() {
  gameEnded = true;
  turnIndicator.textContent = "";
  restartBtn.style.display = "block";
  updateScore();
}

function updateScore() {
  winCounter.textContent = winCount;
  loseCounter.textContent = loseCount;
}

restartBtn.addEventListener("click", init);

function getSmartMove(board, selfMarked, opponentMarked) {
  let move = findWinningMove(selfMarked, board);
  if (move) return move;
  move = findWinningMove(opponentMarked, board);
  if (move) return move;

  const center = Math.floor(SIZE / 2);
  if (!selfMarked[center][center] && !opponentMarked[center][center])
    return [center, center];

  const corners = [
    [0, 0],
    [0, SIZE - 1],
    [SIZE - 1, 0],
    [SIZE - 1, SIZE - 1],
  ];
  for (let [r, c] of corners) {
    if (!selfMarked[r][c] && !opponentMarked[r][c]) return [r, c];
  }

  let available = [];
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      if (!selfMarked[i][j] && !opponentMarked[i][j]) available.push([i, j]);
    }
  }
  return available[Math.floor(Math.random() * available.length)];
}

function findWinningMove(marked, board) {
  for (let i = 0; i < SIZE; i++) {
    let row = marked[i];
    if (row.filter((v) => v).length === SIZE - 1) {
      let empty = row.findIndex((v) => !v);
      if (!calledNumbers.has(board[i][empty])) return [i, empty];
    }
    let col = marked.map((r) => r[i]);
    if (col.filter((v) => v).length === SIZE - 1) {
      let empty = col.findIndex((v) => !v);
      if (!calledNumbers.has(board[empty][i])) return [empty, i];
    }
  }
  let diag = [...Array(SIZE)].map((_, i) => marked[i][i]);
  if (diag.filter((v) => v).length === SIZE - 1) {
    let empty = diag.findIndex((v) => !v);
    if (!calledNumbers.has(board[empty][empty])) return [empty, empty];
  }
  let anti = [...Array(SIZE)].map((_, i) => marked[i][SIZE - 1 - i]);
  if (anti.filter((v) => v).length === SIZE - 1) {
    let empty = anti.findIndex((v) => !v);
    if (!calledNumbers.has(board[empty][SIZE - 1 - empty]))
      return [empty, SIZE - 1 - empty];
  }
  return null;
}

init();
