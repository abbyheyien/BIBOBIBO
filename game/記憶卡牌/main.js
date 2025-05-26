// 漢堡選單切換
const menuToggle = document.querySelector(".menu-toggle");
const navbar = document.querySelector("nav.navbar");

menuToggle.addEventListener("click", () => {
  navbar.classList.toggle("active");
});

// 遊戲元素選取
const gameBoard = document.getElementById("gameBoard");
const movesCountElement = document.getElementById("moves-count");
const pairsFoundElement = document.getElementById("pairs-found");
const messageAreaElement = document.getElementById("messageArea");
const restartButton = document.getElementById("restartButton");

// 卡牌符號 (Emoji)
const symbols = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"];
const totalPairs = symbols.length;

// 遊戲狀態變數
let gameCards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let lockBoard = false;

// 初始化遊戲
function initGame() {
  moves = 0;
  matchedPairs = 0;
  flippedCards = [];
  lockBoard = false;
  gameCards = [];

  movesCountElement.textContent = moves;
  pairsFoundElement.textContent = matchedPairs;
  messageAreaElement.textContent = "點擊卡牌開始遊戲！";
  messageAreaElement.className = "message-area";

  // 複製符號並洗牌
  let cardSymbols = [...symbols, ...symbols];
  for (let i = cardSymbols.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardSymbols[i], cardSymbols[j]] = [cardSymbols[j], cardSymbols[i]];
  }

  // 清空棋盤
  gameBoard.innerHTML = "";

  // 建立卡牌元素
  cardSymbols.forEach((symbol, index) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.dataset.id = index;
    cardElement.dataset.symbol = symbol;

    cardElement.innerHTML = `
      <div class="card-face card-back">?</div>
      <div class="card-face card-front">${symbol}</div>
    `;

    cardElement.addEventListener("click", handleCardClick);
    gameBoard.appendChild(cardElement);

    gameCards.push({
      id: index,
      symbol,
      element: cardElement,
      isFlipped: false,
      isMatched: false,
    });
  });
}

// 處理卡牌點擊
function handleCardClick(event) {
  if (lockBoard) return;

  const clickedCardElement = event.currentTarget;
  const clickedCardData = gameCards.find(
    (card) => card.element === clickedCardElement
  );

  if (
    !clickedCardData ||
    clickedCardData.isFlipped ||
    clickedCardData.isMatched
  )
    return;

  flipCard(clickedCardData);
  flippedCards.push(clickedCardData);

  if (flippedCards.length === 2) {
    lockBoard = true;
    moves++;
    movesCountElement.textContent = moves;
    checkForMatch();
  }
}

// 翻牌
function flipCard(cardData) {
  cardData.isFlipped = true;
  cardData.element.classList.add("is-flipped");
}

// 檢查是否配對
function checkForMatch() {
  const [card1, card2] = flippedCards;

  if (card1.symbol === card2.symbol) {
    setTimeout(() => {
      card1.isMatched = true;
      card2.isMatched = true;
      card1.element.classList.add("is-matched");
      card2.element.classList.add("is-matched");

      matchedPairs++;
      pairsFoundElement.textContent = matchedPairs;
      messageAreaElement.textContent = "找到一對！";
      messageAreaElement.className = "message-area success";

      flippedCards = [];
      lockBoard = false;

      if (matchedPairs === totalPairs) {
        messageAreaElement.textContent = `恭喜！您在 ${moves} 次翻牌後全對啦`;
        messageAreaElement.className = "message-area success";
        lockBoard = true;
      }
    }, 500);
  } else {
    messageAreaElement.textContent = "不匹配，再試一次！";
    messageAreaElement.className = "message-area";
    setTimeout(() => {
      unflipCards(card1, card2);
    }, 1000);
  }
}

// 翻回不匹配卡牌
function unflipCards(card1, card2) {
  card1.isFlipped = false;
  card2.isFlipped = false;
  card1.element.classList.remove("is-flipped");
  card2.element.classList.remove("is-flipped");

  flippedCards = [];
  lockBoard = false;
}

// 綁定重新開始按鈕事件
restartButton.addEventListener("click", initGame);

// 遊戲初始化啟動
initGame();
