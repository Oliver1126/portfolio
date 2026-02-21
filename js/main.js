document.addEventListener('DOMContentLoaded', () => {

    // 1. Intersection Observer for Fade-in Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select all elements with .fade-in class
    // We modify CSS slightly via JS to ensure they start paused if we want stricter control, 
    // but the CSS 'forwards' usually handles it. 
    // Here we just toggle a class for cleaner logic if needed.
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => {
        // el.style.opacity = '0'; // Ensure hidden initially
        observer.observe(el);
    });


    // 2. Hero Network Animation (Canvas)
    const canvas = document.createElement('canvas');
    const heroBg = document.getElementById('hero-canvas');

    if (heroBg) {
        heroBg.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        let width, height;
        let particles = [];

        // Resize handling
        const resize = () => {
            width = canvas.width = heroBg.offsetWidth;
            height = canvas.height = heroBg.offsetHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        // Particle Class
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Wrap around screen
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }

            draw() {
                ctx.fillStyle = 'rgba(99, 102, 241, 0.5)'; // Indigo
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Initialize Particles
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }

        // Animation Loop
        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Update and draw particles
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            // Draw connections
            particles.forEach((p1, i) => {
                particles.slice(i + 1).forEach(p2 => {
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist / 150)})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                });
            });

            requestAnimationFrame(animate);
        };

        animate();
    }

    // 3. Terminal Typewriter Effect
    const terminalBody = document.querySelector('.terminal-body');
    if (terminalBody) {
        const lines = [
            { text: "Initializing NodalNexus Environment...", type: "info", delay: 800 },
            { text: "Loading Agent Modules...", type: "info", delay: 1500 },
            { text: "Connecting to n8n Workflow Engine... [CONNECTED]", type: "success", delay: 2400 },
            { text: "Spawning 'Market_Research' Agent... [ACTIVE]", type: "success", delay: 3500 },
            { text: "System Status: OPTIMAL. Waiting for directive...", type: "info", delay: 4500 }
        ];

        let lineIndex = 0;

        function typeLine() {
            if (lineIndex >= lines.length) return;

            const lineData = lines[lineIndex];
            const line = document.createElement('div');
            line.className = 'terminal-line';
            line.style.animationDelay = '0s'; // Fire immediately upon creation

            const prefix = document.createElement('span');
            prefix.className = 'cmd-prefix';
            prefix.textContent = '>';

            const text = document.createElement('span');
            text.className = lineData.type === 'success' ? 'log-success' : 'cmd-text';
            text.textContent = ` ${lineData.text}`;

            line.appendChild(prefix);
            line.appendChild(text);
            terminalBody.appendChild(line);

            lineIndex++;
            if (lineIndex < lines.length) {
                setTimeout(typeLine, lines[lineIndex].delay - (lines[lineIndex - 1]?.delay || 0));
            }
        }

        // Start typing after initial load
        setTimeout(typeLine, 1000);
    }
    // 4. ROI Calculator Logic
    const hoursInput = document.getElementById('hoursInput');
    const rateInput = document.getElementById('rateInput');
    const hoursValue = document.getElementById('hoursValue');
    const rateValue = document.getElementById('rateValue');
    const savingsValue = document.getElementById('savingsValue');

    if (hoursInput && rateInput && savingsValue) {
        function calculateROI() {
            const hours = parseInt(hoursInput.value);
            const rate = parseInt(rateInput.value);

            // Update display values
            hoursValue.textContent = hours;
            rateValue.textContent = `$${rate}`;

            // Calculate Annual Savings
            // Formula: Hours/week * Rate/hour * 52 weeks
            const weeklySavings = hours * rate;
            const annualSavings = weeklySavings * 52;

            // Format as Currency
            const formattedSavings = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0
            }).format(annualSavings);

            savingsValue.textContent = formattedSavings;
        }

        // Add Listeners
        hoursInput.addEventListener('input', calculateROI);
        rateInput.addEventListener('input', calculateROI);

        // Initial Calculation
        calculateROI();
    }

    // 5. 3D Tilt Effect
    const card = document.querySelector('.interactive-card');
    if (card) {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
            const rotateY = ((x - centerX) / centerX) * 10;

            const img = card.querySelector('img');
            const glare = card.querySelector('.card-glare');

            if (img && glare) {
                img.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 80%)`;
                glare.style.opacity = 1;
            }
        });

        card.addEventListener('mouseleave', () => {
            const img = card.querySelector('img');
            const glare = card.querySelector('.card-glare');

            if (img && glare) {
                img.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
                glare.style.opacity = 0;
            }
        });
    }
});
