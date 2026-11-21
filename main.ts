// Hands in the Spot the Difference game (Node 22, standard library only).
// The game is plain static files under game/ that a desktop browser loads
// offline: game/index.html plus its ES modules, no library, no network.
// This program copies game/ and screenshots/ from beside this file into
// /output and writes /output/dossier.json with the vendored make.fun
// library, so the sealed scorer can check the entry and the judge can
// read it.
//
// Serve it locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// A spot-the-difference entry is only worth handing in with pictures of
// the game itself, so refuse to build an empty screenshots folder.
const shotDir = join(repoRoot, 'screenshots');
if (!existsSync(shotDir) || readdirSync(shotDir).filter((f) => !f.startsWith('.')).length === 0) {
  throw new Error('screenshots/ is empty: take the 3-4 screenshots before handing the game in');
}

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'game'), join(outputDir, 'game'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
cpSync(shotDir, join(outputDir, 'screenshots'), { recursive: true });

// These caps mirror the scorer's own gate (reference/gate.json): the
// dossier text is capped at 160 KiB, at most 4 screenshots of 256 KiB
// each, game/ holds at most 993 files and 48 MiB in all, and no path
// under game/ is longer than 1000 bytes. game/ and screenshots/ share
// /output's own 1000-entry, 64 MiB cap with dossier.json.
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
