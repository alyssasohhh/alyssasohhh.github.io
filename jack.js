document.addEventListener('DOMContentLoaded', () => {
  const subtitles = [
    "It started with a message from Marcus… or at least, I thought it was him.",
    "He said he needed help verifying something. I didn’t think twice. Marcus and I have been friends for years.",
    "I sent it over. A photo of my identity card. Front and back.",
    "Turns out, it wasn’t Marcus. It was some AI pretending to be him.",
    "If someone asks for personal info online, always double-check their identity. Even if it looks like someone you trust."
  ];

  let currentIndex = 0;
  let videoPlayed = false;
  let typewriterTimeouts = [];

  const subtitleText = document.querySelector('.subtitle-text');
  const leftArrow = document.querySelector('.nav-arrow.left');
  const rightArrows = document.querySelectorAll('.nav-arrow.right');
  const subtitleBar = document.getElementById('subtitle-bar');
  const jackContainer = document.getElementById('jack-container');
  const videoOverlay = document.getElementById('video-overlay');
  const video = document.getElementById('jack-video');
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

    // Show video only at index 2
    if (index === 2 && !videoPlayed) {
      jackContainer.classList.add('hidden');
      subtitleBar.classList.add('hidden');
      videoOverlay.classList.remove('hidden');
      video.play();

      // Disable arrows during video
      leftArrow.style.visibility = 'hidden';
      rightArrows.forEach(arrow => (arrow.style.visibility = 'hidden'));

      // When video ends, restore
      video.onended = () => {
        videoOverlay.classList.add('hidden');
        jackContainer.classList.remove('hidden');
        subtitleBar.classList.remove('hidden');
        videoPlayed = true;
        showSubtitle(currentIndex); // replay current line
      };

      return;
    }

    fadeInText(subtitles[index]);

    // Update arrow visibility
    leftArrow.style.visibility = index === 0 ? 'hidden' : 'visible';
    rightArrows.forEach(arrow => {
      arrow.style.visibility = index >= subtitles.length - 1 ? 'hidden' : 'visible';
    });
  }

  // Arrow navigation
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

  // Skip button event
  skipBtn.addEventListener('click', () => {
    if (!video.paused) {
      video.pause();
      video.currentTime = video.duration; // jump to end
      video.onended();
    }
  });

  // Start scene
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