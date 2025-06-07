// 漢堡選單切換
const menuToggle = document.querySelector(".menu-toggle");
const navbar = document.querySelector("nav.navbar");

menuToggle.addEventListener("click", () => {
  navbar.classList.toggle("active");
});

// 產生4個不重複數字字串
function generateAnswer() {
  const digits = [];
  while (digits.length < 4) {
    const n = Math.floor(Math.random() * 10);
    if (!digits.includes(n)) digits.push(n);
  }
  return digits.join("");
}

// 計算A和B
function calculateAB(answer, guess) {
  let A = 0;
  let B = 0;
  for (let i = 0; i < 4; i++) {
    if (guess[i] === answer[i]) {
      A++;
    } else if (answer.includes(guess[i])) {
      B++;
    }
  }
  return { A, B };
}

document.addEventListener("DOMContentLoaded", () => {
  const answer = generateAnswer();
  console.log("電腦答案（除錯用）:", answer);

  const guessButton = document.getElementById("guess-button");
  const userInput = document.getElementById("user-input");
  const historyContainer = document.getElementById("history-container");
  const historyDiv = document.getElementById("history");
  let gameOver = false;

  guessButton.addEventListener("click", () => {
    if (gameOver) return;

    const guess = userInput.value.trim();
    if (!/^\d{4}$/.test(guess)) {
      alert("請輸入 4 位數字！");
      return;
    }
    // 檢查是否重複數字
    const digits = new Set(guess);
    if (digits.size !== 4) {
      alert("數字不能重複！");
      return;
    }

    const { A, B } = calculateAB(answer, guess);

    // 顯示歷史紀錄區塊
    if (historyContainer.style.display === "none") {
      historyContainer.style.display = "block";
    }

    // 新增紀錄
    const p = document.createElement("p");
    p.textContent = `${guess} → ${A}A${B}B`;
    historyDiv.appendChild(p);

    if (A === 4) {
      alert("恭喜你猜中了！遊戲結束！");
      gameOver = true;
      guessButton.disabled = true;
      userInput.disabled = true;
    } else {
      userInput.value = "";
      userInput.focus();
    }
  });

  // 可加按 Enter 鍵也可猜
  userInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      guessButton.click();
    }
  });
});
