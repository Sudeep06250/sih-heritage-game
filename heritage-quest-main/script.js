// Heritage Quest - Interaction & Ambient Sparks
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const container = document.getElementById('heritageQuestApp');
    const canvas = document.getElementById('ambientCanvas');
    const ctx = canvas.getContext('2d');
    
    const startBtn = document.getElementById('startBtn');
    const storyModal = document.getElementById('storyModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const questBtns = document.querySelectorAll('.quest-btn');
    const bgMusic = document.getElementById('bgMusic');

    // Music Elements & Controls
    const musicToggleBtn = document.getElementById('musicToggleBtn');
    const musicIcon = document.getElementById('musicIcon');
    const musicLabel = document.getElementById('musicLabel');

    bgMusic.volume = 0.4;
    bgMusic.loop = true;

    // Check user preference (Default is UNMUTED / ON)
    let isExplicitlyMuted = localStorage.getItem('heritageMusicMuted') === 'true';
    let isAudioPlaying = false;

    function updateMusicUI(state) {
        if (!musicToggleBtn) return;
        if (state === 'playing') {
            musicToggleBtn.classList.remove('is-muted');
            musicToggleBtn.classList.remove('needs-gesture');
            if (musicIcon) musicIcon.textContent = '🔊';
            if (musicLabel) musicLabel.textContent = 'Music: ON';
            musicToggleBtn.setAttribute('title', 'Music is playing. Click to turn OFF.');
        } else if (state === 'waiting') {
            musicToggleBtn.classList.remove('is-muted');
            musicToggleBtn.classList.add('needs-gesture');
            if (musicIcon) musicIcon.textContent = '🎵';
            if (musicLabel) musicLabel.textContent = 'Click to Play';
            musicToggleBtn.setAttribute('title', 'Browser blocked autoplay. Click anywhere or click here to start music!');
        } else {
            musicToggleBtn.classList.add('is-muted');
            musicToggleBtn.classList.remove('needs-gesture');
            if (musicIcon) musicIcon.textContent = '🔇';
            if (musicLabel) musicLabel.textContent = 'Music: OFF';
            musicToggleBtn.setAttribute('title', 'Music is OFF. Click to turn ON.');
        }
    }

    // Restore playback timestamp from previous page
    function restorePlaybackPosition() {
        const savedTime = sessionStorage.getItem('heritageMusicTime');
        if (savedTime && !isNaN(parseFloat(savedTime))) {
            try {
                bgMusic.currentTime = parseFloat(savedTime);
            } catch (e) {}
        }
    }

    // Track currentTime continuously and save before navigating
    bgMusic.addEventListener('timeupdate', () => {
        if (!bgMusic.paused && bgMusic.currentTime > 0) {
            sessionStorage.setItem('heritageMusicTime', bgMusic.currentTime.toString());
        }
    });

    window.addEventListener('beforeunload', () => {
        if (bgMusic.currentTime > 0) {
            sessionStorage.setItem('heritageMusicTime', bgMusic.currentTime.toString());
        }
    });

    function playAudio() {
        if (isExplicitlyMuted) return;
        restorePlaybackPosition();
        bgMusic.muted = false;
        
        const promise = bgMusic.play();
        if (promise !== undefined) {
            promise.then(() => {
                isAudioPlaying = true;
                updateMusicUI('playing');
            }).catch(() => {
                // Browser Autoplay Policy: Audio requires 1 click/touch anywhere on the page
                isAudioPlaying = false;
                updateMusicUI('waiting');
            });
        }
    }

    function pauseAudio() {
        isExplicitlyMuted = true;
        isAudioPlaying = false;
        localStorage.setItem('heritageMusicMuted', 'true');
        bgMusic.pause();
        updateMusicUI('muted');
    }

    // 1. Initial State Setup
    if (isExplicitlyMuted) {
        updateMusicUI('muted');
    } else {
        updateMusicUI('waiting');
        playAudio();
    }

    // 2. Global Unlocker: Starts audio instantly on user's first click or touch
    function unlockAudioOnGesture() {
        if (!isExplicitlyMuted && bgMusic.paused) {
            playAudio();
        }
    }

    ['click', 'pointerdown', 'mousedown', 'touchstart', 'keydown'].forEach(evt => {
        window.addEventListener(evt, unlockAudioOnGesture, { capture: true, passive: true });
    });

    // 3. Direct Toggle Button Handler
    if (musicToggleBtn) {
        musicToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (bgMusic.paused) {
                isExplicitlyMuted = false;
                localStorage.setItem('heritageMusicMuted', 'false');
                playAudio();
            } else {
                pauseAudio();
            }
        });
    }

    // Button Interaction - Navigate to player info page
    startBtn.addEventListener('click', () => {
        window.location.href = 'playerinfo.html';
    });

    closeModalBtn.addEventListener('click', () => {
        storyModal.classList.remove('active');
    });

    // Close modal if clicking outside the card
    storyModal.addEventListener('click', (e) => {
        if (e.target === storyModal) {
            storyModal.classList.remove('active');
        }
    });

    // Quest Card initialization handlers
    questBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.quest-card');
            const questTitle = card.querySelector('h3').textContent;
            
            // Button transition effect
            btn.textContent = "INITIALIZING...";
            btn.style.background = "#ffdf8d";
            btn.style.color = "#000000";
            btn.style.borderColor = "#ffdf8d";
            
            setTimeout(() => {
                alert(`Starting: ${questTitle}\nPreparing story chapters and mapping coordinates...`);
                btn.textContent = "Initialize Quest";
                btn.style.background = "transparent";
                btn.style.color = "#ffe699";
                btn.style.borderColor = "#d7973c";
                storyModal.classList.remove('active');
            }, 1200);
        });
    });

    // Resize canvas to match the container resolution
    function resizeCanvas() {
        const rect = container.getBoundingClientRect();
        // Set canvas buffer sizes to match the display size of the aspect-ratio locked container
        canvas.width = rect.width;
        canvas.height = rect.height;
    }

    window.addEventListener('resize', resizeCanvas);
    // Initial size setup
    resizeCanvas();

    // Particle System (Warm embers floating up)
    const particles = [];
    const maxParticles = 40;

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            // Spawn mostly near the bottom center and sides where the torches/fire appear in the artwork
            this.y = canvas.height + Math.random() * 20;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedY = -(Math.random() * 0.8 + 0.3);
            this.speedX = (Math.random() - 0.5) * 0.4;
            // Warm amber color palette with random opacity
            this.opacity = Math.random() * 0.6 + 0.2;
            this.fadeSpeed = Math.random() * 0.003 + 0.001;
            // Sway cycle
            this.swayAngle = Math.random() * Math.PI * 2;
            this.swaySpeed = Math.random() * 0.02 + 0.01;
        }

        update() {
            this.y += this.speedY;
            
            // Sway left/right gently using sine wave
            this.swayAngle += this.swaySpeed;
            this.x += this.speedX + Math.sin(this.swayAngle) * 0.15;
            
            // Fade out as it floats higher
            this.opacity -= this.fadeSpeed;

            // Reset when it goes off screen or completely fades out
            if (this.y < 0 || this.opacity <= 0) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            
            // Outer glow path
            const glowGradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size * 2
            );
            glowGradient.addColorStop(0, `rgba(255, 230, 153, ${this.opacity})`);
            glowGradient.addColorStop(0.3, `rgba(215, 151, 60, ${this.opacity * 0.8})`);
            glowGradient.addColorStop(1, 'rgba(215, 151, 60, 0)');
            
            ctx.fillStyle = glowGradient;
            ctx.fill();
            ctx.restore();
        }
    }

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
        // Distribute them vertically initially so they don't all spawn at the bottom at once
        const p = new Particle();
        p.y = Math.random() * canvas.height;
        particles.push(p);
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        requestAnimationFrame(animate);
    }

    // Start particles loop
    animate();

    // Ensure resizing handles canvas initialization properly
    // (sometimes browser bounding rects load late due to web fonts)
    setTimeout(resizeCanvas, 500);
});
