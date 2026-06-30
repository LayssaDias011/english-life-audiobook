(function () {
  "use strict";

  const defaultState = {
    completedLessons: [],
    answers: {},
    writing: {},
    speaking: {},
    flashcards: {},
    lastPage: "dashboard.html",
    lastLessonId: "1A",
    currentWeek: 1,
    studyMinutes: 0,
    updatedAt: null,
  };

  function loadState() {
    return {
      ...defaultState,
      ...StorageService.get(AppConfig.storageKey, defaultState),
    };
  }

  function saveState(state) {
    StorageService.set(AppConfig.storageKey, {
      ...state,
      updatedAt: new Date().toISOString(),
    });
  }

  window.ProgressService = {
    getState() {
      return loadState();
    },

    saveLastPage(page) {
      const state = loadState();
      state.lastPage = page;
      saveState(state);
    },

    saveLastLesson(lessonId) {
      const state = loadState();
      state.lastLessonId = lessonId;
      saveState(state);
    },

    saveAnswer(key, value) {
      const state = loadState();
      state.answers[key] = value;
      saveState(state);
    },

    getAnswer(key, fallback = "") {
      return loadState().answers[key] ?? fallback;
    },

    saveWriting(key, value) {
      const state = loadState();
      state.writing[key] = value;
      saveState(state);
    },

    getWriting(key) {
      return loadState().writing[key] || "";
    },

    saveSpeaking(key, metadata) {
      const state = loadState();
      state.speaking[key] = metadata;
      saveState(state);
    },

    removeSpeaking(key) {
      const state = loadState();
      delete state.speaking[key];
      saveState(state);
    },

    saveFlashcard(unit, cardKey, result) {
      const state = loadState();
      state.flashcards[unit] = state.flashcards[unit] || {};
      const current = state.flashcards[unit][cardKey] || { correct: 0, wrong: 0 };
      current[result] = (current[result] || 0) + 1;
      current.lastReviewedAt = new Date().toISOString();
      state.flashcards[unit][cardKey] = current;
      saveState(state);
    },

    completeLesson(lessonId) {
      const state = loadState();
      if (!state.completedLessons.includes(lessonId)) {
        state.completedLessons.push(lessonId);
      }
      state.lastLessonId = lessonId;
      saveState(state);
    },

    getOverallPercent(totalLessons = 24) {
      const completed = loadState().completedLessons.length;
      return Math.min(100, Math.round((completed / totalLessons) * 100));
    },
  };
})();
