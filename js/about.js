/* ══════════════════════════════════════
   CANVAS PARTICLE NETWORK BACKGROUND
══════════════════════════════════════ */
(function () {
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    let W, H, particles;
    const COUNT = 60;
    const LINK_DIST = 140;

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    function Particle() {
        this.x     = Math.random() * W;
        this.y     = Math.random() * H;
        this.vx    = (Math.random() - 0.5) * 0.4;
        this.vy    = (Math.random() - 0.5) * 0.4;
        this.r     = Math.random() * 1.5 + 0.5;
        this.alpha = Math.random() * 0.5 + 0.1;
    }

    function init() {
        resize();
        particles = Array.from({ length: COUNT }, () => new Particle());
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        /* Draw connecting lines */
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p = particles[i], q = particles[j];
                const dx = p.x - q.x, dy = p.y - q.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < LINK_DIST) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0,170,255,${(1 - dist / LINK_DIST) * 0.15})`;
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.stroke();
                }
            }
        }

        /* Draw & move particles */
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0,170,255,${p.alpha})`;
            ctx.fill();

            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > W) p.vx *= -1;
            if (p.y < 0 || p.y > H) p.vy *= -1;
        });

        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', init);
    init();
    draw();
})();


/* ══════════════════════════════════════
   SCROLL REVEAL (IntersectionObserver)
══════════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ══════════════════════════════════════
   ANIMATED NUMBER COUNTERS
══════════════════════════════════════ */
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el     = entry.target;
        const target = +el.dataset.target;
        const dur    = 1600;
        const start  = performance.now();

        function step(now) {
            const t    = Math.min((now - start) / dur, 1);
            const ease = 1 - Math.pow(1 - t, 3); /* ease-out cubic */
            el.textContent = Math.round(ease * target);
            if (t < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target;
            }
        }

        requestAnimationFrame(step);
        counterObserver.unobserve(el);
    });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));


/* ══════════════════════════════════════
   HOLOGRAPHIC CARD 3D TILT
══════════════════════════════════════ */
const holoCard = document.getElementById('holoCard');
if (holoCard) {
    holoCard.addEventListener('mousemove', e => {
        const r  = holoCard.getBoundingClientRect();
        const rx = ((e.clientY - r.top  - r.height / 2) / r.height) * 10;
        const ry = ((e.clientX - r.left - r.width  / 2) / r.width)  * -10;
        holoCard.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    holoCard.addEventListener('mouseleave', () => {
        holoCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
}


/* ══════════════════════════════════════
   SCROLL TO TOP BUTTON
══════════════════════════════════════ */
const scrollBtn = document.getElementById('scrollBtn');

window.addEventListener('scroll', () => {
    scrollBtn.style.display = window.scrollY > 400 ? 'flex' : 'none';
});


/* ══════════════════════════════════════
   AUTH NAV (Login / Logout)
══════════════════════════════════════ */
function updateAuthNav() {
    const loggedIn = localStorage.getItem('ms_logged_in') === 'true';
    document.getElementById('nav-login').style.display  = loggedIn ? 'none'         : 'inline-block';
    document.getElementById('nav-logout').style.display = loggedIn ? 'inline-block' : 'none';
}

function handleLogout() {
    localStorage.removeItem('ms_logged_in');
    localStorage.removeItem('ms_user_email');
    updateAuthNav();
}

updateAuthNav();


/* ══════════════════════════════════════
   MOBILE HAMBURGER MENU
══════════════════════════════════════ */
function toggleMenu() {
    document.querySelector('.nav-anim').classList.toggle('active');
    document.querySelector('.hamburger').classList.toggle('open');
}

document.querySelectorAll('.nav-anim a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            document.querySelector('.nav-anim').classList.remove('active');
            document.querySelector('.hamburger').classList.remove('open');
        }
    });
});
