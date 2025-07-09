import React, { useRef, useEffect } from "react";

// Animated Milky Way starfield background (dark theme)
const ThreeDBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Starfield parameters
    const numStars = 420;
    const milkyWayBand = 0.22; // Fraction of height for dense band
    const stars = [];
    for (let i = 0; i < numStars; i++) {
      // Distribute more stars in the Milky Way band
      const band = Math.random() < 0.68;
      let y = band
        ? height * 0.5 + (Math.random() - 0.5) * height * milkyWayBand
        : Math.random() * height;
      let x = Math.random() * width;
      let radius = band
        ? 0.8 + Math.random() * 1.6
        : 0.5 + Math.random() * 1.2;
      let speed = band
        ? 0.06 + Math.random() * 0.10
        : 0.02 + Math.random() * 0.06;
      let alpha = 0.5 + Math.random() * 0.5;
      stars.push({
        x,
        y,
        radius,
        speed,
        alpha,
        phase: Math.random() * Math.PI * 2,
        twinkle: 0.3 + Math.random() * 0.7,
        color: band
          ? `rgba(${180 + Math.floor(Math.random()*40)},${180 + Math.floor(Math.random()*40)},${255},1)`
          : `rgba(200,200,255,1)`
      });
    }

    let t = 0;
    function draw() {
      ctx.clearRect(0, 0, width, height);
      // Deep black background
      ctx.fillStyle = "#090a0f";
      ctx.fillRect(0, 0, width, height);

      // Draw stars
      for (let s of stars) {
        // Parallax movement (simulate slight galaxy rotation)
        s.x += Math.sin((s.y / height) * Math.PI * 2 + t * 0.0008) * s.speed;
        s.y += Math.cos((s.x / width) * Math.PI * 2 + t * 0.0005) * s.speed * 0.2;

        // Wrap around
        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;
        if (s.y < 0) s.y = height;
        if (s.y > height) s.y = 0;

        // Twinkle effect
        const twinkle = s.twinkle * (0.6 + 0.4 * Math.sin(t * 0.05 + s.phase));
        ctx.save();
        ctx.globalAlpha = s.alpha * twinkle;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius * (0.8 + 0.4 * twinkle), 0, 2 * Math.PI);
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 8 * twinkle;
        ctx.fillStyle = s.color;
        ctx.fill();
        ctx.restore();
      }
      t += 1;
      requestAnimationFrame(draw);
    }
    draw();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        background: "#090a0f"
      }}
      aria-hidden="true"
    />
  );
};

export default ThreeDBackground;
