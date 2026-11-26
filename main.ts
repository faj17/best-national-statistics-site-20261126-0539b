// main.ts — hand in Nusantara in Numbers (Node 22, standard library only).
//
// The site itself is plain static files in app/ (index.html, data.js,
// charts.js, app.js, style.css): a browser opens app/index.html and the
// whole site runs with no build step and no network. This program's only
// job is the hand-in: copy app/ and screenshots/ beside this file into the
// output directory, and write output/dossier.json — the summary the judge
// reads (screenshots, first-load files and bytes, and the source outline)
// — using the vendored make.fun library, which must stay untouched: the
// scorer requires dossier.json to be byte for byte what its own copy of
// the library writes.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Serve the site locally with `node serve.ts`, then open http://localhost:8080.

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

/* The repository root is the directory this file sits in. */
const repoRoot = dirname(fileURLToPath(import.meta.url));

/* The grader hands us a writable /output; locally we take the env override. */
const handInDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

/* The scorer's own caps, from the competition's gate: the text budget that
 * shapes the dossier's bytes, at most 4 screenshots of 256 KiB each, and
 * app/ capped at 993 entries and 16 MiB — app/ shares /output's own
 * 1000-entry cap with screenshots/ and dossier.json, so leave it room. */
const dossierOptions = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
};

/* Start from an empty output directory, so a stale file from an earlier
 * run can never ride along into the hand-in. */
function resetDir(path: string): void {
  rmSync(path, { recursive: true, force: true });
  mkdirSync(path, { recursive: true });
}

/* Refuse to hand in a repository whose site shell is missing: a dossier
 * built from an empty app/ would judge as an empty site. */
if (!existsSync(join(repoRoot, "app", "index.html"))) {
  throw new Error("app/index.html is missing — nothing to hand in");
}

resetDir(handInDir);
cpSync(join(repoRoot, "app"), join(handInDir, "app"), { recursive: true });
if (existsSync(join(repoRoot, "screenshots"))) {
  cpSync(join(repoRoot, "screenshots"), join(handInDir, "screenshots"), { recursive: true });
}
writeFileSync(join(handInDir, "dossier.json"), buildDossier(handInDir, dossierOptions));

console.log(`handed in to ${handInDir}`);
