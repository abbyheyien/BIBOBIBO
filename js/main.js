/*search*/
const searchInput = document.getElementById("game-search");
const gameCards = document.querySelectorAll(".game-card");
const noResults = document.getElementById("no-results");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase().trim();
  let visibleCount = 0;

  gameCards.forEach((card) => {
    const title = card.querySelector("h4").textContent.toLowerCase();
    const match = title.includes(query);
    card.style.display = match ? "block" : "none";
    if (match) visibleCount++;
  });

  noResults.style.display = visibleCount === 0 ? "block" : "none";
});

/*漢堡選單*/

