#!/usr/bin/env node
/**
 * Optional, run once on your own machine:  npm run photos
 *
 * Downloads start/end photos for the plan's exercises from free-exercise-db
 * (public domain, https://github.com/yuhonas/free-exercise-db), converts them
 * to WebP and saves them in public/exercises/<id>/. The app then shows a
 * "Photo" tab next to the animation. Nothing is loaded from GitHub at runtime.
 *
 * Only exact name matches are used (no guessing). Afterwards, open
 * .photo-cache/review.html in your browser and check every pair. To drop a
 * bad match, run:  npm run photos -- --skip=reverse-curl,split-squat
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const BASE = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main";
const ALLOWED_EQUIPMENT = new Set(["dumbbell", "body only", "other", null, undefined]);

/** app exercise id -> dataset names to try, in order */
const CANDIDATES = {
  "bench-press": ["Dumbbell Bench Press"],
  "push-up": ["Pushups", "Push-Up", "Push-Ups"],
  flyes: ["Dumbbell Flyes"],
  "shoulder-press": ["Seated Dumbbell Press", "Dumbbell Shoulder Press", "Seated Dumbbell Shoulder Press"],
  "lateral-raise": ["Seated Side Lateral Raise", "Side Lateral Raise"],
  "triceps-extension": ["Lying Dumbbell Tricep Extension", "Lying Dumbbell Triceps Extension"],
  "bench-dips": ["Bench Dips"],
  "front-plank": ["Plank"],
  "single-arm-row": ["One-Arm Dumbbell Row"],
  pullover: ["Bent-Arm Dumbbell Pullover", "Straight-Arm Dumbbell Pullover"],
  "seated-curl": ["Seated Dumbbell Curl", "Dumbbell Bicep Curl"],
  "hammer-curl": ["Hammer Curls", "Alternate Hammer Curl"],
  "reverse-curl": ["Standing Dumbbell Reverse Curl", "Reverse Dumbbell Curl"],
  "wrist-curl": ["Palms-Up Dumbbell Wrist Curl Over A Bench", "Seated Dumbbell Palms-Up Wrist Curl"],
  "farmers-carry": ["Farmer's Walk"],
  "goblet-squat": ["Goblet Squat"],
  "split-squat": ["Split Squat with Dumbbells", "Dumbbell Bulgarian Split Squat"],
  "step-ups": ["Dumbbell Step Ups"],
  "calf-raise": ["Standing Dumbbell Calf Raise"],
  "dead-bug": ["Dead Bug"],
  "side-plank": ["Side Bridge"],
  "close-grip-push-up": ["Push-Ups - Close Triceps Position"],
  "arnold-press": ["Arnold Dumbbell Press"],
  "lateral-front-raise": ["Side Lateral Raise"],
};

const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, "");
const skip = new Set(
  (process.argv.find((a) => a.startsWith("--skip=")) ?? "--skip=").slice(7).split(",").filter(Boolean),
);

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function getBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

let sharp = null;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.warn("sharp not found: saving original JPGs (run `npm i -D sharp` for smaller WebP files).");
}

console.log("Downloading exercise list…");
const all = await getJson(`${BASE}/dist/exercises.json`);
const byName = new Map(all.map((e) => [norm(e.name), e]));

const mediaPath = path.join(ROOT, "src/data/exercise-media.json");
const media = {};
const rows = [];
const missing = [];

for (const [appId, names] of Object.entries(CANDIDATES)) {
  if (skip.has(appId)) {
    console.log(`- ${appId}: skipped`);
    continue;
  }
  const hit = names.map((n) => byName.get(norm(n))).find((e) => e && ALLOWED_EQUIPMENT.has(e.equipment));
  if (!hit || !Array.isArray(hit.images) || hit.images.length < 2) {
    missing.push(appId);
    continue;
  }
  const dir = path.join(ROOT, "public/exercises", appId);
  await mkdir(dir, { recursive: true });
  const frames = [];
  let width = 720;
  let height = 540;
  for (let i = 0; i < 2; i++) {
    const buf = await getBuffer(`${BASE}/exercises/${hit.images[i]}`);
    if (sharp) {
      const out = await sharp(buf).resize({ width: 720, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
      const meta = await sharp(out).metadata();
      width = meta.width ?? width;
      height = meta.height ?? height;
      await writeFile(path.join(dir, `${i}.webp`), out);
      frames.push(`/exercises/${appId}/${i}.webp`);
    } else {
      await writeFile(path.join(dir, `${i}.jpg`), buf);
      frames.push(`/exercises/${appId}/${i}.jpg`);
    }
  }
  media[appId] = { frames, width, height, source: hit.name };
  rows.push({ appId, source: hit.name, frames });
  console.log(`✓ ${appId}  ←  ${hit.name}`);
}

await writeFile(mediaPath, JSON.stringify(media, null, 2) + "\n");

const review = `<!doctype html><meta charset="utf-8"><title>HomeGain photo review</title>
<style>body{font:15px system-ui;background:#111;color:#eee;margin:24px}div{display:flex;gap:12px;align-items:center;margin:12px 0;padding:12px;background:#1b1b1b;border-radius:12px}
img{height:160px;border-radius:8px;background:#fff}b{width:220px}</style>
<h1>Check every pair: right exercise, dumbbells or bodyweight only, clear poses</h1>
<p>Bad match? Run <code>npm run photos -- --skip=id1,id2</code>. The animation is used instead.</p>
${rows.map((r) => `<div><b>${r.appId}<br><small>${r.source}</small></b>${r.frames.map((f) => `<img src="../public${f}">`).join("")}</div>`).join("\n")}`;
await mkdir(path.join(ROOT, ".photo-cache"), { recursive: true });
await writeFile(path.join(ROOT, ".photo-cache/review.html"), review);

console.log(`\nSaved ${rows.length} photo pairs. No exact match (animation only): ${missing.join(", ") || "none"}`);
console.log("Now open .photo-cache/review.html in your browser and check each pair.");
