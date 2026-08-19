// Player Info Page - Professional Interaction & Ambient Sparks
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const container = document.getElementById('heritageQuestApp');
    const canvas = document.getElementById('ambientCanvas');
    const ctx = canvas.getContext('2d');
    const bgMusic = document.getElementById('bgMusic');
    const playerForm = document.getElementById('playerForm');
    const submitBtn = document.getElementById('submitBtn');

    // Input Elements
    const nameInput = document.getElementById('playerName');
    const emailInput = document.getElementById('playerEmail');
    const ageInput = document.getElementById('playerAge');
    const phoneInput = document.getElementById('playerPhone');
    const phoneGroup = document.getElementById('phoneInputGroup');

    // Error Elements
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const ageError = document.getElementById('ageError');
    const phoneError = document.getElementById('phoneError');

    // Toast Modal Elements
    const successToast = document.getElementById('successToast');
    const toastTitle = document.getElementById('toastTitle');
    const toastDesc = document.getElementById('toastDesc');
    const toastOkBtn = document.getElementById('toastOkBtn');

    // 1. Pre-fill Saved Data from localStorage if available
    function loadSavedProfile() {
        const savedName = localStorage.getItem('playerName');
        const savedEmail = localStorage.getItem('playerEmail');
        const savedAge = localStorage.getItem('playerAge');
        const savedPhone = localStorage.getItem('playerPhone');

        if (savedName) nameInput.value = savedName;
        if (savedEmail) emailInput.value = savedEmail;
        if (savedAge) ageInput.value = savedAge;
        if (savedPhone) {
            // Strip +91 for display in prefixed field
            const clean = savedPhone.replace('+91', '').trim();
            phoneInput.value = formatPhoneNumber(clean);
        }
    }
    loadSavedProfile();

    // 2. Validation Functions (Professional Standards)
    function validateName(val) {
        const trimmed = val.trim();
        // Min 2 chars, letters, spaces, hyphens, apostrophes only (no random symbols/numbers)
        const nameRegex = /^[A-Za-z\s'\.\-]{2,50}$/;
        if (!trimmed) {
            return { valid: false, msg: 'Full Name is required.' };
        }
        if (trimmed.length < 2) {
            return { valid: false, msg: 'Name must be at least 2 characters.' };
        }
        if (!nameRegex.test(trimmed)) {
            return { valid: false, msg: 'Name should only contain letters and spaces.' };
        }
        return { valid: true };
    }

    function validateEmail(val) {
        const trimmed = val.trim();
        // RFC-compliant practical email regex
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
        if (!trimmed) {
            return { valid: false, msg: 'Email address is required.' };
        }
        if (!emailRegex.test(trimmed)) {
            return { valid: false, msg: 'Please enter a valid email address (e.g. name@domain.com).' };
        }
        return { valid: true };
    }

    function validateAge(val) {
        const trimmed = String(val).trim();
        if (!trimmed) {
            return { valid: false, msg: 'Age is required.' };
        }
        const num = parseInt(trimmed, 10);
        if (isNaN(num) || num < 5 || num > 110) {
            return { valid: false, msg: 'Please enter a valid age between 5 and 110.' };
        }
        return { valid: true };
    }

    function formatPhoneNumber(value) {
        // Keep only digits
        const digits = value.replace(/\D/g, '').slice(0, 10);
        if (digits.length > 5) {
            return `${digits.slice(0, 5)} ${digits.slice(5)}`;
        }
        return digits;
    }

    function validatePhone(val) {
        const digits = val.replace(/\D/g, '');
        if (!digits) {
            return { valid: false, msg: 'Mobile number is required.' };
        }
        if (digits.length !== 10) {
            return { valid: false, msg: 'Mobile number must be exactly 10 digits.' };
        }
        // Valid Indian mobile numbers start with 6, 7, 8, or 9
        if (!/^[6-9]/.test(digits)) {
            return { valid: false, msg: 'Indian mobile numbers must start with 6, 7, 8, or 9.' };
        }
        return { valid: true };
    }

    // Helper UI State Handlers
    function setFieldState(inputEl, errorEl, result, wrapperEl = null) {
        const target = wrapperEl || inputEl;
        if (result.valid) {
            target.classList.remove('is-invalid');
            target.classList.add('is-valid');
            errorEl.classList.remove('active');
            errorEl.textContent = '';
        } else {
            target.classList.remove('is-valid');
            target.classList.add('is-invalid');
            errorEl.textContent = result.msg;
            errorEl.classList.add('active');
        }
        return result.valid;
    }

    // 3. Real-Time Event Listeners
    // Name Input
    nameInput.addEventListener('input', () => {
        if (nameInput.value.length > 0) {
            setFieldState(nameInput, nameError, validateName(nameInput.value));
        } else {
            nameInput.classList.remove('is-valid', 'is-invalid');
            nameError.classList.remove('active');
        }
    });
    nameInput.addEventListener('blur', () => {
        if (nameInput.value.trim().length > 0) {
            setFieldState(nameInput, nameError, validateName(nameInput.value));
        }
    });

    // Email Input
    emailInput.addEventListener('input', () => {
        if (emailInput.value.length > 0) {
            setFieldState(emailInput, emailError, validateEmail(emailInput.value));
        } else {
            emailInput.classList.remove('is-valid', 'is-invalid');
            emailError.classList.remove('active');
        }
    });
    emailInput.addEventListener('blur', () => {
        if (emailInput.value.trim().length > 0) {
            setFieldState(emailInput, emailError, validateEmail(emailInput.value));
        }
    });

    // Age Input - Prevent non-numeric characters (e, +, -, .)
    ageInput.addEventListener('keydown', (e) => {
        if (['e', 'E', '+', '-', '.'].includes(e.key)) {
            e.preventDefault();
        }
    });
    ageInput.addEventListener('input', () => {
        if (ageInput.value.length > 0) {
            setFieldState(ageInput, ageError, validateAge(ageInput.value));
        } else {
            ageInput.classList.remove('is-valid', 'is-invalid');
            ageError.classList.remove('active');
        }
    });
    ageInput.addEventListener('blur', () => {
        if (ageInput.value.trim().length > 0) {
            setFieldState(ageInput, ageError, validateAge(ageInput.value));
        }
    });

    // Phone Input - Auto Format & Digits only
    phoneInput.addEventListener('input', (e) => {
        const raw = e.target.value;
        const formatted = formatPhoneNumber(raw);
        e.target.value = formatted;

        const digits = formatted.replace(/\D/g, '');
        if (digits.length === 10) {
            setFieldState(phoneInput, phoneError, validatePhone(digits), phoneGroup);
        } else if (digits.length > 0) {
            phoneGroup.classList.remove('is-valid');
            phoneGroup.classList.remove('is-invalid');
            phoneError.classList.remove('active');
        }
    });
    phoneInput.addEventListener('blur', () => {
        if (phoneInput.value.trim().length > 0) {
            setFieldState(phoneInput, phoneError, validatePhone(phoneInput.value), phoneGroup);
        }
    });

    // Google Apps Script Web App Endpoint
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxoY1Rk0ZoJerFwOyWQnzb2vPY9YR4s00e6EGBp9H7aJVQA1yT6vcf-bFNLgYwYhDQ/exec';

    // 4. Form Submission Handler
    playerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameVal = nameInput.value;
        const emailVal = emailInput.value;
        const ageVal = ageInput.value;
        const phoneVal = phoneInput.value;

        const isNameValid = setFieldState(nameInput, nameError, validateName(nameVal));
        const isEmailValid = setFieldState(emailInput, emailError, validateEmail(emailVal));
        const isAgeValid = setFieldState(ageInput, ageError, validateAge(ageVal));
        const isPhoneValid = setFieldState(phoneInput, phoneError, validatePhone(phoneVal), phoneGroup);

        if (isNameValid && isEmailValid && isAgeValid && isPhoneValid) {
            const rawDigits = phoneVal.replace(/\D/g, '');
            const fullPhone = `+91 ${rawDigits.slice(0, 5)} ${rawDigits.slice(5)}`;

            // Save to localStorage
            localStorage.setItem('playerName', nameVal.trim());
            localStorage.setItem('playerEmail', emailVal.trim().toLowerCase());
            localStorage.setItem('playerAge', ageVal.trim());
            localStorage.setItem('playerPhone', fullPhone);

            // Button loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span class="spinner"></span> <span>BEGINNING QUEST...</span>`;

            // Prepare payload for Google Apps Script
            const payload = {
                fullName: nameVal.trim(),
                name: nameVal.trim(),
                email: emailVal.trim().toLowerCase(),
                age: ageVal.trim(),
                mobileNumber: fullPhone,
                mobile: fullPhone,
                phone: fullPhone,
                submittedAt: new Date().toISOString()
            };

            try {
                // Send POST request with mode: 'no-cors'
                await fetch(SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
            } catch (err) {
                console.warn('Endpoint submission warning (handled gracefully):', err);
            }

            // Smooth transition & redirect to the next quest page
            setTimeout(() => {
                window.location.href = 'map/map.html';
            }, 600);
        } else {
            // Shake first invalid field
            const firstInvalid = document.querySelector('.is-invalid input') || document.querySelector('input.is-invalid');
            if (firstInvalid) {
                firstInvalid.focus();
            }
        }
    });

    // Toast button click -> Redirect to next quest page
    toastOkBtn.addEventListener('click', () => {
        successToast.classList.remove('show');
        window.location.href = 'map/map.html';
    });

    // 5. Audio Control via Dedicated Button
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

    // 2. Global Instant Unlocker: Starts audio on ANY cursor movement, hover, touch or click
    function unlockAudioOnGesture() {
        if (!isExplicitlyMuted && bgMusic.paused) {
            playAudio();
        }
    }

    const allGestures = ['mousemove', 'pointermove', 'mouseenter', 'mouseover', 'wheel', 'click', 'pointerdown', 'mousedown', 'touchstart', 'keydown'];
    allGestures.forEach(evt => {
        window.addEventListener(evt, unlockAudioOnGesture, { capture: true, passive: true });
        document.addEventListener(evt, unlockAudioOnGesture, { capture: true, passive: true });
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

    // 6. Particle Canvas System
    function resizeCanvas() {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const particles = [];
    const maxParticles = 35;

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 20;
            this.size = Math.random() * 2.2 + 0.6;
            this.speedY = -(Math.random() * 0.7 + 0.3);
            this.speedX = (Math.random() - 0.5) * 0.35;
            this.opacity = Math.random() * 0.55 + 0.2;
            this.fadeSpeed = Math.random() * 0.003 + 0.001;
            this.swayAngle = Math.random() * Math.PI * 2;
            this.swaySpeed = Math.random() * 0.02 + 0.01;
        }

        update() {
            this.y += this.speedY;
            this.swayAngle += this.swaySpeed;
            this.x += this.speedX + Math.sin(this.swayAngle) * 0.15;
            this.opacity -= this.fadeSpeed;

            if (this.y < 0 || this.opacity <= 0) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            
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

    for (let i = 0; i < maxParticles; i++) {
        const p = new Particle();
        p.y = Math.random() * canvas.height;
        particles.push(p);
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();
    setTimeout(resizeCanvas, 400);
});

// Global back button function
function goBack() {
    window.location.href = 'index.html';
}

