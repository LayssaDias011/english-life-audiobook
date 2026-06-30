(function () {
  "use strict";

  let cards = [];
  let currentIndex = 0;
  let showBack = false;
  let unitId = AppConfig.defaultGlossary;

  async function loadGlossary() {
    const response = await fetch(`data/glossary/${unitId}.json`);
    if (!response.ok) {
      throw new Error("Glossary was not found.");
    }
    const data = await response.json();
    cards = data.words || [];
    unitId = data.unit || unitId;
  }

  function render() {
    const root = document.getElementById("flashcard-root");
    if (!root) return;

    if (!cards.length) {
      root.innerHTML = `<div class="empty-state">No flashcards available yet.</div>`;
      return;
    }

    const card = cards[currentIndex];
    root.innerHTML = `
      <article class="flashcard-card">
        <p class="progress-note">Card ${currentIndex + 1} of ${cards.length}</p>
        <button class="flashcard-word" data-flip-card type="button" aria-label="Flip card">
          <strong>${showBack ? card.portuguese : card.english}</strong>
        </button>
        <div class="button-row">
          <button class="button" data-card-result="correct" type="button">Acertei</button>
          <button class="button secondary" data-card-result="wrong" type="button">Errei</button>
          <button class="button secondary" data-next-card type="button">Next</button>
        </div>
      </article>
    `;

    root.querySelector("[data-flip-card]").addEventListener("click", () => {
      showBack = !showBack;
      render();
    });

    root.querySelectorAll("[data-card-result]").forEach((button) => {
      button.addEventListener("click", () => {
        ProgressService.saveFlashcard(unitId, card.english, button.dataset.cardResult);
        nextCard();
      });
    });

    root.querySelector("[data-next-card]").addEventListener("click", nextCard);
  }

  function nextCard() {
    currentIndex = (currentIndex + 1) % cards.length;
    showBack = false;
    render();
  }

  window.FlashcardEngine = {
    async init() {
      const root = document.getElementById("flashcard-root");
      if (!root) return;
      try {
        await loadGlossary();
        render();
      } catch (error) {
        root.innerHTML = `<div class="empty-state">${error.message}</div>`;
      }
    },
  };
})();
