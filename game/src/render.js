// All canvas drawing: the HUD, the two picture panels, the found
// markers, the hint pulse, and the title / level-complete /
// game-complete / time-up screens.

import { VIEW, MARK_POP_MS, HINT_MAX_RADIUS } from './config.js';
import { drawScene } from './scenes.js';
import { isMuted } from './audio.js';

const INK = '#22283b';
const PANEL_BORDER = '#3a3f55';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawPanel(ctx, game, side, originX, now) {
  ctx.save();
  if (now < game.shakeUntil) {
    ctx.translate((Math.random() - 0.5) * 7, (Math.random() - 0.5) * 7);
  }
  ctx.beginPath();
  ctx.rect(originX, VIEW.panelY, VIEW.panelWidth, VIEW.panelHeight);
  ctx.clip();
  ctx.translate(originX, VIEW.panelY);
  drawScene(ctx, game.level.id, side);
  ctx.restore();

  // frame + side label
  ctx.strokeStyle = PANEL_BORDER;
  ctx.lineWidth = 3;
  ctx.strokeRect(originX, VIEW.panelY, VIEW.panelWidth, VIEW.panelHeight);
  ctx.fillStyle = side === 'A' ? '#2e6fc9' : '#c96a2e';
  ctx.beginPath();
  ctx.arc(originX + 24, VIEW.panelY + 24, 17, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 19px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(side, originX + 24, VIEW.panelY + 25);

  drawMarkers(ctx, game, originX, now);
}

function drawMarkers(ctx, game, originX, now) {
  for (const diff of game.diffs) {
    if (!game.found.has(diff.id)) continue;
    const age = now - (game.foundAt.get(diff.id) || 0);
    const pop = age < MARK_POP_MS ? 0.6 + (age / MARK_POP_MS) * 0.4 : 1;
    const r = 26 * pop;
    const cx = originX + diff.x;
    const cy = VIEW.panelY + diff.y;
    ctx.save();
    ctx.globalAlpha = age < MARK_POP_MS ? age / MARK_POP_MS : 1;
    ctx.strokeStyle = '#2fae4e';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#2fae4e';
    ctx.beginPath();
    ctx.arc(cx, cy, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(cx - 5, cy);
    ctx.lineTo(cx - 1, cy + 5);
    ctx.lineTo(cx + 6, cy - 5);
    ctx.stroke();
    ctx.restore();
  }
  // hint pulse: a growing ring on the one unfound difference
  if (game.hint) {
    const diff = game.diffs.find((d) => d.id === game.hint.id);
    if (diff) {
      const phase = (now % 500) / 500;
      const r = 22 + phase * (HINT_MAX_RADIUS - 22);
      ctx.save();
      ctx.globalAlpha = 1 - phase;
      ctx.strokeStyle = '#ffd94d';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(originX + diff.x, VIEW.panelY + diff.y, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }
}

function drawHud(ctx, game) {
  ctx.fillStyle = '#f7f3ea';
  ctx.fillRect(0, 0, VIEW.width, VIEW.hudHeight);
  ctx.fillStyle = INK;
  ctx.font = 'bold 26px Georgia, serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('SPOT THE DIFFERENCE', 20, 32);

  // level name + difficulty
  ctx.font = '16px Georgia, serif';
  ctx.fillStyle = '#5a5f73';
  ctx.fillText(`${game.level.name}  ·  ${game.level.difficulty}`, 330, 33);

  // counter pill
  const pillX = 640;
  ctx.fillStyle = '#2e6fc9';
  roundRect(ctx, pillX, 14, 170, 36, 18);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(`Found ${game.foundCount} / ${game.diffs.length}`, pillX + 85, 33);

  // timer bar
  const barX = 830;
  const barW = 200;
  const frac = Math.max(0, game.timeLeft / game.level.timeLimit);
  ctx.fillStyle = '#d8d2c2';
  roundRect(ctx, barX, 20, barW, 24, 12);
  ctx.fill();
  ctx.fillStyle = frac > 0.25 ? '#2fae4e' : '#d23b2e';
  if (frac > 0) {
    roundRect(ctx, barX, 20, barW * frac, 24, 12);
    ctx.fill();
  }
  ctx.fillStyle = INK;
  ctx.font = 'bold 18px Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText(`${Math.ceil(game.timeLeft)}s`, barX + barW + 10, 33);

  // score + hints
  ctx.textAlign = 'right';
  ctx.font = 'bold 20px Georgia, serif';
  ctx.fillText(`Score ${game.score}`, 1252, 22);
  ctx.font = '16px Georgia, serif';
  ctx.fillStyle = '#5a5f73';
  ctx.fillText(`Hints ${game.hintsLeft}  ·  ${isMuted() ? 'Muted (M)' : 'Sound on (M)'}`, 1252, 46);
  ctx.textAlign = 'left';
}

function drawBottomBar(ctx, game, now) {
  ctx.fillStyle = '#f7f3ea';
  ctx.fillRect(0, VIEW.bottomBarY, VIEW.width, VIEW.height - VIEW.bottomBarY);
  ctx.fillStyle = INK;
  ctx.font = '16px Georgia, serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(game.level.tagline, 20, 668);
  ctx.fillStyle = '#5a5f73';
  ctx.fillText('Click a difference on either picture  ·  H hint  ·  N next  ·  R restart  ·  M mute', 20, 694);
  ctx.textAlign = 'right';
  ctx.fillStyle = INK;
  ctx.font = 'bold 17px Georgia, serif';
  ctx.fillText(`Total ${game.totalScore}   ·   Best ${game.best}`, 1260, 668);
  if (now < game.flashUntil) {
    ctx.fillStyle = '#c96a2e';
    ctx.font = 'bold 18px Georgia, serif';
    ctx.fillText(game.flashMessage, 1260, 694);
  }
  ctx.textAlign = 'left';
}

function drawTitle(ctx, game) {
  ctx.fillStyle = '#1d2340';
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);
  // decorative mini panels
  ctx.fillStyle = '#2e6fc9';
  ctx.fillRect(140, 150, 200, 130);
  ctx.fillStyle = '#c96a2e';
  ctx.fillRect(940, 150, 200, 130);
  ctx.strokeStyle = '#2fae4e';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(240, 215, 34, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(1040, 215, 34, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#fdf6e3';
  ctx.font = 'bold 64px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SPOT THE DIFFERENCE', 640, 300);
  ctx.font = '26px Georgia, serif';
  ctx.fillStyle = '#ffd94d';
  ctx.fillText('Two pictures. One is lying. Find what changed.', 640, 360);
  ctx.font = '20px Georgia, serif';
  ctx.fillStyle = '#c9d2e8';
  ctx.fillText('Harbor Morning  ·  Night Market  ·  Garden Party', 640, 420);
  ctx.fillText('Click a difference on either picture  ·  H for a hint', 640, 452);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px Georgia, serif';
  ctx.fillText('Click anywhere to play', 640, 530);
  if (game.best > 0) {
    ctx.font = '18px Georgia, serif';
    ctx.fillStyle = '#c9d2e8';
    ctx.fillText(`Best score: ${game.best}`, 640, 566);
  }
  ctx.textAlign = 'left';
}

function drawStars(ctx, cx, y, stars) {
  for (let i = 0; i < 3; i++) {
    const x = cx + (i - 1) * 64;
    ctx.fillStyle = i < stars ? '#ffd94d' : '#4a5168';
    ctx.font = '46px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('★', x, y);
  }
  ctx.textAlign = 'left';
}

function drawOverlay(ctx, game) {
  ctx.fillStyle = 'rgba(20, 24, 48, 0.82)';
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);
  ctx.fillStyle = '#f7f3ea';
  roundRect(ctx, 340, 150, 600, 420, 20);
  ctx.fill();
  ctx.fillStyle = INK;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (game.screen === 'levelDone') {
    ctx.font = 'bold 40px Georgia, serif';
    ctx.fillText('Level Complete!', 640, 210);
    drawStars(ctx, 640, 280, game.stars);
    ctx.fillStyle = INK;
    ctx.textAlign = 'center';
    ctx.font = '22px Georgia, serif';
    ctx.fillText(`${game.level.name}  ·  ${game.foundCount}/${game.diffs.length} found`, 640, 340);
    ctx.fillText(`Finds ${game.score}  +  time bonus ${game.levelBonus}  =  ${game.score + game.levelBonus}`, 640, 380);
    ctx.fillText(`Total score: ${game.totalScore}`, 640, 420);
    ctx.font = 'bold 22px Georgia, serif';
    ctx.fillText(game.levelIndex + 1 < 3 ? 'Press N or click for the next level' : 'Press N or click to see your total', 640, 500);
  } else if (game.screen === 'gameDone') {
    ctx.font = 'bold 40px Georgia, serif';
    ctx.fillText('You found them all!', 640, 210);
    drawStars(ctx, 640, 280, Math.min(3, game.results.reduce((s, r) => s + r.stars, 0) > 7 ? 3 : 2));
    ctx.fillStyle = INK;
    ctx.textAlign = 'center';
    ctx.font = '22px Georgia, serif';
    let y = 340;
    for (const r of game.results) {
      ctx.fillText(`${r.name}: ${'★'.repeat(r.stars)}${'☆'.repeat(3 - r.stars)}  ${r.score} pts`, 640, y);
      y += 34;
    }
    ctx.font = 'bold 24px Georgia, serif';
    ctx.fillText(`Total score: ${game.totalScore}   ·   Best: ${game.best}`, 640, y + 16);
    ctx.font = 'bold 22px Georgia, serif';
    ctx.fillText('Click to play again', 640, 510);
  } else if (game.screen === 'timeUp') {
    ctx.font = 'bold 40px Georgia, serif';
    ctx.fillText("Time's up!", 640, 230);
    ctx.font = '22px Georgia, serif';
    ctx.fillText(`You found ${game.foundCount} of ${game.diffs.length} differences in ${game.level.name}.`, 640, 300);
    ctx.fillText('A fresh pair of eyes helps. Try again!', 640, 340);
    ctx.font = 'bold 22px Georgia, serif';
    ctx.fillText('Press R or click to retry the level', 640, 480);
  }
  ctx.textAlign = 'left';
}

export function drawFrame(ctx, game, now) {
  ctx.clearRect(0, 0, VIEW.width, VIEW.height);
  ctx.fillStyle = '#e9e4d6';
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);
  if (game.screen === 'title') {
    drawTitle(ctx, game);
    return;
  }
  drawHud(ctx, game);
  drawPanel(ctx, game, 'A', VIEW.leftPanelX, now);
  drawPanel(ctx, game, 'B', VIEW.rightPanelX, now);
  drawBottomBar(ctx, game, now);
  if (game.screen !== 'playing') drawOverlay(ctx, game);
}
