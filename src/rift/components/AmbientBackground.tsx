import React, { useEffect, useRef } from 'react';

/**
 * AmbientBackground
 * Ultra-dynamic, non-repeating dual-chromatic fluid light field.
 * Combines warm dark amber / crimson (#ea580c, #dc2626) and deep electric / cobalt blue (#0284c7, #2563eb).
 * Features smooth pointer reactivity, multi-frequency incommensurate orbital harmonics,
 * and floating subtle luminous particle embers for an alive, non-looping aesthetic.
 */
export const AmbientBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates with smooth lerping
    const mouse = { x: width * 0.5, y: height * 0.5, targetX: width * 0.5, targetY: height * 0.5 };

    const handlePointerMove = (e: PointerEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('resize', handleResize);

    // 6 Fluid Light Nodes with distinct harmonic irrational velocity factors
    const nodes = [
      {
        // Ember Orange
        color: [234, 88, 12],
        baseRadiusRatio: 0.45,
        freqX1: 0.00028,
        freqY1: 0.00037,
        freqX2: 0.00017,
        freqY2: 0.00043,
        phaseX: 0.15,
        phaseY: 1.42,
        alpha: 0.32,
        mouseInfluence: 0.12,
      },
      {
        // Dark Crimson Red
        color: [220, 38, 38],
        baseRadiusRatio: 0.42,
        freqX1: 0.00021,
        freqY1: 0.00031,
        freqX2: 0.00039,
        freqY2: 0.00019,
        phaseX: 2.31,
        phaseY: 0.84,
        alpha: 0.28,
        mouseInfluence: 0.08,
      },
      {
        // Deep Ruby Accent
        color: [185, 28, 28],
        baseRadiusRatio: 0.35,
        freqX1: 0.00033,
        freqY1: 0.00023,
        freqX2: 0.00013,
        freqY2: 0.00047,
        phaseX: 4.12,
        phaseY: 2.19,
        alpha: 0.22,
        mouseInfluence: 0.15,
      },
      {
        // Electric Sapphire Blue
        color: [2, 132, 199],
        baseRadiusRatio: 0.48,
        freqX1: 0.00026,
        freqY1: 0.00041,
        freqX2: 0.00019,
        freqY2: 0.00029,
        phaseX: 3.78,
        phaseY: 2.81,
        alpha: 0.34,
        mouseInfluence: -0.14,
      },
      {
        // Deep Oceanic Cobalt Blue
        color: [37, 99, 235],
        baseRadiusRatio: 0.5,
        freqX1: 0.00034,
        freqY1: 0.00024,
        freqX2: 0.00042,
        freqY2: 0.00036,
        phaseX: 5.12,
        phaseY: 1.15,
        alpha: 0.3,
        mouseInfluence: -0.1,
      },
      {
        // Twilight Indigo
        color: [79, 70, 229],
        baseRadiusRatio: 0.38,
        freqX1: 0.00018,
        freqY1: 0.00032,
        freqX2: 0.00029,
        freqY2: 0.00022,
        phaseX: 1.84,
        phaseY: 4.63,
        alpha: 0.24,
        mouseInfluence: 0.18,
      },
    ];

    // Dynamic drifting luminous dust particles (embers & azure specks)
    const particleCount = 28;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4 - 0.15,
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.4 + 0.1,
      isWarm: Math.random() > 0.5,
    }));

    let t = 0;

    const render = () => {
      t = performance.now();

      // Lerp mouse towards target
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const normMouseX = (mouse.x / width - 0.5) * 2;
      const normMouseY = (mouse.y / height - 0.5) * 2;

      // Obsidian backdrop base (#080a10)
      ctx.fillStyle = '#080a10';
      ctx.fillRect(0, 0, width, height);

      const maxDim = Math.max(width, height);

      // Render fluid light nodes with dynamic harmonics and pointer gravity
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        // Three-tier harmonic trajectory (irrational periods prevent cycling)
        const harm1X = Math.sin(t * n.freqX1 + n.phaseX);
        const harm2X = Math.cos(t * n.freqX2 + n.phaseY * 1.3);
        const harm3X = Math.sin(t * (n.freqX1 * 0.47) + i);

        const harm1Y = Math.cos(t * n.freqY1 + n.phaseY);
        const harm2Y = Math.sin(t * n.freqY2 + n.phaseX * 1.7);
        const harm3Y = Math.cos(t * (n.freqY1 * 0.53) + i);

        let normX = 0.5 + 0.32 * harm1X + 0.12 * harm2X + 0.06 * harm3X;
        let normY = 0.5 + 0.32 * harm1Y + 0.12 * harm2Y + 0.06 * harm3Y;

        // Apply mouse interaction offset
        normX += normMouseX * n.mouseInfluence * 0.15;
        normY += normMouseY * n.mouseInfluence * 0.15;

        const x = normX * width;
        const y = normY * height;

        // Dynamic scale breathing
        const r = maxDim * n.baseRadiusRatio * (0.85 + 0.15 * Math.sin(t * 0.0004 + i * 1.5));

        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        const [rC, gC, bC] = n.color;

        grad.addColorStop(0, `rgba(${rC}, ${gC}, ${bC}, ${n.alpha})`);
        grad.addColorStop(0.4, `rgba(${rC}, ${gC}, ${bC}, ${n.alpha * 0.45})`);
        grad.addColorStop(1, `rgba(${rC}, ${gC}, ${bC}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render drifting ethereal particles
      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.isWarm
          ? `rgba(249, 115, 22, ${p.alpha})`
          : `rgba(14, 165, 233, ${p.alpha})`;
        ctx.fill();
      }

      // Edge vignette to preserve deep contrast for content readability
      const vig = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        Math.min(width, height) * 0.35,
        width * 0.5,
        height * 0.5,
        maxDim * 0.8
      );
      vig.addColorStop(0, 'rgba(8, 10, 16, 0)');
      vig.addColorStop(0.65, 'rgba(8, 10, 16, 0.4)');
      vig.addColorStop(1, 'rgba(6, 8, 12, 0.88)');

      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Secondary fluid drift mesh */}
      <div className="absolute inset-0 filter blur-[120px] opacity-40 mix-blend-screen pointer-events-none">
        <div className="absolute top-[8%] left-[12%] w-[48vw] h-[48vw] rounded-full bg-gradient-to-tr from-amber-600/30 to-rose-600/20 animate-drift-slow" />
        <div className="absolute bottom-[8%] right-[12%] w-[52vw] h-[52vw] rounded-full bg-gradient-to-bl from-blue-600/35 to-sky-500/25 animate-drift-reverse" />
      </div>

      {/* Apple specular grain */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
};

