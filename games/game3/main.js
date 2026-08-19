// ==========================================
// 1. SAMBALPURI FOLK INSTRUMENTAL AUDIO ENGINE
// ==========================================
let audioCtx = null;
let masterGain = null;
let isPlaying = false;
let isMuted = false;

// Folk Scale Frequencies (A Pentatonic)
const FOLK_SCALE = [220.00, 277.18, 293.66, 329.63, 392.00, 440.00];

function initSambalpuriAudio() {
  if (audioCtx) return;

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContext();

  masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.5, audioCtx.currentTime);
  masterGain.connect(audioCtx.destination);

  isPlaying = true;

  // Start parallel looping audio threads
  startDholPulse(audioCtx, masterGain);
  startTasaRhythm(audioCtx, masterGain);
  startFolkFluteMelody(audioCtx, masterGain);
}

// Bottom-Right Action: Double-click to mute music
function muteMusic() {
  if (masterGain && audioCtx) {
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
    isMuted = true;
  }
}

// Bottom-Left Action: Click to restart/unmute music
function playMusic() {
  if (!audioCtx) {
    initSambalpuriAudio();
  } else if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  if (masterGain && isMuted) {
    masterGain.gain.setValueAtTime(0.5, audioCtx.currentTime);
    isMuted = false;
  }
}

function startDholPulse(ctx, destination) {
  let beatIndex = 0;

  function playDhol() {
    if (isPlaying) {
      const now = ctx.currentTime;

      if (beatIndex % 2 === 0) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.18);

        gain.gain.setValueAtTime(0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.20);

        osc.connect(gain);
        gain.connect(destination);

        osc.start(now);
        osc.stop(now + 0.21);
      }

      beatIndex = (beatIndex + 1) % 4;
    }
    setTimeout(playDhol, 227);
  }

  playDhol();
}

function startTasaRhythm(ctx, destination) {
  let step = 0;

  function playTasa() {
    if (isPlaying) {
      const now = ctx.currentTime;

      if (step % 2 !== 0 || step === 3) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(950, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.connect(gain);
        gain.connect(destination);

        osc.start(now);
        osc.stop(now + 0.07);
      }

      step = (step + 1) % 8;
    }
    setTimeout(playTasa, 113);
  }

  playTasa();
}

function startFolkFluteMelody(ctx, destination) {
  const melodySequence = [0, 2, 3, 4, 3, 2, 4, 5, 4, 3, 2, 0];
  let noteIndex = 0;

  function playFluteNote() {
    if (isPlaying) {
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const freq = FOLK_SCALE[melodySequence[noteIndex]];

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(destination);

      osc.start(now);
      osc.stop(now + 0.23);

      noteIndex = (noteIndex + 1) % melodySequence.length;
    }
    setTimeout(playFluteNote, 227);
  }

  playFluteNote();
}

// ==========================================
// 2. DATA DEFINITIONS FOR ALL DISHES
// ==========================================
const DISH_DATA = {
  "Chhena Poda": [
    { name: "Chenna", fileName: "chenna.jpeg", isCorrect: true },
    { name: "Sugar", fileName: "sugar.jpg", isCorrect: true },
    { name: "Cashews", fileName: "cashews.jpg", isCorrect: true },
    { name: "Ghee", fileName: "ghee.jpeg", isCorrect: false },
    { name: "Cardamom", fileName: "cardamom.jpeg", isCorrect: false },
    { name: "Cheese", fileName: "cheese.jpeg", isCorrect: false },
    { name: "White Sugar", fileName: "white sugar.jpeg", isCorrect: false },
    { name: "Saffron", fileName: "saffron.jpeg", isCorrect: false }
  ],
  "Dalma": [
    { name: "Toor Dal", fileName: "chenna.jpeg", isCorrect: true },
    { name: "Raw Banana", fileName: "sugar.jpg", isCorrect: true },
    { name: "Pumpkin", fileName: "cashews.jpg", isCorrect: true },
    { name: "Ghee", fileName: "ghee.jpeg", isCorrect: false },
    { name: "Cardamom", fileName: "cardamom.jpeg", isCorrect: false },
    { name: "Cheese", fileName: "cheese.jpeg", isCorrect: false },
    { name: "White Sugar", fileName: "white sugar.jpeg", isCorrect: false },
    { name: "Saffron", fileName: "saffron.jpeg", isCorrect: false }
  ],
  "Rasagola": [
    { name: "Chenna", fileName: "chenna.jpeg", isCorrect: true },
    { name: "Sugar Syrup", fileName: "sugar.jpg", isCorrect: true },
    { name: "Semolina", fileName: "cashews.jpg", isCorrect: true },
    { name: "Cardamom", fileName: "cardamom.jpeg", isCorrect: true },
    { name: "Ghee", fileName: "ghee.jpeg", isCorrect: false },
    { name: "Cheese", fileName: "cheese.jpeg", isCorrect: false },
    { name: "White Sugar", fileName: "white sugar.jpeg", isCorrect: false },
    { name: "Saffron", fileName: "saffron.jpeg", isCorrect: false }
  ]
};

let selectedDishName = "";
let ALL_INGREDIENTS = [];
let FAKE_ITEMS_COUNT = 0;
let fakesRemoved = 0;

let memoryPhase = true;
let memoryTimer = null;
let selectionTimer = null;
let isDalmaUnlocked = false;
const meshes = [];

const DISPLAY_BG = "increade_the_width_of_the_202608141225.jpeg";
const SELECTION_BG = "bg.jpeg";

// ==========================================
// 3. THREE.JS SCENE SETUP
// ==========================================
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(0, 0, 7);
camera.lookAt(0, 0, 0);

const textureLoader = new THREE.TextureLoader();

function goToMenu() {
  initSambalpuriAudio();

  document.getElementById("start-page").style.display = "none";
  document.getElementById("selection-menu").style.display = "flex";
  
  // Show audio controls on all pages except cover page
  document.getElementById("audio-controls").style.display = "flex";
}

function clearScene() {
  meshes.forEach(m => scene.remove(m));
  meshes.length = 0;
}

function selectDish(dish) {
  clearInterval(memoryTimer);
  clearInterval(selectionTimer);

  selectedDishName = dish;
  ALL_INGREDIENTS = DISH_DATA[dish];
  FAKE_ITEMS_COUNT = ALL_INGREDIENTS.filter(item => !item.isCorrect).length;
  fakesRemoved = 0;
  memoryPhase = true;

  textureLoader.load(`assets/${DISPLAY_BG}`, (texture) => {
    scene.background = texture;
  });

  clearScene();

  document.getElementById("start-page").style.display = "none";
  document.getElementById("selection-menu").style.display = "none";
  document.getElementById("ui").style.display = "block";
  document.getElementById("timer").style.display = "block";
  document.getElementById("instructions").innerText = `Memorize authentic ingredients for ${selectedDishName}!`;

  displayMemoryPhase();
  startMemoryTimer();
}

// ==========================================
// 4. MESH CREATION & PHASE LOGIC
// ==========================================
function createIngredientMesh(data, posX, posY, width = 1.3, height = 1.1) {
  const geometry = new THREE.BoxGeometry(width, height, 0.05);
  const texture = textureLoader.load(`assets/${data.fileName}`);
  const material = new THREE.MeshBasicMaterial({ map: texture });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(posX, posY, 0);
  mesh.userData = data;
  scene.add(mesh);
  return mesh;
}

function displayMemoryPhase() {
  clearScene();
  const correctItems = ALL_INGREDIENTS.filter(item => item.isCorrect);
  
  const itemWidth = 2.6;
  const itemHeight = 1.7;
  const spacingX = 3.2;

  correctItems.forEach((item, index) => {
    const posX = (index - (correctItems.length - 1) / 2) * spacingX;
    meshes.push(createIngredientMesh(item, posX, -0.05, itemWidth, itemHeight));
  });
}

function startMemoryTimer() {
  let memoryTimeLeft = 10;
  const timerElement = document.getElementById("time");
  timerElement.innerText = memoryTimeLeft;

  memoryTimer = setInterval(() => {
    memoryTimeLeft--;
    timerElement.innerText = memoryTimeLeft;
    if (memoryTimeLeft <= 0) {
      clearInterval(memoryTimer);
      startSelectionPhase();
    }
  }, 1000);
}

function startSelectionPhase() {
  memoryPhase = false;
  document.getElementById("instructions").innerText = `Click ONLY the extra ingredients NOT used in ${selectedDishName}!`;

  textureLoader.load(`assets/${SELECTION_BG}`, (texture) => {
    scene.background = texture;
  });

  clearScene();

  const cols = 4;
  const itemWidth = 2.1;
  const itemHeight = 1.6;
  
  const spacingX = 2.4; 
  const spacingY = 2.4;
  const startY = 1.2;

  ALL_INGREDIENTS.forEach((item, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);

    const posX = (col - (cols - 1) / 2) * spacingX;
    const posY = startY - (row * spacingY);

    meshes.push(createIngredientMesh(item, posX, posY, itemWidth, itemHeight));
  });

  let selectionTimeLeft = 20;
  const timerElement = document.getElementById("time");
  timerElement.innerText = selectionTimeLeft;

  selectionTimer = setInterval(() => {
    selectionTimeLeft--;
    timerElement.innerText = selectionTimeLeft;

    if (selectionTimeLeft <= 0) {
      clearInterval(selectionTimer);
      if (fakesRemoved < FAKE_ITEMS_COUNT) {
        handleLoss();
      }
    }
  }, 1000);
}

// ==========================================
// 5. VICTORY / LOSS / MENU HANDLERS
// ==========================================
function handleVictory() {
  clearInterval(selectionTimer);
  clearInterval(memoryTimer);
  memoryPhase = true;
  isDalmaUnlocked = true;

  setTimeout(() => {
    document.getElementById("victory-modal").style.display = "flex";
  }, 500);
}

function handleLoss() {
  clearInterval(selectionTimer);
  clearInterval(memoryTimer);
  memoryPhase = true;

  setTimeout(() => {
    document.getElementById("loss-modal").style.display = "flex";
  }, 500);
}

function returnToMenu() {
  clearInterval(selectionTimer);
  clearInterval(memoryTimer);
  
  clearScene();

  document.getElementById("victory-modal").style.display = "none";
  document.getElementById("loss-modal").style.display = "none";
  document.getElementById("ui").style.display = "none";
  document.getElementById("selection-menu").style.display = "flex";
  document.getElementById("audio-controls").style.display = "flex";

  if (isDalmaUnlocked) {
    const dalmaBtn = document.getElementById("btn-dalma");
    dalmaBtn.className = "unlocked-btn";
    dalmaBtn.removeAttribute("disabled");
    dalmaBtn.innerText = "🔓 Dalma";
    dalmaBtn.onclick = () => selectDish("Dalma");
  }
}

// ==========================================
// 6. RAYCASTING & RENDER LOOP
// ==========================================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click", (event) => {
  if (memoryPhase) return;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(meshes);

  if (intersects.length > 0) {
    const selectedObj = intersects[0].object;
    const isCorrect = selectedObj.userData.isCorrect;

    if (!isCorrect) {
      scene.remove(selectedObj);
      const index = meshes.indexOf(selectedObj);
      if (index > -1) meshes.splice(index, 1);

      fakesRemoved++;

      if (fakesRemoved === FAKE_ITEMS_COUNT) {
        handleVictory();
      } else {
        document.getElementById("instructions").innerText = "Good job! Find the remaining extra ingredient(s)!";
      }
    } else {
      handleLoss();
    }
  }
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();