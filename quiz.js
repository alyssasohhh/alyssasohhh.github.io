document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const introSection = document.getElementById("intro-section");
  const mirrorSection = document.getElementById("mirror-section");
  const quizSection = document.getElementById("quiz-section");
  const endingSection = document.getElementById("ending-section");

  const subtitleBox = document.getElementById("subtitle-box");
  const subtitleText = document.getElementById("subtitle-text");
  const nextLineBtn = document.getElementById("next-line-btn");

  const reviewBtn = document.getElementById("review-btn");      // "I'm not ready" button
  const proceedBtn = document.getElementById("proceed-btn");

  const yourMirror = document.getElementById("your-mirror");
  const enterMirrorBtn = document.getElementById("enter-mirror-btn");

  const scoreCounter = document.getElementById("score-counter");
  const quizSubtitle = document.getElementById("quiz-subtitle");
  const questionText = document.getElementById("question-text");
  const optionA = document.getElementById("optionA");
  const optionB = document.getElementById("optionB");

  const quizSubtitleBox = document.getElementById("quiz-subtitle-box");
  const nextExplanationBtn = document.getElementById("next-explanation-btn");
  const quizQuestionBox = document.getElementById("quiz-question-box");
  const questionNumber = document.getElementById("question-number");

  const finalSubtitle = document.getElementById("final-subtitle");
  const finalScore = document.getElementById("final-score");
  const retryBtn = document.getElementById("retry-btn");

  const flashEffect = document.getElementById("flash-effect");

 const correctSound = new Audio('audio/correct-sound.mp3');
 const wrongSound = new Audio('audio/wrong-sound.mp3');

  const quizKeeper = document.getElementById("quiz-keeper");

  // Intro lines
  const introLines = [
    "Welcome back, brave spirit.",
    "You have learned much from the four mirrors.",
    "Now, a final test awaits to prove your understanding.",
    "Are you ready to face your own mirror and the choices within?"
  ];

  let currentIntroLine = 0;

  // Quiz questions (unchanged)
  const questions = [
    {
      question: "What’s one way to check if an image or video is fake or made by AI?",
      answers: {
        A: "Look closely. Things like mismatched shadows or weird faces can give it away.",
        B: "If it’s really clear and high quality, it’s probably real."
      },
      correct: "A",
      explanation: "AI fakes can look real at first, but small glitches often expose them. Just because it’s high quality doesn’t mean it’s real."
    },
    {
      question: "What is a deepfake?",
      answers: {
        A: "A realistic video or audio made using AI to copy someone.",
        B: "A video with special effects added after filming."
      },
      correct: "A",
      explanation: "Deepfakes use AI to make it look or sound like someone did or said something they didn’t. It’s different from regular editing."
    },
    {
      question: "You get a voice message that sounds just like your mum saying, “I need your bank login, quickly. It’s an emergency.” But the number is unknown.",
      answers: {
        A: "It’s probably her on a new phone. I’ll trust the voice.",
        B: "I should call my mum directly to check."
      },
      correct: "B",
      explanation: "AI can copy voices perfectly. Always double-check strange requests, even if the voice sounds real."
    },
    {
      question: "You get an email from your teacher’s name and it sounds like how they write. It says to click a link to get your final grades, but something about the link seems off.",
      answers: {
        A: "It sounds like my teacher, so I think it’s fine.",
        B: "I won’t click it. I’ll ask my teacher just to be sure."
      },
      correct: "B",
      explanation: "AI can copy writing styles too. If a message feels off, trust your gut and check before clicking anything."
    },
    {
      question: "A friend shares a viral AI art filter that asks you to upload 10 photos of yourself.",
      answers: {
        A: "Sounds fun. I’ll try it — probably harmless.",
        B: "Hmm… uploading that many photos might not be a good idea."
      },
      correct: "B",
      explanation: "Some AI apps collect photos to train their systems or store them without you knowing. Always think before you upload."
    },
    {
      question: "You see a news article with shocking claims, but it’s poorly written and doesn’t list any sources.",
      answers: {
        A: "It’s online, so it must be true.",
        B: "I’ll check if trusted sites are also reporting it."
      },
      correct: "B",
      explanation: "AI can create fake articles fast. The more emotional or shocking it is, the more you should double-check."
    },
    {
      question: "A website says it can tell you who’s in love with you by scanning your Instagram.",
      answers: {
        A: "That’s sketchy. I don’t think I’ll try it.",
        B: "Sounds fun! I wanna know."
      },
      correct: "A",
      explanation: "Sites like that often collect your data, not give real answers. If it sounds too magical, it’s probably a trap."
    },
    {
      question: "An AI app gives you free editing tools but asks for access to your camera, microphone, contacts, and location.",
      answers: {
        A: "That’s way too much. I’ll skip it.",
        B: "I just want the filters. It’s fine."
      },
      correct: "A",
      explanation: "Some apps ask for way more than they need. That kind of access can put your data at risk, even when the app’s closed."
    },
    {
      question: "You get a message offering a job from a company you’ve never heard of. It’s well-written and asks for your personal details.",
      answers: {
        A: "It sounds professional. I’ll reply.",
        B: "I’ll search the company first to check if it’s real."
      },
      correct: "B",
      explanation: "AI can write emails that sound real. If someone asks for your info, always make sure they’re genuine before replying."
    },
    {
      question: "How can you protect your data from apps that use AI?",
      answers: {
        A: "Check what permissions the app wants and avoid sketchy ones.",
        B: "Just download lots of apps so the AI gets smarter."
      },
      correct: "A",
      explanation: "Some apps collect more data than you expect. Checking permissions helps protect your privacy."
    }
  ];

  const passThreshold = 7;
  let currentQuestionIndex = 0;
  let score = 0;
  let isAnswering = false;

  function showElement(el) {
    if (!el) return;
    el.classList.remove("hidden");
  }
  function hideElement(el) {
    if (!el) return;
    el.classList.add("hidden");
  }

  function showKeeper() {
    quizKeeper.classList.remove("hidden");
    quizKeeper.style.width = "300px";
    quizKeeper.style.opacity = "1";
  }
  function hideKeeper() {
    quizKeeper.style.width = "150px";
    quizKeeper.style.opacity = "0";
    quizKeeper.classList.add("hidden");
  }

  function typeWriter(text, element, delay = 30) {
    return new Promise((resolve) => {
      element.textContent = "";
      let i = 0;
      function type() {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(type, delay);
        } else {
          resolve();
        }
      }
      type();
    });
  }

  function showIntroLine() {
    if (currentIntroLine < introLines.length) {
      typeWriter(introLines[currentIntroLine], subtitleText).then(() => {
        nextLineBtn.style.opacity = "1";
        nextLineBtn.disabled = false;
      });
    } else {
      nextLineBtn.style.opacity = "0";
      nextLineBtn.disabled = true;
      reviewBtn.style.opacity = "1";
      proceedBtn.style.opacity = "1";
      reviewBtn.disabled = false;
      proceedBtn.disabled = false;
    }
  }

  function startIntro() {
    currentIntroLine = 0;
    reviewBtn.style.opacity = "0";
    proceedBtn.style.opacity = "0";
    reviewBtn.disabled = true;
    proceedBtn.disabled = true;
    nextLineBtn.style.opacity = "0";
    nextLineBtn.disabled = true;
    showIntroLine();
  }

  nextLineBtn.addEventListener("click", () => {
    nextLineBtn.style.opacity = "0";
    nextLineBtn.disabled = true;
    currentIntroLine++;
    showIntroLine();
  });

  // REVIEW BUTTON ("I'm not ready") goes to main title page (index.html)
  reviewBtn.addEventListener("click", () => {
    sessionStorage.setItem("skipIntro", "true");
    window.location.href = "index.html";
  });

  proceedBtn.addEventListener("click", () => {
    introSection.style.opacity = "0";
    setTimeout(() => {
      hideElement(introSection);
      showElement(mirrorSection);
      mirrorSection.style.opacity = "0";
      mirrorSection.style.display = "block";
      mirrorSection.style.transition = "opacity 0.6s ease";
      setTimeout(() => {
        mirrorSection.style.opacity = "1";
      }, 50);
    }, 600);
  });

  enterMirrorBtn.addEventListener("click", () => {
    mirrorSection.style.opacity = "0";
    setTimeout(() => {
      hideElement(mirrorSection);
      showElement(quizSection);
      quizSection.style.opacity = "0";
      quizSection.style.display = "block";
      quizSection.style.transition = "opacity 0.6s ease";
      setTimeout(() => {
        quizSection.style.opacity = "1";
        startQuiz();
      }, 50);
    }, 600);
  });

  function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    scoreCounter.textContent = `Score: ${score}`;
    quizQuestionBox.style.display = "block";
    quizSubtitleBox.classList.add("hidden");
    nextExplanationBtn.classList.add("hidden");
    hideKeeper();
    showQuestion();
  }

  function showQuestion() {
    isAnswering = true;
    const q = questions[currentQuestionIndex];
    questionNumber.textContent = `Question ${currentQuestionIndex + 1} / ${questions.length}`;
    questionText.textContent = q.question;
    optionA.textContent = `A) ${q.answers.A}`;
    optionB.textContent = `B) ${q.answers.B}`;
    quizQuestionBox.style.display = "block";
    quizSubtitleBox.classList.add("hidden");
    nextExplanationBtn.classList.add("hidden");
    hideKeeper();
    enableOptions();
    // Remove previous classes
    optionA.classList.remove("correct", "wrong");
    optionB.classList.remove("correct", "wrong");
  }

  function enableOptions() {
    optionA.disabled = false;
    optionB.disabled = false;
  }
  function disableOptions() {
    optionA.disabled = true;
    optionB.disabled = true;
  }

  function playSound(correct) {
    if (correct) {
      correctSound.currentTime = 0;
      correctSound.play();
    } else {
      wrongSound.currentTime = 0;
      wrongSound.play();
    }
  }

  function flashScreen(colorClass) {
    return new Promise((resolve) => {
      function onAnimationEnd() {
        flashEffect.classList.remove(colorClass);
        flashEffect.removeEventListener("animationend", onAnimationEnd);
        resolve();
      }
      flashEffect.addEventListener("animationend", onAnimationEnd);
      flashEffect.classList.add(colorClass);
    });
  }

  optionA.addEventListener("click", () => answerQuestion("A"));
  optionB.addEventListener("click", () => answerQuestion("B"));

  async function answerQuestion(selected) {
    if (!isAnswering) return;
    isAnswering = false;
    disableOptions();
    const q = questions[currentQuestionIndex];
    const isCorrect = selected === q.correct;
    if (isCorrect) {
      score++;
      playSound(true);
      await flashScreen("flash-correct");
      if(selected === "A") {
        optionA.classList.add("correct");
        optionB.classList.add("wrong");
      } else {
        optionB.classList.add("correct");
        optionA.classList.add("wrong");
      }
    } else {
      playSound(false);
      await flashScreen("flash-wrong");
      if(selected === "A") {
        optionA.classList.add("wrong");
        optionB.classList.add("correct");
      } else {
        optionB.classList.add("wrong");
        optionA.classList.add("correct");
      }
    }
    scoreCounter.textContent = `Score: ${score}`;
    quizQuestionBox.style.display = "none";
    quizSubtitle.textContent = "";
    quizSubtitleBox.classList.remove("hidden");
    showKeeper();
    await typeWriter(q.explanation, quizSubtitle);
    nextExplanationBtn.classList.remove("hidden");
  }

  nextExplanationBtn.addEventListener("click", () => {
    nextExplanationBtn.classList.add("hidden");
    quizSubtitleBox.classList.add("hidden");
    currentQuestionIndex++;
    if (currentQuestionIndex >= questions.length) {
      showEnding();
    } else {
      showQuestion();
    }
  });

function showEnding() {
  // Stop and reset quiz background music immediately
  quizAudio.pause();
  quizAudio.currentTime = 0;

  quizSection.style.opacity = "0";
  setTimeout(() => {
    hideElement(quizSection);
    showElement(endingSection);
    endingSection.style.opacity = "0";
    endingSection.style.display = "block";
    hideKeeper(); // keep keeper hidden in ending
    setTimeout(() => {
      endingSection.style.opacity = "1";
      const passed = score >= passThreshold;
      finalScore.textContent = `Final Score: ${score} / ${questions.length}`;
      endingSection.style.backgroundSize = "cover";
      endingSection.style.backgroundRepeat = "no-repeat";
      endingSection.style.backgroundPosition = "center";

      // Prepare audio
      let endingAudio;
      if (passed) {
        endingSection.style.backgroundImage = "url('images/goldengates.jpg')";
        endingAudio = new Audio('audio/ending-pass.mp3');
      } else {
        endingSection.style.backgroundImage = "url('images/soultrapped.png')";
        endingAudio = new Audio('audio/ending-fail.mp3');
      }

      // Play ending audio once
      endingAudio.volume = 1;
      endingAudio.play().catch(e => console.warn("Ending audio play blocked:", e));

      const endMessage = passed
        ? `Well done, brave one! You have passed the test.\nYour score: ${score} / ${questions.length}.\nYou may now leave the mirror or try again.`
        : `Alas, you did not pass.\nYour score: ${score} / ${questions.length}.\nYou remain trapped within the mirror’s depths.\nTry again to escape your fate.`;

      typeWriter(endMessage, finalSubtitle);
      retryBtn.classList.remove("hidden");
    }, 50);
  }, 600);

}
 // Retry button redirects to index.html
 retryBtn.addEventListener("click", () => {
  window.location.href = "index.html";
 });

  // Navigation logic (unchanged, but make sure elements exist or remove this block)
  const lookLeftBtn = document.getElementById("look-left");
  const lookRightBtn = document.getElementById("look-right");
  const wallChoice = document.getElementById("wall-choice");
  const leftWallScene = document.getElementById("left-wall-scene");
  const rightWallScene = document.getElementById("right-wall-scene");

  if (lookLeftBtn && wallChoice && leftWallScene) {
    lookLeftBtn.addEventListener("click", () => {
      hideElement(wallChoice);
      showElement(leftWallScene);
    });
  }
  if (lookRightBtn && wallChoice && rightWallScene) {
    lookRightBtn.addEventListener("click", () => {
      hideElement(wallChoice);
      showElement(rightWallScene);
    });
  }

  const backFromLeftBtn = document.getElementById("back-from-left");
  const backFromRightBtn = document.getElementById("back-from-right");

  if (backFromLeftBtn && wallChoice && leftWallScene) {
    backFromLeftBtn.addEventListener("click", () => {
      hideElement(leftWallScene);
      showElement(wallChoice);
    });
  }
  if (backFromRightBtn && wallChoice && rightWallScene) {
    backFromRightBtn.addEventListener("click", () => {
      hideElement(rightWallScene);
      showElement(wallChoice);
    });
  }

  // Initialize
  if (introSection) {
    showElement(introSection);
  } else {
    sessionStorage.setItem("skipIntro", "true");
    window.location.href = "index.html";
  }
  startIntro();
});

// Skip intro logic if flagged in sessionStorage (usually in main.js, but kept here for completeness)
document.addEventListener("DOMContentLoaded", () => {
  const introScene = document.getElementById("intro-scene");
  const hallwayScene = document.getElementById("hallway-scene");
  const wallChoice = document.getElementById("wall-choice");

  if (sessionStorage.getItem("skipIntro") === "true") {
    // Skip intro and show hallway
    if (introScene) introScene.classList.add("hidden");
    if (hallwayScene) hallwayScene.classList.remove("hidden");
    if (wallChoice) wallChoice.classList.remove("hidden");

    sessionStorage.removeItem("skipIntro");
  }
});
// --- Quiz background music (looping, plays after user interaction) ---
const quizAudio = new Audio('audio/quiz-bg.mp3');
quizAudio.loop = true;
quizAudio.volume = 1;

function startQuizMusicOnce() {
  quizAudio.play().catch(err => console.log("Autoplay blocked:", err));
  window.removeEventListener("click", startQuizMusicOnce);
  window.removeEventListener("keydown", startQuizMusicOnce);
}
window.addEventListener("click", startQuizMusicOnce);
window.addEventListener("keydown", startQuizMusicOnce);
// Prepare audio objects for correct and wrong sounds
const correctSound = new Audio('audio/correct-sound.mp3');
const wrongSound = new Audio('audio/wrong-sound.mp3');

// Play correct answer sound
function playCorrectSound() {
  correctSound.pause();
  correctSound.currentTime = 0;
  correctSound.play().catch(e => console.warn("Correct sound play blocked:", e));
}

// Play wrong answer sound
function playWrongSound() {
  wrongSound.pause();
  wrongSound.currentTime = 0;
  wrongSound.play().catch(e => console.warn("Wrong sound play blocked:", e));
}