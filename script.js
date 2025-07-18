const startBtn = document.getElementById("start-btn");
const textContent = document.getElementById("text-content");
const narrationBox = document.getElementById("subtitle-box");
const narrationText = document.getElementById("narration-text");
const textOverlay = document.getElementById("text-overlay");
const subtitle = document.getElementById("subtitle");
const keeperContainer = document.getElementById("keeper-container");
const nextArrow = document.getElementById("next-subtitle");
const prevArrow = document.getElementById("prev-subtitle");
const wallChoice = document.getElementById("wall-choice");

const forceProceedBtn = document.getElementById("force-proceed-btn"); // "I have seen enough" button
const lookLeftBtn = document.getElementById("look-left");
const lookRightBtn = document.getElementById("look-right");

const subtitleText = "Decide your destiny. Make the right or wrong choices and see the consequences.";

const keeperLines = [
  "Welcome, new wandering spirit. I am the Keeper of Truths.",
  "Before you choose your fate, the mirrors will teach you what you need to know. These four mirrors show how AI contributes to online harms.",
  "After completing the 4 mirrors, you will face your own mirror, so make sure you are ready."
];

let currentLine = 0;

/** Typewriter effect for subtitles */
function typeSubtitle(text, element, speed = 35) {
  let i = 0;
  element.textContent = "";
  function typing() {
    if (i <= text.length) {
      element.textContent = text.slice(0, i);
      i++;
      setTimeout(typing, speed);
    }
  }
  typing();
}

// Show hallway buttons container and individual buttons
function showHallwayButtons() {
  wallChoice.classList.add("visible");
  forceProceedBtn.classList.remove("hidden");
  forceProceedBtn.style.display = "block";   // center horizontally
  forceProceedBtn.style.margin = "0 auto";

  lookLeftBtn.classList.remove("hidden");
  lookRightBtn.classList.remove("hidden");
}

// Hide hallway buttons container and individual buttons
function hideHallwayButtons() {
  wallChoice.classList.remove("visible");
  forceProceedBtn.classList.add("hidden");

  lookLeftBtn.classList.add("hidden");
  lookRightBtn.classList.add("hidden");
}

// Handle music play/fade between tracks
let currentMusic = null;
function playBackgroundMusic(src) {
  if (currentMusic && currentMusic.src.includes(src)) return; // Already playing this track

  const newAudio = new Audio('audio/' + src);
  newAudio.loop = true;
  newAudio.volume = 0;
  newAudio.play().catch(e => {
    // In case autoplay blocked, log error but continue
    console.warn("Audio play blocked:", e);
  });

  // Smooth fade-in
  const fadeIn = setInterval(() => {
    if (newAudio.volume < 1) {
      newAudio.volume = Math.min(newAudio.volume + 0.05, 1);
    } else {
      clearInterval(fadeIn);
    }
  }, 100);

  // Smooth fade-out for previous music
  if (currentMusic) {
    const old = currentMusic;
    const fadeOut = setInterval(() => {
      if (old.volume > 0) {
        old.volume = Math.max(old.volume - 0.05, 0);
      } else {
        old.pause();
        clearInterval(fadeOut);
      }
    }, 100);
  }

  currentMusic = newAudio;
}

window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded");

  playBackgroundMusic('hallway-bg.mp3');

  if (subtitle) {
    console.log("Subtitle element found:", subtitle);

    // Ensure subtitle and container are visible
    subtitle.style.display = "block";
    const container = document.getElementById("subtitle-container");
    if (container) container.style.display = "block";

    subtitle.classList.remove("hidden");

    // Clear text and start typing the main subtitle
    subtitle.textContent = "";
    typeSubtitle(subtitleText, subtitle);
  } else {
    console.log("Subtitle element NOT found!");
  }

  handleHashNavigation();
  checkAllMirrorsComplete();

  // Debug info for mirrors
  const completedMirrors = JSON.parse(localStorage.getItem('completedMirrors')) || {};
  console.log("Completed Mirrors:", completedMirrors);

  // If skipIntro flag is set, show hallway with buttons immediately
  if (sessionStorage.getItem("skipIntro") === "true") {
    sessionStorage.removeItem("skipIntro");

    if (textContent) textContent.style.display = "none";

    showHallwayButtons();

    const screen = document.getElementById("screen");
    if (screen) screen.classList.remove("title-screen");

    if (keeperContainer) keeperContainer.classList.add("hidden");

    const subtitleBox = document.getElementById("subtitle-box");
    if (subtitleBox) subtitleBox.classList.add("hidden");

    if (screen) {
      screen.style.display = "block";
      screen.style.opacity = "1";
    }
  }
});

// Start Journey button handler
startBtn.addEventListener("click", () => {
  textContent.style.opacity = 0;
  textOverlay.classList.add("hidden");

  setTimeout(() => {
    textContent.classList.add("hidden");

    keeperContainer.classList.remove("hidden");
    keeperContainer.classList.add("fade-in");

    narrationBox.classList.remove("hidden");
    narrationBox.classList.add("animate");

    typeSubtitle(keeperLines[currentLine], narrationText);
    prevArrow.classList.add("hidden");
    nextArrow.classList.remove("hidden");

    // Hide hallway buttons initially
    hideHallwayButtons();
  }, 1000);
});

// Keeper narration navigation
nextArrow.addEventListener("click", () => {
  if (currentLine < keeperLines.length - 1) {
    currentLine++;
    typeSubtitle(keeperLines[currentLine], narrationText);
    prevArrow.classList.remove("hidden");

    if (currentLine === keeperLines.length - 1) {
      nextArrow.textContent = "✓";
    }
  } else {
    narrationBox.classList.remove("animate");
    narrationBox.classList.add("hidden");

    keeperContainer.classList.remove("fade-in");
    keeperContainer.classList.add("fade-out");

    setTimeout(() => {
      keeperContainer.classList.add("hidden");

      // Show hallway buttons including "I have seen enough"
      showHallwayButtons();
    }, 1500);
  }
});

prevArrow.addEventListener("click", () => {
  if (currentLine > 0) {
    currentLine--;
    typeSubtitle(keeperLines[currentLine], narrationText);
    nextArrow.textContent = "▶";

    if (currentLine === 0) {
      prevArrow.classList.add("hidden");
    }
  }
});

// Wall navigation buttons
lookLeftBtn.addEventListener("click", () => {
  document.getElementById("left-wall-scene").classList.remove("hidden");
  hideHallwayButtons();
});

lookRightBtn.addEventListener("click", () => {
  document.getElementById("right-wall-scene").classList.remove("hidden");
  hideHallwayButtons();
});

document.getElementById("back-from-left").addEventListener("click", () => {
  document.getElementById("left-wall-scene").classList.add("hidden");
  showHallwayButtons();
});

document.getElementById("back-from-right").addEventListener("click", () => {
  document.getElementById("right-wall-scene").classList.add("hidden");
  showHallwayButtons();
});

// Handle back-from-mirror navigation using hash in URL
function handleHashNavigation() {
  const hash = window.location.hash;

  if (hash === "#left") {
    if (textContent) textContent.classList.add("hidden");
    if (textOverlay) textOverlay.classList.add("hidden");
    if (keeperContainer) keeperContainer.classList.add("hidden");
    if (narrationBox) narrationBox.classList.add("hidden");
    wallChoice.classList.remove("visible");

    document.getElementById("left-wall-scene").classList.remove("hidden");
  } else if (hash === "#right") {
    if (textContent) textContent.classList.add("hidden");
    if (textOverlay) textOverlay.classList.add("hidden");
    if (keeperContainer) keeperContainer.classList.add("hidden");
    if (narrationBox) narrationBox.classList.add("hidden");
    wallChoice.classList.remove("visible");

    document.getElementById("right-wall-scene").classList.remove("hidden");
  }
}
window.addEventListener("hashchange", handleHashNavigation);

// Check if all mirrors completed and show completion button
function checkAllMirrorsComplete() {
  const completedMirrors = JSON.parse(localStorage.getItem('completedMirrors')) || {};
  const allCompleted = ["jack", "emily", "may", "liam"].every(name => completedMirrors[name]);
  const completionBtn = document.getElementById('completion-btn');

  if (allCompleted && completionBtn) {
    completionBtn.classList.remove('hidden');
    completionBtn.style.display = "block"; // ensure visible
  }
}

// "I have seen enough, let me face my own mirror" button click
forceProceedBtn.addEventListener("click", () => {
  window.location.href = "quiz.html"; // Redirect to quiz page
});

// Show Keeper after proceed (optional utility function)
function showKeeperAfterProceed() {
  if (narrationText) narrationText.style.color = "goldenrod";

  if (keeperContainer) {
    keeperContainer.classList.remove("hidden", "fade-out");
    keeperContainer.classList.add("fade-in");
  }

  if (narrationBox) {
    narrationBox.classList.remove("hidden");
    narrationBox.classList.add("animate");
  }

  typeSubtitle("You have chosen your path. The mirror awaits your fate.", narrationText);
}

// Review button from keeper sequence returns to hallway
const reviewBtn = document.getElementById("review-btn");
if (reviewBtn) {
  reviewBtn.addEventListener("click", () => {
    sessionStorage.setItem("skipIntro", "true");
    window.location.href = "index.html";
  });
}

/* ===== Quiz and hallway handling ===== */

const quizIntro = document.getElementById("quiz-intro");
const quizReviewBtn = document.querySelector("#quiz-intro #review-btn"); // Quiz intro "I'm Not Ready, Let Me Review"
const quizContainer = document.getElementById("quiz-container");
const retryBtn = document.getElementById("retry-btn");

// Quiz intro review button handler
if (quizReviewBtn) {
  quizReviewBtn.addEventListener("click", () => {
    sessionStorage.setItem("skipIntro", "true");
    window.location.href = "index.html";
  });
}

// Retry button in quiz endings
if (retryBtn) {
  retryBtn.addEventListener("click", () => {
    sessionStorage.setItem("skipIntro", "true");
    window.location.href = "index.html";
  });
}

// Additional retry buttons
const quizReviewBtn2 = document.getElementById("quiz-review-btn");
if (quizReviewBtn2) {
  quizReviewBtn2.addEventListener("click", () => {
    sessionStorage.setItem("skipIntro", "true");
    window.location.href = "index.html";
  });
}

const retryGoodBtn = document.getElementById("retry-good-btn");
if (retryGoodBtn) {
  retryGoodBtn.addEventListener("click", () => {
    sessionStorage.setItem("skipIntro", "true");
    window.location.href = "index.html";
  });
}

const retryBadBtn = document.getElementById("retry-bad-btn");
if (retryBadBtn) {
  retryBadBtn.addEventListener("click", () => {
    sessionStorage.setItem("skipIntro", "true");
    window.location.href = "index.html";
  });
}

startBtn.addEventListener("click", () => {
  // Play hallway background music (looping)
  const audio = new Audio('audio/hallway-bg.mp3');
  audio.loop = true;
  audio.volume = 1;
  audio.play().catch(err => console.log("Audio play error:", err));

  // *** Your existing code for subtitles etc stays here unchanged ***
  textContent.style.opacity = 0;
  textOverlay.classList.add("hidden");

  setTimeout(() => {
    textContent.classList.add("hidden");
    keeperContainer.classList.remove("hidden");
    keeperContainer.classList.add("fade-in");
    narrationBox.classList.remove("hidden");
    narrationBox.classList.add("animate");

    typeSubtitle(keeperLines[currentLine], narrationText);
    prevArrow.classList.add("hidden");
    nextArrow.classList.remove("hidden");

    hideHallwayButtons();
  }, 1000);
});
let hallwayAudio = null;

function playHallwayMusic() {
  if (hallwayAudio) {
    if (hallwayAudio.paused) hallwayAudio.play().catch(() => {});
    return;
  }

  hallwayAudio = new Audio('audio/hallway-bg.mp3');
  hallwayAudio.loop = true;
  hallwayAudio.volume = 1;
  hallwayAudio.play().catch(() => {});
}

function setupHallwayMusicOnInteraction() {
  function startMusicOnInteraction() {
    playHallwayMusic();
    window.removeEventListener('click', startMusicOnInteraction);
    window.removeEventListener('keydown', startMusicOnInteraction);
    window.removeEventListener('touchstart', startMusicOnInteraction);
  }

  window.addEventListener('click', startMusicOnInteraction);
  window.addEventListener('keydown', startMusicOnInteraction);
  window.addEventListener('touchstart', startMusicOnInteraction);
}

function onReturnToHallway() {
  if (hallwayAudio) {
    hallwayAudio.play().catch(() => {});
  }
}

// Initialize the interaction listener on page load
document.addEventListener('DOMContentLoaded', () => {
  setupHallwayMusicOnInteraction();
});

// Example: call this on your back buttons to resume music:
document.getElementById('back-from-left').addEventListener('click', () => {
  document.getElementById('left-wall-scene').classList.add('hidden');
  showHallwayButtons();
  onReturnToHallway();
});

document.getElementById('back-from-right').addEventListener('click', () => {
  document.getElementById('right-wall-scene').classList.add('hidden');
  showHallwayButtons();
  onReturnToHallway();
});
