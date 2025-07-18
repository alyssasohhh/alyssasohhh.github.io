document.addEventListener('DOMContentLoaded', () => {
  const subtitles = [
    "It was just a game. Everyone was playing it.",
    "I tapped ‘Allow’ on everything without reading… who doesn’t?",
    "Then it glitched — and suddenly, this warning popped up.",
    "Now I’m getting scam emails, messages pretending to be my bank and my friends.",
    "Be careful what you install — and what you give it access to."
  ];

  let currentIndex = 0;
  let videoPlayed = false;
  let typewriterTimeouts = [];

  const subtitleText = document.querySelector('.subtitle-text');
  const leftArrow = document.querySelector('.nav-arrow.left');
  const rightArrows = document.querySelectorAll('.nav-arrow.right');
  const subtitleBar = document.getElementById('subtitle-bar');
  const liamContainer = document.getElementById('liam-container');
  const videoOverlay = document.getElementById('video-overlay');
  const video = document.getElementById('liam-video');
  const skipBtn = document.getElementById('skip-video-btn');

  function clearTypewriter() {
    typewriterTimeouts.forEach(timeout => clearTimeout(timeout));
    typewriterTimeouts = [];
    subtitleText.textContent = '';
  }

  function fadeInText(text) {
    clearTypewriter();
    subtitleText.textContent = '';
    let charIndex = 0;
    const speed = 40;

    function typeChar() {
      if (charIndex < text.length) {
        subtitleText.textContent += text.charAt(charIndex);
        charIndex++;
        const timeout = setTimeout(typeChar, speed);
        typewriterTimeouts.push(timeout);
      }
    }

    typeChar();
  }

  function showSubtitle(index) {
    clearTypewriter();

    if (index === 2 && !videoPlayed) {
      liamContainer.classList.add('hidden');
      subtitleBar.classList.add('hidden');
      videoOverlay.classList.remove('hidden');
      video.play();

      leftArrow.style.visibility = 'hidden';
      rightArrows.forEach(arrow => arrow.style.visibility = 'hidden');

      video.onended = () => {
        videoOverlay.classList.add('hidden');
        liamContainer.classList.remove('hidden');
        subtitleBar.classList.remove('hidden');
        videoPlayed = true;
        showSubtitle(currentIndex); // re-show same subtitle after video
      };

      return;
    }

    fadeInText(subtitles[index]);

    leftArrow.style.visibility = index === 0 ? 'hidden' : 'visible';
    rightArrows.forEach(arrow => {
      arrow.style.visibility = index >= subtitles.length - 1 ? 'hidden' : 'visible';
    });
  }

  leftArrow.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      showSubtitle(currentIndex);
    }
  });

  rightArrows.forEach(arrow => {
    arrow.addEventListener('click', () => {
      if (currentIndex < subtitles.length - 1) {
        currentIndex++;
        showSubtitle(currentIndex);
      }
    });
  });

  skipBtn.addEventListener('click', () => {
    video.pause();
    videoOverlay.classList.add('hidden');
    liamContainer.classList.remove('hidden');
    subtitleBar.classList.remove('hidden');
    videoPlayed = true;
    showSubtitle(currentIndex);
  });

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