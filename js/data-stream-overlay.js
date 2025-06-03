// js/data-stream-overlay.js
function initDataStreamOverlay() {
    const canvas = document.getElementById('data-stream-canvas');
    if (!canvas) {
        console.warn('Data stream canvas not found.'); // Changed to warn as it's non-critical
        return;
    }

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles = [];
    let streamIntensity = 1.0; // Will be modulated by scroll

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    class StreamParticle {
        constructor() {
            this.reset();
            this.size = Math.random() * 2 + 0.5; // Smaller, more numerous particles
            this.opacity = 0; // Start fully transparent, fade in
            this.targetOpacity = 0.1 + Math.random() * 0.4;
            this.color = Math.random() > 0.3 ? `rgba(0, 122, 255, ${this.opacity})` : `rgba(200, 200, 220, ${this.opacity})`; // Mostly blue, some light gray/white
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height; // Start anywhere for a more ambient field
            this.speedY = (0.2 + Math.random() * 0.8) * streamIntensity; // Modulated by intensity
            this.speedX = (Math.random() - 0.5) * 0.2 * streamIntensity; // Slight horizontal drift
            this.life = 0;
            this.maxLife = 150 + Math.random() * 150; // How long they live before reset
            this.opacity = 0; // Reset opacity
            this.targetOpacity = 0.1 + Math.random() * 0.4;
             // Fade in
            if (typeof gsap !== 'undefined') {
                gsap.to(this, { opacity: this.targetOpacity, duration: 1 + Math.random() * 1 });
            } else {
                this.opacity = this.targetOpacity;
            }
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.life++;

            if (this.y > height + this.size || this.x < -this.size || this.x > width + this.size || this.life > this.maxLife) {
                this.reset();
            }

            // Update color with current opacity (needed if not using GSAP to animate color directly)
            this.color = this.color.replace(/[\d\.]+(?=\))/, this.opacity.toFixed(2));

        }

        draw() {
            if (this.opacity <= 0) return;
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size * (2 + Math.random()*3) ); // Elongated rectangles
        }
    }

    function createParticles() {
        const particleCount = Math.floor(200 * streamIntensity); // Number of particles based on intensity
        if (particles.length < particleCount) {
            for (let i = 0; i < particleCount - particles.length; i++) {
                particles.push(new StreamParticle());
            }
        } else if (particles.length > particleCount) {
            particles.splice(particleCount, particles.length - particleCount);
        }
    }

    let lastScrollY = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;

    function animateDataStream() {
        // Semi-transparent clear for trails
        ctx.fillStyle = 'rgba(10, 20, 35, 0.05)'; // Dark blueish, very transparent
        ctx.fillRect(0, 0, width, height);

        // Update streamIntensity based on scroll (subtle effect)
        const scrollRatio = maxScroll > 0 ? Math.min(1, window.scrollY / maxScroll) : 0;
        streamIntensity = 0.5 + (1 - scrollRatio) * 1.0; // Intensity decreases as user scrolls down

        createParticles(); // Adjust particle count dynamically if needed

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animateDataStream);
    }

    // Initial Setup
    resizeCanvas();
    createParticles(); // Create initial set

    // Fade in canvas
    if (typeof gsap !== 'undefined') {
        gsap.to(canvas, { opacity: 0.6, duration: 3, delay: 1.5 }); // Target overall opacity 0.6
    } else {
        canvas.style.opacity = '0.6';
    }

    window.addEventListener('resize', resizeCanvas);

    // Start animation only if GSAP is available for ticker, otherwise RAF is already set
    // RAF loop is self-contained, no need for GSAP ticker here unless for specific timing controls.
    animateDataStream();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDataStreamOverlay);
} else {
    initDataStreamOverlay();
}
