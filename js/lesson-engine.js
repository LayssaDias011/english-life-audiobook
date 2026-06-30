(function () {
  "use strict";

  function getLessonId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id") || AppConfig.defaultLessonId;
  }

  async function loadLesson(lessonId) {
    const response = await fetch(`data/lessons/${lessonId}.json`);
    if (!response.ok) {
      throw new Error(`Lesson ${lessonId} was not found.`);
    }
    return response.json();
  }

  function renderVocabulary(items) {
    return `
      <section class="lesson-section">
        <h2>Vocabulary</h2>
        <ul class="list">
          ${items.map((item) => `<li><strong>${item.english}</strong><br><span>${item.portuguese}</span></li>`).join("")}
        </ul>
      </section>
    `;
  }

  function renderGrammar(items) {
    return `
      <section class="lesson-section">
        <h2>Grammar</h2>
        <ul class="list">
          ${items.map((item) => `<li><strong>${item.topic}</strong><br><span>${item.explanation}</span></li>`).join("")}
        </ul>
      </section>
    `;
  }

  function renderListening(lesson) {
    const audioUrl = AppConfig.getJsDelivrAudioUrl(lesson.audio);
    return `
      <section class="lesson-section full">
        <h2>Listening</h2>
        <audio class="audio-player" controls preload="none" src="${audioUrl}"></audio>
        ${lesson.listening.map((exercise, exerciseIndex) => `
          <article>
            <p><strong>${exercise.instruction}</strong></p>
            ${exercise.items.map((item, itemIndex) => {
              const key = `${lesson.id}:listening:${exerciseIndex}:${itemIndex}`;
              const saved = ProgressService.getAnswer(key, "");
              return `
                <div class="answer-row">
                  <label class="field-label" for="${key}">${item.speaker}: ${item.text}</label>
                  <input class="input" id="${key}" data-answer="${item.answer}" data-answer-key="${key}" value="${saved}" autocomplete="off">
                  <p class="feedback" data-feedback-for="${key}"></p>
                </div>
              `;
            }).join("")}
          </article>
        `).join("")}
      </section>
    `;
  }

  function renderWriting(lesson) {
    const key = `${lesson.id}:writing`;
    return `
      <section class="lesson-section full">
        <h2>Writing</h2>
        <p>${lesson.writing.prompt}</p>
        <textarea class="textarea" data-writing-key="${key}" placeholder="Write here...">${ProgressService.getWriting(key)}</textarea>
        <p class="progress-note" data-writing-status>Autosaved locally.</p>
      </section>
    `;
  }

  function renderSpeaking(lesson) {
    return `
      <section class="lesson-section full">
        <h2>Speaking</h2>
        <p>${lesson.speaking.prompt}</p>
        <div data-recorder data-recorder-key="${lesson.id}:speaking" data-recorder-label="Lesson ${lesson.id} speaking practice"></div>
      </section>
    `;
  }

  function renderReview(lesson) {
    return `
      <section class="lesson-section full">
        <h2>Review</h2>
        <ul class="list">
          ${lesson.review.map((question) => `<li>${question}</li>`).join("")}
        </ul>
        <button class="button" data-complete-lesson="${lesson.id}">Mark lesson as complete</button>
      </section>
    `;
  }

  function bindListening() {
    document.querySelectorAll("[data-answer-key]").forEach((input) => {
      const feedback = document.querySelector(`[data-feedback-for="${input.dataset.answerKey}"]`);
      const check = () => {
        const expected = input.dataset.answer.trim().toLowerCase();
        const actual = input.value.trim().toLowerCase();
        ProgressService.saveAnswer(input.dataset.answerKey, input.value);
        feedback.textContent = actual ? (actual === expected ? "Correct" : "Try again") : "";
        feedback.className = `feedback ${actual ? (actual === expected ? "correct" : "incorrect") : ""}`;
      };
      input.addEventListener("input", check);
      check();
    });
  }

  function bindWriting() {
    document.querySelectorAll("[data-writing-key]").forEach((textarea) => {
      const status = document.querySelector("[data-writing-status]");
      textarea.addEventListener("input", () => {
        ProgressService.saveWriting(textarea.dataset.writingKey, textarea.value);
        if (status) {
          status.textContent = "Saved locally.";
        }
      });
    });
  }

  function bindCompletion() {
    document.querySelectorAll("[data-complete-lesson]").forEach((button) => {
      button.addEventListener("click", () => {
        ProgressService.completeLesson(button.dataset.completeLesson);
        button.textContent = "Lesson completed";
        button.disabled = true;
      });
    });
  }

  window.LessonEngine = {
    async init() {
      const root = document.getElementById("lesson-root");
      if (!root) return;

      const lessonId = getLessonId();
      ProgressService.saveLastLesson(lessonId);

      try {
        const lesson = await loadLesson(lessonId);
        document.title = `${lesson.unit} | English Life`;
        root.innerHTML = `
          <section class="lesson-hero">
            <p>${lesson.unit}</p>
            <h1>${lesson.title}</h1>
          </section>
          <div class="lesson-grid">
            ${renderVocabulary(lesson.vocabulary)}
            ${renderGrammar(lesson.grammar)}
            ${renderListening(lesson)}
            ${renderWriting(lesson)}
            ${renderSpeaking(lesson)}
            ${renderReview(lesson)}
          </div>
        `;
        bindListening();
        bindWriting();
        bindCompletion();
        if (window.SpeakingRecorder) {
          SpeakingRecorder.initAll();
        }
      } catch (error) {
        root.innerHTML = `<div class="empty-state">${error.message}</div>`;
      }
    },
  };
})();
