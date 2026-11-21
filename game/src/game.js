// Game state and rules: levels, timer, scoring, hints, stars.
// Rendering lives in render.js, input in input.js, sound in audio.js.

import {
  LEVELS, SCORE_PER_FIND, TIME_BONUS_PER_SECOND, WRONG_CLICK_PENALTY_SECONDS,
  HINTS_PER_LEVEL, STAR_RULES, VIEW, CLICK_RADIUS, HINT_MS, MARK_POP_MS, BEST_KEY,
} from './config.js';
import { DIFFERENCES } from './differences.js';
import { drawFrame } from './render.js';
import { bindInput } from './input.js';
import { playFind, playMiss, playTick, playFanfare, playHint, setMuted, isMuted } from './audio.js';
import { stageShot } from './shots.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.screen = 'title';
    this.levelIndex = 0;
    this.found = new Set();
    this.foundAt = new Map();
    this.mistakes = 0;
    this.hintsLeft = HINTS_PER_LEVEL;
    this.timeLeft = LEVELS[0].timeLimit;
    this.score = 0;
    this.totalScore = 0;
    this.stars = 0;
    this.levelBonus = 0;
    this.hint = null;
    this.shakeUntil = 0;
    this.lastTickSecond = -1;
    this.results = [];
    this.best = Number(localStorage.getItem(BEST_KEY) || 0);
    this.flashMessage = '';
    this.flashUntil = 0;
    this.lastTime = 0;
    bindInput(canvas, this);
  }

  get level() {
    return LEVELS[this.levelIndex];
  }

  get diffs() {
    return DIFFERENCES[this.level.id];
  }

  get foundCount() {
    return this.found.size;
  }

  get remainingCount() {
    return this.diffs.length - this.found.size;
  }

  start() {
    const loop = (t) => {
      const dt = Math.min(0.1, (t - this.lastTime) / 1000 || 0);
      this.lastTime = t;
      this.update(dt, t);
      drawFrame(this.ctx, this, t);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    stageShot(this);
  }

  update(dt, now) {
    if (this.screen !== 'playing') return;
    this.timeLeft -= dt;
    if (this.timeLeft <= 10) {
      const whole = Math.ceil(this.timeLeft);
      if (whole !== this.lastTickSecond && whole > 0) {
        this.lastTickSecond = whole;
        playTick();
      }
    }
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.screen = 'timeUp';
    }
    if (this.hint && now > this.hint.until) this.hint = null;
  }

  startLevel(index) {
    this.levelIndex = index;
    this.found = new Set();
    this.foundAt = new Map();
    this.mistakes = 0;
    this.hintsLeft = HINTS_PER_LEVEL;
    this.timeLeft = this.level.timeLimit;
    this.score = 0;
    this.stars = 0;
    this.levelBonus = 0;
    this.hint = null;
    this.lastTickSecond = -1;
    this.screen = 'playing';
  }

  restartLevel() {
    this.startLevel(this.levelIndex);
  }

  beginGame() {
    this.totalScore = 0;
    this.results = [];
    this.startLevel(0);
  }

  // A click in canvas pixels. Works out which panel it landed in,
  // then whether it hit an unfound difference.
  clickAt(px, py) {
    if (this.screen === 'title') {
      this.beginGame();
      return;
    }
    if (this.screen === 'levelDone' || this.screen === 'gameDone') {
      this.nextLevel();
      return;
    }
    if (this.screen === 'timeUp') {
      this.restartLevel();
      return;
    }
    const panel = this.panelAt(px, py);
    if (!panel) return;
    const lx = px - panel.x;
    const ly = py - VIEW.panelY;
    // A click on a difference already found is a free re-look, not a
    // mistake: ignore it instead of charging the wrong-click penalty.
    for (const diff of this.diffs) {
      if (this.found.has(diff.id) && Math.hypot(diff.x - lx, diff.y - ly) < CLICK_RADIUS) return;
    }
    let bestDiff = null;
    let bestDist = CLICK_RADIUS;
    for (const diff of this.diffs) {
      if (this.found.has(diff.id)) continue;
      const d = Math.hypot(diff.x - lx, diff.y - ly);
      if (d < bestDist) {
        bestDist = d;
        bestDiff = diff;
      }
    }
    if (bestDiff) {
      this.found.add(bestDiff.id);
      this.foundAt.set(bestDiff.id, performance.now());
      this.score += SCORE_PER_FIND;
      playFind();
      this.flash(`${bestDiff.label} found! +${SCORE_PER_FIND}`);
      if (this.found.size === this.diffs.length) this.completeLevel();
    } else {
      this.mistakes += 1;
      this.timeLeft = Math.max(0, this.timeLeft - WRONG_CLICK_PENALTY_SECONDS);
      this.shakeUntil = performance.now() + 220;
      playMiss();
      this.flash(`Not there! -${WRONG_CLICK_PENALTY_SECONDS}s`);
    }
  }

  panelAt(px, py) {
    if (py < VIEW.panelY || py > VIEW.panelY + VIEW.panelHeight) return null;
    if (px >= VIEW.leftPanelX && px <= VIEW.leftPanelX + VIEW.panelWidth) {
      return { side: 'A', x: VIEW.leftPanelX };
    }
    if (px >= VIEW.rightPanelX && px <= VIEW.rightPanelX + VIEW.panelWidth) {
      return { side: 'B', x: VIEW.rightPanelX };
    }
    return null;
  }

  useHint() {
    if (this.screen !== 'playing') return;
    if (this.hintsLeft <= 0) {
      this.flash('No hints left!');
      return;
    }
    const unfound = this.diffs.filter((d) => !this.found.has(d.id));
    if (unfound.length === 0) return;
    const pick = unfound[Math.floor(Math.random() * unfound.length)];
    this.hintsLeft -= 1;
    this.hint = { id: pick.id, until: performance.now() + HINT_MS };
    playHint();
  }

  toggleMute() {
    setMuted(!isMuted());
  }

  nextLevel() {
    if (this.screen === 'gameDone') {
      this.screen = 'title';
      return;
    }
    if (this.screen === 'levelDone') {
      if (this.levelIndex + 1 < LEVELS.length) this.startLevel(this.levelIndex + 1);
      else this.screen = 'gameDone';
    }
  }

  completeLevel() {
    this.levelBonus = Math.round(this.timeLeft) * TIME_BONUS_PER_SECOND;
    const levelScore = this.score + this.levelBonus;
    this.totalScore += levelScore;
    this.stars = this.starsForLevel();
    this.results.push({ name: this.level.name, stars: this.stars, score: levelScore });
    if (this.totalScore > this.best) {
      this.best = this.totalScore;
      localStorage.setItem(BEST_KEY, String(this.best));
    }
    playFanfare();
    this.screen = 'levelDone';
  }

  starsForLevel() {
    const timeFraction = this.timeLeft / this.level.timeLimit;
    if (this.mistakes <= STAR_RULES.three.maxMistakes && timeFraction >= STAR_RULES.three.minTimeFraction) return 3;
    if (this.mistakes <= STAR_RULES.two.maxMistakes && timeFraction >= STAR_RULES.two.minTimeFraction) return 2;
    return 1;
  }

  flash(message) {
    this.flashMessage = message;
    this.flashUntil = performance.now() + 1400;
  }

  // ---- staging helpers used by shots.js (screenshot mode only) ----

  stagePlay(levelIndex, foundIds, timeLeft) {
    this.startLevel(levelIndex);
    for (const id of foundIds) {
      this.found.add(id);
      this.foundAt.set(id, performance.now() - MARK_POP_MS);
    }
    // The staged finds count on the scoreboard too, so the picture
    // stays honest: three rings means three finds' worth of points.
    this.score = foundIds.length * SCORE_PER_FIND;
    this.timeLeft = timeLeft;
  }

  stagePlayWithHint(levelIndex, foundIds, timeLeft, hintId) {
    this.stagePlay(levelIndex, foundIds, timeLeft);
    this.hintsLeft = HINTS_PER_LEVEL - 1;
    // A long pulse for the screenshot: the real hint lasts HINT_MS,
    // but the camera needs a few seconds to arrive.
    this.hint = { id: hintId, until: performance.now() + 60000 };
  }

  stageLevelDone(levelIndex, stars, score) {
    this.startLevel(levelIndex);
    for (const diff of this.diffs) {
      this.found.add(diff.id);
      this.foundAt.set(diff.id, performance.now() - MARK_POP_MS);
    }
    this.score = score;
    this.timeLeft = 62;
    this.stars = stars;
    this.levelBonus = 124;
    this.totalScore = score + this.levelBonus;
    this.results = [{ name: this.level.name, stars, score: score + this.levelBonus }];
    this.screen = 'levelDone';
  }
}
