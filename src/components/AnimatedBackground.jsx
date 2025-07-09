import React, { useRef, useEffect } from "react";
import bgImgUrl from './synthwave-bg.jpg';

// Helper for random star positions
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

const STAR_COUNT = 60;
const GRID_COLOR = "#b36aff";
const STAR_COLOR = "#fff";

export default function AnimatedBackground() {
  const canvasRef = useRef(null);
  const stars = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrameId;
    let gridOffset = 0;

    const bgImg = new window.Image();
    bgImg.src = bgImgUrl;
    let imgLoaded = false;
    bgImg.onload = () => { imgLoaded = true; }

    // Initialize stars
    function initStars() {
      stars.current = Array.from({ length: STAR_COUNT }, () => ({
        x: randomBetween(0, width),
        y: randomBetween(0, height),
        speed: randomBetween(0.8, 2.2),
        size: randomBetween(0.8, 2.2),
      }));
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initStars();
    }

    window.addEventListener("resize", resize);
    resize();

    function drawGrid() {
      // Infinite moving grid (synthwave style)
      ctx.save();
      ctx.strokeStyle = GRID_COLOR;
      ctx.globalAlpha = 0.5;
      let gridHeight = height * 0.7;
      let gridY = height - gridHeight;
      let vanishingPtX = width / 2;
      let vanishingPtY = gridY;

      // Draw horizontal grid lines
      let lineCount = 18;
      for (let i = 0; i < lineCount; i++) {
        let t = i / (lineCount - 1);
        let y = gridY + t * gridHeight + (gridOffset % 40);
        let left = vanishingPtX - (width / 2) * (1 - t);
        let right = vanishingPtX + (width / 2) * (1 - t);
        ctx.beginPath();
        ctx.moveTo(left, y);
        ctx.lineTo(right, y);
        ctx.stroke();
      }
      // Draw vertical grid lines
      let vLines = 15;
      for (let i = 0; i < vLines; i++) {
        let t = i / (vLines - 1);
        ctx.beginPath();
        ctx.moveTo(vanishingPtX, vanishingPtY);
        ctx.lineTo(
          t * width,
          height
        );
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawStars() {
      ctx.save();
      ctx.fillStyle = STAR_COLOR;
      for (let star of stars.current) {
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    function updateStars() {
      for (let star of stars.current) {
        star.y += star.speed;
        if (star.y > height) {
          star.x = randomBetween(0, width);
          star.y = randomBetween(-20, -2);
          star.speed = randomBetween(0.8, 2.2);
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      if (imgLoaded) {
        ctx.drawImage(bgImg, 0, 0, width, height);
      } else {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, width, height);
      }
      drawGrid();
      drawStars();
      updateStars();
      gridOffset += 1.5;
      animationFrameId = requestAnimationFrame(animate);
    }

    animate();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      zIndex: 0,
      background: "#0a0a23"
    }} />
  );
}
