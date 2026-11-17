# HomeGain: Build Spec for a Personal Workout + Meal Plan Web App

> **How to use this file.** Give it to Claude (best in **Claude Code**, because the build needs to install packages, download images and push to GitHub) with this message:
> *"Read the whole file, then build the app phase by phase in Section 14. Use the defaults in Section 15 instead of asking me questions. Stop after each phase and show me what works."*

---

## 1. What We Are Building

A clean, mobile-first personal web app, deployed on **Vercel**, that turns my 7-day home workout and meal plan into something I can tap through every day.

- **Single user, no login, no backend.** Everything is saved in the browser (localStorage).
- **Plan data is fixed content** (Section 16). The app displays it, tracks my ticks, and adds a BMI calculator and progress tools.
- **Placeholder name:** HomeGain. Easy to rename.

## 2. Requirements From Me (Must All Be Met)

| # | Requirement |
|---|---|
| R1 | Show everything in the plan content (Section 16), except what is excluded in Section 3. |
| R2 | **One click** on a day shows that day's plan (workout or rest day). |
| R3 | A **round button** per day. Click it and it shows a **tick** (click again to undo). |
| R4 | When **all 7 days are ticked**, the tracker **resets to its initial state** automatically. |
| R5 | Every workout day shows **each exercise with a visual** that shows how to do it. |
| R6 | Meals have **visuals** too (food icons, a plate diagram, a timeline). |
| R7 | A **BMI calculator**. |
| R8 | The site must look **clean, never messy**. |
| R9 | Add **extra features** that suit it, but only ones that keep it clean (Sections 9 and 14). |
| R10 | Deploy on **Vercel**. |

## 3. Content Exclusions (Important)

Do **not** put these on the website:

- Any injury, back-care, pain or rehab guidance (the "Back Rules" section of my source plan is excluded entirely).
- Any **cooking instructions**: air-fryer settings, temperatures, doneness checks, potato cooking methods, marinade ideas, food-safety steps.
- No "removed from version 1" notes on exercises. Show the current exercise lists only.

Keep food content to **what to eat and how much**, never how to cook it. The site is public by URL, so also keep any health details out of it.

---

## 4. Tech Stack (Defaults)

| Area | Choice |
|---|---|
| Framework | **Next.js (latest stable, App Router) + TypeScript** |
| Styling | **Tailwind CSS** with CSS variables for theme tokens |
| UI primitives | **shadcn/ui** (Radix) for accordion, dialog, tabs, toast, switch |
| Motion | **Framer Motion** (respect `prefers-reduced-motion`) |
| State | **Zustand** with `persist` middleware (localStorage, versioned, with `migrate`) |
| Charts | **Recharts** (weight log) or lightweight SVG |
| Images | Static WebP files in `/public`, optimised with `sharp` at build time |
| Tests | **Vitest** (unit) + **Playwright** (one smoke test) |
| Hosting | **Vercel** (free Hobby plan is enough) |

No database, no auth, no API keys, no environment variables for the MVP.

## 5. Information Architecture

Bottom tab bar on mobile (left sidebar on wide screens). Five tabs, one gear icon for settings.

| Tab | Route | Purpose |
|---|---|---|
| **Plan** | `/` | Week strip with round tick buttons + the selected day's plan |
| **Meals** | `/meals` | Daily meal timeline, plate diagram, calorie/protein totals |
| **BMI** | `/bmi` | BMI calculator |
| **Progress** | `/progress` | Weeks completed, weight log and chart, weekly check-in |
| **Guide** | `/guide` | Progression steps, daily habits, food notes |
| Gear icon | `/settings` | Week start day, units, BMI scale, theme, backup/reset |

### Plan tab wireframe (mobile)

```
┌──────────────────────────────┐
│ HomeGain              ⚙      │
│ Wed 18 Nov                   │
│                              │
│ ( ✓ ) ( ✓ ) (   ) (   ) ...  │   <- 7 round buttons: tap = tick
│  Sat   Sun   Mon   Tue       │   <- tap the label/chip = open that day
│ ▔▔▔▔                         │   <- underline shows selected day
│ 3 / 7 days done              │
│                              │
│ DAY 2 · SUN                  │
│ Pull: Back, Biceps, Forearms │
│ ~45 min · 9 exercises        │
│                              │
│ ┌──────────────────────────┐ │
│ │ [img]  Supported Row  ⌄  │ │   <- accordion card, collapsed
│ │        4 × 12-15 / arm   │ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │ [animated 2-frame visual]│ │   <- expanded card
│ │ Muscles: Lats, Biceps    │ │
│ │ 1. Hand + knee on bench… │ │
│ │ 2. …                     │ │
│ │ ▶ Watch a demo           │ │
│ └──────────────────────────┘ │
│                              │
│  [  ◯  Mark Day 2 complete ] │   <- big round tick button (same state)
└──────────────────────────────┘
 Plan   Meals   BMI   Progress  Guide
```

**Two separate click targets in the week strip:** the **round button** toggles the tick (R3). The **day chip** (label area) opens that day's plan inline with one click (R2), with no page navigation. Both the strip's round button and the big "Mark Day complete" button at the bottom of a day control the **same** state.

---

## 6. Design System ("Not Messy" Rules)

**Feel:** calm, modern, premium fitness app. Lots of whitespace, one accent colour, soft cards.

| Token | Light | Dark |
|---|---|---|
| Background | `#FAFAF7` | `#0F1214` |
| Surface (cards) | `#FFFFFF` | `#171B1E` |
| Ink (text) | `#14171A` | `#ECEFF1` |
| Muted text | `#667078` | `#8A949B` |
| Border | `#E7E8E4` | `#262B2F` |
| **Accent (only one)** | `#16A34A` (green) | `#34D399` |

- **Typography:** one family (Geist or Inter via `next/font`), two weights (500, 700), tabular numbers for stats. Max three text sizes per screen.
- **Shape and spacing:** 16 px card radius, 8-pt spacing scale, 16 px page gutters, 1 px borders, minimal shadows.
- **Layout:** single column up to 768 px. Above that, Plan page uses two columns: exercise list left, sticky visual right. Max content width 960 px.
- **Focus tag colours:** day-type chips (Push, Pull, Legs, Full body, Rest) use muted tints only. No rainbow.
- **One primary action per screen.** Everything else is secondary or hidden behind an accordion.
- **Progressive disclosure:** exercise details, meal details and guide cards are collapsed by default.
- **Motion:** 150-250 ms ease-out. Tick draws with an SVG stroke animation. Week-complete celebration is brief and subtle (about 1.5 s, small confetti or ring pulse). Disable all non-essential motion with `prefers-reduced-motion`.
- **Accessibility:** WCAG AA contrast, 44 px minimum touch targets, keyboard operable, visible focus rings, round buttons use `aria-pressed` and labels like "Mark Day 3 complete".
- **Empty/loading states:** skeleton shimmer for images, friendly text for empty weight log.
- **Dark mode:** follows system by default, switchable in Settings.

---

## 7. State Model

```ts
type DayNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface Settings {
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6; // weekday of Day 1; 0 = Sunday. DEFAULT 6 (Saturday)
  units: "metric" | "imperial";            // DEFAULT metric
  bmiScale: "who" | "asia";                // DEFAULT asia
  theme: "system" | "light" | "dark";      // DEFAULT system
  heightCm: number;                        // DEFAULT 170.18 (5 ft 7 in)
}

interface WeekState {
  ticks: boolean[];          // length 7, index 0 = Day 1
  startedAt: string;         // ISO date
  phase: "active" | "celebrating";
}

interface AppState {
  settings: Settings;
  week: WeekState;
  weeksCompleted: number;
  completedWeeks: { completedAt: string }[];
  weightLog: { date: string; kg: number }[];
  mealChecks: Record<string, boolean>;       // key: `${yyyy-mm-dd}:${mealId}` (Phase 2)
  setChecks: Record<string, boolean>;        // key: `${yyyy-mm-dd}:${exerciseId}:${setIndex}` (Phase 2)
  waterByDate: Record<string, number>;       // glasses (Phase 2)
}
```

**Day to weekday mapping:** `weekday(dayN) = (weekStartsOn + dayN - 1) % 7`. With the default (Saturday), Day 1 = Sat, Day 2 = Sun, Day 3 = Mon (rest), Day 4 = Tue, Day 5 = Wed (rest), Day 6 = Thu, Day 7 = Fri (rest). Selected day on first load = the Day whose weekday matches today in the device time zone.

### The Tick and Reset Logic (R3, R4)

```ts
toggleTick(i) {
  ticks[i] = !ticks[i];
  if (ticks.every(Boolean)) week.phase = "celebrating";   // all 7 done
}

// Runs after the celebration ends (about 3 s, or on tap), AND on app load if
// phase === "celebrating" or all ticks are true (so closing the tab mid-celebration still resets).
completeWeek() {
  weeksCompleted += 1;
  completedWeeks.push({ completedAt: now });
  ticks = [false x 7];            // back to the initial state
  week.startedAt = now;
  week.phase = "active";
}
```

Rules:
- Untick is always allowed before the 7th tick.
- During the celebration overlay ("Week complete! 🎉  Week #N"), show an **Undo** button that cancels the 7th tick and returns to `active`.
- Rest days count: all **7** round buttons (including the 3 rest days) must be ticked.
- No time-based reset. The week resets only when all 7 are ticked.
- Any day can be ticked at any time (today is only highlighted).
- Handle hydration safely: read persisted state after mount to avoid server/client mismatch.
- Sync across tabs with the `storage` event.

---

## 8. BMI Calculator (R7)

**Inputs:** weight (kg or lb), height (cm, or ft + in), units toggle, scale toggle (WHO standard / Asian). Pre-fill from Settings: 65 kg and 170.18 cm. Compute live as the user types, no submit button needed.

**Formulas**
- Metric: `BMI = kg / (m * m)`, where `m = cm / 100`
- Imperial: `BMI = 703 * lb / (in * in)`
- Round to **1 decimal**. Valid input ranges: height 100-250 cm, weight 25-300 kg. Show a gentle inline message outside the range.

**Categories**

| Category | WHO standard | Asian (Asia-Pacific) |
|---|---|---|
| Underweight | below 18.5 | below 18.5 |
| Normal | 18.5 - 24.9 | 18.5 - 22.9 |
| Overweight | 25.0 - 29.9 | 23.0 - 24.9 |
| Obese | 30.0 and above | 25.0 and above |

**Result UI:** a large number, the category label, and a segmented horizontal gauge with an animated marker. Below it show the **healthy weight range for the entered height** (`18.5 * m²` to upper limit `* m²`) and the difference from the current weight.

**Buttons:** "Save to weight log" (adds today's weight to the Progress chart).

**Note shown under the result:** "BMI does not separate muscle from fat, so it may creep up as you build muscle. Use it as one signal, not the whole picture."

**Unit-test values**
- 65 kg, 170.18 cm gives **22.4**, Normal on both scales. Healthy range (WHO) about 53.6 to 72.1 kg, (Asian) about 53.6 to 66.3 kg.
- 65 kg, 170 cm gives **22.5**.
- Imperial check: 143.3 lb and 5 ft 7 in must give **22.4**, matching the metric result within rounding.

---

## 9. Features

### MVP (Phase 1-4): must ship

1. **Week strip** with 7 round tick buttons, day chips, progress text ("3 / 7 days done"), reset after 7 (Section 7).
2. **Day plan view** (workout or rest day) with exercise accordion cards and visuals (Section 10).
3. **Meals page** with timeline, visuals, totals, training/rest toggle (Section 11).
4. **BMI calculator** (Section 8).
5. **Progress page:** weeks completed, a calendar-style list of completed weeks, weight log with line chart and the target band (0.25-0.5 kg gain per week from the first logged weight). The **weekly check-in** card compares the latest weekly change to the target:
   - Gaining slower than 0.25 kg/week: "Add 1 more potato or a glass of milk."
   - Gaining faster than 0.5 kg/week: "Cut the bedtime snack or a few potatoes."
   - On target: "Right on track. Keep going."
6. **Guide page** (collapsible cards): progression steps, daily habits, food notes (Section 16.4 to 16.6).
7. **Settings:** week start day, units, BMI scale, theme, **export/import JSON backup**, reset all data (with confirm dialog).
8. **Footer note:** "General fitness guidance, not medical advice." Plus image credit (Section 10).

### Phase 2: nice-to-have (each is hidden behind a clear entry point, never cluttering the main screens)

| Feature | Notes |
|---|---|
| **Workout mode** | Full-screen, one exercise at a time, big set counter, auto **rest timer** (60-90 s), screen wake lock, "next exercise" button |
| **Per-set checkboxes** | On exercise cards; a day progress ring fills as sets are done. The day's round button is still the source of truth |
| **Meal checklist** | Tick meals eaten; calorie/protein ring fills toward the day's target |
| **Water tracker** | 3-4 L target shown as 12-16 tap-able glasses per day |
| **Weekly shopping list** | Derived from meal data: 3.5 kg raw chicken, 5.6 kg potatoes for 7 days, plus eggs, milk, yogurt, bananas, nuts, vegetables. Computed in code, never typed by hand |
| **PWA** | Installable, works offline (manifest + cached static assets) |
| **Rest-day stretch cards** | 4-5 simple generic stretches with visuals, shown only on rest days |

### Phase 3: optional

- Cross-device sync via Vercel-marketplace Redis/Upstash or Supabase with a simple passcode (only if I ask).
- Share-progress image card.

> **Scope guard:** build only the MVP first. Do not add features beyond this list without asking.

---

## 10. Exercise Visuals (R5): The Key Part

Goal: every exercise card expands to show **an animated two-frame visual (start position to end position)**, the muscles worked, 3-5 short step cues, and a "Watch a demo" link.

### Visual source strategy (in priority order)

**Tier 1: free-exercise-db (public domain).**
- GitHub: `yuhonas/free-exercise-db`. Licensed under the **Unlicense** (public domain). It has per-exercise JSON (`id`, `name`, `equipment`, `primaryMuscles`, `secondaryMuscles`, `instructions[]`, `images[]`) and JPG images, usually two per exercise (`0.jpg` = start, `1.jpg` = end).
- Image URL pattern: `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/<id>/0.jpg`
- Combined data: look for `dist/exercises.json` in the repo. If it is missing, assemble it from the per-exercise JSON files or follow the repo's `make` instructions.
- Animate by **cross-fading** frame 0 and frame 1 on a loop (about 1.2 s each, ease-in-out). Pause the loop when the card is off-screen or when reduced motion is on (show a static pair side by side instead).

**Tier 2: custom SVG pose animation** for exercises the dataset lacks or shows with the wrong equipment (for example hip thrust with a dumbbell, bird-dog, dead bug, curl-to-press).
- Build one reusable `<PoseAnimation keyframes=... />` component: a clean line-art figure with 2px rounded strokes, a simple bench and dumbbell drawn consistently, the moving limb highlighted in the accent colour, 2-3 keyframes animated with Framer Motion.
- Keep the style identical across all fallback exercises so the set looks like one family.

**Tier 3: "Watch a demo" link** on every card, opening a YouTube search in a new tab: `https://www.youtube.com/results?search_query=<exercise name> dumbbell form`. No embedded videos, to keep pages fast.

### Build-time media pipeline (do this once, commit the output)

1. Write `scripts/build-exercise-media.ts` that downloads `exercises.json`, filters to `equipment` in `dumbbell`, `body only`, `other` (I have no barbell, cable or machines), matches each plan exercise to a dataset `id` using the hints below, downloads the JPGs, converts them to WebP (max 720 px wide, quality about 80) with `sharp`, and writes `public/exercises/<slug>/0.webp` and `1.webp` plus `src/data/exercise-media.json`.
2. **Visually inspect every matched image pair** (open the images, don't trust names). Reject mismatches, wrong equipment or confusing poses, and send them to Tier 2.
3. The app must **not** depend on GitHub at runtime. All images are self-hosted.
4. Footer credit: "Exercise images: free-exercise-db (public domain)". Not legally required, but polite.

### Match hints (unverified guesses from memory; the builder must check)

| Plan exercise | Dataset search hints | Likely tier |
|---|---|---|
| Flat Dumbbell Bench Press | "Dumbbell Bench Press" | 1 |
| Push-ups | "Pushups" | 1 |
| Dumbbell Flyes | "Dumbbell Flyes" | 1 |
| Seated Dumbbell Shoulder Press | "Seated Dumbbell Press", "Dumbbell Shoulder Press" | 1 |
| Lateral Raises | "Side Lateral Raise" | 1 |
| Lying Dumbbell Triceps Extension | "Lying Dumbbell Tricep Extension", "Lying Triceps Press" | 1 |
| Bench Dips | "Bench Dips" | 1 |
| Front Plank | "Plank" | 1 |
| Supported Single-Arm Row | "One-Arm Dumbbell Row" | 1 |
| Dumbbell Pullover | "Bent-Arm Dumbbell Pullover", "Straight-Arm Dumbbell Pullover" | 1 |
| Bird-Dog | "Bird Dog", "Superman" | 2 |
| Seated Dumbbell Curl | "Seated Dumbbell Curl", "Dumbbell Bicep Curl" | 1 |
| Seated Hammer Curl | "Hammer Curls" | 1 |
| Reverse Curl | "Reverse Dumbbell Curl" | 2 if missing |
| Wrist Curl | "Palms-Up Dumbbell Wrist Curl Over A Bench" | 1 |
| Reverse Wrist Curl | "Palms-Down Dumbbell Wrist Curl Over A Bench" | 1 |
| Farmer's Carry | "Farmer's Walk" | 1 |
| Goblet Squat to Bench | "Goblet Squat" (add a bench-touch cue in text) | 1 |
| Static Split Squat (Bulgarian style) | "Single Leg Squat", "Split Squat", "Bulgarian Split Squat" | 1 or 2 |
| Dumbbell Hip Thrust | glute bridge / hip thrust variants | 2 |
| Step-Ups onto Bench | "Dumbbell Step Ups" | 1 |
| Standing Calf Raise | "Standing Dumbbell Calf Raise" | 1 |
| Dead Bug | "Dead Bug" | 2 if missing |
| Side Plank | "Side Bridge" | 1 |
| Seated Curl-to-Press | curl + press | 2 |
| Close-Grip Push-ups | "Close-Grip Push-Up", "Push-Ups - Close Triceps Position" | 1 |
| Seated Arnold Press | "Arnold Dumbbell Press" | 1 |
| Front Raise | "Front Dumbbell Raise" | 1 |

### Exercise card content (data shape)

```ts
interface Exercise {
  id: string;                 // slug
  name: string;
  sets: string;               // e.g. "4 x 12-15 per arm"
  note?: string;              // short coaching note from the plan
  muscles: string[];          // primary muscles
  steps: string[];            // 3-5 short cues, rewritten from the dataset instructions in plain words
  media: { type: "photo" | "pose"; frames: string[] | PoseId };
  demoQuery: string;
}
```

- Rewrite dataset `instructions` into **3-5 short, friendly steps**. Do not paste long paragraphs.
- Each step should be one line (under about 90 characters).
- Make sure the written cues match the plan's own notes (for example, "3-sec lowering", "ribs down").

---

## 11. Meal Visuals (R6)

No stock photos (inconsistent look, licence and hotlink risks). Use:

1. **A consistent custom food icon set** (flat, two-tone, same stroke weight): egg, bread, glass of milk, banana, yogurt bowl, almonds, chicken piece, potato, salad bowl, peanut-butter jar, oil drop, water glass. Fallback to emoji only if an icon is missing.
2. **Meal timeline:** a vertical timeline of the 7 meals with time, icon cluster, items with quantities, and kcal/protein chips. Collapsed by default, tap to expand.
3. **Plate diagram (SVG):** for lunch/dinner, a round plate split into segments for chicken (250 g), potatoes (400 g) and vegetables, with labels. This is the main "visual step" for the biggest meals.
4. **Totals ring:** kcal and protein for the selected day. A **Training day / Rest day** switch changes the totals (rest day drops the pre-workout snack).
5. Show **what to eat and how much**, never cooking steps (Section 3).

---

## 12. Page-by-Page Behaviour

**Plan (`/`)**
- Strip on top, selected day below. Opening a day is instant, with no reload.
- Workout day: header (day number, weekday, focus, estimated duration, number of exercises), a warm-up line, exercise accordion (only one open at a time), and the big round "Mark Day N complete" button.
- Rest day: calm card with "Walk 20-30 minutes + light stretching", plus the big round button.
- Keep the selected day in the URL as `?day=3` so it can be bookmarked.

**Meals (`/meals`)**: Section 11.

**BMI (`/bmi`)**: Section 8.

**Progress (`/progress`)**: Weeks completed counter, list of completed weeks (date + number), weight log with add/edit/delete, chart with target band, weekly check-in card.

**Guide (`/guide`)**: Collapsible cards: "Getting stronger with light dumbbells", "Daily habits", "Food notes".

**Settings (`/settings`)**: Section 9 item 7.

---

## 13. Quality Bar

- **Performance:** Lighthouse 90+ on mobile for Performance, Accessibility, Best Practices. Lazy-load exercise images, use `next/image`, keep JS lean.
- **Responsive:** test at 360, 390, 768, 1024, 1440 px.
- **No layout shift** when images load (reserve aspect ratio).
- **Privacy:** no analytics or trackers by default, no personal details in the code, repo set to **private**. Add `robots: { index: false, follow: false }` in metadata so search engines skip it. The site is public by URL, so it holds only the plan content, never medical details.
- **Tests (Vitest):**
  - `bmi.ts`: the values in Section 8, both unit systems, both scales, boundary values (18.5, 22.9, 23.0, 24.9, 25.0, 29.9, 30.0).
  - `week.ts`: ticking 7 days triggers celebration and then reset; untick works; undo works; reload during celebration still resets; `weeksCompleted` increments exactly once.
  - `schedule.ts`: day-to-weekday mapping for every `weekStartsOn` value.
- **Playwright smoke test:** open `/`, tick all 7 round buttons, confirm the celebration shows and then all ticks clear and the counter shows 1.

---

## 14. Build Order (Phases)

**Phase 0: Scaffold.** Create the Next.js + TypeScript + Tailwind project, install shadcn/ui, Framer Motion, Zustand, Recharts, Vitest. Set up theme tokens (Section 6), fonts, bottom nav, empty routes. Commit.

**Phase 1: Data and core logic.** Put all plan content (Section 16) into typed files in `src/data/` (`plan.ts`, `meals.ts`, `guide.ts`). Write `bmi.ts`, `schedule.ts`, `week.ts` with unit tests. Commit.

**Phase 2: Plan tab.** Week strip, tick buttons, day selection, celebration + reset, day view with exercise cards using **text steps only** for now, big round button. Commit.

**Phase 3: Visuals.** Build the media pipeline (Section 10), then the `<ExerciseVisual>` cross-fade component and the Tier 2 `<PoseAnimation>` fallbacks. Visually verify every exercise. Commit.

**Phase 4: Meals, BMI, Progress, Guide, Settings.** Plate diagram, food icons, timeline, BMI page, weight log + chart + check-in, guide cards, backup/import/reset. Commit.

**Phase 5: Polish and QA.** Dark mode, reduced motion, accessibility pass, responsive pass, Lighthouse, Playwright smoke test. Fix issues. Commit.

**Phase 6: Deploy to Vercel** (Section 17).

**Phase 7 (optional): Phase 2 features** from Section 9, one at a time.

At the end of every phase, run `npm run lint`, `npm run build` and the tests, and summarise what works in 3-5 lines.

---

## 15. Defaults (Don't Ask, Use These)

- Day 1 = **Saturday** (week runs Sat to Fri). Changeable in Settings.
- Metric units, **Asian BMI scale** default (toggle available), theme follows the system.
- Pre-filled body stats: 65 kg, 170.18 cm (5 ft 7 in).
- Any day can be ticked at any time. Rest days must be ticked too.
- The celebration overlay lasts about 3 s or until tapped, with an Undo button.
- App name: **HomeGain** (placeholder). Accent colour: green.
- English only.
- Phase 2 and 3 features are **off** until I ask.

---

## 16. Plan Content (Source of Truth)

### 16.1 Overview (show on the Plan tab as a collapsible "About this plan" card)

- **Goal:** lean muscle gain with a better physique. Not competition bodybuilding.
- **Equipment:** 2 x 7.5 kg dumbbells + 1 flat bench.
- **Training:** 4 days per week.
- **Stats (defaults in BMI tool):** 65 kg, 5'7" (about 170 cm), BMI about 22.4.

### 16.2 Weekly Schedule

| Day | Focus | Muscles | Est. time |
|---|---|---|---|
| Day 1 | **Push** | Chest, shoulders, triceps | 40-50 min |
| Day 2 | **Pull** | Back, biceps, forearms | 40-50 min |
| Day 3 | **Rest** | Walk 20-30 min + light stretching | |
| Day 4 | **Legs + Core** | Quads, glutes, hamstrings, calves, abs | 40-50 min |
| Day 5 | **Rest** | Walk 20-30 min + light stretching | |
| Day 6 | **Full body (arms + shoulders focus)** | Weak points | 40-50 min |
| Day 7 | **Rest** | Walk 20-30 min + light stretching | |

### 16.3 Workouts

**Day 1: Push (Chest, Shoulders, Triceps)**

Warm-up (5 min): arm circles, shoulder rolls, 10 slow push-ups.

| Exercise | Sets x Reps | Note |
|---|---|---|
| Flat Dumbbell Bench Press | 4 x 12-15 | Back fully supported on the bench. 3-sec lowering |
| Push-ups (on the floor) | 3 x near-failure | Hips in line, belly braced |
| Dumbbell Flyes (on bench) | 3 x 15 | Light, slow stretch |
| Seated Dumbbell Shoulder Press | 3 x 12 | Sit tall, ribs down |
| Lateral Raises (seated) | 3 x 15 | No swinging |
| Lying Dumbbell Triceps Extension (on bench) | 3 x 12-15 | |
| Bench Dips | 3 x 15 | |
| Front Plank | 3 x 30-45 sec | Squeeze glutes, don't sag |

**Day 2: Pull (Back, Biceps, Forearms)**

Warm-up (5 min): cat-cow (gentle), arm swings, shoulder blade squeezes.

| Exercise | Sets x Reps | Note |
|---|---|---|
| Supported Single-Arm Row | 4 x 12-15 per arm | One hand and one knee on the bench, back flat, pull the elbow to the hip |
| Dumbbell Pullover (lying on bench) | 3 x 12-15 | Both hands on one dumbbell. Targets lats |
| Bird-Dog | 3 x 10 per side | Slow, hold 2 sec |
| Seated Dumbbell Curl | 4 x 12-15 | Seated, upright, no leaning back |
| Seated Hammer Curl | 3 x 12-15 | Also works forearms |
| Reverse Curl (palms down) | 3 x 12-15 | Forearms and top of the arm |
| Wrist Curl + Reverse Wrist Curl | 3 x 20 each | Forearms resting on thighs |
| Farmer's Carry | 3 x 30 sec | Stand tall, shoulders back |

**Day 4: Legs + Core**

Warm-up (5 min): bodyweight squats, leg swings, glute bridges.

| Exercise | Sets x Reps | Note |
|---|---|---|
| Goblet Squat to Bench | 4 x 12-15 | Sit back to lightly touch the bench, then stand |
| Static Split Squat (Bulgarian style) | 3 x 10-12 per leg | Back foot on the bench, torso upright. Bodyweight first, add dumbbells when easy |
| Dumbbell Hip Thrust | 4 x 12-15 | Upper back on the bench, dumbbell on hips, ribs down at the top |
| Step-Ups onto Bench | 3 x 12 per leg | Dumbbells at sides, torso upright |
| Standing Calf Raise | 4 x 20 | Slow, pause at the top |
| Dead Bug | 3 x 10 per side | Lower back stays pressed to the floor |
| Side Plank | 3 x 20-30 sec per side | |

**Day 6: Full Body (Arms and Shoulders Focus)**

Warm-up (5 min): arm circles, shoulder rolls.

| Exercise | Sets x Reps | Note |
|---|---|---|
| Push-ups | 3 x near-failure | Floor, braced core |
| Seated Dumbbell Shoulder Press | 3 x 12 | |
| Seated Curl-to-Press | 3 x 12 | Curl, then press overhead, seated |
| Close-Grip Push-ups | 3 x near-failure | Triceps focus |
| Seated Arnold Press | 3 x 12 | Rotate palms as you press |
| Lateral Raise + Front Raise | 3 x 15 each | Back to back |
| Front Plank | 3 x 45 sec | |

**Rest days (3, 5, 7):** Walk 20-30 minutes and do light stretching.

### 16.4 Guide Card: Getting Stronger With Light Dumbbells

Dumbbells are fixed at 7.5 kg, so progress by making each set harder, in this order:

1. Reach the top of each rep range with clean form.
2. Slow the lowering phase to 3-4 seconds.
3. Add a 1-2 second pause at the hardest point.
4. Cut rest between sets from 90 sec to 60 sec.
5. Switch to single-arm versions to double the load per arm.

Tip: a pair of resistance bands (about $8-10) would extend this setup a lot, especially for back width and shoulders. Muscle grows well on 10-20 reps taken close to failure, so heavy weights aren't needed.

### 16.5 Guide Card: Daily Habits

- Drink **3-4 liters** of water a day.
- Sleep **7-8 hours**. Muscle repairs during sleep.
- **Weigh yourself once a week**, same day and time.
- Aim to gain about **0.25-0.5 kg per week**. Slower: add 1 more potato or a glass of milk. Faster: cut the bedtime snack or a few potatoes.
- Keep a quick log of your reps and sets so you know when to progress.
- Give it **8-12 weeks** before judging results.
- Take short walks on rest days, and don't skip rest days. Rest is when muscle rebuilds.

### 16.6 Meals

**Daily target:** about **2,800 kcal** and about **195 g protein** on training days; about **2,600 kcal** and **190 g protein** on rest days (skip the pre-workout snack). A modest surplus for lean gain.

| Meal | Time | Food | kcal | Protein |
|---|---|---|---|---|
| Breakfast | 7:30-8:00 AM | 2 whole eggs + 2 slices whole-wheat bread (or 1-2 parathas/rotis) + 1 glass milk + 1 banana | 560 | 29 g |
| Mid-morning | 10:30 AM | 1 cup plain yogurt (doi) + 20 g almonds or roasted chana | 265 | 12 g |
| Lunch | 1:00-2:00 PM | 250 g raw chicken + 400 g potatoes (about 3 medium) + big salad or vegetables + 1 tsp oil | 655 | 65 g |
| Pre-workout (training days only) | 30-45 min before | 1 banana + 1 tbsp peanut butter | 200 | 4 g |
| Post-workout | within 1 hour | 1 glass milk + 1 banana (or 2 boiled eggs) | 270 | 9 g |
| Dinner | 8:00-9:00 PM | Same as lunch: 250 g raw chicken + 400 g potatoes + vegetables | 655 | 65 g |
| Before bed | about 10 PM | 1 glass milk + a few nuts | 200 | 10 g |
| **Training-day total** | | | **about 2,805** | **about 194 g** |
| **Rest-day total** | | (without pre-workout) | **about 2,605** | **about 190 g** |

Quantities are **raw weight**. Chicken loses about 25-30% of its weight when cooked.

**Food notes (Guide card):**
- **Why 250 g of chicken per meal (500 g a day)?** About 105-145 g of protein a day is enough to build muscle at 65 kg. Protein beyond that is used as plain fuel, and it crowds out the potatoes and vegetables that power your training.
- **Add vegetables at every meal:** cucumber, tomato, carrot, spinach, broccoli, beans. Chicken plus potato alone is low in fibre and some vitamins.
- **Healthy fats:** the plan is lean, so keep the eggs, nuts, peanut butter and 1 tsp of oil.
- **Swap chicken for fish** (rui, katla, tilapia) **two times a week** for omega-3 and variety.
- **Daily shopping for lunch and dinner:** about 500 g raw chicken and 800 g potatoes.

---

## 17. Deploying on Vercel

1. In the project folder run `npm run build` and `npm test`. Both must pass locally.
2. Create a **private** GitHub repo and push the code.
3. Go to **vercel.com/new**, import the repo. The Next.js preset is detected automatically. Keep the default build settings. No environment variables are needed.
4. Click **Deploy**. Every future push to `main` deploys automatically, and pull requests get preview URLs.
5. *(Optional)* Add a custom domain in the project's Domains settings.
6. **Post-deploy checklist (on the live URL, on a phone):**
   - Tick all 7 round buttons: celebration plays, then everything resets and the counter shows 1.
   - Reload the page: state persists.
   - Open every day: exercise visuals load and animate, no broken images.
   - BMI shows 22.4 for 65 kg and 170.18 cm.
   - Dark mode and landscape look right.
   - No back-care or cooking text anywhere (search the built site for "air fry", "cook", "marinate", "pain", "disc").
   - Run Lighthouse on mobile.

---

## 18. Definition of Done

- [ ] All requirements R1-R10 are met.
- [ ] Nothing from Section 3 appears on the site.
- [ ] Every workout exercise has a verified visual, 3-5 step cues, muscle tags and a demo link.
- [ ] Week tracker: tick, untick, 7-day celebration, reset, counter, reload persistence all work.
- [ ] BMI results match the Section 8 test values.
- [ ] Unit tests and the Playwright smoke test pass.
- [ ] Looks clean at all tested screen sizes, in light and dark mode.
- [ ] Live on Vercel, checked on a real phone.
