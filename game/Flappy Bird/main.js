// 漢堡選單切換
const menuToggle = document.querySelector(".menu-toggle");
const navbar = document.querySelector("nav.navbar");

menuToggle.addEventListener("click", () => {
  navbar.classList.toggle("active");
});

// Canvas 基本設定
const CANVAS_WIDTH = 288;
const CANVAS_HEIGHT = 400;

const canvas = document.getElementById("gameCanvas");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const ctx = canvas.getContext("2d");

// 元素抓取
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const scoreDisplay = document.getElementById("score");
const gameOverMessage = document.getElementById("gameOverMessage");
const finalScore = document.getElementById("finalScore");
const closeMessage = document.getElementById("closeMessage");

const rulesButton = document.getElementById("rulesButton");
const rulesOverlay = document.getElementById("rulesOverlay");
const closeRules = document.getElementById("closeRules");

// 規則彈窗開關
rulesButton.addEventListener("click", () => {
  rulesOverlay.style.display = "flex";
});
closeRules.addEventListener("click", () => {
  rulesOverlay.style.display = "none";
});

// 遊戲參數與狀態
const gravity = 0.35;
const birdSize = 30;
const pipeWidth = 50;
const pipeGap = 150;

let bird, pipes, score, animationFrameId, gameRunning, gameOver;

// 初始化或重設遊戲狀態
function resetGame() {
  bird = {
    x: 80,
    y: canvas.height / 2,
    velocity: 0,
    width: birdSize,
    height: birdSize,
  };
  pipes = [];
  score = 0;
  gameOver = false;
  scoreDisplay.textContent = "分數：0";
  gameRunning = false;
}

// 畫小鳥
function drawBird() {
  ctx.fillStyle = "#f1c40f";
  ctx.beginPath();
  ctx.ellipse(
    bird.x,
    bird.y,
    bird.width / 2,
    bird.height / 2,
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();
  ctx.closePath();
}

// 畫水管
function drawPipes() {
  ctx.fillStyle = "#27ae60";
  pipes.forEach((pipe) => {
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
    ctx.fillRect(
      pipe.x,
      pipe.topHeight + pipeGap,
      pipeWidth,
      canvas.height - pipe.topHeight - pipeGap
    );
  });
}

// 更新水管位置與新增新水管
function updatePipes() {
  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
    const topHeight = Math.random() * (canvas.height - pipeGap - 100) + 50;
    pipes.push({ x: canvas.width, topHeight });
  }
  pipes.forEach((pipe) => (pipe.x -= 2));

  if (pipes.length > 0 && pipes[0].x + pipeWidth < 0) {
    pipes.shift();
    score++;
    scoreDisplay.textContent = "分數：" + score;
  }
}

// 碰撞判定
function checkCollision() {
  if (
    bird.y + bird.height / 2 >= canvas.height ||
    bird.y - bird.height / 2 <= 0
  ) {
    return true;
  }

  for (let pipe of pipes) {
    if (
      bird.x + bird.width / 2 > pipe.x &&
      bird.x - bird.width / 2 < pipe.x + pipeWidth &&
      (bird.y - bird.height / 2 < pipe.topHeight ||
        bird.y + bird.height / 2 > pipe.topHeight + pipeGap)
    ) {
      return true;
    }
  }
  return false;
}

// 遊戲主迴圈
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  bird.velocity += gravity;
  bird.y += bird.velocity;

  updatePipes();

  drawPipes();
  drawBird();

  if (checkCollision()) {
    endGame();
    return;
  }

  animationFrameId = requestAnimationFrame(gameLoop);
}

// 開始遊戲
function startGame() {
  if (gameRunning) return;
  resetGame();
  gameRunning = true;
  startButton.style.display = "none";
  restartButton.style.display = "none";
  gameOverMessage.style.display = "none";
  rulesOverlay.style.display = "none";
  gameLoop();
}

// 遊戲結束
function endGame() {
  gameRunning = false;
  gameOver = true;
  cancelAnimationFrame(animationFrameId);
  finalScore.textContent = `你的分數是：${score}`;
  gameOverMessage.style.display = "flex";
  restartButton.style.display = "inline-block";
}

// 小鳥跳躍或重啟
function flap() {
  if (gameOver) {
    startGame();
  } else if (gameRunning) {
    bird.velocity = -8;
  }
}

// 綁定事件
startButton.addEventListener("click", startGame);

restartButton.addEventListener("click", () => {
  gameOverMessage.style.display = "none";
  startGame();
});

closeMessage.addEventListener("click", () => {
  gameOverMessage.style.display = "none";
});

// 空白鍵跳躍
window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    flap();
  }
});

// 點擊畫布跳躍或重啟
canvas.addEventListener("click", flap);

// 觸控跳躍
canvas.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    flap();
  },
  { passive: false }
);

// 初始化遊戲狀態
resetGame();
