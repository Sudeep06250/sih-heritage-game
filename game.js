
document.addEventListener("DOMContentLoaded", () => {
  const completeOverlay = document.getElementById("levelCompleteOverlay");
  if (completeOverlay) completeOverlay.classList.add("hidden");
});
const HERITAGE_DISCOVERIES = [
  {
    id: "wheel",
    title: "Konark Sun Wheel",
    icon: "☀️",
    x: 1400,
    history: "The Konark Sun Temple is famous for its monumental stone wheels. The wheels are richly carved and form part of the temple's chariot symbolism associated with Surya, the Sun God.",
    fact: "UNESCO WORLD HERITAGE CENTRE ✅"
  },
  {
    id: "horse",
    title: "Stone Horse",
    icon: "🐎",
    x: 3000,
    history: "The temple was conceived as the colossal stone chariot of Surya. Sculpted horses are part of this powerful architectural idea, representing the movement and energy of the Sun God's chariot.",
    fact: "UNESCO WORLD HERITAGE CENTRE ✅"
  },
  {
    id: "dance",
    title: "Dancing Sculpture",
    icon: "🕺",
    x: 4600,
    history: "Konark's sculptures preserve scenes of music, dance and everyday life. These carvings are important evidence of the artistic traditions and cultural life represented at the monument.",
    fact: "UNESCO WORLD HERITAGE CENTRE ✅"
  },
  {
    id: "temple",
    title: "Konark Sun Temple",
    icon: "🛕",
    x: 6200,
    history: "The Konark Sun Temple in Odisha is a 13th-century monument built during the reign of King Narasimhadeva I. Its architecture represents Surya's grand stone chariot.",
    fact: "UNESCO WORLD HERITAGE CENTRE ✅"
  }
];

let discoveredHeritage = new Set();
let heritagePaused = false;
let activeHeritage = null;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const coinsEl = document.getElementById("coins");
const distanceEl = document.getElementById("distance");
const heartsEl = document.getElementById("hearts");
const locationEl = document.getElementById("location");

const startScreen = document.getElementById("startScreen");

const levelCompleteOverlay = document.getElementById("levelCompleteOverlay");
const finalScoreEl = document.getElementById("finalScoreComplete");
const targetProgressEl = document.getElementById("targetProgress");
const completeContinueBtn = document.getElementById("completeContinueBtn");

const pauseOverlay = document.getElementById("pauseOverlay");
const gameOverOverlay = document.getElementById("gameOverOverlay");

const assets = {};
const imageFiles = {
  backgrounds: [
    ["KONARK TEMPLE", "assets/konark-background.jpg"],
    ["FOREST PATH", "assets/forest-path.jpg"],
    ["PILLAR CORRIDOR", "assets/pillar-corridor.jpg"],
    ["CLIFF PATH", "assets/cliff-path.jpg"],
    ["CAVE TUNNEL", "assets/cave-tunnel.jpg"]
  ],
  run: [1,2,3,4,5,6,7,8].map(n => `assets/run-${n}.png`),
  jump: [1,2,3].map(n => `assets/jump-${n}.png`),
  slide: [1,2,3].map(n => `assets/slide-${n}.png`),
  idle: [1,2].map(n => `assets/idle-${n}.png`),
  hit: [1,2].map(n => `assets/hit-${n}.png`),
  rock: "assets/rock.png",
  pillar: "assets/pillar.png",
  barrier: "assets/barrier.png",
  spikes: "assets/spikes.png",
  coin: "assets/coin.png",
  gem: "assets/gem.png",
  energy: "assets/energy.png",
  shield: "assets/shield.png",
  magnet: "assets/magnet.png",
  wheel: "assets/konark-wheel.png",
  torch: "assets/torch.png",
  palm: "assets/palm-tree.png",
  bush: "assets/bush.png",
  lion: "assets/lion-statue.png",
  flag: "assets/heritage-flag.png"
};

function loadImage(key, src) {
  return new Promise(resolve => {
    const im = new Image();
    im.onload = () => { assets[key] = im; resolve(); };
    im.onerror = () => resolve();
    im.src = src;
  });
}

let assetsReady = false;
let assetsLoaded = 0;
let assetsTotal = 0;

async function loadAssets() {
  const jobs = [];
  imageFiles.backgrounds.forEach((item, i) => jobs.push(loadImage(`bg${i}`, item[1])));
  ["run","jump","slide","idle","hit"].forEach(group => {
    imageFiles[group].forEach((src, i) => jobs.push(loadImage(`${group}${i}`, src)));
  });
  for (const [key, src] of Object.entries(imageFiles)) {
    if (Array.isArray(src)) continue;
    jobs.push(loadImage(key, src));
  }

  assetsTotal = jobs.length;
  await Promise.all(jobs);
  assetsReady = true;

  // Refresh the screen once all images are ready.
  draw();
}


const TARGET_SCORE = 7000;
let levelCompleted = false;
const state = {
  running: false,
  paused: false,
  over: false,
  score: 0,
  coins: 0,
  distance: 0,
  lives: 3,
  speed: 6,
  worldX: 0,
  lastTime: 0,
  spawnTimer: 0,
  collectibleTimer: 0,
  sceneryTimer: 0,
  shake: 0,
  shield: 0,
  magnet: 0,
  energy: 0
};

const player = {
  x: 0,
  y: 0,
  w: 72,
  h: 112,
  vy: 0,
  grounded: true,
  sliding: false,
  slideTimer: 0,
  frame: 0,
  frameTimer: 0,
  animState: "idle",
  hitTimer: 0,
  coyoteTimer: 0,
  jumpCooldown: 0
};

const obstacles = [];
const collectibles = [];
const scenery = [];

const keys = {
  up: false,
  down: false
};

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(innerWidth * dpr);
  canvas.height = Math.floor(innerHeight * dpr);
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  player.x = Math.max(90, innerWidth * 0.14);
  if (player.grounded) player.y = groundY() - player.h;
}
window.addEventListener("resize", resize);

function groundY() {
  return innerHeight * 0.79;
}

function currentBiome() {
  const d = Number.isFinite(state.distance) ? Math.max(0, state.distance) : 0;
  const count = imageFiles.backgrounds.length;
  return Math.max(0, Math.min(count - 1, Math.floor(d / 450) % count));
}

function currentBackground() {
  return assets[`bg${currentBiome()}`];
}

function resetGame() {
  
  
  discoveredHeritage.clear();
  levelCompleted = false;
  state.running = false;
  state.paused = false;
  state.over = false;
  state.score = 0;
  state.coins = 0;
  state.distance = 0;
  state.lives = 3;
  state.speed = 6;
  state.worldX = 0;
  state.lastTime = performance.now();
  state.spawnTimer = 0;
  state.collectibleTimer = 0;
  state.sceneryTimer = 0;
  state.shake = 0;
  state.shield = 0;
  state.magnet = 0;
  state.energy = 0;

  obstacles.length = 0;
  collectibles.length = 0;
  scenery.length = 0;

  player.x = Math.max(90, innerWidth * 0.14);
  player.y = groundY() - player.h;
  player.vy = 0;
  player.grounded = true;
  player.sliding = false;
  player.slideTimer = 0;
  player.frame = 0;
  player.frameTimer = 0;
  player.animState = "idle";
  player.hitTimer = 0;
  player.coyoteTimer = 120;
  player.jumpCooldown = 0;
  state.lastTime = performance.now();

  pauseOverlay.classList.add("hidden");
  gameOverOverlay.classList.add("hidden");
  startScreen.classList.remove("hidden");
  updateHUD();
}

const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
let musicEnabled = true;
// Try to start the music as soon as the game page opens.
// If the browser blocks audible autoplay, the first click/tap/key press
// automatically starts it without requiring the PLAY button.
window.addEventListener("load", () => {
  setTimeout(() => playGameMusic(), 50);
});

["pointerdown", "keydown", "touchstart"].forEach(type => {
  window.addEventListener(type, tryStartMusicFromFirstInteraction, { once: true, passive: true });
});


function playGameMusic() {
  if (!musicEnabled || !bgMusic) return;
  bgMusic.volume = 0.55;
  const p = bgMusic.play();
  if (p && typeof p.catch === "function") {
    p.catch(() => {
      // Browsers may block audible autoplay. A user interaction anywhere
      // on the page will retry immediately.
    });
  }
}

function tryStartMusicFromFirstInteraction() {
  if (!musicEnabled || !bgMusic) return;
  bgMusic.muted = false;
  playGameMusic();
}

function pauseGameMusic() {
  if (bgMusic) bgMusic.pause();
}

function stopGameMusic() {
  if (!bgMusic) return;
  bgMusic.pause();
  bgMusic.currentTime = 0;
}

function updateMusicButton() {
  if (musicBtn) musicBtn.textContent = musicEnabled ? "🔊" : "🔇";
}

function startGame() {
  // Never block PLAY on image loading. The game has built-in canvas fallbacks,
  // so it can start immediately while the sprite images finish loading.
  startScreen.classList.add("hidden");
  pauseOverlay.classList.add("hidden");
  gameOverOverlay.classList.add("hidden");
  state.running = true;
  state.paused = false;
  state.over = false;
  state.lastTime = performance.now();
  playGameMusic();
  draw();
  requestAnimationFrame(loop);
}

function togglePause() {
  if (!state.running || state.over) return;
  state.paused = !state.paused;
  pauseOverlay.classList.toggle("hidden", !state.paused);
  if (state.paused) {
    pauseGameMusic();
  } else {
    state.lastTime = performance.now();
    playGameMusic();
    requestAnimationFrame(loop);
  }
}

function gameOver() {
  state.running = false;
  state.over = true;
  stopGameMusic();
  document.getElementById("finalScore").textContent = Math.floor(state.score);
  document.getElementById("finalDistance").textContent = Math.floor(state.distance) + " m";
  gameOverOverlay.classList.remove("hidden");
}


function updateCollectionHUD() {
  const count = document.getElementById("collectionCount");
  if (count) count.textContent = `${discoveredHeritage.size} / ${HERITAGE_DISCOVERIES.length}`;
}

function createCompletionSparkles() {
  const layer = document.getElementById("completionSparkles");
  if (!layer || layer.children.length) return;

  const count = window.innerWidth < 700 ? 42 : 78;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const sparkle = document.createElement("span");
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.setProperty("--size", `${2 + Math.random() * 5}px`);
    sparkle.style.setProperty("--duration", `${4.5 + Math.random() * 4.5}s`);
    sparkle.style.setProperty("--delay", `${-Math.random() * 8}s`);
    sparkle.style.setProperty("--drift", `${-55 + Math.random() * 110}px`);
    sparkle.style.setProperty("--drift2", `${-70 + Math.random() * 140}px`);
    sparkle.style.setProperty("--opacity", `${0.45 + Math.random() * 0.55}`);
    fragment.appendChild(sparkle);
  }

  layer.appendChild(fragment);
}

function showFinalCollection() {
  const grid = document.getElementById("finalCollectionGrid");
  if (!grid) return;
  grid.innerHTML = "";

  HERITAGE_DISCOVERIES.forEach(item => {
    const card = document.createElement("article");
    card.className = "collection-card";
    card.innerHTML = `<div class="collection-icon">${item.icon}</div>
      <div class="collection-content">
        <div class="collection-status">✓ COLLECTED</div>
        <h3>${item.title}</h3>
        <p>${item.history}</p>
        <div class="collection-fact"><strong>Verified by:- </strong> ${item.fact}</div>
      </div>`;
    grid.appendChild(card);
  });

  updateCollectionHUD();
}

function completeLevel() {
  if (levelCompleted) return;

  levelCompleted = true;
  state.running = false;
  state.paused = false;

  if (pauseOverlay) pauseOverlay.classList.add("hidden");
  if (gameOverOverlay) gameOverOverlay.classList.add("hidden");
  if (finalScoreEl) finalScoreEl.textContent = Math.min(TARGET_SCORE, Math.floor(state.score || 0));
  showFinalCollection();
  createCompletionSparkles();
  if (levelCompleteOverlay) levelCompleteOverlay.classList.remove("hidden");

  if (bgMusic) {
    bgMusic.pause();
    bgMusic.currentTime = 0;
  }
}

function quitGame() {
  stopGameMusic();
  // "Quit" means leave the current run and return to the title screen.
  state.running = false;
  state.paused = false;
  state.over = false;

  obstacles.length = 0;
  collectibles.length = 0;
  scenery.length = 0;

  pauseOverlay.classList.add("hidden");
  gameOverOverlay.classList.add("hidden");
  startScreen.classList.remove("hidden");

  resetGame();
}

function jump() {
  if (!state.running || state.paused || state.over) return;
  if (player.jumpCooldown > 0) return;

  // Small coyote-time window makes jump reliable even if the player has
  // just left the ground by a frame or two.
  const canJump = player.grounded || player.coyoteTimer > 0;
  if (!canJump) return;

  player.sliding = false;
  player.slideTimer = 0;
  player.grounded = false;
  player.coyoteTimer = 0;
  player.jumpCooldown = 180;

  // Velocity is in pixels/second. This gives a clear, responsive jump.
  player.vy = -720;
}

function slide() {
  if (!state.running || state.paused || state.over) return;
  if (player.grounded) {
    player.sliding = true;
    player.slideTimer = 500;
  }
}

function makeObstacle() {
  const types = ["rock", "pillar", "barrier", "spikes"];
  const type = types[Math.floor(Math.random() * types.length)];
  const data = {
    type,
    x: innerWidth + 50,
    y: groundY(),
    w: type === "pillar" ? 60 : 70,
    h: type === "spikes" ? 45 : 70
  };
  obstacles.push(data);
}

function makeCollectible() {
  const types = ["coin", "coin", "coin", "coin", "gem", "energy", "shield", "magnet"];
  const type = types[Math.floor(Math.random() * types.length)];
  collectibles.push({
    type,
    x: innerWidth + 70,
    y: groundY() - 90 - Math.random() * 120,
    w: type === "coin" ? 38 : 44,
    h: type === "coin" ? 38 : 44,
    phase: Math.random() * Math.PI * 2
  });
}

function makeScenery() {
  const types = ["torch", "palm", "bush", "lion", "flag"];
  const type = types[Math.floor(Math.random() * types.length)];
  scenery.push({
    type,
    x: innerWidth + 100,
    y: groundY(),
    scale: 0.65 + Math.random() * 0.45
  });
}

function rectsOverlap(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function playerBox() {
  if (player.sliding) {
    return {
      x: player.x + 7,
      y: player.y + 46,
      w: player.w + 3,
      h: 55
    };
  }
  return {
    x: player.x + 12,
    y: player.y + 9,
    w: player.w - 18,
    h: player.h - 12
  };
}

function obstacleBox(o) {
  return {
    x: o.x + 8,
    y: o.y - o.h + 8,
    w: o.w - 16,
    h: o.h - 8
  };
}

function collect(c) {
  if (c.type === "coin") {
    state.coins++;
    state.score += 100;
  } else if (c.type === "gem") {
    state.score += 500;
  } else if (c.type === "energy") {
    state.energy = 7000;
    state.score += 250;
  } else if (c.type === "shield") {
    state.shield = 7000;
    state.score += 250;
  } else if (c.type === "magnet") {
    state.magnet = 7000;
    state.score += 250;
  } else if (c.type === "wheel") {
    // The Konark Wheel is now a fixed heritage discovery, not a score collectible.
  }
}

function hitObstacle() {
  if (player.hitTimer > 0) return;

  if (state.shield > 0) {
    state.shield = 0;
    state.shake = 12;
    player.hitTimer = 450;
    state.score += 100;
    return;
  }

  state.lives--;
  state.shake = 16;
  player.hitTimer = 850;

  if (state.lives <= 0) gameOver();
}

function update(dt) {
  const dtSec = dt / 1000;

  state.speed = Math.min(13, 6 + state.distance / 700);
  state.worldX += state.speed * dtSec * 60;
  state.distance += state.speed * dtSec * 0.95;
  state.score += state.speed * dtSec * 3;
  if (!Number.isFinite(state.distance) || state.distance < 0) state.distance = 0;
  if (!Number.isFinite(state.score) || state.score < 0) state.score = 0;

  // Smooth sprite animation: use a stable frame rate independent of game FPS.
  // 62 ms ≈ 16 frames/sec, which is much smoother than the old 90 ms timing.
  let animState = "run";
  if (player.hitTimer > 0) animState = "hit";
  else if (player.sliding) animState = "slide";
  else if (!player.grounded) animState = "jump";

  if (player.animState !== animState) {
    player.animState = animState;
    player.frame = 0;
    player.frameTimer = 0;
  } else {
    player.frameTimer += dt;
    const frameDuration = animState === "run" ? 62 : 85;
    const frameCount = animState === "run" ? 8 : (animState === "jump" ? 3 : (animState === "slide" ? 3 : 2));
    while (player.frameTimer >= frameDuration) {
      player.frame = (player.frame + 1) % frameCount;
      player.frameTimer -= frameDuration;
    }
  }

  if (player.hitTimer > 0) player.hitTimer -= dt;
  if (state.shield > 0) state.shield -= dt;
  if (state.magnet > 0) state.magnet -= dt;
  if (state.energy > 0) state.energy -= dt;

  if (player.slideTimer > 0) {
    player.slideTimer -= dt;
    if (player.slideTimer <= 0) player.sliding = false;
  }

  // Physics are time-based so jumping remains consistent even when FPS changes.
  player.jumpCooldown = Math.max(0, player.jumpCooldown - dt);
  const wasGrounded = player.grounded;
  const gravity = 1900;
  player.vy += gravity * dtSec;
  player.y += player.vy * dtSec;

  const floorY = groundY() - player.h;
  if (player.y >= floorY) {
    player.y = floorY;
    player.vy = 0;
    player.grounded = true;
    player.coyoteTimer = 120;
  } else {
    player.grounded = false;
    if (wasGrounded) player.coyoteTimer = 120;
    else player.coyoteTimer = Math.max(0, player.coyoteTimer - dt);
  }

  state.spawnTimer += dt;
  state.collectibleTimer += dt;
  state.sceneryTimer += dt;

  const obstacleGap = Math.max(720, 1250 - state.distance * 0.7);
  if (state.spawnTimer > obstacleGap) {
    makeObstacle();
    state.spawnTimer = 0;
  }

  if (state.collectibleTimer > 500) {
    makeCollectible();
    state.collectibleTimer = 0;
  }

  if (state.sceneryTimer > 850) {
    makeScenery();
    state.sceneryTimer = 0;
  }

  obstacles.forEach(o => o.x -= state.speed * dtSec * 60);
  collectibles.forEach(c => {
    c.x -= state.speed * dtSec * 60;
    c.phase += dtSec * 4;

    if (state.magnet > 0) {
      const dx = player.x - c.x;
      const dy = (player.y + 45) - c.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 250) {
        c.x += dx * 0.04;
        c.y += dy * 0.04;
      }
    }
  });
  scenery.forEach(s => s.x -= state.speed * dtSec * 60);

  const pBox = playerBox();

  for (let i = obstacles.length - 1; i >= 0; i--) {
    const o = obstacles[i];
    if (o.x < -150) {
      obstacles.splice(i, 1);
      continue;
    }
    if (rectsOverlap(pBox, obstacleBox(o))) {
      hitObstacle();
      obstacles.splice(i, 1);
    }
  }

  for (let i = collectibles.length - 1; i >= 0; i--) {
    const c = collectibles[i];
    const cBox = { x: c.x, y: c.y, w: c.w, h: c.h };
    if (c.x < -100) {
      collectibles.splice(i, 1);
      continue;
    }
    if (rectsOverlap(pBox, cBox)) {
      collect(c);
      collectibles.splice(i, 1);
    }
  }

  for (let i = scenery.length - 1; i >= 0; i--) {
    if (scenery[i].x < -180) scenery.splice(i, 1);
  }

  if (state.shake > 0) state.shake -= dt * 0.04;

  updateHUD();

  checkHeritageDiscoveries();
  

  const allHeritageCollected = discoveredHeritage.size >= HERITAGE_DISCOVERIES.length;

  if (state.score >= TARGET_SCORE && allHeritageCollected) {
    completeLevel();
    return;
  }
}

function drawCoverImage(im, x, y, w, h, offsetX = 0) {
  if (!im) return;
  const iw = im.naturalWidth || im.width;
  const ih = im.naturalHeight || im.height;
  const scale = Math.max(w / iw, h / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = x + (w - dw) / 2 + offsetX;
  const dy = y + (h - dh) / 2;
  ctx.drawImage(im, dx, dy, dw, dh);
}

function drawBackground() {
  const w = innerWidth;
  const h = innerHeight;

  // Always paint the canvas first. This prevents a black/empty canvas if
  // an image is still loading or an asset path is wrong.
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#b48b55");
  sky.addColorStop(.48, "#6e684f");
  sky.addColorStop(1, "#2b1a0d");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  const bg = currentBackground();

  if (bg && bg.complete && bg.naturalWidth > 0) {
    const scale = Math.max(w / bg.naturalWidth, h * 0.82 / bg.naturalHeight);
    const bw = bg.naturalWidth * scale;
    const bh = bg.naturalHeight * scale;
    const offset = -(state.worldX * 0.08) % bw;

    for (let x = offset - bw; x < w + bw; x += bw) {
      ctx.drawImage(bg, x, 0, bw, bh);
    }
  } else {
    // Visible fallback landscape.
    ctx.fillStyle = "rgba(32, 54, 34, .72)";
    ctx.fillRect(0, h * .30, w, h * .50);
    ctx.fillStyle = "rgba(18, 23, 16, .9)";
    ctx.fillRect(0, h * .63, w, h * .37);

    // Distant temple silhouette.
    ctx.fillStyle = "rgba(50, 38, 24, .8)";
    const cx = w * .72;
    const baseY = h * .63;
    ctx.fillRect(cx - 95, baseY - 90, 190, 90);
    ctx.beginPath();
    ctx.moveTo(cx - 115, baseY - 90);
    ctx.lineTo(cx, baseY - 205);
    ctx.lineTo(cx + 115, baseY - 90);
    ctx.closePath();
    ctx.fill();
  }

  const grad = ctx.createLinearGradient(0, h * .45, 0, h);
  grad.addColorStop(0, "rgba(10,7,4,0)");
  grad.addColorStop(1, "rgba(10,7,4,.72)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

function drawGround() {
  const gy = groundY();
  ctx.fillStyle = "#2b1a0d";
  ctx.fillRect(0, gy, innerWidth, innerHeight - gy);

  ctx.fillStyle = "#8c5d25";
  ctx.fillRect(0, gy, innerWidth, 5);

  ctx.fillStyle = "rgba(255, 207, 102, .2)";
  const lineOffset = -(state.worldX * 1.5) % 80;
  for (let x = lineOffset; x < innerWidth; x += 80) {
    ctx.fillRect(x, gy + 13, 45, 3);
  }
}

function drawScenery() {
  for (const s of scenery) {
    const im = assets[s.type];
    if (!im || !im.complete || im.naturalWidth <= 0) continue;

    const targetH = (s.type === "palm" ? 145 : 105) * s.scale;
    const ratio = im.naturalWidth / im.naturalHeight;
    const width = targetH * ratio;

    ctx.globalAlpha = .88;
    ctx.drawImage(im, s.x, s.y - targetH, width, targetH);
    ctx.globalAlpha = 1;
  }
}

function drawPlayer() {
  const group = player.animState || "run";
  const count = group === "run" ? 8 : (group === "jump" ? 3 : (group === "slide" ? 3 : 2));
  // The run artwork is now one clean, transparent character pose. Instead of
  // using the old contaminated sprite-sheet crops, animate it with a subtle
  // smooth bob/squash so the character stays clean and never shows fragments.
  const im = group === "run" ? assets.run0 : assets[group + (player.frame % count)];
  ctx.save();

  if (player.hitTimer > 0 && Math.floor(player.hitTimer / 80) % 2 === 0) ctx.globalAlpha = .45;

  if (im && im.complete && im.naturalWidth > 0) {
    let targetH = group === "slide" ? 72 : 116;
    let bob = 0;
    let scaleX = 1;

    if (group === "run") {
      const t = performance.now() / 1000;
      const phase = t * 10.5;
      bob = Math.sin(phase) * 2.5;
      // Very subtle squash/stretch gives the single clean pose a smoother run feel.
      scaleX = 1 + Math.sin(phase * 2) * 0.018;
      targetH *= 1 - Math.sin(phase * 2) * 0.012;
    }

    const ratio = im.naturalWidth / im.naturalHeight;
    const dh = targetH;
    const dw = dh * ratio * scaleX;
    const x = player.x + (player.w - dw) / 2;
    const y = player.y + player.h - dh + bob;
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(im, x, y, dw, dh);
  }
  ctx.restore();
}
function drawObstacle(o) {
  const im = assets[o.type];

  if (im && im.complete && im.naturalWidth > 0) {
    const maxH = o.type === "spikes" ? 58 : 82;
    const ratio = im.naturalWidth / im.naturalHeight;
    const dh = maxH;
    const dw = dh * ratio;

    ctx.drawImage(im, o.x + (o.w - dw) * 0.5, o.y - dh, dw, dh);
  } else {
    ctx.fillStyle = "#55402d";
    ctx.fillRect(o.x, o.y - o.h, o.w, o.h);
  }
}

function drawCollectible(c) {
  const im = assets[c.type];
  if (!im || !im.complete || im.naturalWidth <= 0) return;

  const bob = Math.sin(c.phase) * 6;
  const targetH = c.type === "coin" ? 42 : 48;
  const ratio = im.naturalWidth / im.naturalHeight;
  const dw = targetH * ratio;

  ctx.save();
  ctx.shadowColor = "rgba(255, 210, 70, .75)";
  ctx.shadowBlur = c.type === "gem" || c.type === "wheel" ? 16 : 8;
  ctx.drawImage(im, c.x, c.y + bob, dw, targetH);
  ctx.restore();
}

function draw() {
  ctx.save();

  if (state.shake > 0) {
    ctx.translate((Math.random() - .5) * state.shake, (Math.random() - .5) * state.shake);
  }

  drawBackground();
  drawScenery();
  drawGround();
  drawHeritageDiscoveries();
  

  for (const c of collectibles) drawCollectible(c);
  for (const o of obstacles) drawObstacle(o);

  drawPlayer();

  if (state.energy > 0) {
    ctx.strokeStyle = "rgba(255, 224, 94, .65)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(player.x + player.w / 2, player.y + player.h / 2, 55 + Math.sin(performance.now()/90)*4, 0, Math.PI*2);
    ctx.stroke();
  }

  if (state.shield > 0) {
    ctx.strokeStyle = "rgba(95, 211, 255, .85)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(player.x + player.w / 2, player.y + player.h / 2, 48, 0, Math.PI*2);
    ctx.stroke();
  }

  ctx.restore();
}


function updateTargetHUD() {
  if (!targetProgressEl) return;
  const current = Math.min(TARGET_SCORE, Math.max(0, Math.floor(state.score || 0)));
  targetProgressEl.textContent = `TARGET ${current} / ${TARGET_SCORE}`;
}

function updateHUD() {
  const safeScore = Number.isFinite(state.score) ? Math.max(0, state.score) : 0;
  const safeDistance = Number.isFinite(state.distance) ? Math.max(0, state.distance) : 0;
  const safeCoins = Number.isFinite(state.coins) ? Math.max(0, state.coins) : 0;
  const biome = currentBiome();
  const bgInfo = imageFiles.backgrounds[biome] || imageFiles.backgrounds[0];

  scoreEl.textContent = Math.floor(safeScore);
  coinsEl.textContent = Math.floor(safeCoins);
  distanceEl.textContent = Math.floor(safeDistance) + " m";
  locationEl.textContent = bgInfo ? bgInfo[0] : "KONARK TEMPLE";

  heartsEl.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    const s = document.createElement("span");
    s.className = "heart";
    s.textContent = i < state.lives ? "❤️" : "🖤";
    heartsEl.appendChild(s);
  }

  document.getElementById("shieldPower").classList.toggle("active", state.shield > 0);
  document.getElementById("magnetPower").classList.toggle("active", state.magnet > 0);
  document.getElementById("energyPower").classList.toggle("active", state.energy > 0);
  updateTargetHUD();
}

function loop(now) {
  if (!state.running || state.paused) return;

  const rawDt = now - state.lastTime;
  const dt = Math.min(34, Math.max(1, Number.isFinite(rawDt) ? rawDt : 16));
  state.lastTime = now;

  update(dt);
  draw();

  if (state.running) requestAnimationFrame(loop);
}

window.addEventListener("keydown", e => {
  if (e.code === "ArrowUp" || e.code === "Space" || e.code === "KeyW") {
    e.preventDefault();
    jump();
  }
  if (e.code === "ArrowDown" || e.code === "KeyS") {
    e.preventDefault();
    slide();
  }
  if (e.code === "KeyP") {
    e.preventDefault();
    togglePause();
  }

  if (e.code === "Escape") {
    e.preventDefault();
    if (state.running && !state.over) {
      if (!state.paused) {
        state.paused = true;
        pauseOverlay.classList.remove("hidden");
        pauseGameMusic();
      } else {
        state.paused = false;
        pauseOverlay.classList.add("hidden");
        playGameMusic();
        state.lastTime = performance.now();
        requestAnimationFrame(loop);
      }
    }
  }
  if (e.code === "KeyR" && state.over) {
    resetGame();
    startGame();
  }
});

document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("pauseBtn").addEventListener("click", togglePause);
document.getElementById("resumeBtn").addEventListener("click", togglePause);
document.getElementById("quitBtn").addEventListener("click", quitGame);
document.getElementById("restartBtn").addEventListener("click", () => {
  resetGame();
  startGame();
});

document.getElementById("jumpPad").addEventListener("pointerdown", jump);
document.getElementById("slidePad").addEventListener("pointerdown", slide);

canvas.addEventListener("pointerdown", e => {
  if (e.clientY < innerHeight * 0.78 || e.clientX > innerWidth * .5) jump();
  else slide();
});

resize();
resetGame();
draw();
loadAssets().catch(err => {
  console.error("Asset loading failed:", err);
  assetsReady = true;
  draw();
});



if (musicBtn) {
  musicBtn.addEventListener("click", () => {
    musicEnabled = !musicEnabled;
    if (musicEnabled) {
      if (state.running && !state.paused && !state.over) playGameMusic();
    } else {
      pauseGameMusic();
    }
    updateMusicButton();
  });
  updateMusicButton();
}


document.getElementById("completeContinueBtn")?.addEventListener("click", () => {
  levelCompleteOverlay?.classList.add("hidden");
  startScreen?.classList.remove("hidden");
  resetGame();
});


function checkHeritageDiscoveries() {
  if (levelCompleted || !state.running) return;
  const scroll = Number.isFinite(state.worldX) ? state.worldX : 0;
  const playerScreenX = player.x;

  for (const item of HERITAGE_DISCOVERIES) {
    if (discoveredHeritage.has(item.id)) continue;
    const screenX = item.x - scroll;
    if (Math.abs(screenX - playerScreenX) < 95) {
      discoveredHeritage.add(item.id);
      updateCollectionHUD?.();
      break;
    }
  }
}

function openHeritageDiscovery(item) {
  discoveredHeritage.add(item.id);
  updateCollectionHUD?.();
}

function continueFromHeritage() {
  heritagePaused = false;
  activeHeritage = null;
  document.getElementById("heritageOverlay")?.classList.add("hidden");
}



function drawHeritageDiscoveries() {
  const scroll = Number.isFinite(state.worldX) ? state.worldX : 0;

  for (const item of HERITAGE_DISCOVERIES) {
    if (discoveredHeritage.has(item.id)) continue;

    const x = item.x - scroll;
    if (x < -130 || x > innerWidth + 130) continue;

    const baseY = groundY() - 12;
    const bob = Math.sin(performance.now() / 300 + item.x) * 4;

    ctx.save();
    ctx.textAlign = "center";
    ctx.font = "42px serif";
    ctx.shadowColor = "rgba(255, 205, 80, .9)";
    ctx.shadowBlur = 18;
    ctx.fillText(item.icon, x, baseY - 55 + bob);

    ctx.shadowBlur = 0;
    ctx.font = "700 12px Arial, sans-serif";
    ctx.fillStyle = "#ffe7a6";
    ctx.fillText(item.title.toUpperCase(), x, baseY - 10 + bob);

    ctx.strokeStyle = "rgba(255, 220, 130, .55)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, baseY - 42 + bob, 31, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}















updateCollectionHUD();


// ENTER = CONTINUE anywhere a continue button is currently visible.
window.addEventListener("keydown", (e) => {
  if (e.code !== "Enter" && e.key !== "Enter") return;

  const heritageOverlay = document.getElementById("heritageOverlay");
  const keyOverlay = document.getElementById("keyMessageOverlay");
  const completeOverlay = document.getElementById("levelCompleteOverlay");

  if (heritageOverlay && !heritageOverlay.classList.contains("hidden")) {
    e.preventDefault();
    document.getElementById("heritageContinueBtn")?.click();
    return;
  }

  if (keyOverlay && !keyOverlay.classList.contains("hidden")) {
    e.preventDefault();
    document.getElementById("keyMessageContinue")?.click();
    return;
  }

  if (completeOverlay && !completeOverlay.classList.contains("hidden")) {
    e.preventDefault();
    document.getElementById("completeContinueBtn")?.click();
  }
});
