const daysEl = document.getElementById('days').querySelector('h2');
const hoursEl = document.getElementById('hours').querySelector('h2');
const minutesEl = document.getElementById('minutes').querySelector('h2');
const secondsEl = document.getElementById('seconds').querySelector('h2');

const progressCircle100 = document.getElementById('progress-100');
const progressCircle200 = document.getElementById('progress-200');
const progressCircle365 = document.getElementById('progress-365');

// Add canvas elements and contexts
const canvas100 = document.getElementById('particle-canvas-100');
const canvas200 = document.getElementById('particle-canvas-200');
const canvas365 = document.getElementById('particle-canvas-365');

const ctx100 = canvas100.getContext('2d');
const ctx200 = canvas200.getContext('2d');
const ctx365 = canvas365.getContext('2d');

// Set canvas dimensions explicitly (important!)
[canvas100, canvas200, canvas365].forEach(canvas => {
    const size = parseInt(canvas.style.width) || 150; // Get size from CSS or default
    canvas.width = size;
    canvas.height = size;
});

const progressCircles = [
    { element: progressCircle100, target: 100, canvas: canvas100, ctx: ctx100, isEmitting: false, particles: [] },
    { element: progressCircle200, target: 200, canvas: canvas200, ctx: ctx200, isEmitting: false, particles: [] },
    { element: progressCircle365, target: 365, canvas: canvas365, ctx: ctx365, isEmitting: false, particles: [] },
];

const radius = 50;
const circumference = 2 * Math.PI * radius;

progressCircles.forEach(circleData => {
    if (circleData.element) {
        circleData.element.style.strokeDasharray = `${circumference} ${circumference}`;
        circleData.element.style.strokeDashoffset = circumference;
    }
});

const targetDate = new Date('December 29, 2024 15:26:00').getTime();

const incompleteColor = '#1c3b6b';
const completeColor = '#ff7eb9';

const incompleteGlowClass = 'glow-incomplete';
const completeGlowClass = 'glow-complete';

// --- Particle Class ---
class Particle {
    constructor(x, y, ctx, color) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2.5 + 1; // Slightly smaller max size: 1 to 3.5
        // Slower speed range: -0.75 to 0.75
        this.speedX = (Math.random() * 1.5 - 0.75);
        this.speedY = (Math.random() * 1.5 - 0.75);
        this.color = color;
        this.life = 150; // Increased lifespan due to slower speed
        this.opacity = 1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 1;
        // Adjust fadeout timing based on new lifespan
        if (this.life < 75) {
            this.opacity = this.life / 75;
        }
    }

    draw() {
        this.ctx.save();
        this.ctx.globalAlpha = this.opacity;
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }
}

// --- Function to create particles for a specific circle ---
function createParticles(circleData) {
    // Frequency is handled in animateParticles, so we create one particle here
    const centerX = circleData.canvas.width / 2;
    const centerY = circleData.canvas.height / 2;

    // Calculate radius relative to current canvas size (original SVG radius is 50 in a 150x150 viewbox)
    const particleRadius = 50 * (circleData.canvas.width / 150);

    const angle = Math.random() * Math.PI * 2; // Random angle

    // Calculate starting position on the circumference
    const startX = centerX + particleRadius * Math.cos(angle);
    const startY = centerY + particleRadius * Math.sin(angle);

    circleData.particles.push(new Particle(startX, startY, circleData.ctx, completeColor));
}

// --- Main Animation Loop ---
function animateParticles() {
    progressCircles.forEach(circleData => {
        if (!circleData.ctx) return;

        circleData.ctx.clearRect(0, 0, circleData.canvas.width, circleData.canvas.height);

        // Create new particles LESS FREQUENTLY if the circle is emitting
        // Adjust the probability (0.08 is ~8% chance per frame)
        if (circleData.isEmitting && Math.random() < 0.08) {
            createParticles(circleData);
        }

        // Update and draw existing particles
        for (let i = circleData.particles.length - 1; i >= 0; i--) {
            const p = circleData.particles[i];
            p.update();
            p.draw();

            if (p.life <= 0) {
                circleData.particles.splice(i, 1);
            }
        }
    });

    requestAnimationFrame(animateParticles);
}

function updateTimerElement(element, value) {
    const currentValue = element.innerText;
    if (currentValue !== value) {
        element.style.opacity = '0';
        setTimeout(() => {
            element.innerText = value;
            element.style.opacity = '1';
        }, 200);
    }
}

function updateProgressCircles(currentDays) {
    progressCircles.forEach(circleData => {
        if (!circleData.element || !circleData.ctx) return; // Check context too

        // Recalculate canvas size on update (for responsiveness) - can be optimized
        const currentSize = parseInt(circleData.canvas.style.width) || circleData.canvas.width;
         if (circleData.canvas.width !== currentSize) {
            circleData.canvas.width = currentSize;
            circleData.canvas.height = currentSize;
        }

        const element = circleData.element;
        const targetDays = circleData.target;
        const progress = Math.min(1, Math.max(0, currentDays) / targetDays);
        const offset = circumference * (1 - progress);

        element.style.strokeDashoffset = offset;

        if (progress >= 1) {
            element.style.stroke = completeColor;
            element.classList.remove(incompleteGlowClass);
            element.classList.add(completeGlowClass);
            circleData.isEmitting = true; // Start emitting particles
        } else {
            element.style.stroke = incompleteColor;
            element.classList.remove(completeGlowClass);
            element.classList.add(incompleteGlowClass);
            circleData.isEmitting = false; // Stop emitting particles
        }
    });
}

function updateTimer() {
    const now = new Date().getTime();
    const distance = now - targetDate;
    const currentDays = Math.floor(Math.max(0, distance) / (1000 * 60 * 60 * 24));

    updateProgressCircles(currentDays);

    if (distance < 0) {
        daysEl.innerText = '00';
        hoursEl.innerText = '00';
        minutesEl.innerText = '00';
        secondsEl.innerText = '00';
        return;
    }

    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const formatTime = (time) => (time < 10 ? `0${time}` : String(time));

    updateTimerElement(daysEl, formatTime(currentDays));
    updateTimerElement(hoursEl, formatTime(hours));
    updateTimerElement(minutesEl, formatTime(minutes));
    updateTimerElement(secondsEl, formatTime(seconds));
}

const timerInterval = setInterval(updateTimer, 1000);

function initialSetup() {
    const now = new Date().getTime();
    const distance = now - targetDate;
    const currentDays = Math.floor(Math.max(0, distance) / (1000 * 60 * 60 * 24));

    // Initial circle state setup (stroke, glow class)
    progressCircles.forEach(circleData => {
        if (circleData.element) {
            circleData.element.style.transition = 'none';
            circleData.element.style.strokeDashoffset = circumference;
            circleData.element.style.stroke = incompleteColor;
            circleData.element.classList.remove(completeGlowClass);
            circleData.element.classList.add(incompleteGlowClass);
            const progress = Math.min(1, Math.max(0, currentDays) / circleData.target);
             if (progress >= 1) {
                 circleData.isEmitting = true; // Set initial emitting state
            }
        }
    });

    // Animation setup for strokeDashoffset
    requestAnimationFrame(() => {
        progressCircles.forEach(circleData => {
            if (circleData.element) {
                const element = circleData.element;
                const targetDays = circleData.target;
                const progress = Math.min(1, Math.max(0, currentDays) / targetDays);
                const offset = circumference * (1 - progress);

                const finalColor = progress >= 1 ? completeColor : incompleteColor;
                const finalGlowClass = progress >= 1 ? completeGlowClass : incompleteGlowClass;
                const initialGlowClass = progress >= 1 ? incompleteGlowClass : completeGlowClass;

                setTimeout(() => {
                    if (element) {
                        element.style.stroke = finalColor;
                        element.classList.remove(initialGlowClass);
                        element.classList.add(finalGlowClass);
                        element.style.transition = 'stroke-dashoffset 1s ease-out, stroke 0.5s ease-out';
                        element.style.strokeDashoffset = offset;
                    }
                }, 20);
            }
        });
    });

    if (distance < 0) {
        daysEl.innerText = '00';
        hoursEl.innerText = '00';
        minutesEl.innerText = '00';
        secondsEl.innerText = '00';
    } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        const formatTime = (time) => (time < 10 ? `0${time}` : String(time));

        daysEl.innerText = formatTime(currentDays);
        hoursEl.innerText = formatTime(hours);
        minutesEl.innerText = formatTime(minutes);
        secondsEl.innerText = formatTime(seconds);
    }

    // Start the particle animation loop AFTER initial setup
    animateParticles();
}

initialSetup();