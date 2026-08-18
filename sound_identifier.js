/**
 * Sound Identifier Game — Odisha Heritage Echoes
 * Web Audio Synthesizer, Dynamic Visualizer & State Unlock Engine
 */

(function () {
  'use strict';

  // ==========================================
  // 1. GAME DATA & HERITAGE SOUND DEFINITIONS
  // ==========================================
  const SOUND_QUESTS = [
    {
      id: 'mardala',
      name: 'Odissi Mardala',
      category: 'Sacred Percussion',
      icon: '🥁',
      originTag: '🛕 Temple & Classical Dance',
      clueTitle: 'Listen to the deep rhythmic beats and resonant slap...',
      hint: 'This is the principal percussion instrument of classical Odissi dance and Jagannath temple sanctum prayers.',
      lore: 'The Mardala is an ancient two-headed wooden barrel drum from Odisha. Sculptures of Mardala players grace the 13th-century Sun Temple at Konark.',
      options: [
        { id: 'mardala', name: 'Odissi Mardala', category: 'Sacred Percussion', icon: '🥁' },
        { id: 'tabla', name: 'Classical Tabla', category: 'Hindustani Percussion', icon: '🪘' },
        { id: 'dholak', name: 'Folk Dholak', category: 'Folk Rhythm', icon: '🪘' },
        { id: 'ghatam', name: 'Earthen Ghatam', category: 'Clay Percussion', icon: '🏺' }
      ],
      // Procedural audio synthesis profile
      synthType: 'mardala'
    },
    {
      id: 'shankha',
      name: 'Shankhadhwani (Sacred Conch)',
      category: 'Divine Wind Instrument',
      icon: '🐚',
      originTag: '🌊 Holy Ocean & Aarti Rituals',
      clueTitle: 'Listen to the soaring, resonant sacred wind blast...',
      hint: 'Blown during temple aartis, auspicious starts, and Rath Yatra to purify the atmosphere with sacred vibrations.',
      lore: 'The Shankha (Turbinella pyrum) produces a profound acoustic wave recognized for thousands of years as the primeval sound of auspicious beginnings.',
      options: [
        { id: 'bansuri', name: 'Bamboo Bansuri', category: 'Melodic Wind', icon: '🪈' },
        { id: 'shankha', name: 'Shankhadhwani (Conch)', category: 'Divine Wind Instrument', icon: '🐚' },
        { id: 'nadaswaram', name: 'Nadaswaram Pipe', category: 'Double Reed Wind', icon: '🎺' },
        { id: 'trumpet', name: 'Brass Ranashinga', category: 'War Horn', icon: '📯' }
      ],
      synthType: 'shankha'
    },
    {
      id: 'bell',
      name: 'Temple Ghanta (Brass Bell)',
      category: 'Sacred Idiophone',
      icon: '🔔',
      originTag: '🛕 Jagannath Sanctum Aarti',
      clueTitle: 'Listen to the shimmering metallic resonance and long decay...',
      hint: 'Rung continuously with the left hand by priests while waving the ghee lamp during temple aarti.',
      lore: 'Crafted from Ashtadhatu (eight sacred metals), the temple bell generates frequencies that harmonize left and right brain hemispheres.',
      options: [
        { id: 'manjira', name: 'Manjira Cymbals', category: 'Metallic Percussion', icon: '🪙' },
        { id: 'bell', name: 'Temple Ghanta (Bell)', category: 'Sacred Idiophone', icon: '🔔' },
        { id: 'jal_tarang', name: 'Jal Tarang', category: 'Water Bowls', icon: '🥣' },
        { id: 'ektara', name: 'Baul Ektara', category: 'Single String', icon: '🪕' }
      ],
      synthType: 'bell'
    },
    {
      id: 'bansuri',
      name: 'Odia Bansuri (Bamboo Flute)',
      category: 'Devotional Melodic Wind',
      icon: '🪈',
      originTag: '🎶 Jayadeva Geeta Govinda',
      clueTitle: 'Listen to the sweet breathy melody and devotional vibrations...',
      hint: 'Made from special riparian bamboo, expressing the gentle morning and evening ragas of Odisha.',
      lore: 'Lord Jagannath is venerated as Muralidhara. The Odia bansuri tradition breathes life into the verses of Jayadeva’s Gita Govinda.',
      options: [
        { id: 'sitar', name: 'Royal Sitar', category: 'Plucked Strings', icon: '🪕' },
        { id: 'sarangi', name: 'Bowed Sarangi', category: 'Bowed Strings', icon: '🎻' },
        { id: 'bansuri', name: 'Odia Bansuri (Flute)', category: 'Devotional Melodic Wind', icon: '🪈' },
        { id: 'veena', name: 'Rudra Veena', category: 'Ancient String', icon: '🎸' }
      ],
      synthType: 'bansuri'
    },
    {
      id: 'mahuri',
      name: 'Mahuri (Odia Shehnai)',
      category: 'Auspicious Reed Wind',
      icon: '🎺',
      originTag: '🚩 Puri Rath Yatra Procession',
      clueTitle: 'Listen to the sharp, festive double-reed melody...',
      hint: 'Played at the forefront of the Grand Chariot of Jagannath during Rath Yatra festivals.',
      lore: 'The Mahuri is a heritage double-reed aerophone played by traditional servitors (Mahuris) during temple festivals and Odissi folk dramas.',
      options: [
        { id: 'harmonium', name: 'Harmonium', category: 'Free Reed Key', icon: '🎹' },
        { id: 'mahuri', name: 'Mahuri (Odia Shehnai)', category: 'Auspicious Reed Wind', icon: '🎺' },
        { id: 'pungi', name: 'Folk Been / Pungi', category: 'Folk Wind', icon: '🐍' },
        { id: 'khol', name: 'Kirtan Khol', category: 'Clay Drum', icon: '🪘' }
      ],
      synthType: 'mahuri'
    }
  ];

  // ==========================================
  // 2. STATE & WEB AUDIO SYNTHESIZER ENGINE
  // ==========================================
  let currentRoundIdx = 0;
  let score = 0;
  let streak = 0;
  let hintsLeft = 3;
  let isAudioPlaying = false;
  let activeAudioNodes = [];
  let audioCtx = null;
  let visualizerAnimId = null;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function stopAllCurrentAudio() {
    activeAudioNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        node.disconnect();
      } catch (e) {}
    });
    activeAudioNodes = [];
    isAudioPlaying = false;
    updatePlayBtnState(false);
  }

  // ==========================================
  // 3. AUTHENTIC PROCEDURAL HERITAGE SYNTHS
  // ==========================================

  // Synthesizes realistic Mardala percussion (Deep thud + Crisp resonant slap)
  function playMardalaPattern(analyser) {
    const t0 = audioCtx.currentTime + 0.05;
    const rhythmPattern = [
      { time: 0, type: 'bass', freq: 110, dur: 0.35 },
      { time: 0.25, type: 'slap', freq: 480, dur: 0.2 },
      { time: 0.5, type: 'slap', freq: 540, dur: 0.18 },
      { time: 0.75, type: 'bass', freq: 105, dur: 0.38 },
      { time: 1.05, type: 'slap', freq: 520, dur: 0.22 },
      { time: 1.3, type: 'bass', freq: 110, dur: 0.4 },
      { time: 1.6, type: 'flourish', freq: 620, dur: 0.35 }
    ];

    rhythmPattern.forEach(hit => {
      const startTime = t0 + hit.time;
      if (hit.type === 'bass') {
        // Deep resonant membrane pitch drop
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(hit.freq * 1.5, startTime);
        osc.frequency.exponentialRampToValueAtTime(hit.freq * 0.7, startTime + hit.dur);

        gain.gain.setValueAtTime(0.7, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + hit.dur);

        osc.connect(gain);
        gain.connect(analyser);
        osc.start(startTime);
        osc.stop(startTime + hit.dur);
        activeAudioNodes.push(osc, gain);
      } else {
        // High harmonic slap + noise transient
        const osc = audioCtx.createOscillator();
        const filter = audioCtx.createBiquadFilter();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(hit.freq, startTime);
        osc.frequency.exponentialRampToValueAtTime(hit.freq * 0.6, startTime + hit.dur);

        filter.type = 'bandpass';
        filter.frequency.value = hit.freq * 1.2;
        filter.Q.value = 4.0;

        gain.gain.setValueAtTime(0.5, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + hit.dur);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(analyser);
        osc.start(startTime);
        osc.stop(startTime + hit.dur);
        activeAudioNodes.push(osc, gain, filter);
      }
    });

    setTimeout(() => {
      if (isAudioPlaying) stopAllCurrentAudio();
    }, 2400);
  }

  // Synthesizes Shankha (Sacred Conch Wind Blast)
  function playShankhaSound(analyser) {
    const t0 = audioCtx.currentTime + 0.05;
    const dur = 3.0;
    const baseFreq = 233.08; // Bb3 sacred frequency

    const harmonics = [1, 2, 3, 4, 5, 6];
    const harmonicGains = [0.6, 0.45, 0.35, 0.2, 0.12, 0.08];

    // Master envelope
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.001, t0);
    masterGain.gain.linearRampToValueAtTime(0.55, t0 + 0.5); // Warm wind swell
    masterGain.gain.setValueAtTime(0.55, t0 + 2.0);
    masterGain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    masterGain.connect(analyser);
    activeAudioNodes.push(masterGain);

    // Subtle pitch inflection (conch blowing upward sweep & vibrato)
    harmonics.forEach((h, idx) => {
      const osc = audioCtx.createOscillator();
      const hGain = audioCtx.createGain();
      
      osc.type = idx % 2 === 0 ? 'sine' : 'sawtooth';
      const targetFreq = baseFreq * h;

      osc.frequency.setValueAtTime(targetFreq * 0.96, t0);
      osc.frequency.exponentialRampToValueAtTime(targetFreq, t0 + 0.4);
      osc.frequency.setValueAtTime(targetFreq, t0 + 2.2);
      osc.frequency.exponentialRampToValueAtTime(targetFreq * 0.98, t0 + dur);

      hGain.gain.value = harmonicGains[idx];
      osc.connect(hGain);
      hGain.connect(masterGain);

      osc.start(t0);
      osc.stop(t0 + dur);
      activeAudioNodes.push(osc, hGain);
    });

    setTimeout(() => {
      if (isAudioPlaying) stopAllCurrentAudio();
    }, dur * 1000 + 100);
  }

  // Synthesizes Temple Ghanta (Resonant Brass Bell)
  function playTempleBell(analyser) {
    const t0 = audioCtx.currentTime + 0.05;
    const dur = 3.5;
    const partials = [
      { ratio: 1.0, gain: 0.55, decay: 3.5 },
      { ratio: 2.76, gain: 0.35, decay: 2.8 },
      { ratio: 5.4, gain: 0.25, decay: 2.0 },
      { ratio: 8.9, gain: 0.15, decay: 1.4 }
    ];
    const fundamental = 587.33; // D5 temple chime

    partials.forEach(p => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = fundamental * p.ratio;

      gain.gain.setValueAtTime(p.gain, t0);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + p.decay);

      osc.connect(gain);
      gain.connect(analyser);

      osc.start(t0);
      osc.stop(t0 + p.decay);
      activeAudioNodes.push(osc, gain);
    });

    setTimeout(() => {
      if (isAudioPlaying) stopAllCurrentAudio();
    }, dur * 1000);
  }

  // Synthesizes Odia Bansuri (Bamboo Flute Raga phrases)
  function playBansuriMelody(analyser) {
    const t0 = audioCtx.currentTime + 0.05;
    // Devotional notes in Raga Mohana / Bhupali: Sa, Re, Ga, Pa, Dha, Sa'
    const notes = [
      { pitch: 440.0, dur: 0.45, time: 0 },    // Sa (A4)
      { pitch: 493.88, dur: 0.4, time: 0.45 }, // Re (B4)
      { pitch: 554.37, dur: 0.5, time: 0.85 }, // Ga (C#5)
      { pitch: 659.25, dur: 0.6, time: 1.35 }, // Pa (E5)
      { pitch: 554.37, dur: 0.4, time: 1.95 }, // Ga
      { pitch: 440.0, dur: 0.7, time: 2.35 }   // Sa
    ];

    notes.forEach(note => {
      const startTime = t0 + note.time;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.pitch, startTime);
      // Gentle pitch bend / meend
      osc.frequency.linearRampToValueAtTime(note.pitch * 1.01, startTime + note.dur * 0.5);

      filter.type = 'lowpass';
      filter.frequency.value = 1800;

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.4, startTime + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + note.dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(analyser);

      osc.start(startTime);
      osc.stop(startTime + note.dur);
      activeAudioNodes.push(osc, gain, filter);
    });

    setTimeout(() => {
      if (isAudioPlaying) stopAllCurrentAudio();
    }, 3200);
  }

  // Synthesizes Mahuri (Odia Shehnai reed melody)
  function playMahuriMelody(analyser) {
    const t0 = audioCtx.currentTime + 0.05;
    const notes = [
      { pitch: 392.0, dur: 0.3, time: 0 },
      { pitch: 440.0, dur: 0.25, time: 0.3 },
      { pitch: 493.88, dur: 0.3, time: 0.55 },
      { pitch: 587.33, dur: 0.5, time: 0.85 },
      { pitch: 523.25, dur: 0.3, time: 1.35 },
      { pitch: 493.88, dur: 0.6, time: 1.65 }
    ];

    notes.forEach(note => {
      const startTime = t0 + note.time;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = 'sawtooth'; // characteristic rich buzzing reed
      osc.frequency.setValueAtTime(note.pitch, startTime);

      filter.type = 'bandpass';
      filter.frequency.value = note.pitch * 2.2;
      filter.Q.value = 3.5;

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + note.dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(analyser);

      osc.start(startTime);
      osc.stop(startTime + note.dur);
      activeAudioNodes.push(osc, gain, filter);
    });

    setTimeout(() => {
      if (isAudioPlaying) stopAllCurrentAudio();
    }, 2400);
  }

  // Master Playback Router
  function playCurrentHeritageSound() {
    initAudioContext();
    if (isAudioPlaying) {
      stopAllCurrentAudio();
      return;
    }

    isAudioPlaying = true;
    updatePlayBtnState(true);

    const quest = SOUND_QUESTS[currentRoundIdx];
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 128;
    analyser.connect(audioCtx.destination);
    activeAudioNodes.push(analyser);

    startVisualizerLoop(analyser);

    switch (quest.synthType) {
      case 'mardala':
        playMardalaPattern(analyser);
        break;
      case 'shankha':
        playShankhaSound(analyser);
        break;
      case 'bell':
        playTempleBell(analyser);
        break;
      case 'bansuri':
        playBansuriMelody(analyser);
        break;
      case 'mahuri':
        playMahuriMelody(analyser);
        break;
      default:
        playMardalaPattern(analyser);
    }
  }

  function updatePlayBtnState(playing) {
    const playBtn = document.getElementById('playAudioBtn');
    const playLabel = document.getElementById('playBtnLabel');
    const overlay = document.getElementById('listeningOverlay');
    const statusText = document.getElementById('statusText');
    const radialGlow = document.getElementById('audioGlow');

    if (playing) {
      playBtn.classList.add('playing');
      playLabel.textContent = 'PLAYING...';
      overlay.classList.add('active');
      statusText.textContent = '🎶 Resonance Active — Listen Carefully';
      if (radialGlow) radialGlow.classList.add('active');
    } else {
      playBtn.classList.remove('playing');
      playLabel.textContent = 'PLAY SOUND';
      overlay.classList.remove('active');
      statusText.textContent = 'Press Play to Hear the Sound';
      if (radialGlow) radialGlow.classList.remove('active');
    }
  }

  // ==========================================
  // 4. REAL-TIME CANVAS VISUALIZER
  // ==========================================
  function startVisualizerLoop(analyser) {
    const canvas = document.getElementById('visualizerCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
      if (!isAudioPlaying) {
        // Draw idle calm wave
        drawIdleState(ctx, canvas);
        return;
      }

      visualizerAnimId = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.2;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height * 0.85;

        // Dynamic gold-cyan gradient bars
        const grad = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
        grad.addColorStop(0, '#06b6d4');
        grad.addColorStop(0.5, '#eab308');
        grad.addColorStop(1, '#fef08a');

        ctx.fillStyle = grad;
        ctx.shadowColor = '#eab308';
        ctx.shadowBlur = 8;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);

        x += barWidth + 1;
      }
    }

    draw();
  }

  function drawIdleState(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const cy = canvas.height / 2;
    ctx.moveTo(0, cy);
    ctx.lineTo(canvas.width, cy);
    ctx.stroke();
  }

  // ==========================================
  // 5. ROUND RENDERING & OPTION CHECKING
  // ==========================================
  function loadRound(idx) {
    stopAllCurrentAudio();
    const quest = SOUND_QUESTS[idx];

    // Update Round Meta
    document.getElementById('roundIndicator').textContent = `Round ${idx + 1} of ${SOUND_QUESTS.length}`;
    document.getElementById('progressFill').style.width = `${((idx + 1) / SOUND_QUESTS.length) * 100}%`;
    document.getElementById('originTag').textContent = quest.originTag;
    document.getElementById('roundClueTitle').textContent = quest.clueTitle;

    // Reset Hint
    const hintBox = document.getElementById('hintBox');
    hintBox.style.display = 'none';
    document.getElementById('hintText').textContent = quest.hint;

    // Shuffle and render options
    const grid = document.getElementById('optionsGrid');
    grid.innerHTML = '';

    const shuffled = [...quest.options].sort(() => Math.random() - 0.5);

    shuffled.forEach(opt => {
      const card = document.createElement('div');
      card.className = 'option-card';
      card.dataset.id = opt.id;
      card.innerHTML = `
        <div class="option-icon">${opt.icon}</div>
        <div class="option-info">
          <span class="option-name">${opt.name}</span>
          <span class="option-category">${opt.category}</span>
        </div>
      `;

      card.addEventListener('click', () => handleOptionSelection(card, opt.id, quest));
      grid.appendChild(card);
    });

    // Automatically trigger preview playback after a short beat
    setTimeout(() => {
      playCurrentHeritageSound();
    }, 400);
  }

  function handleOptionSelection(selectedCard, chosenId, quest) {
    const isCorrect = chosenId === quest.id;
    const allCards = document.querySelectorAll('.option-card');
    allCards.forEach(c => c.style.pointerEvents = 'none');

    if (isCorrect) {
      selectedCard.classList.add('correct');
      streak++;
      const earnedXP = 200 + streak * 50;
      score += earnedXP;

      updateHUD();

      setTimeout(() => {
        showFeedbackModal(quest, earnedXP);
      }, 700);
    } else {
      selectedCard.classList.add('incorrect');
      streak = 0;
      updateHUD();

      // Highlight the correct one
      allCards.forEach(c => {
        if (c.dataset.id === quest.id) {
          c.classList.add('correct');
        }
      });

      setTimeout(() => {
        showFeedbackModal(quest, 50, false);
      }, 900);
    }
  }

  function updateHUD() {
    document.getElementById('scoreDisplay').textContent = score;
    document.getElementById('streakDisplay').textContent = streak;
  }

  function showFeedbackModal(quest, earnedXP, wasCorrect = true) {
    const modal = document.getElementById('feedbackModal');
    document.getElementById('feedbackIcon').textContent = wasCorrect ? '✨ 🏅' : '💡 📖';
    document.getElementById('feedbackTitle').textContent = wasCorrect ? 'Magnificent Resonance!' : 'Knowledge Unlocked!';
    document.getElementById('feedbackInstrument').textContent = quest.name;
    document.getElementById('feedbackLore').textContent = quest.lore;
    document.getElementById('earnedPoints').textContent = `+${earnedXP} XP Earned`;

    const continueBtn = document.getElementById('continueRoundBtn');
    if (currentRoundIdx === SOUND_QUESTS.length - 1) {
      continueBtn.textContent = 'Claim Grand Finale Rewards →';
    } else {
      continueBtn.textContent = 'Next Sound Quest →';
    }

    modal.classList.add('show');
  }

  // ==========================================
  // 6. VICTORY, BADGE & MAP STATE UNLOCK ENGINE
  // ==========================================
  function triggerGrandVictory() {
    stopAllCurrentAudio();

    // 1. Save Unlocked State (Rajasthan unlocked!)
    let unlockedStates = [];
    try {
      unlockedStates = JSON.parse(localStorage.getItem('unlocked_states') || '["odisha"]');
    } catch (e) {
      unlockedStates = ['odisha'];
    }

    if (!unlockedStates.includes('rajasthan')) {
      unlockedStates.push('rajasthan');
    }
    localStorage.setItem('unlocked_states', JSON.stringify(unlockedStates));

    // 2. Award Dhwani Ratna Badge
    let userBadges = [];
    try {
      userBadges = JSON.parse(localStorage.getItem('user_badges') || '[]');
    } catch (e) {
      userBadges = [];
    }

    const badgeObj = {
      id: 'kalinga_veera',
      title: 'KalingaVeera',
      subtitle: 'Master of Odisha Heritage & Sacred Echoes',
      region: 'Odisha',
      image: 'assets/odisha-badge.jpg',
      dateEarned: new Date().toLocaleDateString()
    };

    if (!userBadges.some(b => b.id === 'kalinga_veera')) {
      userBadges.push(badgeObj);
      localStorage.setItem('user_badges', JSON.stringify(userBadges));
    }

    localStorage.setItem('completed_odisha_sound_quest', 'true');
    localStorage.setItem('quest_score', String(score));

    // 3. Display Final Victory Modal
    document.getElementById('finalScoreVal').textContent = score;
    const victoryModal = document.getElementById('victoryModal');
    victoryModal.classList.add('show');

    // 4. Launch Festive Confetti
    startConfettiCelebration();
  }

  // Festive Confetti Physics
  function startConfettiCelebration() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#f59e0b', '#06b6d4', '#ec4899', '#10b981', '#fef08a', '#8b5cf6'];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 4 + 2,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8
      });
    }

    function renderConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotSpeed;

        if (p.y > canvas.height) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });

      requestAnimationFrame(renderConfetti);
    }

    renderConfetti();
  }

  // ==========================================
  // 7. INITIALIZATION & EVENT LISTENERS
  // ==========================================
  document.addEventListener('DOMContentLoaded', () => {
    // Play button
    const playBtn = document.getElementById('playAudioBtn');
    if (playBtn) {
      playBtn.addEventListener('click', playCurrentHeritageSound);
    }

    // Hint button
    const hintBtn = document.getElementById('hintBtn');
    if (hintBtn) {
      hintBtn.addEventListener('click', () => {
        if (hintsLeft > 0) {
          hintsLeft--;
          document.getElementById('hintBadge').textContent = `💡 ${hintsLeft} Hints Left`;
          document.getElementById('hintBox').style.display = 'flex';
          if (hintsLeft === 0) {
            hintBtn.style.opacity = '0.5';
            hintBtn.style.pointerEvents = 'none';
          }
        }
      });
    }

    // Modal Continue Button
    const continueBtn = document.getElementById('continueRoundBtn');
    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        document.getElementById('feedbackModal').classList.remove('show');
        currentRoundIdx++;
        if (currentRoundIdx < SOUND_QUESTS.length) {
          loadRound(currentRoundIdx);
        } else {
          triggerGrandVictory();
        }
      });
    }

    // Return to Map & Explore Unlocked State Button
    const goToMapBtn = document.getElementById('goToMapBtn');
    if (goToMapBtn) {
      goToMapBtn.addEventListener('click', () => {
        window.location.href = 'map.html?unlocked=rajasthan';
      });
    }

    // Replay Quest Button
    const replayQuestBtn = document.getElementById('replayQuestBtn');
    if (replayQuestBtn) {
      replayQuestBtn.addEventListener('click', () => {
        currentRoundIdx = 0;
        score = 0;
        streak = 0;
        hintsLeft = 3;
        updateHUD();
        document.getElementById('victoryModal').classList.remove('show');
        loadRound(0);
      });
    }

    // Start Round 0
    loadRound(0);
  });
})();
