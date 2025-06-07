const menuToggle = document.getElementById("menu-toggle");
const navbar = document.getElementById("navbar");
menuToggle.addEventListener("click", () => {
  navbar.classList.toggle("active");
});

const toggleBtn = document.getElementById("toggleInstructionsBtn");
const instructions = document.getElementById("instructions");

toggleBtn.addEventListener("click", () => {
  instructions.classList.toggle("hidden");

  if (instructions.classList.contains("hidden")) {
    toggleBtn.textContent = "遊戲說明";
  } else {
    toggleBtn.textContent = "❌關閉說明";
  }
});

const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");
const messageEl = document.getElementById("message");

const TILE_SIZE = 10;
const PLAYER_COLOR = "#007bff";
const WALL_COLOR = "#343a40";
const EXIT_COLOR = "#28a745";
const PATH_COLOR = "#e9ecef";

let maze = [];
let playerPos = { x: 1, y: 1 };
let gameWon = false;
let currentDifficulty = "easy";

const difficultySettings = {
  easy: { width: 15, height: 15 },
  normal: { width: 25, height: 25 },
  hard: { width: 35, height: 35 },
};

const difficultyButtons = document.querySelectorAll(
  "#difficulty-select button"
);
difficultyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    difficultyButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    currentDifficulty = button.dataset.difficulty;
    resetGame();
  });
});

const retryButton = document.getElementById("retryButton");
retryButton.addEventListener("click", resetGame);

// 迷宮生成演算法（DFS Backtracking）
function generateMaze(width, height) {
  const maze = Array(height)
    .fill(null)
    .map(() => Array(width).fill(1));

  const directions = [
    [0, -2],
    [0, 2],
    [-2, 0],
    [2, 0],
  ];

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function carvePassagesFrom(x, y) {
    maze[y][x] = 0;

    shuffle(directions);
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (
        ny > 0 &&
        ny < height - 1 &&
        nx > 0 &&
        nx < width - 1 &&
        maze[ny][nx] === 1
      ) {
        maze[y + dy / 2][x + dx / 2] = 0;
        carvePassagesFrom(nx, ny);
      }
    }
  }

  carvePassagesFrom(1, 1);

  maze[1][1] = "S";
  maze[height - 2][width - 2] = "E";

  return maze;
}

function initializeGame() {
  const { width, height } = difficultySettings[currentDifficulty];
  maze = generateMaze(width, height);

  canvas.width = width * TILE_SIZE;
  canvas.height = height * TILE_SIZE;

  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      if (maze[y][x] === "S") {
        playerPos = { x, y };
        break;
      }
    }
  }

  gameWon = false;
  messageEl.textContent = "使用方向鍵或 W/A/S/D 移動，找到綠色出口！";

  window.removeEventListener("keydown", handleKeyPress);
  window.addEventListener("keydown", handleKeyPress);

  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      const cell = maze[y][x];
      const rectX = x * TILE_SIZE;
      const rectY = y * TILE_SIZE;

      ctx.fillStyle = PATH_COLOR;
      ctx.fillRect(rectX, rectY, TILE_SIZE, TILE_SIZE);

      if (cell === 1) {
        ctx.fillStyle = WALL_COLOR;
        ctx.fillRect(rectX, rectY, TILE_SIZE, TILE_SIZE);
      } else if (cell === "E") {
        ctx.fillStyle = EXIT_COLOR;
        ctx.fillRect(rectX, rectY, TILE_SIZE, TILE_SIZE);
      }
    }
  }

  ctx.fillStyle = PLAYER_COLOR;
  ctx.beginPath();
  ctx.arc(
    playerPos.x * TILE_SIZE + TILE_SIZE / 2,
    playerPos.y * TILE_SIZE + TILE_SIZE / 2,
    TILE_SIZE / 3,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

function handleKeyPress(event) {
  if (gameWon) return;

  let dx = 0,
    dy = 0;
  switch (event.key) {
    case "ArrowUp":
    case "w":
    case "W":
      dy = -1;
      break;
    case "ArrowDown":
    case "s":
    case "S":
      dy = 1;
      break;
    case "ArrowLeft":
    case "a":
    case "A":
      dx = -1;
      break;
    case "ArrowRight":
    case "d":
    case "D":
      dx = 1;
      break;
    default:
      return;
  }

  event.preventDefault();
  movePlayer(dx, dy);
}

function movePlayer(dx, dy) {
  const newX = playerPos.x + dx;
  const newY = playerPos.y + dy;

  if (
    maze[newY] !== undefined &&
    maze[newY][newX] !== undefined &&
    maze[newY][newX] !== 1
  ) {
    playerPos.x = newX;
    playerPos.y = newY;
    draw();

    if (maze[playerPos.y][playerPos.x] === "E") {
      gameWon = true;
      messageEl.textContent = "恭喜！你成功找到了出口！ 🎉";
      window.removeEventListener("keydown", handleKeyPress);
    }
  }
}

function resetGame() {
  initializeGame();
}

// 手機點擊或觸控移動功能
canvas.addEventListener(
  "touchstart",
  (event) => {
    if (gameWon) return;

    const touch = event.touches[0];

    const rect = canvas.getBoundingClientRect();
    const clickX = touch.clientX - rect.left;
    const clickY = touch.clientY - rect.top;

    const playerCenterX = playerPos.x * TILE_SIZE + TILE_SIZE / 2;
    const playerCenterY = playerPos.y * TILE_SIZE + TILE_SIZE / 2;

    const diffX = clickX - playerCenterX;
    const diffY = clickY - playerCenterY;

    event.preventDefault();

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        movePlayer(1, 0);
      } else {
        movePlayer(-1, 0);
      }
    } else {
      if (diffY > 0) {
        movePlayer(0, 1);
      } else {
        movePlayer(0, -1);
      }
    }
  },
  { passive: false }
);

// 初始化遊戲
resetGame();
