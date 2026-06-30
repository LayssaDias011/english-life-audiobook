(function () {
  "use strict";

  window.AppConfig = {
    appName: "English Life",
    storageKey: "english-life-progress-v1",
    repoOwner: "LayssaDias011",
    repoName: "english-life-audiobook",
    branch: "main",
    defaultLessonId: "1A",
    defaultGlossary: "unit1",
    roadmapUrl: "data/roadmap.json",
    getJsDelivrAudioUrl(path) {
      return `https://cdn.jsdelivr.net/gh/${this.repoOwner}/${this.repoName}@${this.branch}/${path}`;
    },
  };
})();
