/**
 * NanoGalaxy interactive showcase
 * Two-scene canvas animation inspired by PhantaField PPMOCVD product demo.
 * Scene 1: atomic lattice growth with plasma + light beams
 * Scene 2: full-wafer chamber growth
 */
(function () {
  'use strict';

  const canvas = document.getElementById('ngShowcase');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const sceneDuration = 9000; // ms per scene
  const transitionDuration = 1200; // ms
  const totalCycle = sceneDuration * 2 + transitionDuration * 2;

  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width, height;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function rand(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  // --- Scene 1 data: hexagonal lattice ---
  const latticeAtoms = [];
  const latticeRows = 12;
  const latticeCols = 14;
  for (let r = 0; r < latticeRows; r++) {
    for (let c = 0; c < latticeCols; c++) {
      const xOffset = (r % 2) * 0.5;
      const x = (c + xOffset - latticeCols / 2) * 22;
      const y = (r - latticeRows / 2) * 19;
      latticeAtoms.push({
        x, y,
        type: (r + c) % 2 === 0 ? 'Mo' : 'S',
        delay: rand(r * 31 + c * 17) * 0.6,
        phase: rand(r * 13 + c * 7) * Math.PI * 2
      });
    }
  }

  // --- Scene 1 particles (precursors, plasma, light) ---
  const particles = [];
  for (let i = 0; i < 220; i++) {
    particles.push({
      x: (rand(i) - 0.5) * 500,
      y: -300 - rand(i + 1) * 400,
      z: (rand(i + 2) - 0.5) * 200,
      vx: (rand(i + 3) - 0.5) * 0.4,
      vy: 0.4 + rand(i + 4) * 0.8,
      vz: (rand(i + 5) - 0.5) * 0.3,
      size: 1.2 + rand(i + 6) * 2.2,
      hue: rand(i + 7) > 0.6 ? 280 : (rand(i + 8) > 0.5 ? 50 : 170),
      seed: i
    });
  }

  // --- Scene 2 data: chamber ---
  const waferParticles = [];
  for (let i = 0; i < 180; i++) {
    waferParticles.push({
      angle: rand(i) * Math.PI * 2,
      radius: 50 + rand(i + 1) * 220,
      y: -350 - rand(i + 2) * 200,
      vy: 0.3 + rand(i + 3) * 0.5,
      size: 1 + rand(i + 4) * 1.5,
      seed: i
    });
  }

  function drawGlow(cx, cy, r, color) {
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, color);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawScene1(progress, fade) {
    const cx = width / 2;
    const cy = height / 2 + 10;
    const scale = Math.min(width, height) / 500;

    // Plasma beam from top
    const plasmaX = cx - 80 * scale;
    const plasmaLen = 260 * scale;
    const plasmaWidth = 28 * scale * (0.8 + 0.2 * Math.sin(progress * Math.PI * 4));
    const pg = ctx.createLinearGradient(plasmaX, cy - plasmaLen, plasmaX, cy);
    pg.addColorStop(0, 'rgba(200,180,255,0)');
    pg.addColorStop(0.35, 'rgba(200,160,255,0.35)');
    pg.addColorStop(0.7, 'rgba(180,140,255,0.55)');
    pg.addColorStop(1, 'rgba(160,120,255,0.2)');
    ctx.fillStyle = pg;
    ctx.beginPath();
    ctx.moveTo(plasmaX - plasmaWidth * 0.25, cy - plasmaLen);
    ctx.lineTo(plasmaX + plasmaWidth * 0.25, cy - plasmaLen);
    ctx.lineTo(plasmaX + plasmaWidth * 0.8, cy);
    ctx.lineTo(plasmaX - plasmaWidth * 0.8, cy);
    ctx.closePath();
    ctx.fill();

    // Plasma sparkles
    for (let i = 0; i < 40; i++) {
      const t = (progress * 1.5 + rand(i) * 10) % 1;
      const sx = plasmaX + (rand(i + 100) - 0.5) * plasmaWidth * t;
      const sy = cy - plasmaLen + plasmaLen * t;
      const ss = 1 + rand(i + 200) * 2;
      ctx.fillStyle = 'rgba(220,200,255,' + (0.5 * (1 - t) * fade) + ')';
      ctx.beginPath();
      ctx.arc(sx, sy, ss, 0, Math.PI * 2);
      ctx.fill();
    }

    // Light beam from side at angle
    const lightAngle = -0.35;
    const lightLen = 320 * scale;
    const lightW = 18 * scale;
    const lx0 = cx + 120 * scale;
    const ly0 = cy - 60 * scale;
    const lx1 = lx0 + Math.cos(lightAngle) * lightLen;
    const ly1 = ly0 + Math.sin(lightAngle) * lightLen;
    const lg = ctx.createLinearGradient(lx0, ly0, lx1, ly1);
    lg.addColorStop(0, 'rgba(120,220,255,0)');
    lg.addColorStop(0.4, 'rgba(120,220,255,0.25)');
    lg.addColorStop(0.75, 'rgba(160,240,255,0.45)');
    lg.addColorStop(1, 'rgba(200,255,255,0.1)');
    ctx.strokeStyle = lg;
    ctx.lineWidth = lightW;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(lx0, ly0);
    ctx.lineTo(lx1, ly1);
    ctx.stroke();

    // Floating precursor particles
    for (const p of particles) {
      let py = p.y + p.vy * progress * 300;
      let px = p.x + p.vx * progress * 120 + Math.sin(progress * 4 + p.seed) * 10;
      if (py > cy + 50 * scale) continue;
      const z = p.z + p.vz * progress * 60;
      const parallax = 1 + z * 0.002;
      const alpha = clamp(1 - (py - (cy - 120 * scale)) / (220 * scale), 0, 1) * fade;
      if (alpha <= 0) continue;
      ctx.fillStyle = p.hue === 280
        ? 'rgba(180,120,255,' + alpha + ')'
        : (p.hue === 50 ? 'rgba(255,220,80,' + alpha + ')' : 'rgba(80,220,200,' + alpha + ')');
      ctx.beginPath();
      ctx.arc(cx + px * scale * parallax, cy + (py - cy) * scale * parallax, p.size * scale * parallax, 0, Math.PI * 2);
      ctx.fill();
    }

    // Hexagonal lattice atoms
    for (const atom of latticeAtoms) {
      const settle = clamp((progress - atom.delay) / 0.5, 0, 1);
      const settleEase = easeInOutCubic(settle);
      const ax = cx + atom.x * scale;
      const ay = cy + atom.y * scale + (1 - settleEase) * 80 * scale;
      const az = Math.sin(progress * 2 + atom.phase) * 3 * scale;
      const r = (atom.type === 'Mo' ? 8 : 5) * scale + az * 0.05;
      const glow = atom.type === 'Mo' ? 'rgba(255,220,80,0.25)' : 'rgba(80,220,200,0.25)';
      drawGlow(ax, ay, r * 2.5, glow);
      ctx.fillStyle = atom.type === 'Mo' ? '#f5d742' : '#3dd9c4';
      ctx.beginPath();
      ctx.arc(ax, ay, r, 0, Math.PI * 2);
      ctx.fill();
      // highlight
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.beginPath();
      ctx.arc(ax - r * 0.3, ay - r * 0.3, r * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawScene2(progress, fade) {
    const cx = width / 2;
    const cy = height / 2 + 20;
    const scale = Math.min(width, height) / 480;

    const plateW = 320 * scale;
    const plateH = 24 * scale;
    const gap = 180 * scale;

    // Chamber top plate
    const topY = cy - gap;
    ctx.fillStyle = '#1a2435';
    ctx.beginPath();
    ctx.ellipse(cx, topY, plateW / 2, plateH / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(148,163,184,0.25)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Chamber bottom plate / susceptor
    const botY = cy + gap * 0.2;
    const grad = ctx.createLinearGradient(cx, botY - plateH, cx, botY + plateH);
    grad.addColorStop(0, '#232d3f');
    grad.addColorStop(0.5, '#1a2435');
    grad.addColorStop(1, '#111827');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(cx, botY, plateW / 2, plateH / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Concentric rings on bottom plate
    for (let i = 0; i < 5; i++) {
      const rw = plateW * (0.9 - i * 0.16);
      ctx.strokeStyle = 'rgba(148,163,184,' + (0.12 - i * 0.02) + ')';
      ctx.beginPath();
      ctx.ellipse(cx, botY, rw / 2, plateH / 2, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Falling particles
    for (const p of waferParticles) {
      const py = topY + p.y + p.vy * progress * 500;
      if (py > botY - 10 * scale) continue;
      const px = cx + Math.cos(p.angle) * p.radius * scale;
      const alpha = clamp(1 - (py - topY) / (gap * 0.9), 0, 1) * fade;
      ctx.fillStyle = 'rgba(200,220,255,' + alpha + ')';
      ctx.beginPath();
      ctx.arc(px, py, p.size * scale, 0, Math.PI * 2);
      ctx.fill();
    }

    // Growing MoS₂ film
    const filmRadius = (50 + progress * 260) * scale;
    const filmAlpha = clamp(progress * 1.4, 0, 1) * fade;
    if (filmRadius > 0) {
      // base glow
      drawGlow(cx, botY - 4 * scale, filmRadius * 1.1, 'rgba(140,80,255,' + (0.25 * filmAlpha) + ')');
      // hex pattern
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, botY, filmRadius / 2, Math.min(filmRadius / 2, plateH / 2 + 2 * scale), 0, 0, Math.PI * 2);
      ctx.clip();
      const dotSpacing = 10 * scale;
      for (let r = -Math.ceil(filmRadius / dotSpacing); r <= Math.ceil(filmRadius / dotSpacing); r++) {
        for (let c = -Math.ceil(filmRadius / dotSpacing); c <= Math.ceil(filmRadius / dotSpacing); c++) {
          const dx = (c + (r % 2) * 0.5) * dotSpacing;
          const dy = r * dotSpacing * 0.866;
          if (dx * dx + dy * dy > (filmRadius / 2) * (filmRadius / 2)) continue;
          ctx.fillStyle = (r + c) % 2 === 0 ? 'rgba(200,150,255,' + filmAlpha + ')' : 'rgba(140,100,220,' + filmAlpha + ')';
          ctx.beginPath();
          ctx.arc(cx + dx, botY + dy * 0.25, 2 * scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
      // rim light
      ctx.strokeStyle = 'rgba(180,140,255,' + (0.8 * filmAlpha) + ')';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(cx, botY, filmRadius / 2, Math.min(filmRadius / 2, plateH / 2 + 2 * scale), 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  const tagsWrap = document.getElementById('ngShowcaseTags');
  const titleEl = document.getElementById('ngShowcaseTitle');
  const textEl = document.getElementById('ngShowcaseText');

  const captions = [
    {
      title: 'A machine that grows semiconductors a few atoms thick.',
      text: 'Plasma and light crack the precursor molecules, and molybdenum and sulfur settle into one atomic layer of MoS₂.',
      tags: [
        { label: 'plasma, from above', x: 0.38, y: 0.18 },
        { label: 'light, from the side at an angle', x: 0.34, y: 0.30 }
      ]
    },
    {
      title: 'A machine that grows semiconductors a few atoms thick.',
      text: 'MoS₂ films across full 300 mm wafers, cool enough to grow directly on finished chips.',
      tags: []
    }
  ];

  function renderTags(sceneIndex, fade) {
    if (!tagsWrap) return;
    tagsWrap.innerHTML = '';
    const tags = captions[sceneIndex].tags;
    tags.forEach(tag => {
      const el = document.createElement('div');
      el.className = 'ng-showcase-tag';
      el.textContent = tag.label;
      el.style.left = (tag.x * 100) + '%';
      el.style.top = (tag.y * 100) + '%';
      el.style.opacity = fade;
      tagsWrap.appendChild(el);
    });
  }

  let lastScene = -1;

  function animate(ts) {
    if (!ts) ts = performance.now();
    const cycle = ts % totalCycle;

    // Determine phase:
    // 0..sceneDuration = scene 1 hold
    // sceneDuration..sceneDuration+transitionDuration = scene 1->2 transition
    // sceneDuration+transitionDuration..2*sceneDuration+transitionDuration = scene 2 hold
    // 2*sceneDuration+transitionDuration..totalCycle = scene 2->1 transition
    let sceneA, sceneB, t, phase;
    if (cycle < sceneDuration) {
      sceneA = 0; sceneB = 0; t = cycle / sceneDuration; phase = 'hold1';
    } else if (cycle < sceneDuration + transitionDuration) {
      sceneA = 0; sceneB = 1; t = (cycle - sceneDuration) / transitionDuration; phase = 'trans1';
    } else if (cycle < 2 * sceneDuration + transitionDuration) {
      sceneA = 1; sceneB = 1; t = (cycle - sceneDuration - transitionDuration) / sceneDuration; phase = 'hold2';
    } else {
      sceneA = 1; sceneB = 0; t = (cycle - 2 * sceneDuration - transitionDuration) / transitionDuration; phase = 'trans2';
    }

    const fadeA = phase === 'hold1' ? 1 : (phase === 'trans1' ? 1 - easeInOutCubic(t) : (phase === 'hold2' ? 0 : easeInOutCubic(t)));
    const fadeB = phase === 'hold1' ? 0 : (phase === 'trans1' ? easeInOutCubic(t) : (phase === 'hold2' ? 1 : 1 - easeInOutCubic(t)));

    const progress1 = phase === 'hold1' ? t : (phase === 'trans1' ? 1 : (phase === 'trans2' ? 1 - easeInOutCubic(t) : 0));
    const progress2 = phase === 'hold2' ? t : (phase === 'trans1' ? easeInOutCubic(t) : (phase === 'trans2' ? 0 : 0));

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#050b14';
    ctx.fillRect(0, 0, width, height);

    if (fadeA > 0.01) drawScene1(progress1, fadeA);
    if (fadeB > 0.01) drawScene2(progress2, fadeB);

    const currentScene = phase === 'hold1' || phase === 'trans2' || phase === 'trans1' ? 0 : 1;
    if (currentScene !== lastScene) {
      lastScene = currentScene;
      if (titleEl) titleEl.textContent = captions[currentScene].title;
      if (textEl) textEl.textContent = captions[currentScene].text;
      renderTags(currentScene, 1);
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();
