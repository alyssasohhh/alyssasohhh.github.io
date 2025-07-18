const subtitles = [
  "I only sent one photo. Just one.",
  "But somehow… they used it to make deepfakes. Fake videos. Horrible ones.",
  "", // placeholder while video plays
  "They spread it everywhere. My school, my family — even strangers believed it.",
  "Think twice before sending private images — AI deepfakes can haunt you forever."
];

const subtitleBox = document.getElementById("emily-subtitle");
const prevArrow = document.getElementById("prev-arrow");
const nextArrow = document.getElementById("next-arrow");
const video = document.getElementById("emily-video");
const videoContainer = document.getElementById("emily-video-container");
const skipBtn = document.getElementById("skip-video-btn");

let currentIndex = 0;

function typeWriter(text, element, speed = 30) {
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

function showSubtitle(index) {
  if (index === 2) {
    // show video
    videoContainer.classList.remove("hidden");
    nextArrow.style.visibility = "hidden";
    prevArrow.style.visibility = "hidden";
    return;
  }

  typeWriter(subtitles[index], subtitleBox);
  prevArrow.style.visibility = index === 0 ? "hidden" : "visible";
  nextArrow.style.visibility = index === subtitles.length - 1 ? "hidden" : "visible";
}

nextArrow.addEventListener("click", () => {
  if (currentIndex < subtitles.length - 1) {
    currentIndex++;
    showSubtitle(currentIndex);
  }
});

prevArrow.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    showSubtitle(currentIndex);
  }
});

video.addEventListener("ended", () => {
  videoContainer.classList.add("hidden");
  currentIndex = 3;
  showSubtitle(currentIndex);
});

skipBtn.addEventListener("click", () => {
  video.pause();
  videoContainer.classList.add("hidden");
  currentIndex = 3;
  showSubtitle(currentIndex);
});

document.addEventListener("DOMContentLoaded", () => {
  showSubtitle(currentIndex);
});
// --- Background music (looping, plays after user interaction) ---
const bgAudio = new Audio('audio/hallway-bg.mp3');
bgAudio.loop = true;
bgAudio.volume = 1;

// Try to play once user clicks anywhere (needed for autoplay restrictions)
function startMusicOnce() {
  bgAudio.play().catch(err => console.log("Autoplay blocked:", err));
  window.removeEventListener("click", startMusicOnce);
  window.removeEventListener("keydown", startMusicOnce);
}
window.addEventListener("click", startMusicOnce);
window.addEventListener("keydown", startMusicOnce);