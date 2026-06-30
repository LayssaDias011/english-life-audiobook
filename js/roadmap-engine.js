(function () {
  "use strict";

  async function loadRoadmap() {
    const response = await fetch(AppConfig.roadmapUrl);
    if (!response.ok) {
      throw new Error("Roadmap was not found.");
    }
    return response.json();
  }

  function renderRoadmapItem(item) {
    return `
      <article class="roadmap-item">
        <p class="eyebrow">Week ${item.week} - ${item.phase}</p>
        <h3>${item.objective}</h3>
        <p><strong>Speaking:</strong> ${item.speakingTask}</p>
        <p><strong>Writing:</strong> ${item.writingTask}</p>
        <p><strong>Listening:</strong> ${item.listeningTask}</p>
        <p><strong>Review:</strong> ${item.reviewTask}</p>
        <div class="tag-list">
          ${item.grammar.map((value) => `<span class="tag">${value}</span>`).join("")}
          ${item.englishFileUnits.map((value) => `<a class="tag" href="lesson.html?id=${value}">${value}</a>`).join("")}
        </div>
      </article>
    `;
  }

  window.RoadmapEngine = {
    async initDashboard() {
      const root = document.getElementById("week-summary");
      if (!root) return;
      const roadmap = await loadRoadmap();
      const state = ProgressService.getState();
      const week = roadmap.find((item) => item.week === state.currentWeek) || roadmap[0];
      root.innerHTML = renderRoadmapItem(week);
      document.getElementById("current-week").textContent = week.week;
      document.getElementById("current-week-phase").textContent = week.phase;
      document.getElementById("next-task").textContent = week.speakingTask;
    },

    async initReview() {
      const root = document.getElementById("roadmap-root");
      if (!root) return;
      try {
        const roadmap = await loadRoadmap();
        root.innerHTML = roadmap.map(renderRoadmapItem).join("");
      } catch (error) {
        root.innerHTML = `<div class="empty-state">${error.message}</div>`;
      }
    },
  };
})();
