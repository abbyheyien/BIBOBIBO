// 漢堡選單切換
const menuToggle = document.querySelector(".menu-toggle");
const navbar = document.querySelector("nav.navbar");

menuToggle.addEventListener("click", () => {
  navbar.classList.toggle("active");
});

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const messageOverlay = document.getElementById("messageOverlay");
const gameOverTitleElement = document.getElementById("gameOverTitle");
const gameOverScoreElement = document.getElementById("gameOverScore");

const upBtn = document.querySelector(".up");
const downBtn = document.querySelector(".down");
const leftBtn = document.querySelector(".left");
const rightBtn = document.querySelector(".right");

// --- 遊戲參數與狀態 ---
const gridSize = 20;
let tileCountX, tileCountY;
let snake, food, dx, dy, score, gameInterval;
let changingDirection = false;
let gameActive = false;
const gameSpeed = 120;

// --- 初始化畫布大小 ---
function setupCanvas() {
  const containerElement = document.querySelector(".game-container");
  if (!containerElement) return;

  const containerWidth = containerElement.offsetWidth - 30;
  let canvasSize = Math.min(containerWidth, 500);

  if (window.innerWidth < 420) {
    canvasSize = Math.min(containerWidth, window.innerWidth * 0.85);
  }

  canvasSize = Math.floor(canvasSize / gridSize) * gridSize;
  canvasSize = Math.max(canvasSize, gridSize * 10);

  canvas.width = canvasSize;
  canvas.height = canvasSize;
  tileCountX = canvas.width / gridSize;
  tileCountY = canvas.height / gridSize;
}

// --- 初始化遊戲變數 ---
function initializeGameVariables() {
  snake = [
    { x: Math.floor(tileCountX / 2), y: Math.floor(tileCountY / 2) },
    { x: Math.floor(tileCountX / 2) - 1, y: Math.floor(tileCountY / 2) },
    { x: Math.floor(tileCountX / 2) - 2, y: Math.floor(tileCountY / 2) },
  ].filter((segment) => segment.x >= 0);

  if (snake.length === 0) {
    snake = [{ x: 0, y: 0 }];
  }

  dx = 1;
  dy = 0;
  score = 0;
  scoreElement.textContent = score;
  placeFood();
  changingDirection = false;
}

// --- 放置食物 ---
function placeFood() {
  if (tileCountX <= 0 || tileCountY <= 0) return;

  let foodOnSnake;
  do {
    foodOnSnake = false;
    food = {
      x: Math.floor(Math.random() * tileCountX),
      y: Math.floor(Math.random() * tileCountY),
    };
    for (const segment of snake) {
      if (segment.x === food.x && segment.y === food.y) {
        foodOnSnake = true;
        break;
      }
    }
  } while (foodOnSnake);
}

// --- 繪製遊戲畫面 ---
function draw() {
  ctx.fillStyle = "#ecf0f1";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? "#27ae60" : "#2ecc71";
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize - 1,
      gridSize - 1
    );
    ctx.strokeStyle = "#bdc3c7";
    ctx.strokeRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize,
      gridSize
    );
  });

  if (food) {
    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(
      food.x * gridSize,
      food.y * gridSize,
      gridSize - 1,
      gridSize - 1
    );
    ctx.strokeStyle = "#bdc3c7";
    ctx.strokeRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
  }
}

// --- 遊戲邏輯更新 ---
function update() {
  if (!gameActive) return;

  changingDirection = false;

  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  if (food && head.x === food.x && head.y === food.y) {
    score++;
    scoreElement.textContent = score;
    placeFood();
  } else {
    snake.pop();
  }

  if (checkCollision()) {
    gameOver();
    return;
  }

  draw();
}

// --- 碰撞檢查 ---
function checkCollision() {
  const head = snake[0];
  if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY)
    return true;

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) return true;
  }

  return false;
}

// --- 遊戲結束處理 ---
function gameOver() {
  gameActive = false;
  clearInterval(gameInterval);
  gameInterval = null;
  gameOverTitleElement.textContent = "遊戲結束！ (Game Over!)";
  gameOverScoreElement.textContent = `您的分數 (Your Score): ${score}`;
  messageOverlay.classList.add("flex");
}

// --- 方向改變函式 ---
function changeDirection(newDx, newDy) {
  if (changingDirection) return;
  if (dx === -newDx && dy === -newDy) return;

  dx = newDx;
  dy = newDy;
  changingDirection = true;
}

// --- 遊戲開始 ---
function startGame() {
  if (gameActive) return;
  setupCanvas();
  initializeGameVariables();
  messageOverlay.classList.remove("flex");
  gameActive = true;
  gameInterval = setInterval(update, gameSpeed);
}

// --- 監聽鍵盤事件 ---
document.addEventListener("keydown", (event) => {
  const keyPressed = event.key;

  if (
    gameActive &&
    ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(keyPressed)
  ) {
    event.preventDefault();
  }

  if (!gameActive) {
    if (
      (keyPressed === " " || keyPressed === "Enter") &&
      !messageOverlay.classList.contains("flex")
    ) {
      startGame();
    }
    return;
  }

  if (
    (keyPressed === "ArrowUp" || keyPressed.toLowerCase() === "w") &&
    dy === 0
  ) {
    changeDirection(0, -1);
  } else if (
    (keyPressed === "ArrowDown" || keyPressed.toLowerCase() === "s") &&
    dy === 0
  ) {
    changeDirection(0, 1);
  } else if (
    (keyPressed === "ArrowLeft" || keyPressed.toLowerCase() === "a") &&
    dx === 0
  ) {
    changeDirection(-1, 0);
  } else if (
    (keyPressed === "ArrowRight" || keyPressed.toLowerCase() === "d") &&
    dx === 0
  ) {
    changeDirection(1, 0);
  }
});

// --- 手機按鈕監聽 ---
upBtn.addEventListener("click", () => {
  if (dy === 0) changeDirection(0, -1);
});
downBtn.addEventListener("click", () => {
  if (dy === 0) changeDirection(0, 1);
});
leftBtn.addEventListener("click", () => {
  if (dx === 0) changeDirection(-1, 0);
});
rightBtn.addEventListener("click", () => {
  if (dx === 0) changeDirection(1, 0);
});

// --- 開始與重新開始按鈕 ---
startButton.addEventListener("click", () => {
  startGame();
});

restartButton.addEventListener("click", () => {
  messageOverlay.classList.remove("flex");
  startGame();
});

// --- 頁面載入時設定畫布大小 ---
window.addEventListener("resize", () => {
  if (!gameActive) setupCanvas();
});

window.addEventListener("load", () => {
  setupCanvas();
  draw();
});
