(function () {
  "use strict";

  function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("service-worker.js").catch((error) => {
        console.warn("Service worker registration failed", error);
      });
    }
  }

  function initDashboard() {
    const state = ProgressService.getState();
    const percent = ProgressService.getOverallPercent();
    const percentLabel = document.getElementById("overall-progress");
    const percentBar = document.getElementById("overall-progress-bar");
    const lastLesson = document.getElementById("last-lesson");
    const lastPage = document.getElementById("last-page");

    if (percentLabel) percentLabel.textContent = `${percent}%`;
    if (percentBar) percentBar.style.width = `${percent}%`;
    if (lastLesson) lastLesson.textContent = state.lastLessonId || AppConfig.defaultLessonId;
    if (lastPage) lastPage.textContent = state.lastPage || "dashboard.html";

    if (window.RoadmapEngine) {
      RoadmapEngine.initDashboard().catch((error) => console.warn(error));
    }
  }

  function initInterview() {
    const select = document.getElementById("interview-question");
    if (!select) return;
    const questions = [
      "Tell me about yourself.",
      "Tell me about your QA experience.",
      "Tell me about automation testing.",
      "Tell me about API testing.",
      "Tell me about leadership.",
      "How do you handle conflicts?",
      "What is your experience as Tech Lead?",
    ];
    select.innerHTML = questions.map((question) => `<option>${question}</option>`).join("");
    select.addEventListener("change", () => {
      ProgressService.saveAnswer("interview:selected-question", select.value);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.dataset.page;
    ProgressService.saveLastPage(`${location.pathname.split("/").pop()}${location.search}`);

    if (page === "dashboard") initDashboard();
    if (page === "lesson" && window.LessonEngine) LessonEngine.init();
    if (page === "flashcards" && window.FlashcardEngine) FlashcardEngine.init();
    if (page === "review" && window.RoadmapEngine) RoadmapEngine.initReview();
    if (page === "speaking" && window.SpeakingRecorder) SpeakingRecorder.initAll();
    if (page === "interview") {
      initInterview();
      if (window.SpeakingRecorder) SpeakingRecorder.initAll();
    }

    registerServiceWorker();
  });
})();
