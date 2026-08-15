// Player Info Page - Interaction & Ambient Sparks
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const container = document.getElementById('heritageQuestApp');
    const canvas = document.getElementById('ambientCanvas');
    const ctx = canvas.getContext('2d');
    const bgMusic = document.getElementById('bgMusic');
    const playerForm = document.getElementById('playerForm');

    // Auto-play music on first user interaction
    let musicStarted = false;
    bgMusic.volume = 0.4;

    function startMusic() {
        if (musicStarted) return;
        musicStarted = true;
        
        // Play music
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.catch(function(error) {
                console.log('Music play failed, will retry on next movement:', error);
                musicStarted = false;
            });
        }
    }

    // Start music on cursor movement
    document.addEventListener('mousemove', startMusic, true);
    document.addEventListener('touchmove', startMusic, true);

    // Background Click for Music Control (Single click = play, Double click = stop)
    let clickCount = 0;
    let clickTimer = null;

    container.addEventListener('click', (e) => {
        // Only toggle if click is on background (not on buttons or form)
        if (musicStarted && e.target === container) {
            clickCount++;

            if (clickCount === 1) {
                // Single click - play music
                clickTimer = setTimeout(() => {
                    if (clickCount === 1 && bgMusic.paused) {
                        bgMusic.play().catch(error => {
                            console.log('Failed to play music:', error);
                        });
                    }
                    clickCount = 0;
                }, 300); // 300ms timeout to detect if it's a double click
            } else if (clickCount === 2) {
                // Double click - stop music
                clearTimeout(clickTimer);
                if (!bgMusic.paused) {
                    bgMusic.pause();
                }
                clickCount = 0;
            }
        }
    });

    // Form Submission Handler
    playerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('playerName').value.trim();
        const email = document.getElementById('playerEmail').value.trim();
        const age = document.getElementById('playerAge').value.trim();
        const phone = document.getElementById('playerPhone').value.trim();

        if (name && email && age && phone) {
            // Clean phone string (remove spaces, dashes)
            const cleanPhone = phone.replace(/[\s\-]/g, '');
            const phonePattern = /^(\+91)?[6-9]\d{9}$/;
            if (!phonePattern.test(cleanPhone)) {
                alert('Please enter a valid Indian 10-digit mobile number (e.g., 9876543210 or +919876543210)');
                return;
            }

            const formattedPhone = cleanPhone.startsWith('+91') ? cleanPhone : `+91${cleanPhone}`;

            // Store player info in localStorage
            localStorage.setItem('playerName', name);
            localStorage.setItem('playerEmail', email);
            localStorage.setItem('playerAge', age);
            localStorage.setItem('playerPhone', formattedPhone);

            // Show success message
            alert(`Welcome, ${name}! Your profile has been saved.\nReady to explore the heritage quest!`);
            
            // Reset form
            playerForm.reset();

            // Redirect to main page or quest page
            window.location.href = 'index.html';
        } else {
            alert('Please fill in all fields.');
        }
    });

    // Resize canvas to match the container resolution
    function resizeCanvas() {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }

    window.addEventListener('resize', resizeCanvas);
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
            this.y = canvas.height + Math.random() * 20;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedY = -(Math.random() * 0.8 + 0.3);
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.6 + 0.2;
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

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
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

    animate();
    setTimeout(resizeCanvas, 500);
});

// Global back button function
function goBack() {
    window.location.href = 'index.html';
}
