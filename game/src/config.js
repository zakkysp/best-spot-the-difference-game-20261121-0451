// Level list and tuning for Spot the Difference.
// One entry per level: name, time limit, and the short blurb shown on the HUD.
export const LEVELS = [
  {
    id: 'harbor',
    name: 'Harbor Morning',
    tagline: 'Seven changes hide in the morning light.',
    timeLimit: 180,
    difficulty: 'Easy',
  },
  {
    id: 'market',
    name: 'Night Market',
    tagline: 'Eight changes under the paper lanterns.',
    timeLimit: 150,
    difficulty: 'Medium',
  },
  {
    id: 'garden',
    name: 'Garden Party',
    tagline: 'Nine quiet changes in the afternoon garden.',
    timeLimit: 120,
    difficulty: 'Hard',
  },
];

// Points and penalties.
export const SCORE_PER_FIND = 100;
export const TIME_BONUS_PER_SECOND = 2;
export const WRONG_CLICK_PENALTY_SECONDS = 5;
export const HINTS_PER_LEVEL = 3;

// Stars on the level-complete screen: 3 stars need few mistakes and
// plenty of time left, 2 stars need a decent run, anything else is 1.
export const STAR_RULES = {
  three: { maxMistakes: 1, minTimeFraction: 0.4 },
  two: { maxMistakes: 3, minTimeFraction: 0.15 },
};

// Canvas and panel geometry. The scene itself is drawn in a 600 x 540
// box; the two panels sit side by side under the HUD bar.
export const VIEW = {
  width: 1280,
  height: 720,
  hudHeight: 64,
  panelWidth: 600,
  panelHeight: 540,
  panelY: 84,
  leftPanelX: 20,
  rightPanelX: 660,
  bottomBarY: 640,
};

// How close a click must land to a difference centre to count.
export const CLICK_RADIUS = 34;

// Hint pulse lasts this long (ms) and the ring grows to this radius.
export const HINT_MS = 1600;
export const HINT_MAX_RADIUS = 52;

// How long a found marker takes to pop in (ms).
export const MARK_POP_MS = 260;

// Best-score key in localStorage.
export const BEST_KEY = 'spot-the-difference-best';
