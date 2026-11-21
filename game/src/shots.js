// Screenshot staging: ?shot=start|play|play2|play3|end&seed=1
// puts the game into a fixed, photogenic state so the screenshots
// show the real game at its best. With no ?shot= parameter the
// game simply opens on the title screen.

export function stageShot(game) {
  const params = new URLSearchParams(window.location.search);
  const shot = params.get('shot');
  if (!shot || shot === 'start') return;

  if (shot === 'play') {
    // Harbor Morning mid-game: 3 found (rings visible), 4 still hidden.
    game.stagePlay(0, ['flag', 'sail', 'buoy'], 122);
  } else if (shot === 'play2') {
    // Night Market mid-game with a hint pulsing on the moon.
    game.stagePlayWithHint(1, ['lantern', 'cat', 'fruit'], 98, 'moon');
  } else if (shot === 'play3') {
    // Garden Party mid-game: 4 found, 5 still hidden.
    game.stagePlay(2, ['tulip', 'candles', 'dog', 'fountain'], 74);
  } else if (shot === 'end') {
    // Harbor Morning finished: three stars and the score breakdown.
    game.stageLevelDone(0, 3, 700);
  }
}
