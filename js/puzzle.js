// 漢堡選單切換
const menuToggle = document.getElementById("menu-toggle");
const navbar = document.getElementById("navbar");

menuToggle.addEventListener("click", () => {
  navbar.classList.toggle("active");
});

// 搜尋框互動（你可以擴充這段來做即時過濾）
const searchInput = document.getElementById("game-search");
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const gameCards = document.querySelectorAll(".game-card");

  gameCards.forEach((card) => {
    const title = card.querySelector("h4").textContent.toLowerCase();
    if (title.includes(query)) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
});
