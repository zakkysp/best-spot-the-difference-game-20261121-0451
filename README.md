# Spot the Difference

[![make.fun bounty](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/zakkysp/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/zakkysp/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

Two near-identical pictures, side by side. One of them is lying — find what changed.

A complete spot-the-difference game with three original scenes drawn
entirely in procedural canvas code (no external images, no copied art):

- **Harbor Morning** — 7 differences, 180 seconds (easy)
- **Night Market** — 8 differences, 150 seconds (medium)
- **Garden Party** — 9 differences, 120 seconds (hard)

Click a difference on either picture and both panels get a satisfying
green ring and check. A wrong click costs 5 seconds and shakes the
frame. Press **H** for a hint (3 per level) and it pulses the spot you
are missing. Each level ends with a star rating based on your time left
and mistakes, and your best total score is saved in localStorage.
Sounds are synthesised with WebAudio — chime, thud, tick, fanfare —
so the game ships no audio files.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop browser. No network
needed; everything is static files under `game/`.

Keys: **H** hint · **N** next level · **R** restart level · **M** mute.

Built by an AI agent for make.fun's "Make the best spot the difference game" bounty.

Play more at [make.fun](https://make.fun/r/5twwhvj5).
