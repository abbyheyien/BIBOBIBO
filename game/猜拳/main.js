// 漢堡選單切換
const menuToggle = document.querySelector(".menu-toggle");
const navbar = document.querySelector("nav.navbar");

menuToggle.addEventListener("click", () => {
  navbar.classList.toggle("active");
});

function play(playerChoice) {
  // 選項陣列
  const options = ["石頭", "剪刀", "布"];

  // 電腦隨機出拳 (0, 1, 或 2)
  const computerChoice = options[Math.floor(Math.random() * 3)];

  // 取得顯示結果的 DOM 元素
  const playerChoiceElem = document.getElementById("player-choice");
  const computerChoiceElem = document.getElementById("computer-choice");
  const winnerInfoElem = document.getElementById("winner-info");

  // 預設結果
  let winner = "";

  // 判斷勝負邏輯
  if (playerChoice === computerChoice) {
    winner = "平手！";
    winnerInfoElem.className = "tie"; // 應用平手的樣式
  } else if (
    (playerChoice === "石頭" && computerChoice === "剪刀") ||
    (playerChoice === "剪刀" && computerChoice === "布") ||
    (playerChoice === "布" && computerChoice === "石頭")
  ) {
    winner = "你贏了！🎉";
    winnerInfoElem.className = "win"; // 應用勝利的樣式
  } else {
    winner = "電腦贏了！💻";
    winnerInfoElem.className = ""; // 移除特定樣式 (或設為 'lose')
  }

  // 將結果更新到網頁上
  playerChoiceElem.innerText = `你出了：${playerChoice}`;
  computerChoiceElem.innerText = `電腦出了：${computerChoice}`;
  winnerInfoElem.innerText = `結果：${winner}`;
}
