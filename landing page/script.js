// Retro neon grid animation for #neon-grid-bg canvas

// --- Moving Stars ---
let neonGridStars = [];
function cacheStars(width, height, gridTop) {
    neonGridStars = [];
    for (let i = 0; i < 90; i++) {
        let sx = Math.random() * width;
        let sy = Math.random() * (gridTop - 10); // Only above grid
        let r = Math.random() * 1.3 + 0.4;
        let speed = Math.random() * 0.25 + 0.13;
        let alpha = Math.random() * 0.5 + 0.45;
        neonGridStars.push({sx, sy, r, alpha, speed});
    }
}

function drawNeonGrid(ctx, width, height, offset, starsOffset) {
    ctx.clearRect(0, 0, width, height);
    // Background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    // Grid params
    const gridColor = '#ff0080'; // Neon pink
    const glowColor = 'rgba(255,0,128,0.7)';
    const lineWidth = 2;
    const glowBlur = 11;
    const gridHeight = height * 0.38;
    const gridBottom = height * 0.96;
    const gridLeft = width * 0.05;
    const gridRight = width * 0.95;
    const vanishingX = width / 2;
    const vanishingY = gridHeight;
    const spacing = 38;
    const numLines = 18;
    ctx.save();
    ctx.lineWidth = lineWidth;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = glowBlur;
    ctx.strokeStyle = gridColor;

    // Draw horizontal lines (floor)
    for (let i = 0; i < numLines; i++) {
        let t = i + (offset % 1);
        let y = gridBottom - t * (gridBottom - gridHeight) / (numLines - 1);
        let scale = (y - gridHeight) / (gridBottom - gridHeight);
        let xStart = vanishingX - scale * (vanishingX - gridLeft);
        let xEnd = vanishingX + scale * (gridRight - vanishingX);
        ctx.beginPath();
        ctx.moveTo(xStart, y);
        ctx.lineTo(xEnd, y);
        ctx.stroke();
    }

    // Draw vertical lines (perspective)
    const verticalCount = 20;
    for (let i = 0; i <= verticalCount; i++) {
        let ratio = (i / verticalCount) * 2 - 1;
        ctx.beginPath();
        ctx.moveTo(vanishingX + ratio * (gridRight - vanishingX), gridBottom);
        ctx.lineTo(vanishingX + ratio * (vanishingX - gridLeft) * 0.01, gridHeight);
        ctx.stroke();
    }
    ctx.restore();

    // Draw moving stars (above grid only)
    ctx.save();
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 4;
    for (const star of neonGridStars) {
        let sy = star.sy + starsOffset * star.speed;
        if (sy > gridHeight - 2) sy = sy - (gridHeight - 10);
        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(star.sx, sy, star.r, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff';
        ctx.fill();
    }
    ctx.restore();
}

function animateNeonGrid() {
    const canvas = document.getElementById('neon-grid-bg');
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
    }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const gridHeight = height * 0.38;
    cacheStars(width, height, gridHeight);
    let start = performance.now();
    function frame(now) {
        let offset = ((now - start) / 1000) * 1.2;
        let starsOffset = ((now - start) / 36);
        drawNeonGrid(ctx, width, height, offset, starsOffset);
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

window.addEventListener('resize', animateNeonGrid);
window.addEventListener('DOMContentLoaded', animateNeonGrid);
