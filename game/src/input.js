// Mouse and keyboard input: converts a pointer event into canvas
// coordinates (the canvas may be CSS-scaled) and maps keys to actions.

export function bindInput(canvas, game) {
  canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
    game.clickAt(x, y);
  });

  window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (key === 'h') {
      game.useHint();
    } else if (key === 'n') {
      game.nextLevel();
    } else if (key === 'r') {
      if (game.screen === 'playing' || game.screen === 'timeUp') game.restartLevel();
    } else if (key === 'm') {
      game.toggleMute();
    } else if (key === 'enter') {
      if (game.screen === 'title') game.beginGame();
    }
  });
}
