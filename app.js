/**
 * Kram Khoj (क्रम खोज) — Odisha Coastal Heritage Sequence Quest
 * Single-Page Application (SPA) Controller & Web Audio Synth
 */

document.addEventListener('DOMContentLoaded', () => {
  // Web Audio Synth for retro/ambient sound effects
  class SoundManager {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
      }
    }

    playCorrect() {
      if (this.isMuted) return;
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2); // G5
      osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.3); // C6

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    }

    playWrong() {
      if (this.isMuted) return;
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(130, now + 0.25);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    }

    playVictory() {
      if (this.isMuted) return;
      this.init();
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const now = this.ctx.currentTime + idx * 0.12;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      });
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      return this.isMuted;
    }
  }

  const audio = new SoundManager();

  // App State Variables
  const levels = window.HERITAGE_LEVELS;
  let currentLevelIdx = 0;
  let score = 0;
  let streak = 0;
  let maxStreak = 0;
  let hintIdx = 0;

  // DOM Views
  const views = {
    opening: document.getElementById('view-opening'),
    instructions: document.getElementById('view-instructions'),
    game: document.getElementById('view-game'),
    fact: document.getElementById('view-fact'),
    victory: document.getElementById('view-victory')
  };

  // Nav Buttons
  const navBtns = {
    home: document.getElementById('nav-btn-home'),
    instructions: document.getElementById('nav-btn-instructions'),
    lvl1: document.getElementById('nav-btn-lvl1'),
    lvl2: document.getElementById('nav-btn-lvl2'),
    lvl3: document.getElementById('nav-btn-lvl3'),
    lvl4: document.getElementById('nav-btn-lvl4')
  };

  // Lightbox Modal
  const chartLightbox = document.getElementById('chart-lightbox');
  const chartFullImg = document.getElementById('chart-full-img');
  const btnCloseLightbox = document.getElementById('btn-close-lightbox');
  const btnViewChart = document.getElementById('btn-view-chart');
  const btnViewChartFact = document.getElementById('btn-view-chart-fact');

  // Score & Sound Elements
  const scoreVal = document.getElementById('score-val');
  const streakVal = document.getElementById('streak-val');
  const btnSoundToggle = document.getElementById('btn-sound-toggle');
  const brandHome = document.getElementById('brand-home');

  // Screen Switcher Function
  function switchScreen(screenName) {
    Object.keys(views).forEach(key => {
      if (views[key]) views[key].classList.remove('active');
    });
    if (views[screenName]) views[screenName].classList.add('active');

    // Update Nav Bar highlights
    Object.keys(navBtns).forEach(key => {
      if (navBtns[key]) navBtns[key].classList.remove('active');
    });
    if (screenName === 'opening' && navBtns.home) navBtns.home.classList.add('active');
    if (screenName === 'instructions' && navBtns.instructions) navBtns.instructions.classList.add('active');
    if (screenName === 'game') {
      if (currentLevelIdx === 0 && navBtns.lvl1) navBtns.lvl1.classList.add('active');
      if (currentLevelIdx === 1 && navBtns.lvl2) navBtns.lvl2.classList.add('active');
      if (currentLevelIdx === 2 && navBtns.lvl3) navBtns.lvl3.classList.add('active');
      if (currentLevelIdx === 3 && navBtns.lvl4) navBtns.lvl4.classList.add('active');
    }
  }

  // Bind Nav Links
  if (brandHome) brandHome.addEventListener('click', () => switchScreen('opening'));
  if (navBtns.home) navBtns.home.addEventListener('click', () => switchScreen('opening'));
  if (navBtns.instructions) navBtns.instructions.addEventListener('click', () => switchScreen('instructions'));
  if (navBtns.lvl1) navBtns.lvl1.addEventListener('click', () => startLevel(0));
  if (navBtns.lvl2) navBtns.lvl2.addEventListener('click', () => startLevel(1));
  if (navBtns.lvl3) navBtns.lvl3.addEventListener('click', () => startLevel(2));
  if (navBtns.lvl4) navBtns.lvl4.addEventListener('click', () => startLevel(3));

  // Opening Screen Buttons
  document.getElementById('btn-start-adventure').addEventListener('click', () => startLevel(0));
  document.getElementById('btn-view-rules').addEventListener('click', () => switchScreen('instructions'));
  if (document.getElementById('card-lvl-1')) document.getElementById('card-lvl-1').addEventListener('click', () => startLevel(0));
  if (document.getElementById('card-lvl-2')) document.getElementById('card-lvl-2').addEventListener('click', () => startLevel(1));
  if (document.getElementById('card-lvl-3')) document.getElementById('card-lvl-3').addEventListener('click', () => startLevel(2));
  if (document.getElementById('card-lvl-4')) document.getElementById('card-lvl-4').addEventListener('click', () => startLevel(3));

  // Instructions Screen Button
  document.getElementById('btn-begin-game').addEventListener('click', () => startLevel(0));

  // Toggle Sound Button
  btnSoundToggle.addEventListener('click', () => {
    const muted = audio.toggleMute();
    btnSoundToggle.textContent = muted ? '🔇 Sound: OFF' : '🔊 Sound: ON';
  });

  // Lightbox Handlers
  function openChartLightbox(imgSrc) {
    if (!imgSrc) return;
    chartFullImg.src = imgSrc;
    chartLightbox.classList.add('active');
  }

  btnCloseLightbox.addEventListener('click', () => {
    chartLightbox.classList.remove('active');
  });

  chartLightbox.addEventListener('click', (e) => {
    if (e.target === chartLightbox) chartLightbox.classList.remove('active');
  });

  // Start / Load a Specific Level
  function startLevel(levelIndex) {
    currentLevelIdx = levelIndex;
    hintIdx = 0;
    const lvl = levels[currentLevelIdx];

    // Hide hint drawer
    const hintDrawer = document.getElementById('hint-drawer');
    hintDrawer.classList.remove('active');

    // Chart button visibility
    if (lvl.fact.fullChartImage) {
      btnViewChart.style.display = 'inline-flex';
      btnViewChart.onclick = () => openChartLightbox(lvl.fact.fullChartImage);
    } else {
      btnViewChart.style.display = 'none';
    }

    // Load Level Info
    document.getElementById('game-level-icon').textContent = lvl.icon;
    document.getElementById('game-level-name').textContent = `LEVEL ${lvl.level}: ${lvl.name.toUpperCase()}`;
    document.getElementById('game-level-subtitle').textContent = lvl.subtitle;
    document.getElementById('game-question').textContent = lvl.question;
    document.getElementById('step-count-text').textContent = `Step 4 Target`;

    // Render Sequence Track (Steps 1, 2, 3 + Target Slot 4)
    const sequenceTrack = document.getElementById('sequence-track');
    sequenceTrack.innerHTML = '';

    lvl.sequenceSteps.forEach((st) => {
      const card = document.createElement('div');
      card.className = 'seq-card';
      card.innerHTML = `
        <div class="seq-num">${st.num}</div>
        <div class="seq-img-box"><img src="${st.imgSrc}" alt="${st.title}"></div>
        <div class="seq-title">${st.title}</div>
      `;
      sequenceTrack.appendChild(card);

      const arrow = document.createElement('div');
      arrow.className = 'seq-arrow';
      arrow.textContent = '➔';
      sequenceTrack.appendChild(arrow);
    });

    // Step 4 Target Slot
    const targetSlot = document.createElement('div');
    targetSlot.className = 'seq-card target-slot';
    targetSlot.id = 'target-slot-card';
    targetSlot.innerHTML = `
      <div class="seq-num">4</div>
      <div class="target-question">?</div>
    `;
    sequenceTrack.appendChild(targetSlot);

    // Render Choices Grid (A, B, C)
    const choicesGrid = document.getElementById('choices-grid');
    choicesGrid.innerHTML = '';

    lvl.choices.forEach((ch) => {
      const choiceCard = document.createElement('div');
      choiceCard.className = 'choice-card';
      choiceCard.innerHTML = `
        <div class="choice-badge">${ch.id}</div>
        <div class="seq-img-box"><img src="${ch.imgSrc}" alt="${ch.title}"></div>
        <div class="seq-title">${ch.title}</div>
      `;

      choiceCard.addEventListener('click', () => handleChoiceSelect(ch, choiceCard, lvl));
      choicesGrid.appendChild(choiceCard);
    });

    switchScreen('game');
  }

  // Handle Choice Click
  function handleChoiceSelect(choice, choiceElement, lvl) {
    if (choice.isCorrect) {
      // Correct answer logic
      choiceElement.classList.add('correct-flash');
      audio.playCorrect();

      streak++;
      if (streak > maxStreak) maxStreak = streak;

      const earnedScore = 100 + (streak > 1 ? 50 * streak : 0);
      score += earnedScore;

      scoreVal.textContent = score;
      streakVal.textContent = `🔥 ${streak}x`;

      // Update target slot in sequence track
      const targetSlot = document.getElementById('target-slot-card');
      targetSlot.classList.remove('target-slot');
      targetSlot.innerHTML = `
        <div class="seq-num">4</div>
        <div class="seq-img-box"><img src="${choice.imgSrc}" alt="${choice.title}"></div>
        <div class="seq-title">${choice.title}</div>
      `;

      // Trigger Confetti effect
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      // Transition to Level Fact Screen after 700ms delay
      setTimeout(() => {
        showLevelFactScreen(lvl);
      }, 700);

    } else {
      // Wrong answer logic (-25 points as requested in screenshot)
      choiceElement.classList.add('wrong-flash');
      audio.playWrong();
      score = Math.max(0, score - 25);
      streak = 0;
      scoreVal.textContent = score;
      streakVal.textContent = `🔥 0x`;

      setTimeout(() => {
        choiceElement.classList.remove('wrong-flash');
      }, 600);
    }
  }

  // Display Level Fact & Unlocked Badge Screen
  function showLevelFactScreen(lvl) {
    document.getElementById('fact-level-num').textContent = `Level ${lvl.level} Completed!`;
    document.getElementById('fact-badge-icon').textContent = lvl.fact.badgeIcon;
    document.getElementById('fact-badge-title').textContent = lvl.fact.badgeTitle;
    document.getElementById('fact-badge-desc').textContent = lvl.fact.badgeDesc;

    document.getElementById('fact-title').textContent = lvl.fact.title;
    document.getElementById('fact-text').textContent = lvl.fact.text;
    document.getElementById('fact-source').textContent = lvl.fact.source;

    // Full chart image button
    if (lvl.fact.fullChartImage) {
      btnViewChartFact.style.display = 'inline-flex';
      btnViewChartFact.onclick = () => openChartLightbox(lvl.fact.fullChartImage);
    } else {
      btnViewChartFact.style.display = 'none';
    }

    const btnNext = document.getElementById('btn-next-level');
    if (currentLevelIdx < levels.length - 1) {
      const nextLvl = levels[currentLevelIdx + 1];
      btnNext.textContent = `NEXT LEVEL: ${nextLvl.name.toUpperCase()} ${nextLvl.icon} ➔`;
      btnNext.onclick = () => startLevel(currentLevelIdx + 1);
    } else {
      btnNext.textContent = `🏆 VIEW MASTER VICTORY SUMMARY ➔`;
      btnNext.onclick = () => showVictoryScreen();
    }

    switchScreen('fact');
  }

  // Show Grand Victory Screen
  function showVictoryScreen() {
    audio.playVictory();

    document.getElementById('final-score').textContent = score;
    document.getElementById('final-streak').textContent = `🔥 ${maxStreak}x`;

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 }
      });
    }

    switchScreen('victory');
  }

  // Hint Drawer Logic
  document.getElementById('btn-hint').addEventListener('click', () => {
    const lvl = levels[currentLevelIdx];
    const hintDrawer = document.getElementById('hint-drawer');
    const hintText = document.getElementById('hint-text');

    if (lvl.hints && lvl.hints.length > 0) {
      hintText.textContent = lvl.hints[hintIdx % lvl.hints.length];
      hintIdx++;
      hintDrawer.classList.add('active');
    }
  });

  // Restart Level Button
  document.getElementById('btn-restart-lvl').addEventListener('click', () => {
    startLevel(currentLevelIdx);
  });

  // Victory Buttons
  document.getElementById('btn-replay-all').addEventListener('click', () => {
    score = 0;
    streak = 0;
    maxStreak = 0;
    scoreVal.textContent = '0';
    streakVal.textContent = '🔥 0x';
    startLevel(0);
  });

  document.getElementById('btn-home-victory').addEventListener('click', () => {
    switchScreen('opening');
  });

  // Initial Launch: Show Opening Screen
  switchScreen('opening');
});
