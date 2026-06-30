(function () {
  "use strict";

  function createRecorder(container) {
    const key = container.dataset.recorderKey;
    const label = container.dataset.recorderLabel || "Speaking practice";
    let recorder = null;
    let chunks = [];
    let audioUrl = null;

    container.innerHTML = `
      <h3>${label}</h3>
      <div class="button-row">
        <button class="button" data-start-recording type="button">Record</button>
        <button class="button secondary" data-stop-recording type="button" disabled>Stop</button>
        <button class="button danger" data-delete-recording type="button" disabled>Delete</button>
      </div>
      <p class="recorder-status">Ready to record.</p>
      <audio class="recorder-audio" controls hidden></audio>
    `;

    const startButton = container.querySelector("[data-start-recording]");
    const stopButton = container.querySelector("[data-stop-recording]");
    const deleteButton = container.querySelector("[data-delete-recording]");
    const status = container.querySelector(".recorder-status");
    const audio = container.querySelector("audio");
    const saved = ProgressService.getState().speaking[key];

    if (saved) {
      status.textContent = `Last recording saved: ${new Date(saved.createdAt).toLocaleString()}`;
      deleteButton.disabled = false;
    }

    startButton.addEventListener("click", async () => {
      if (!navigator.mediaDevices || !window.MediaRecorder) {
        status.textContent = "MediaRecorder is not supported in this browser.";
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks = [];
      recorder = new MediaRecorder(stream);

      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      });

      recorder.addEventListener("stop", () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunks, { type: "audio/webm" });
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        audioUrl = URL.createObjectURL(blob);
        audio.src = audioUrl;
        audio.hidden = false;
        deleteButton.disabled = false;
        ProgressService.saveSpeaking(key, {
          createdAt: new Date().toISOString(),
          size: blob.size,
          type: blob.type,
          note: "Audio blob is playable in this session; metadata is persisted in localStorage.",
        });
        status.textContent = "Recording saved locally.";
      });

      recorder.start();
      startButton.disabled = true;
      stopButton.disabled = false;
      status.textContent = "Recording...";
    });

    stopButton.addEventListener("click", () => {
      if (recorder && recorder.state !== "inactive") {
        recorder.stop();
      }
      startButton.disabled = false;
      stopButton.disabled = true;
    });

    deleteButton.addEventListener("click", () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      audioUrl = null;
      audio.removeAttribute("src");
      audio.hidden = true;
      deleteButton.disabled = true;
      ProgressService.removeSpeaking(key);
      status.textContent = "Recording removed.";
    });
  }

  window.SpeakingRecorder = {
    initAll() {
      document.querySelectorAll("[data-recorder]").forEach(createRecorder);
    },
  };
})();
