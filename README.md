# English Life

Static, mobile-first English study platform built with HTML5, CSS3 and Vanilla JavaScript.

The first implementation phase creates the application shell only. It does not include real book content. Lessons, glossary data, audio and PDFs can be added later as files.

## Project Structure

```text
/
├── index.html
├── dashboard.html
├── lesson.html
├── flashcards.html
├── speaking.html
├── review.html
├── interview.html
├── manifest.json
├── service-worker.js
├── css/styles.css
├── js/
├── data/
├── audio/
├── pdf/
└── images/
```

## Where To Put Files

PDFs go in `pdf/`.

Audio files go in `audio/unit-name/`, for example:

```text
audio/unit1/ef3e_elem_01a_1-02.mp3
```

Glossaries go in `data/glossary/`, for example:

```text
data/glossary/unit1.json
```

Lesson data goes in `data/lessons/`, for example:

```text
data/lessons/1A.json
```

## Lesson JSON

Create a new lesson file using the lesson id as the filename. For `lesson.html?id=1A`, the app loads `data/lessons/1A.json`.

```json
{
  "id": "1A",
  "unit": "Unit 1A",
  "title": "My name's Hannah, not Anna",
  "audio": "audio/unit1/ef3e_elem_01a_1-02.mp3",
  "vocabulary": [
    {
      "english": "name",
      "portuguese": "nome"
    }
  ],
  "grammar": [
    {
      "topic": "Verb To Be",
      "explanation": "Use am, is, are to talk about identity."
    }
  ],
  "listening": [
    {
      "type": "gap-fill",
      "instruction": "Listen and fill in the blanks.",
      "items": [
        {
          "speaker": "Mike",
          "text": "Hi. I'm Mike. What's your ____?",
          "answer": "name"
        }
      ]
    }
  ],
  "writing": {
    "prompt": "Write 10 sentences introducing yourself."
  },
  "speaking": {
    "prompt": "Record yourself saying your name, city, job and hobbies."
  },
  "review": [
    "What is your name?",
    "Where are you from?"
  ]
}
```

## Glossary JSON

Flashcards currently load `data/glossary/unit1.json`.

```json
{
  "unit": "unit1",
  "words": [
    {
      "english": "name",
      "portuguese": "nome"
    }
  ]
}
```

## Roadmap JSON

The roadmap is loaded from `data/roadmap.json`. Add one object per week. The app is prepared for 24 weeks.

```json
[
  {
    "week": 1,
    "phase": "Phase 1",
    "objective": "Stop translating and start building sentences.",
    "grammar": ["Verb To Be", "Subject Pronouns"],
    "vocabulary": ["Family", "Work", "Routine"],
    "englishFileUnits": ["1A", "1B"],
    "speakingTask": "Introduce yourself.",
    "writingTask": "Write 100 original sentences.",
    "listeningTask": "Complete Unit 1 listening exercises.",
    "reviewTask": "Review all sentences and vocabulary."
  }
]
```

## Audio With jsDelivr

Lesson audio uses the repository path and converts it to jsDelivr with `AppConfig.getJsDelivrAudioUrl`.

Example source path inside a lesson:

```json
"audio": "audio/unit1/ef3e_elem_01a_1-02.mp3"
```

Generated CDN URL:

```text
https://cdn.jsdelivr.net/gh/LayssaDias011/english-life-audiobook@main/audio/unit1/ef3e_elem_01a_1-02.mp3
```

## Local Progress

Progress is saved in `localStorage` through `ProgressService`.

Stored data includes completed lessons, answers, writing drafts, speaking recording metadata, flashcard results, last page and last lesson.

## PWA

The app includes:

- `manifest.json`
- `service-worker.js`
- Basic cache for HTML, CSS, JavaScript and JSON
- Runtime cache for JSON and audio requests already accessed

## Run Locally

Because the app uses `fetch()` for JSON files, use a static local server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/dashboard.html
```

## GitHub Pages

1. Push the project to GitHub.
2. Open the repository settings.
3. Go to Pages.
4. Choose the `main` branch.
5. Choose the root folder.
6. Save.

The app starts at `index.html`, which redirects to `dashboard.html`.
