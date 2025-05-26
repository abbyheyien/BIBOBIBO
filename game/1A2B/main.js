// 漢堡選單切換
const menuToggle = document.querySelector(".menu-toggle");
const navbar = document.querySelector("nav.navbar");

menuToggle.addEventListener("click", () => {
  navbar.classList.toggle("active");
});

// --- 遊戲設定 ---
const answer = generateAnswer();
let guessCount = 0;
let isGameOver = false;

// --- DOM 元素 ---
const inputElement = document.getElementById("user-input");
const buttonElement = document.getElementById("guess-button");
const historyElement = document.getElementById("history");
const historyContainer = document.getElementById("history-container");

console.log(`💡 提示 (答案): ${answer.join("")}`); // 在主控台顯示答案，方便測試

// --- 事件監聽 ---
buttonElement.addEventListener("click", handleGuess);
inputElement.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    handleGuess();
  }
});

/**
 * 產生一組 4 個不重複的數字作為答案
 * @returns {string[]} - 答案陣列，例如 ['1', '2', '3', '4']
 */
function generateAnswer() {
  const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  let result = [];
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    result.push(digits.splice(randomIndex, 1)[0]);
  }
  return result;
}

/**
 * 處理猜測邏輯
 */
function handleGuess() {
  if (isGameOver) return;

  const guess = inputElement.value;

  // --- 輸入驗證 ---
  if (!/^\d{4}$/.test(guess) || new Set(guess).size !== 4) {
    alert("請輸入 4 個不重複的數字！");
    return;
  }

  guessCount++;
  let a = 0; // A: 數字對，位置也對
  let b = 0; // B: 數字對，位置不對

  // --- 核心比對邏輯 ---
  for (let i = 0; i < 4; i++) {
    if (guess[i] === answer[i]) {
      a++;
    } else if (answer.includes(guess[i])) {
      b++;
    }
  }

  // --- 顯示結果 ---
  addHistory(guess, a, b);
  inputElement.value = ""; // 清空輸入框

  // --- 判斷勝利 ---
  if (a === 4) {
    alert(
      `🎉 恭喜你猜對了！答案是 ${answer.join(
        ""
      )}。\n你總共猜了 ${guessCount} 次！`
    );
    isGameOver = true;
    buttonElement.textContent = "再玩一場";
    buttonElement.onclick = () => location.reload(); // 點擊按鈕重新載入頁面
  }
}

/**
 * 將猜測結果新增到歷史紀錄中
 * @param {string} guess - 使用者猜的數字
 * @param {number} aCount - A 的數量
 * @param {number} bCount - B 的數量
 */
function addHistory(guess, aCount, bCount) {
  if (historyContainer.style.display === "none") {
    historyContainer.style.display = "block";
  }
  const resultLine = document.createElement("div");
  resultLine.textContent = `#${guessCount}: ${guess} ➡️ ${aCount}A${bCount}B`;
  historyElement.prepend(resultLine); // 將最新結果加到最上面
}
