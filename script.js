const canvas = document.getElementById('heart');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const bgStars = [];
const particleCount = 850; 
let time = 0;
let animationState = 'assembling';

function getHeartPoint(t, scale) {
    let x = 16 * Math.pow(Math.sin(t), 3);
    let y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    return { x: x * 14 * scale, y: -y * 14 * scale };
}

function init() {
    particles = [];
    // Звезды на фоне (пыль)
    for (let i = 0; i < 60; i++) {
        bgStars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.2,
            speed: Math.random() * 0.2 + 0.05
        });
    }

    // Частицы сердца
    for (let i = 0; i < particleCount; i++) {
        const t = Math.random() * Math.PI * 2;
        const targetPos = getHeartPoint(t, 1);
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            targetX: canvas.width / 2 + targetPos.x,
            targetY: canvas.height / 2 + targetPos.y,
            t: t,
            size: Math.random() * 1.6 + 0.4,
            assemblySpeed: Math.random() * 0.03 + 0.01,
            // Разные оттенки рубинового
            color: `rgb(${Math.floor(Math.random() * 40 + 180)}, 10, 30)`,
            arrived: false
        });
    }
}

function animate() {
    // Идеально черный фон (без альфа-канала для скорости)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    time += 0.015;

    // Отрисовка звезд фона
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    bgStars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        s.y -= s.speed;
        if (s.y < 0) s.y = canvas.height;
    });

    let arrivedCount = 0;
    const globalPulse = 1 + Math.sin(time * 2.5) * 0.03;

    particles.forEach(p => {
        if (animationState === 'assembling') {
            const dx = p.targetX - p.x;
            const dy = p.targetY - p.y;
            p.x += dx * p.assemblySpeed;
            p.y += dy * p.assemblySpeed;
            if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) p.arrived = true;
            if (p.arrived) arrivedCount++;
        } else {
            p.t += 0.005;
            const pos = getHeartPoint(p.t, globalPulse);
            p.x = canvas.width / 2 + pos.x;
            p.y = canvas.height / 2 + pos.y;
        }

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });

    // Когда 98% частиц собрались, включаем текст и пульсацию
    if (animationState === 'assembling' && arrivedCount > particleCount * 0.98) {
        animationState = 'pulsing';
        // Находим рамку и проявляем её
        const textFrame = document.querySelector('.text-frame-content');
        if(textFrame) textFrame.classList.add('text-visible');
    }

    requestAnimationFrame(animate);
}

init();
animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});