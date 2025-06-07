// === 漢堡選單切換 ===
const menuToggle = document.querySelector(".menu-toggle");
const navbar = document.querySelector("nav.navbar");

menuToggle.addEventListener("click", () => {
  navbar.classList.toggle("active");
});

// === DOM 元素 ===
const timerElement = document.getElementById("timer");
const scoreElement = document.getElementById("score-display");
const questionNumberElement = document.getElementById("question-number");

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const endScreen = document.getElementById("end-screen");

const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");

const difficultySelect = document.getElementById("difficulty-select");

const questionCounter = document.getElementById("question-counter");
const scoreDisplay = document.getElementById("score-display");
const timerBar = document.getElementById("timer-bar");
const questionText = document.getElementById("question-text");
const answerOptions = document.getElementById("answer-options");
const finalScore = document.getElementById("final-score");

const questionBank = [
  // --- 簡單（10題）---
  {
    question: "台灣最高的山是哪一座？",
    difficulty: "簡單",
    answers: [
      { text: "雪山", correct: false },
      { text: "玉山", correct: true },
      { text: "合歡山", correct: false },
      { text: "大霸尖山", correct: false },
    ],
  },
  {
    question: "在太陽系中，哪顆行星的體積最大？",
    difficulty: "簡單",
    answers: [
      { text: "地球", correct: false },
      { text: "土星", correct: false },
      { text: "木星", correct: true },
      { text: "海王星", correct: false },
    ],
  },
  {
    question: "化學元素週期表中，『H』代表什麼元素？",
    difficulty: "簡單",
    answers: [
      { text: "氦", correct: false },
      { text: "氫", correct: true },
      { text: "鐵", correct: false },
      { text: "氧", correct: false },
    ],
  },
  {
    question: "電腦中的『CPU』是什麼？",
    difficulty: "簡單",
    answers: [
      { text: "中央處理器", correct: true },
      { text: "記憶體", correct: false },
      { text: "顯示卡", correct: false },
      { text: "主機板", correct: false },
    ],
  },
  {
    question: "水的沸點是幾度？",
    difficulty: "簡單",
    answers: [
      { text: "100°C", correct: true },
      { text: "90°C", correct: false },
      { text: "80°C", correct: false },
      { text: "70°C", correct: false },
    ],
  },
  {
    question: "人體有幾個肺葉？",
    difficulty: "簡單",
    answers: [
      { text: "3個", correct: false },
      { text: "5個", correct: true },
      { text: "4個", correct: false },
      { text: "6個", correct: false },
    ],
  },
  {
    question: "哪個國家是足球世界盃的發源地？",
    difficulty: "簡單",
    answers: [
      { text: "英格蘭", correct: true },
      { text: "巴西", correct: false },
      { text: "德國", correct: false },
      { text: "阿根廷", correct: false },
    ],
  },
  {
    question: "什麼動物被稱為『沙漠之舟』？",
    difficulty: "簡單",
    answers: [
      { text: "駱駝", correct: true },
      { text: "蛇", correct: false },
      { text: "沙鼠", correct: false },
      { text: "狐狸", correct: false },
    ],
  },
  {
    question: "地球繞太陽一圈需要多少時間？",
    difficulty: "簡單",
    answers: [
      { text: "365天", correct: true },
      { text: "24小時", correct: false },
      { text: "30天", correct: false },
      { text: "1小時", correct: false },
    ],
  },
  {
    question: "國旗上有星星的是哪個國家？",
    difficulty: "簡單",
    answers: [
      { text: "美國", correct: true },
      { text: "加拿大", correct: false },
      { text: "日本", correct: false },
      { text: "英國", correct: false },
    ],
  },

  // --- 普通（10題）---
  {
    question: "名畫《蒙娜麗莎》的作者是誰？",
    difficulty: "普通",
    answers: [
      { text: "米開朗基羅", correct: false },
      { text: "梵谷", correct: false },
      { text: "畢卡索", correct: false },
      { text: "達文西", correct: true },
    ],
  },
  {
    question: "台灣的「護國神山」通常指的是哪家企業？",
    difficulty: "普通",
    answers: [
      { text: "鴻海", correct: false },
      { text: "台積電", correct: true },
      { text: "聯發科", correct: false },
      { text: "中華電信", correct: false },
    ],
  },
  {
    question: "世界上最長的河流是哪一條？",
    difficulty: "普通",
    answers: [
      { text: "尼羅河", correct: true },
      { text: "亞馬遜河", correct: false },
      { text: "長江", correct: false },
      { text: "密西西比河", correct: false },
    ],
  },
  {
    question: "哪座城市有「美食之都」稱號？",
    difficulty: "普通",
    answers: [
      { text: "台北", correct: false },
      { text: "台中", correct: false },
      { text: "高雄", correct: false },
      { text: "台南", correct: true },
    ],
  },
  {
    question: "以下哪一種語言是程式語言？",
    difficulty: "普通",
    answers: [
      { text: "Python", correct: true },
      { text: "西班牙語", correct: false },
      { text: "法語", correct: false },
      { text: "中文", correct: false },
    ],
  },
  {
    question: "太陽系中最靠近太陽的行星是？",
    difficulty: "普通",
    answers: [
      { text: "水星", correct: true },
      { text: "金星", correct: false },
      { text: "地球", correct: false },
      { text: "火星", correct: false },
    ],
  },
  {
    question: "國際單位制中，溫度的基本單位是？",
    difficulty: "普通",
    answers: [
      { text: "攝氏度", correct: false },
      { text: "華氏度", correct: false },
      { text: "開爾文", correct: true },
      { text: "蘭氏度", correct: false },
    ],
  },
  {
    question: "地球上最大的熱帶雨林是？",
    difficulty: "普通",
    answers: [
      { text: "亞馬遜雨林", correct: true },
      { text: "剛果雨林", correct: false },
      { text: "東南亞雨林", correct: false },
      { text: "澳洲雨林", correct: false },
    ],
  },
  {
    question: "人體內負責輸送氧氣的細胞是？",
    difficulty: "普通",
    answers: [
      { text: "紅血球", correct: true },
      { text: "白血球", correct: false },
      { text: "血小板", correct: false },
      { text: "神經細胞", correct: false },
    ],
  },
  {
    question: "以下哪種樂器是弦樂器？",
    difficulty: "普通",
    answers: [
      { text: "小提琴", correct: true },
      { text: "長笛", correct: false },
      { text: "鼓", correct: false },
      { text: "喇叭", correct: false },
    ],
  },

  // --- 困難（10題）---
  {
    question: "台北101大樓的觀景台位於幾樓？",
    difficulty: "困難",
    answers: [
      { text: "91樓", correct: false },
      { text: "101樓", correct: false },
      { text: "89樓", correct: true },
      { text: "99樓", correct: false },
    ],
  },
  {
    question: "莎士比亞的《哈姆雷特》是哪國故事？",
    difficulty: "困難",
    answers: [
      { text: "英國", correct: false },
      { text: "丹麥", correct: true },
      { text: "法國", correct: false },
      { text: "義大利", correct: false },
    ],
  },
  {
    question: "愛因斯坦提出的相對論包含哪兩部分？",
    difficulty: "困難",
    answers: [
      { text: "狹義與廣義相對論", correct: true },
      { text: "量子力學與熱力學", correct: false },
      { text: "經濟學與心理學", correct: false },
      { text: "生物學與化學", correct: false },
    ],
  },
  {
    question: "以下哪種元素不是金屬？",
    difficulty: "困難",
    answers: [
      { text: "鐵", correct: false },
      { text: "鋁", correct: false },
      { text: "氯", correct: true },
      { text: "銅", correct: false },
    ],
  },
  {
    question: "北極光主要是由什麼造成的？",
    difficulty: "困難",
    answers: [
      { text: "太陽風與地球磁場作用", correct: true },
      { text: "火山爆發", correct: false },
      { text: "地震", correct: false },
      { text: "大氣污染", correct: false },
    ],
  },
  {
    question: "電腦網路中的『IP』代表？",
    difficulty: "困難",
    answers: [
      { text: "Internet Protocol", correct: true },
      { text: "Input Process", correct: false },
      { text: "Internal Program", correct: false },
      { text: "Intelligent Processor", correct: false },
    ],
  },
  {
    question: "二進位的1010等於十進位多少？",
    difficulty: "困難",
    answers: [
      { text: "10", correct: true },
      { text: "12", correct: false },
      { text: "8", correct: false },
      { text: "15", correct: false },
    ],
  },
  {
    question: "哪一種天文現象是恆星爆炸？",
    difficulty: "困難",
    answers: [
      { text: "超新星", correct: true },
      { text: "黑洞", correct: false },
      { text: "流星雨", correct: false },
      { text: "彗星", correct: false },
    ],
  },
  {
    question: "電子的電荷量是多少？",
    difficulty: "困難",
    answers: [
      { text: "-1.6×10^-19 庫侖", correct: true },
      { text: "0", correct: false },
      { text: "+1.6×10^-19 庫侖", correct: false },
      { text: "-9.1×10^-31 公斤", correct: false },
    ],
  },
  {
    question: "在資料庫中，SQL是什麼的縮寫？",
    difficulty: "困難",
    answers: [
      { text: "Structured Query Language", correct: true },
      { text: "Simple Query List", correct: false },
      { text: "System Quality Level", correct: false },
      { text: "Standard Query Logic", correct: false },
    ],
  },
];

// === 遊戲邏輯變數 ===
let shuffledQuestions, currentQuestionIndex;
let score, timerInterval, timeLeft;
const TIME_LIMIT = 10;

// === 初始化遊戲 ===
function startGame() {
  startScreen.style.display = "none";
  endScreen.style.display = "none";
  quizScreen.style.display = "block";

  const selectedDifficulty = difficultySelect.value;

  shuffledQuestions = questionBank
    .filter((q) => q.difficulty === selectedDifficulty)
    .sort(() => Math.random() - 0.5);

  currentQuestionIndex = 0;
  score = 0;
  updateScore(score);

  showNextQuestion();
}

// === 顯示下一題 ===
function showNextQuestion() {
  if (currentQuestionIndex >= shuffledQuestions.length) {
    endGame();
    return;
  }

  resetState();
  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  updateQuestionNumber(currentQuestionIndex + 1, shuffledQuestions.length);
  questionText.textContent = currentQuestion.question;

  const answers = currentQuestion.answers.sort(() => Math.random() - 0.5);
  answers.forEach((answer) => {
    const button = document.createElement("button");
    button.textContent = answer.text;
    button.classList.add("answer-btn");
    button.dataset.correct = answer.correct;
    button.addEventListener("click", selectAnswer);
    answerOptions.appendChild(button);
  });

  startTimer();
}

// === 清除上一題狀態 ===
function resetState() {
  clearTimeout(timerInterval);
  timerBar.style.transition = "none";
  timerBar.style.width = "100%";

  while (answerOptions.firstChild) {
    answerOptions.removeChild(answerOptions.firstChild);
  }
}

// === 倒數計時 ===
function startTimer() {
  timeLeft = TIME_LIMIT;
  updateTimerDisplay(timeLeft);

  setTimeout(() => {
    timerBar.style.transition = `width ${TIME_LIMIT}s linear`;
    timerBar.style.width = "0%";
  }, 50);

  const tick = () => {
    timeLeft--;
    updateTimerDisplay(timeLeft);
    if (timeLeft <= 0) {
      handleAnswer(false);
    } else {
      timerInterval = setTimeout(tick, 1000);
    }
  };

  timerInterval = setTimeout(tick, 1000);
}

// === 處理選擇答案 ===
function selectAnswer(e) {
  clearTimeout(timerInterval);
  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === "true";
  handleAnswer(isCorrect, selectedBtn);
}

// === 答案處理 + 顯示正確答案 ===
function handleAnswer(isCorrect, selectedBtn = null) {
  if (isCorrect) {
    score += 10;
    updateScore(score);
    if (selectedBtn) selectedBtn.classList.add("correct");
  } else {
    if (selectedBtn) selectedBtn.classList.add("incorrect");
  }

  Array.from(answerOptions.children).forEach((btn) => {
    if (btn.dataset.correct === "true") btn.classList.add("correct");
    btn.disabled = true;
  });

  currentQuestionIndex++;
  setTimeout(showNextQuestion, 1500);
}

// === 遊戲結束 ===
function endGame() {
  quizScreen.style.display = "none";
  endScreen.style.display = "block";
  finalScore.textContent = `你的總分是: ${score} 分`;
}

// === 更新 UI 顯示 ===
function updateTimerDisplay(time) {
  timerElement.textContent = `倒數：${time} 秒`;
}

function updateScore(score) {
  scoreElement.textContent = `分數: ${score}`;
}

function updateQuestionNumber(current, total) {
  questionNumberElement.textContent = `題目 ${current} / ${total}`;
}

// === 綁定按鈕事件 ===
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);
