// Procedural scene painting: every picture in the game is drawn in code.
// drawScene paints one panel of a level: first the base art that both
// panels share, then each difference's own drawing for that side.
// Scene space is 600 wide x 540 tall; the caller translates to a panel.

import { DIFFERENCES } from './differences.js';

function sky(ctx, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, 540);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 600, 540);
}

function cloud(ctx, x, y, s) {
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.beginPath();
  ctx.ellipse(x, y, 34 * s, 15 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 24 * s, y - 6 * s, 26 * s, 14 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 48 * s, y + 2 * s, 28 * s, 13 * s, 0, 0, Math.PI * 2);
  ctx.fill();
}

function gullPair(ctx, x, y) {
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x - 12, y);
  ctx.quadraticCurveTo(x - 6, y - 8, x, y);
  ctx.quadraticCurveTo(x + 6, y - 8, x + 12, y);
  ctx.stroke();
}

// ---------- Harbor Morning ----------

function drawHarborBase(ctx) {
  sky(ctx, '#8ec9ee', '#fdf3d0');

  // sun
  ctx.fillStyle = '#ffd94d';
  ctx.beginPath();
  ctx.arc(520, 60, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,217,77,0.35)';
  ctx.beginPath();
  ctx.arc(520, 60, 44, 0, Math.PI * 2);
  ctx.fill();

  cloud(ctx, 90, 70, 1);
  cloud(ctx, 330, 46, 0.8);
  gullPair(ctx, 180, 110);
  gullPair(ctx, 320, 130);

  // distant hills with houses
  ctx.fillStyle = '#7fae7a';
  ctx.beginPath();
  ctx.moveTo(0, 300);
  ctx.quadraticCurveTo(90, 220, 190, 292);
  ctx.lineTo(0, 320);
  ctx.closePath();
  ctx.fill();
  // house
  ctx.fillStyle = '#f2e3c6';
  ctx.fillRect(60, 226, 64, 56);
  ctx.fillStyle = '#c96a4a';
  ctx.beginPath();
  ctx.moveTo(54, 228);
  ctx.lineTo(92, 200);
  ctx.lineTo(130, 228);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#5a4632';
  ctx.fillRect(86, 254, 14, 28);

  // sea
  ctx.fillStyle = '#3f8fb8';
  ctx.fillRect(0, 320, 600, 220);
  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(30 + i * 120, 360 + (i % 2) * 40);
    ctx.quadraticCurveTo(70 + i * 120, 352 + (i % 2) * 40, 110 + i * 120, 360 + (i % 2) * 40);
    ctx.stroke();
  }

  // lighthouse
  ctx.fillStyle = '#f7f3ea';
  ctx.fillRect(492, 120, 34, 200);
  ctx.fillStyle = '#d23b2e';
  ctx.fillRect(492, 150, 34, 18);
  ctx.fillRect(492, 210, 34, 18);
  ctx.fillStyle = '#2e3d52';
  ctx.fillRect(488, 100, 42, 22);
  ctx.fillStyle = '#ffd94d';
  ctx.fillRect(496, 106, 26, 10);

  // pier
  ctx.fillStyle = '#8a6a45';
  ctx.fillRect(240, 400, 180, 16);
  ctx.fillStyle = '#6b4a2f';
  for (let i = 0; i < 5; i++) ctx.fillRect(252 + i * 36, 416, 8, 40);

  // boat hull (sail itself is a difference)
  ctx.fillStyle = '#7a4a21';
  ctx.beginPath();
  ctx.moveTo(120, 400);
  ctx.lineTo(200, 400);
  ctx.lineTo(186, 420);
  ctx.lineTo(134, 420);
  ctx.closePath();
  ctx.fill();
  // second boat, far right
  ctx.fillStyle = '#4a6b8a';
  ctx.beginPath();
  ctx.moveTo(420, 440);
  ctx.lineTo(470, 440);
  ctx.lineTo(460, 456);
  ctx.lineTo(430, 456);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#fdf6e3';
  ctx.beginPath();
  ctx.moveTo(445, 440);
  ctx.lineTo(445, 408);
  ctx.lineTo(468, 440);
  ctx.closePath();
  ctx.fill();
}

// ---------- Night Market ----------

function drawMarketBase(ctx) {
  sky(ctx, '#141a33', '#2b2a4a');

  // stars
  ctx.fillStyle = '#ffffff';
  const stars = [[40, 40], [110, 70], [180, 30], [260, 55], [340, 36], [420, 64], [470, 30], [70, 120], [560, 120], [300, 130]];
  for (const [x, y] of stars) {
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // string lights across the top (4 bulbs here; the 5th is a difference)
  ctx.strokeStyle = '#3d2f1e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 84);
  ctx.quadraticCurveTo(300, 120, 600, 84);
  ctx.stroke();
  const bulbXs = [60, 140, 220, 380];
  for (const bx of bulbXs) {
    const by = 84 + Math.sin((bx / 600) * Math.PI) * 18;
    ctx.fillStyle = '#ffd94d';
    ctx.beginPath();
    ctx.arc(bx, by, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  // ground
  ctx.fillStyle = '#3a3348';
  ctx.fillRect(0, 440, 600, 100);

  // stall 1 (left): ramen
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(60, 300, 150, 140);
  ctx.fillStyle = '#c93b2e';
  for (let i = 0; i < 5; i++) {
    if (i % 2 === 0) ctx.fillRect(60 + i * 30, 278, 30, 22);
  }
  ctx.fillStyle = '#f7ead0';
  for (let i = 0; i < 5; i++) {
    if (i % 2 === 1) ctx.fillRect(60 + i * 30, 278, 30, 22);
  }
  ctx.fillStyle = '#5a4632';
  ctx.fillRect(60, 340, 150, 10);

  // stall 2 (middle): awning is a difference, counter is shared
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(300, 300, 130, 140);
  ctx.fillStyle = '#5a4632';
  ctx.fillRect(300, 340, 130, 10);
  ctx.fillStyle = '#3fae5a';
  for (const lx of [330, 360]) {
    ctx.beginPath();
    ctx.arc(lx, 330, 10, 0, Math.PI * 2);
    ctx.fill();
  }

  // stall 3 (right): lanterns
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(470, 300, 110, 140);
  ctx.fillStyle = '#e23b2e';
  for (const lx of [500, 540]) {
    ctx.beginPath();
    ctx.ellipse(lx, 320, 13, 16, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#ffd94d';
  for (const lx of [500, 540]) {
    ctx.beginPath();
    ctx.ellipse(lx, 320, 5, 7, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // crates on the ground
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(430, 440, 60, 40);
  ctx.fillRect(500, 452, 46, 28);
  ctx.strokeStyle = '#5a4632';
  ctx.lineWidth = 2;
  ctx.strokeRect(430, 440, 60, 40);
}

// ---------- Garden Party ----------

function drawGardenBase(ctx) {
  sky(ctx, '#a8d8f0', '#e8f7d9');

  // sun
  ctx.fillStyle = '#ffd94d';
  ctx.beginPath();
  ctx.arc(520, 64, 28, 0, Math.PI * 2);
  ctx.fill();
  cloud(ctx, 300, 60, 0.9);
  cloud(ctx, 420, 110, 0.7);

  // lawn
  ctx.fillStyle = '#6fbf5a';
  ctx.fillRect(0, 320, 600, 220);
  ctx.fillStyle = '#5da94d';
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.ellipse(60 + i * 72, 520, 60, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // fence
  ctx.fillStyle = '#f2ead8';
  for (let i = 0; i < 10; i++) ctx.fillRect(20 + i * 58, 300, 10, 40);
  ctx.fillRect(0, 306, 600, 6);
  ctx.fillRect(0, 326, 600, 6);

  // big tree (3 apples here; the 4th is a difference)
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(486, 200, 26, 130);
  ctx.fillStyle = '#3f8f3a';
  ctx.beginPath();
  ctx.arc(500, 150, 70, 0, Math.PI * 2);
  ctx.arc(450, 190, 46, 0, Math.PI * 2);
  ctx.arc(552, 190, 46, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#c92b2b';
  for (const [ax, ay] of [[470, 130], [530, 120], [545, 175]]) {
    ctx.beginPath();
    ctx.arc(ax, ay, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  // bunting line (all flags but one; the missing one is a difference)
  ctx.strokeStyle = '#5a4632';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(40, 70);
  ctx.quadraticCurveTo(220, 110, 420, 70);
  ctx.stroke();
  const flagCols = ['#d23b2e', '#f2c230', '#3fae5a', '#e88fc0'];
  const flagXs = [84, 144, 264, 324, 384];
  for (let i = 0; i < flagXs.length; i++) {
    const fx = flagXs[i];
    const fy = 70 + Math.sin(((fx - 40) / 380) * Math.PI) * 22;
    ctx.fillStyle = flagCols[i % flagCols.length];
    ctx.beginPath();
    ctx.moveTo(fx - 12, fy);
    ctx.lineTo(fx + 12, fy);
    ctx.lineTo(fx, fy + 20);
    ctx.closePath();
    ctx.fill();
  }

  // picnic table with cake (candles are a difference)
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(220, 330, 180, 12);
  ctx.fillRect(240, 342, 10, 40);
  ctx.fillRect(370, 342, 10, 40);
  ctx.fillStyle = '#f2ead8';
  ctx.fillRect(230, 322, 160, 10);
  // cake
  ctx.fillStyle = '#e88fc0';
  ctx.fillRect(272, 306, 56, 18);
  ctx.fillStyle = '#fdf6e3';
  ctx.fillRect(272, 300, 56, 8);

  // fountain basin (spray is a difference)
  ctx.fillStyle = '#9aa5ad';
  ctx.beginPath();
  ctx.ellipse(452, 400, 52, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#7fb3d5';
  ctx.beginPath();
  ctx.ellipse(452, 396, 42, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#9aa5ad';
  ctx.fillRect(446, 372, 12, 26);

  // flowers along the bottom
  const flowerCols = ['#e88fc0', '#f2c230', '#d23b2e', '#ffffff'];
  for (let i = 0; i < 6; i++) {
    const fx = 200 + i * 34;
    ctx.strokeStyle = '#2e7d32';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(fx, 470);
    ctx.lineTo(fx, 500);
    ctx.stroke();
    ctx.fillStyle = flowerCols[i % flowerCols.length];
    ctx.beginPath();
    ctx.arc(fx, 464, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffd94d';
    ctx.beginPath();
    ctx.arc(fx, 464, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  // the tulip whose colour changes is drawn by its difference
}

// ---------- entry point ----------

export function drawScene(ctx, levelId, side) {
  if (levelId === 'harbor') drawHarborBase(ctx);
  else if (levelId === 'market') drawMarketBase(ctx);
  else drawGardenBase(ctx);
  for (const diff of DIFFERENCES[levelId]) diff.draw(ctx, side);
}
