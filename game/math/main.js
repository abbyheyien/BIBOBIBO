// 漢堡選單切換
const menuToggle = document.querySelector(".menu-toggle");
const navbar = document.querySelector("nav.navbar");

menuToggle.addEventListener("click", () => {
  navbar.classList.toggle("active");
});

const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");

const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const submitBtn = document.getElementById("submit-btn");

const timerDisplay = document.getElementById("timer-display");
const scoreDisplay = document.getElementById("score-display");
const problemContainer = document.getElementById("problem-container");
const answerInput = document.getElementById("answer-input");
const finalScore = document.getElementById("final-score");
const feedbackMessage = document.getElementById("feedback-message");
const difficultySelect = document.getElementById("difficulty-select");

let score, timeLeft, timerInterval;
let currentProblem = { num1: 0, num2: 0, operator: "+", answer: 0 };
const GAME_DURATION = 60; // 遊戲總時長 (秒)

// 遊戲設定
let difficultySettings = {
  easy: { ops: ["+", "-"], maxNum: 20, multiplyMax: 10, divideMax: 10 },
  medium: { ops: ["+", "-", "*"], maxNum: 50, multiplyMax: 10, divideMax: 10 },
  hard: {
    ops: ["+", "-", "*", "/"],
    maxNum: 100,
    multiplyMax: 12,
    divideMax: 12,
  },
};
let currentDifficulty = "easy";

function generateProblem() {
  const settings = difficultySettings[currentDifficulty];
  const operator =
    settings.ops[Math.floor(Math.random() * settings.ops.length)];
  let num1, num2, answer;

  switch (operator) {
    case "+":
      num1 = Math.floor(Math.random() * settings.maxNum) + 1;
      num2 = Math.floor(Math.random() * settings.maxNum) + 1;
      answer = num1 + num2;
      break;
    case "-":
      num1 = Math.floor(Math.random() * settings.maxNum) + 1;
      num2 = Math.floor(Math.random() * num1) + 1; // 確保 num1 >= num2 避免負數 (可調整)
      answer = num1 - num2;
      break;
    case "*":
      num1 = Math.floor(Math.random() * settings.multiplyMax) + 1;
      num2 =
        Math.floor(Math.random() * settings.multiplyMax) +
        (currentDifficulty === "easy" ? 0 : 1); // 簡單難度乘數可為1
      answer = num1 * num2;
      break;
    case "/":
      // 確保能整除
      answer = Math.floor(Math.random() * settings.divideMax) + 1; // 結果
      num2 = Math.floor(Math.random() * settings.divideMax) + 1; // 除數
      num1 = answer * num2; // 被除數
      break;
  }
  currentProblem = { num1, num2, operator, answer };
  problemContainer.textContent = `${num1} ${operator} ${num2} = ?`;
}

function startGame() {
  currentDifficulty = difficultySelect.value;
  startScreen.style.display = "none";
  endScreen.style.display = "none";
  gameScreen.style.display = "block";

  score = 0;
  timeLeft = GAME_DURATION;
  scoreDisplay.textContent = `分數: ${score}`;
  timerDisplay.textContent = `時間: ${timeLeft}`;
  answerInput.value = "";
  feedbackMessage.textContent = "";
  answerInput.focus();

  generateProblem();

  clearInterval(timerInterval); // 清除之前的計時器
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `時間: ${timeLeft}`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
}

function handleSubmit() {
  if (timeLeft <= 0) return; // 時間到則不處理

  const userAnswer = parseInt(answerInput.value);

  if (isNaN(userAnswer)) {
    feedbackMessage.textContent = "請輸入數字！";
    feedbackMessage.className = "feedback-incorrect";
    return;
  }

  if (userAnswer === currentProblem.answer) {
    score += 10;
    feedbackMessage.textContent = "答對了！";
    feedbackMessage.className = "feedback-correct";
  } else {
    feedbackMessage.textContent = `答錯了，答案是 ${currentProblem.answer}`;
    feedbackMessage.className = "feedback-incorrect";
  }

  scoreDisplay.textContent = `分數: ${score}`;
  answerInput.value = "";
  generateProblem();
  answerInput.focus();

  // 短暫顯示回饋後清除
  setTimeout(() => {
    feedbackMessage.textContent = "";
  }, 1500);
}

function endGame() {
  gameScreen.style.display = "none";
  endScreen.style.display = "block";
  finalScore.textContent = `你的總分是: ${score} 分！`;
}

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", () => {
  // 返回開始畫面讓玩家可以重新選擇難度
  endScreen.style.display = "none";
  startScreen.style.display = "block";
});
submitBtn.addEventListener("click", handleSubmit);
answerInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    handleSubmit();
  }
});
