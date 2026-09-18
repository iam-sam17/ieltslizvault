# 🏛️ IELTS Liz Master Vault

A modern, clean, minimalist, and distraction-free educational vault archiving all curated YouTube video masterclasses and complete practice materials from **Elizabeth Ferguson** ([ieltsliz.com](https://ieltsliz.com/)).

---

## 🌟 Key Features

* **⏱️ Integrated Focus Session (Pomodoro) Timer:**
  - Built directly into the top navigation bar.
  - Default: 25 minutes of high-focus study + 5-minute break.
  - Granular `+` and `-` controls to customize session duration on the fly.
  - Synthesized audio chime upon session completion.

* **🎨 3 Minimalist Themes:**
  - **Dark Mode (Default):** Refined slate and charcoal background with subtle borders for comfortable long study hours.
  - **Light Mode:** Crisp, clean paper-white interface with high contrast.
  - **Cyberpunk Mode:** Sleek tech-contrast mode with sharp accents.

* **📚 Complete Flowchart Architecture:**
  - **Welcome Page (`index.html`):** Central dashboard with module roadmaps, live search, and progress tracking.
  - **🎧 Listening (`listening.html`):** Section 1–4 strategies, multiple-choice distractors, map labelling, and audio transcripts.
  - **🗣️ Speaking (`speaking.html`):** Part 1 questions, 100+ Cue Card framework with 1-minute planning method, Part 3 analytical discussions, and natural British idioms.
  - **✍️ Writing (`writing.html`):** 5 Task 2 essay structures, 100+ Band 9 model essays, Academic Task 1 chart breakdowns, and General Training letters.
  - **📖 Reading (`reading.html`):** True/False/Not Given rules, Matching Headings techniques, and raw score to band conversion tables.
  - **💡 Extra Topics & Vocab (`extra-topics.html`):** 30+ topic vocabulary word banks (Environment, Education, Health, Crime, Tech), official exam day checklist, computer vs paper comparison, and an interactive Band Score calculator.
  - **🎬 All Videos (`all-videos.html`):** Filterable and searchable archive of all 47 masterclasses.

* **📝 Studio Player & Smart Markdown Notebook (`player.html`):**
  - Distraction-free YouTube player embed.
  - Built-in Markdown study notebook with real-time auto-saving to `localStorage`.
  - One-click `📥 Export Notes (.md)` button to download your personal study summaries.

* **🔄 Automated GitHub Actions Sync:**
  - Daily scheduled sync via `sync_vault.py` and GitHub Actions workflow.

---

## 🚀 Quick Start (Localhost Server)

You can launch the vault on `localhost:8085` with automatic browser opening using any of the following:

- **Linux / macOS:** Run `bash start.sh` or `./run.py`
- **Windows:** Double-click `start.bat`
- **Direct Python:** `python3 run.py` (automatically detects free ports and opens your browser)
- **Direct Offline:** You can also simply double-click and open `index.html` directly in any web browser!

---

## 💻 Tech Stack

* **Core:** Vanilla HTML5, CSS3 (Custom Design System), JavaScript (ES6+).
* **Typography:** Inter & JetBrains Mono (Google Fonts).
* **Storage:** Browser `localStorage` (No server or database required).
* **Zero External Build Dependencies:** Open `index.html` directly in any web browser.

---

## 📜 Credits & Disclaimer

All teaching methodologies, model essays, and video tutorials are created by **Elizabeth Ferguson (IELTS Liz)**. This vault is an independent, non-commercial open-access educational interface designed to structure and preserve her publicly available resources. For official courses and original materials, visit [ieltsliz.com](https://ieltsliz.com/).
