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

difficultySelect.addEventListener("change", () => {
  difficulty = difficultySelect.value;
});

restartBtn.addEventListener("click", init);

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
      if (marked[i][j]) {
        cell.classList.add(isComputer ? "computer-marked" : "marked");
      }
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

function playerPickNumber(num) {
  if (gameEnded || !isPlayerTurn || calledNumbers.has(num)) return;
  callNumber(num, "玩家");
  isPlayerTurn = false;
  turnIndicator.textContent = "電腦回合，請稍候...";
  setTimeout(() => {
    computerPickNumber();
  }, 1000);
}

function computerPickNumber() {
  if (gameEnded) return;

  let candidates = [];
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      const num = computerBoard[i][j];
      if (!calledNumbers.has(num) && !computerMarked[i][j]) {
        candidates.push({ num, i, j });
      }
    }
  }
  if (candidates.length === 0) return;

  let num = null;

  if (difficulty === "hard") {
    // 透過 evaluateBestMove 選號，兼顧自己贏與阻擋玩家
    num = evaluateBestMove();
  } else {
    // easy 模式隨機選號
    num = candidates[Math.floor(Math.random() * candidates.length)].num;
  }

  callNumber(num, "電腦");
  isPlayerTurn = true;
  if (!gameEnded) turnIndicator.textContent = "玩家回合，請點選你要叫的號碼";
}

// AI 預判策略：綜合計算自己和玩家的贏線分數，選擇最高分號碼
function evaluateBestMove() {
  let candidates = [];
  let scoreMap = new Map();

  // 先找「電腦有且玩家沒有」的號碼，且未叫過
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      const num = computerBoard[i][j];
      if (
        !calledNumbers.has(num) &&
        !computerMarked[i][j] &&
        !playerBoard.flat().includes(num) // 玩家牌沒有這號碼
      ) {
        candidates.push({ num, i, j });
      }
    }
  }

  // 如果沒有找到，代表玩家幾乎擁有所有電腦號碼，才退而求其次用全部未叫號碼(含玩家號碼)
  if (candidates.length === 0) {
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        const num = computerBoard[i][j];
        if (!calledNumbers.has(num) && !computerMarked[i][j]) {
          candidates.push({ num, i, j });
        }
      }
    }
  }

  // 計算每個候選號碼對電腦贏面影響的分數
  for (const { num, i, j } of candidates) {
    // 模擬標記該號碼後，看看有多少行列斜線接近完成
    let score = 0;

    // 計算行、列、斜線標記數，該位置加入後加分
    let tempMarked = computerMarked.map((row) => row.slice());
    tempMarked[i][j] = true;

    // 評估各方向
    const row = tempMarked[i];
    const col = tempMarked.map((r) => r[j]);
    const diag =
      i === j ? [...Array(SIZE).keys()].map((k) => tempMarked[k][k]) : [];
    const anti =
      i + j === SIZE - 1
        ? [...Array(SIZE).keys()].map((k) => tempMarked[k][SIZE - 1 - k])
        : [];

    score += lineScore(row, SIZE);
    score += lineScore(col, SIZE);
    if (diag.length) score += lineScore(diag, SIZE);
    if (anti.length) score += lineScore(anti, SIZE);

    scoreMap.set(num, score);
  }

  // 找分數最高的號碼
  candidates.sort((a, b) => scoreMap.get(b.num) - scoreMap.get(a.num));
  return candidates[0].num;
}

// 計算行、列、斜線的分數函式，數量越多分數越高
function lineScore(markedLine, size) {
  const markedCount = markedLine.filter((v) => v).length;
  if (markedCount === 0) return 0;
  if (markedCount === size) return 1000;
  return markedCount * markedCount;
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
      if (board[i][j] === number) {
        marked[i][j] = true;
      }
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

function findWinningMove(marked, board) {
  for (let i = 0; i < SIZE; i++) {
    const row = marked[i];
    if (row.filter((v) => v).length === SIZE - 1) {
      const empty = row.findIndex((v) => !v);
      if (!calledNumbers.has(board[i][empty])) return [i, empty];
    }

    const col = marked.map((r) => r[i]);
    if (col.filter((v) => v).length === SIZE - 1) {
      const empty = col.findIndex((v) => !v);
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

init();
