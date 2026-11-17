# HomeGain

My personal 7-day home workout + meal plan, as a mobile-first web app.
Next.js 16 · TypeScript · no backend: everything is saved in your browser.

- **Plan**: tap a day to open it, tap the round button to tick it. When all 7 are ticked, a short celebration plays and the week resets (Undo is available for 3 s).
- **Animated exercise visuals** for every exercise, plus an optional demo video (loaded only when you tap play) and a YouTube search link.
- **Meals**: timeline, food icons, plate diagram, training/rest-day totals.
- **BMI**: live calculator (WHO and Asian scales, metric and imperial) that can save to your weight log.
- **Progress**: weeks completed, weight chart with the 0.25-0.5 kg/week target band, weekly check-in.
- **Guide** and **Settings** (week start day, units, theme, JSON backup/restore, reset).

---

## 1. Run it on your computer

You need **Node.js 20.9 or newer** (22 LTS recommended) and **Git**.

```bash
node -v            # should print v20.9 or higher
npm install        # first time only, takes a few minutes
npm run dev        # open http://localhost:3000
```

To try it on your phone, connect it to the same Wi-Fi and run `npm run dev -- -H 0.0.0.0`, then open `http://<your-PC-IP>:3000` on the phone (`ipconfig` shows the IP).

## 2. Check it before deploying

```bash
npm test           # unit tests (BMI, week tracker, schedule, content)
npm run lint       # TypeScript check
npm run build      # the same build Vercel runs
```

All three must pass. If one fails, copy the error and fix it (or paste it to Claude) before pushing.

Optional end-to-end test (downloads a test browser once, ~150 MB):

```bash
npx playwright install chromium
npm run e2e
```

## 3. Optional: real exercise photos

The animations work on their own. If you also want start/end photos from the public-domain
[free-exercise-db](https://github.com/yuhonas/free-exercise-db):

```bash
npm run photos
```

Then open `.photo-cache/review.html` in your browser and check every pair. Drop a bad match with
`npm run photos -- --skip=reverse-curl,split-squat`. Matched exercises get a **Photo** tab.

## 4. Put it on GitHub (private repo)

1. Go to <https://github.com/new>, name it `homegain`, choose **Private**, and don't add a README.
2. In the project folder:

```bash
git init
git add .
git commit -m "HomeGain v1"
git branch -M main
git remote add origin https://github.com/<your-username>/homegain.git
git push -u origin main
```

## 5. Deploy on Vercel

1. Go to <https://vercel.com/new> and sign in with GitHub.
2. **Import** the `homegain` repo (grant Vercel access to it if it isn't listed).
3. Framework: **Next.js** (auto-detected). Keep the default build settings. No environment variables.
4. Click **Deploy**. After a minute or two you get a live URL like `homegain-xyz.vercel.app`.

From now on, every `git push` to `main` redeploys automatically.

## 6. Check the live site (on your phone)

- Tick all 7 round buttons: celebration plays, then everything resets and "1 completed so far" shows.
- Reload: your ticks and settings are still there.
- Open every day: animations play, videos load when tapped.
- BMI shows **22.4** for 65 kg and 170.18 cm.
- Try dark and light theme (Settings) and landscape.
- Search the visible page text (Ctrl+F) for "air fry", "cook", "marinate", "pain", "disc": none should appear. (The video player address `youtube-nocookie.com` is in the page code, not the visible text.)

---

## Notes on choices

- **Dark chocolate theme by default** with one caramel accent. A light "latte" theme and Auto (system) are in Settings.
- **No heavy UI libraries.** The spec listed Tailwind, shadcn/ui, Framer Motion, Zustand and Recharts as defaults; this build uses
  small local equivalents instead (one CSS file with theme variables, CSS/SVG animation, a tiny persisted store with
  versioned migration, native `<dialog>`, and an SVG chart) to keep the app fast and the install light.
- **Exercise visuals** are custom line-art animations (consistent style, no licence or hotlink issues). Real photos are optional (step 3).
- **Privacy**: no analytics, `noindex` metadata, and all data stays in your browser's localStorage. Use Settings → Export to back it up.

General fitness guidance, not medical advice.
