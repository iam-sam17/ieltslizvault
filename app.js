/**
 * IELTS Liz Master Vault — Central Application Logic (app.js)
 * Features:
 * 1. 3 Themes Engine (Dark, Light, Cyberpunk)
 * 2. Focus Session Pomodoro Timer (+/- Customization, Audio Chime, State Persistence)
 * 3. Universal Search Engine with Dropdown
 * 4. Progress & Bookmark Tracker (localStorage)
 * 5. Smart Markdown Note-Taker & File Exporter
 * 6. Interactive Article & Model Essay Modal Reader
 */

// Storage Keys
const STORAGE_KEYS = {
  THEME: 'ielts_liz_theme_v2',
  WATCHED_VIDEOS: 'ielts_liz_watched_v2',
  COMPLETED_BLOGS: 'ielts_liz_completed_blogs_v2',
  BOOKMARKS: 'ielts_liz_bookmarks_v2',
  POMO_TIME: 'ielts_liz_pomo_time_v2',
  NOTE_PREFIX: 'ielts_liz_note_'
};

// Global State
let currentTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
let watchedVideos = JSON.parse(localStorage.getItem(STORAGE_KEYS.WATCHED_VIDEOS) || '[]');
let completedBlogs = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMPLETED_BLOGS) || '[]');
let bookmarkedItems = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKMARKS) || '[]');

// Official Liz Module URL Resolver
function getLizModuleUrl(category, title) {
  const cat = (category || '').toLowerCase();
  const t = (title || '').toLowerCase();
  
  if (cat.includes('listening') || t.includes('listening')) {
    return 'https://ieltsliz.com/ielts-listening/';
  } else if (cat.includes('task 1') || t.includes('task 1')) {
    return 'https://ieltsliz.com/ielts-writing-task-1-lessons-and-tips/';
  } else if (cat.includes('task 2') || cat.includes('writing') || t.includes('writing') || t.includes('essay')) {
    return 'https://ieltsliz.com/ielts-writing-task-2/';
  } else if (cat.includes('speaking') || t.includes('speaking')) {
    return 'https://ieltsliz.com/ielts-speaking-free-lessons-essential-tips/';
  } else if (cat.includes('reading') || t.includes('reading')) {
    return 'https://ieltsliz.com/ielts-reading-lessons-information-and-tips/';
  } else if (cat.includes('vocab') || t.includes('vocab')) {
    return 'https://ieltsliz.com/vocabulary/';
  }
  return 'https://ieltsliz.com';
}

// -----------------------------------------------------------------------------
// 1. THEME ENGINE
// -----------------------------------------------------------------------------
function initTheme() {
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeButtons();
}

function setTheme(theme) {
  currentTheme = theme;
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeButtons();
}

function updateThemeButtons() {
  document.querySelectorAll('.theme-btn, .theme-opt-btn').forEach(btn => {
    const themeVal = btn.getAttribute('data-theme-val') || (btn.getAttribute('onclick') || '').match(/setTheme\('([^']+)'\)/)?.[1];
    if (themeVal && themeVal.toLowerCase() === currentTheme.toLowerCase()) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// -----------------------------------------------------------------------------
// 2. FOCUS SESSION POMODORO TIMER
// -----------------------------------------------------------------------------
let timerSeconds = 25 * 60;
let defaultFocusSeconds = 25 * 60;
let isBreak = false;
let breakSeconds = 5 * 60;
let timerInterval = null;
let isTimerRunning = false;

function initTimer() {
  const saved = localStorage.getItem(STORAGE_KEYS.POMO_TIME);
  if (saved) {
    const parsed = parseInt(saved, 10);
    if (!isNaN(parsed) && parsed > 0) {
      timerSeconds = parsed;
      defaultFocusSeconds = parsed;
    }
  }
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const mins = Math.floor(timerSeconds / 60);
  const secs = timerSeconds % 60;
  const str = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  
  const displayEl = document.getElementById('timerDisplay') || document.querySelector('.timer-digits');
  if (displayEl) displayEl.innerText = str;
}

function toggleTimer() {
  const btn = document.getElementById('startBtn') || document.querySelector('.timer-action-btn') || document.querySelector('.timer-toggle-btn');
  if (!isTimerRunning) {
    isTimerRunning = true;
    if (btn) {
      btn.innerText = 'Pause';
      btn.style.background = 'var(--warning)';
    }
    timerInterval = setInterval(() => {
      if (timerSeconds > 0) {
        timerSeconds--;
        updateTimerDisplay();
      } else {
        clearInterval(timerInterval);
        isTimerRunning = false;
        playChimeSound();
        if (!isBreak) {
          isBreak = true;
          timerSeconds = breakSeconds;
          alert('🎉 Focus Session Finished! Starting a 5-minute relaxation break.');
          if (btn) btn.innerText = 'Start Break';
        } else {
          isBreak = false;
          timerSeconds = defaultFocusSeconds;
          alert('☀️ Break complete! Ready for your next IELTS focus session?');
          if (btn) btn.innerText = 'Start Focus';
        }
        updateTimerDisplay();
      }
    }, 1000);
  } else {
    clearInterval(timerInterval);
    isTimerRunning = false;
    if (btn) {
      btn.innerText = 'Resume';
      btn.style.background = 'var(--accent)';
    }
  }
}

function adjustTime(mins) {
  if (!isTimerRunning) {
    const newSecs = Math.max(60, timerSeconds + mins * 60);
    timerSeconds = newSecs;
    if (!isBreak) defaultFocusSeconds = newSecs;
    localStorage.setItem(STORAGE_KEYS.POMO_TIME, newSecs);
    updateTimerDisplay();
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  isTimerRunning = false;
  isBreak = false;
  timerSeconds = defaultFocusSeconds;
  const btn = document.getElementById('startBtn') || document.querySelector('.timer-action-btn') || document.querySelector('.timer-toggle-btn');
  if (btn) {
    btn.innerText = 'Start';
    btn.style.background = 'var(--accent)';
  }
  updateTimerDisplay();
}

function playChimeSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.8);
  } catch (e) {
    console.log('Audio chime not supported');
  }
}

// -----------------------------------------------------------------------------
// 3. PROGRESS & BOOKMARK ACTIONS
// -----------------------------------------------------------------------------
function toggleVideoWatched(videoId, btnEl) {
  const index = watchedVideos.indexOf(videoId);
  if (index > -1) {
    watchedVideos.splice(index, 1);
  } else {
    watchedVideos.push(videoId);
  }
  localStorage.setItem(STORAGE_KEYS.WATCHED_VIDEOS, JSON.stringify(watchedVideos));
  if (btnEl) updateWatchedButton(videoId, btnEl);
  updateStats();
}

function updateWatchedButton(videoId, btnEl) {
  const isWatched = watchedVideos.includes(videoId);
  btnEl.innerHTML = isWatched ? '✅ Completed' : 'Mark Completed';
  btnEl.classList.toggle('active', isWatched);
}

function toggleBlogCompleted(blogId, btnEl) {
  const index = completedBlogs.indexOf(blogId);
  if (index > -1) {
    completedBlogs.splice(index, 1);
  } else {
    completedBlogs.push(blogId);
  }
  localStorage.setItem(STORAGE_KEYS.COMPLETED_BLOGS, JSON.stringify(completedBlogs));
  if (btnEl) {
    const isDone = completedBlogs.includes(blogId);
    btnEl.innerHTML = isDone ? '✅ Completed' : 'Mark Read';
    btnEl.classList.toggle('active', isDone);
  }
  updateStats();
}

function toggleBookmark(itemId, btnEl) {
  const index = bookmarkedItems.indexOf(itemId);
  if (index > -1) {
    bookmarkedItems.splice(index, 1);
  } else {
    bookmarkedItems.push(itemId);
  }
  localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarkedItems));
  if (btnEl) {
    const isBookmarked = bookmarkedItems.includes(itemId);
    btnEl.innerHTML = isBookmarked ? '★ Saved' : '☆ Save';
    btnEl.classList.toggle('active', isBookmarked);
  }
}

function updateStats() {
  const totalWatchedEl = document.getElementById('totalWatchedCount');
  if (totalWatchedEl) {
    totalWatchedEl.innerText = `${watchedVideos.length} / 47`;
  }
}

// -----------------------------------------------------------------------------
// 4. SMART NOTE-TAKER ENGINE
// -----------------------------------------------------------------------------
function initNoteTaker(id) {
  const textarea = document.getElementById('studyNotesEditor') || document.getElementById('demoNotes');
  if (!textarea) return;
  
  const key = STORAGE_KEYS.NOTE_PREFIX + (id || 'general');
  const savedNote = localStorage.getItem(key);
  if (savedNote !== null) {
    textarea.value = savedNote;
  }
  
  textarea.addEventListener('input', () => {
    localStorage.setItem(key, textarea.value);
    const saveIndicator = document.getElementById('noteSavedIndicator');
    if (saveIndicator) {
      saveIndicator.innerText = 'Saved just now';
      setTimeout(() => { saveIndicator.innerText = 'Auto-saving enabled'; }, 2000);
    }
  });
}

function exportNotes(fileName) {
  const textarea = document.getElementById('studyNotesEditor') || document.getElementById('demoNotes');
  if (!textarea) return;
  
  const text = textarea.value;
  const name = fileName || 'IELTS_Liz_Study_Notes.md';
  const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// -----------------------------------------------------------------------------
// 5. UNIVERSAL SEARCH ENGINE (Ctrl + K)
// -----------------------------------------------------------------------------
function setupSearch() {
  const searchInput = document.querySelector('.search-input-field') || document.querySelector('.search-input');
  if (!searchInput) return;

  // Create or select popover container
  let popover = document.querySelector('.search-results-popover');
  if (!popover) {
    popover = document.createElement('div');
    popover.className = 'search-results-popover';
    searchInput.parentElement.appendChild(popover);
  }

  // Keyboard shortcut Ctrl+K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      searchInput.focus();
    }
  });

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    if (!query) {
      popover.innerHTML = '';
      popover.classList.remove('active');
      return;
    }

    if (typeof LIZ_DATA === 'undefined') return;

    // Search through videos and blog topics
    const matchedVideos = (LIZ_DATA.videos || []).filter(v => 
      v.title.toLowerCase().includes(query) ||
      v.category.toLowerCase().includes(query) ||
      (v.description && v.description.toLowerCase().includes(query))
    );

    const matchedBlogs = [];
    (LIZ_DATA.modules || []).forEach(m => {
      (m.blogMultitopics || []).forEach(b => {
        if (b.title.toLowerCase().includes(query) || b.desc.toLowerCase().includes(query) || b.category.toLowerCase().includes(query)) {
          matchedBlogs.push({ ...b, moduleKey: m.key, moduleTitle: m.title });
        }
      });
    });

    if (matchedVideos.length === 0 && matchedBlogs.length === 0) {
      popover.innerHTML = `<div class="search-item-result" style="color:var(--text-muted); font-size:0.8rem;">No results found for "${query}"</div>`;
      popover.classList.add('active');
      return;
    }

    let html = '';
    
    // Matched Videos
    if (matchedVideos.length > 0) {
      html += `<div style="padding:0.4rem 1rem; font-size:0.7rem; font-weight:700; color:var(--accent); text-transform:uppercase;">Video Masterclasses</div>`;
      matchedVideos.slice(0, 5).forEach(v => {
        html += `
          <div class="search-item-result" onclick="window.location.href='player.html?v=${v.id}'">
            <div class="search-item-title">▶️ ${v.title}</div>
            <div class="search-item-meta">${v.category} • ${v.duration}</div>
          </div>
        `;
      });
    }

    // Matched Blogs
    if (matchedBlogs.length > 0) {
      html += `<div style="padding:0.4rem 1rem; font-size:0.7rem; font-weight:700; color:var(--accent); text-transform:uppercase;">Blog Lessons & Tests</div>`;
      matchedBlogs.slice(0, 5).forEach(b => {
        html += `
          <div class="search-item-result" onclick="window.location.href='${b.moduleKey}.html#${b.id}'">
            <div class="search-item-title">📄 ${b.title}</div>
            <div class="search-item-meta">${b.moduleTitle} • ${b.category}</div>
          </div>
        `;
      });
    }

    popover.innerHTML = html;
    popover.classList.add('active');
  });

  // Close search on outside click
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !popover.contains(e.target)) {
      popover.classList.remove('active');
    }
  });
}

// -----------------------------------------------------------------------------
// 6. VIDEO DURATION PARSER & SORTING ENGINE
// -----------------------------------------------------------------------------
function parseDurationSec(str) {
  if (!str || typeof str !== 'string') return 0;
  const parts = str.trim().split(':').map(n => parseInt(n, 10) || 0);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
}

function sortVideoList(items, sortKey) {
  if (!Array.isArray(items)) return [];
  const list = [...items];
  
  // Get original index from LIZ_DATA for index-based sorts
  const getOriginalIndex = (v) => {
    if (typeof LIZ_DATA !== 'undefined' && LIZ_DATA.videos) {
      const idx = LIZ_DATA.videos.findIndex(vid => vid.id === v.id);
      return idx >= 0 ? idx : 9999;
    }
    return 0;
  };

  const getZayedMasterPlanWeight = (v) => {
    let score = 9999;
    const t = (v.title || '').toLowerCase();
    
    if (v.category === 'Master Strategy') score = 100;
    if (v.category === 'Writing Exam Rules') score = 110;
    
    if (v.module === 'listening') {
      score = 200;
      if (v.category === 'Listening Strategy') score = 210;
      if (v.category === 'Listening Mastery') score = 220;
      if (v.category === 'Listening Practice') score = 230;
    }
    
    if (v.module === 'reading') score = 300;
    
    if (v.category === 'Writing Task 1') {
      score = 400;
      if (t.includes('how to organise')) score = 401;
      else if (t.includes('introduction')) score = 402;
      else if (t.includes('conclusion or overview')) score = 403;
      else if (t.includes('vocabulary')) score = 404;
    }
    
    if (v.category === 'Writing Task 2' || v.category === 'Writing Strategy') {
      score = 500;
      if (t.includes('how to write an introduction')) score = 501;
      else if (t.includes('paragraph length')) score = 502;
      else if (t.includes('do ideas need to be interesting')) score = 503;
      else if (t.includes('expressing your opinion')) score = 504;
      else if (t.includes('examples')) score = 505;
    }
    
    if (v.category === 'Writing Grammar') {
      score = 550;
      if (t.includes('connecting sentences')) score = 551;
    }
    
    if (v.module === 'speaking') {
      score = 600;
      if (v.category === 'Speaking Mastery') score = 610;
      if (v.category === 'Speaking Exam Day') score = 620;
      if (v.category === 'Speaking Part 1') score = 630;
      if (v.category === 'Speaking Part 2') score = 640;
      if (v.category === 'Speaking Part 3') score = 650;
      if (v.category === 'Speaking Practice') score = 660;
    }
    
    if (v.module === 'extra_topics' && score === 9999) score = 700;
    if (v.category === 'About Liz') score = 800;

    return score;
  };

  switch (sortKey) {
    case 'zayed-plan':
      return list.sort((a, b) => {
        const diff = getZayedMasterPlanWeight(a) - getZayedMasterPlanWeight(b);
        if (diff !== 0) return diff;
        return getOriginalIndex(a) - getOriginalIndex(b);
      });
    case 'index-asc':

      return list.sort((a, b) => getOriginalIndex(a) - getOriginalIndex(b));
    case 'index-desc':
      return list.sort((a, b) => getOriginalIndex(b) - getOriginalIndex(a));
    case 'duration-asc':
      return list.sort((a, b) => parseDurationSec(a.duration) - parseDurationSec(b.duration));
    case 'duration-desc':
      return list.sort((a, b) => parseDurationSec(b.duration) - parseDurationSec(a.duration));
    case 'title-asc':
      return list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    case 'title-desc':
      return list.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
    case 'unwatched':
      return list.sort((a, b) => {
        const aWatched = watchedVideos.includes(a.id) ? 1 : 0;
        const bWatched = watchedVideos.includes(b.id) ? 1 : 0;
        if (aWatched !== bWatched) return aWatched - bWatched;
        return getOriginalIndex(a) - getOriginalIndex(b);
      });
    case 'completed':
      return list.sort((a, b) => {
        const aWatched = watchedVideos.includes(a.id) ? 1 : 0;
        const bWatched = watchedVideos.includes(b.id) ? 1 : 0;
        if (aWatched !== bWatched) return bWatched - aWatched;
        return getOriginalIndex(a) - getOriginalIndex(b);
      });
    case 'saved':
      return list.sort((a, b) => {
        const aSaved = bookmarkedItems.includes(a.id) ? 1 : 0;
        const bSaved = bookmarkedItems.includes(b.id) ? 1 : 0;
        if (aSaved !== bSaved) return bSaved - aSaved;
        return getOriginalIndex(a) - getOriginalIndex(b);
      });
    case 'default':
    default:
      return list;
  }
}

// -----------------------------------------------------------------------------
// 7. INITIALIZATION ON DOM READY
// -----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTimer();
  setupSearch();
  updateStats();
});
