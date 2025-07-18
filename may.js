document.addEventListener('DOMContentLoaded', () => {
  const subtitles = [
    "It was Jacob. My grandson. His voice… he sounded so scared.",
    "He begged me for help. Said he was in trouble. Needed $20,000 immediately.",
    "It was an AI voice scam. Sounded exactly like my grandson.",
    "Always double-check a distress call — even if it sounds like someone you love."
  ];

  let currentIndex = 0;
  let videoPlayed = false;
  let typewriterTimeouts = [];

  const subtitleText = document.querySelector('.subtitle-text');
  const leftArrow = document.querySelector('.nav-arrow.left');
  const rightArrows = document.querySelectorAll('.nav-arrow.right');
  const subtitleBar = document.getElementById('subtitle-bar');
  const mayContainer = document.getElementById('may-container');
  const videoOverlay = document.getElementById('video-overlay');
  const video = document.getElementById('may-video');
  const skipBtn = document.getElementById('skipBtn');

  function clearTypewriter() {
    typewriterTimeouts.forEach(timeout => clearTimeout(timeout));
    typewriterTimeouts = [];
    subtitleText.textContent = '';
  }

  function typeSubtitle(text) {
    clearTypewriter();
    subtitleText.textContent = '';
    let i = 0;
    const speed = 35;

    function typeChar() {
      if (i < text.length) {
        subtitleText.textContent += text.charAt(i);
        i++;
        const timeout = setTimeout(typeChar, speed);
        typewriterTimeouts.push(timeout);
      }
    }

    typeChar();
  }

  function showSubtitle(index) {
    clearTypewriter();

    if (index === 2 && !videoPlayed) {
      subtitleBar.classList.add('hidden');
      mayContainer.classList.add('hidden');
      videoOverlay.classList.remove('hidden');
      video.play();

      leftArrow.style.visibility = 'hidden';
      rightArrows.forEach(arrow => arrow.style.visibility = 'hidden');

      video.onended = () => {
        videoOverlay.classList.add('hidden');
        subtitleBar.classList.remove('hidden');
        mayContainer.classList.remove('hidden');
        videoPlayed = true;
        showSubtitle(currentIndex); // re-show subtitle 2
      };

      skipBtn.onclick = () => {
        video.pause();
        videoOverlay.classList.add('hidden');
        subtitleBar.classList.remove('hidden');
        mayContainer.classList.remove('hidden');
        videoPlayed = true;
        showSubtitle(currentIndex); // re-show subtitle 2
      };

      return;
    }

    typeSubtitle(subtitles[index]);

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