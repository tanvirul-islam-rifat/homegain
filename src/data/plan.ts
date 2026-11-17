import type { DayNumber } from "@/lib/schedule";
import type { PoseId } from "./poses";

export type Focus = "push" | "pull" | "legs" | "full" | "rest";

export interface Exercise {
  id: string;
  name: string;
  muscles: string[];
  /** 3-5 short cues, one line each */
  steps: string[];
  /** Animated line-art visual(s). Two ids = shown side by side. */
  poses: PoseId[];
  /** Captions when there is more than one pose */
  poseLabels?: string[];
  /** YouTube search text for "Watch a demo" */
  demoQuery: string;
}

export interface DayExercise {
  exerciseId: string;
  sets: string;
  note?: string;
}

export interface WorkoutDay {
  day: DayNumber;
  kind: "workout";
  focus: Focus;
  title: string;
  muscles: string;
  duration: string;
  warmup: string;
  exercises: DayExercise[];
}

export interface RestDay {
  day: DayNumber;
  kind: "rest";
  focus: "rest";
  title: string;
  muscles: string;
}

export type PlanDay = WorkoutDay | RestDay;

const demo = (q: string) => q;

export const EXERCISES: Record<string, Exercise> = {
  "bench-press": {
    id: "bench-press",
    name: "Flat Dumbbell Bench Press",
    muscles: ["Chest", "Front shoulders", "Triceps"],
    steps: [
      "Lie on the bench, feet flat, dumbbells over your chest.",
      "Lower slowly for 3 seconds until elbows dip just below the bench.",
      "Keep elbows about 45° out from your body.",
      "Press up until your arms are straight over your chest.",
    ],
    poses: ["bench-press"],
    demoQuery: demo("dumbbell bench press form"),
  },
  "push-up": {
    id: "push-up",
    name: "Push-ups",
    muscles: ["Chest", "Triceps", "Front shoulders", "Core"],
    steps: [
      "Hands a little wider than shoulders, body in one straight line.",
      "Brace your belly and squeeze your glutes.",
      "Lower until your chest is a fist above the floor.",
      "Push the floor away until your arms are straight.",
    ],
    poses: ["push-up"],
    demoQuery: demo("push up proper form"),
  },
  flyes: {
    id: "flyes",
    name: "Dumbbell Flyes",
    muscles: ["Chest", "Front shoulders"],
    steps: [
      "Lie on the bench, dumbbells above your chest, palms facing.",
      "Keep a soft bend in your elbows the whole time.",
      "Open your arms wide in a slow arc until your chest stretches.",
      "Bring them back up the same arc, as if hugging a tree.",
    ],
    poses: ["flyes"],
    demoQuery: demo("dumbbell flyes flat bench form"),
  },
  "shoulder-press": {
    id: "shoulder-press",
    name: "Seated Dumbbell Shoulder Press",
    muscles: ["Shoulders", "Triceps"],
    steps: [
      "Sit tall at the end of the bench, dumbbells at shoulder height.",
      "Keep your ribs down and core tight. Don't arch.",
      "Press up until your arms are straight overhead.",
      "Lower with control back to shoulder height.",
    ],
    poses: ["shoulder-press"],
    demoQuery: demo("seated dumbbell shoulder press form"),
  },
  "lateral-raise": {
    id: "lateral-raise",
    name: "Lateral Raises (seated)",
    muscles: ["Side shoulders"],
    steps: [
      "Sit tall, dumbbells at your sides, palms facing in.",
      "Raise your arms out to the sides with a slight elbow bend.",
      "Stop at shoulder height.",
      "Lower slowly for 2-3 seconds. No swinging.",
    ],
    poses: ["lateral-raise"],
    demoQuery: demo("seated dumbbell lateral raise form"),
  },
  "triceps-extension": {
    id: "triceps-extension",
    name: "Lying Dumbbell Triceps Extension",
    muscles: ["Triceps"],
    steps: [
      "Lie on the bench, arms straight up, palms facing each other.",
      "Keep your upper arms still, pointing at the ceiling.",
      "Bend at the elbows to lower the dumbbells beside your head.",
      "Straighten your arms to lift them back up.",
    ],
    poses: ["triceps-extension"],
    demoQuery: demo("lying dumbbell triceps extension form"),
  },
  "bench-dips": {
    id: "bench-dips",
    name: "Bench Dips",
    muscles: ["Triceps", "Chest", "Front shoulders"],
    steps: [
      "Hands on the bench edge behind you, fingers pointing forward.",
      "Feet on the floor in front of you, knees bent.",
      "Bend your elbows straight back to lower your hips.",
      "Stop when upper arms are about level, then push back up.",
    ],
    poses: ["bench-dips"],
    demoQuery: demo("bench dips proper form"),
  },
  "front-plank": {
    id: "front-plank",
    name: "Front Plank",
    muscles: ["Core", "Glutes"],
    steps: [
      "Forearms on the floor, elbows under your shoulders.",
      "Make one straight line from head to heels.",
      "Squeeze your glutes and brace your belly. Don't let hips sag.",
      "Breathe steadily and hold for the time.",
    ],
    poses: ["front-plank"],
    demoQuery: demo("forearm plank proper form"),
  },
  "single-arm-row": {
    id: "single-arm-row",
    name: "Supported Single-Arm Row",
    muscles: ["Lats", "Upper back", "Biceps"],
    steps: [
      "One hand and the same-side knee on the bench, back flat.",
      "Hold the dumbbell in your free hand, arm hanging straight.",
      "Pull your elbow back toward your hip.",
      "Squeeze your shoulder blade, then lower slowly.",
    ],
    poses: ["single-arm-row"],
    demoQuery: demo("one arm dumbbell row bench form"),
  },
  pullover: {
    id: "pullover",
    name: "Dumbbell Pullover",
    muscles: ["Lats", "Chest"],
    steps: [
      "Lie on the bench holding one dumbbell with both hands over your chest.",
      "Keep a slight bend in your elbows.",
      "Lower the weight back behind your head in a slow arc.",
      "Pull it back over your chest, leading with your lats.",
    ],
    poses: ["pullover"],
    demoQuery: demo("dumbbell pullover flat bench form"),
  },
  "bird-dog": {
    id: "bird-dog",
    name: "Bird-Dog",
    muscles: ["Core", "Glutes", "Lower back"],
    steps: [
      "On hands and knees: hands under shoulders, knees under hips.",
      "Reach one arm forward and the opposite leg back.",
      "Keep your hips level and hold for 2 seconds.",
      "Return slowly and switch sides.",
    ],
    poses: ["bird-dog"],
    demoQuery: demo("bird dog exercise form"),
  },
  "seated-curl": {
    id: "seated-curl",
    name: "Seated Dumbbell Curl",
    muscles: ["Biceps"],
    steps: [
      "Sit tall, arms straight down, palms facing forward.",
      "Keep your elbows pinned to your sides.",
      "Curl the dumbbells up toward your shoulders.",
      "Lower slowly. Don't lean back.",
    ],
    poses: ["seated-curl"],
    demoQuery: demo("seated dumbbell curl form"),
  },
  "hammer-curl": {
    id: "hammer-curl",
    name: "Seated Hammer Curl",
    muscles: ["Biceps", "Brachialis", "Forearms"],
    steps: [
      "Sit tall, dumbbells at your sides, palms facing in.",
      "Keep elbows tucked and still.",
      "Curl up with thumbs leading and wrists straight.",
      "Lower slowly to full arm length.",
    ],
    poses: ["hammer-curl"],
    demoQuery: demo("seated hammer curl form"),
  },
  "reverse-curl": {
    id: "reverse-curl",
    name: "Reverse Curl (palms down)",
    muscles: ["Forearms", "Brachialis"],
    steps: [
      "Hold the dumbbells with palms facing down.",
      "Keep elbows close to your sides and wrists straight.",
      "Curl up toward your shoulders.",
      "Lower slowly with control.",
    ],
    poses: ["reverse-curl"],
    demoQuery: demo("reverse dumbbell curl form"),
  },
  "wrist-curl": {
    id: "wrist-curl",
    name: "Wrist Curl + Reverse Wrist Curl",
    muscles: ["Forearms", "Grip"],
    steps: [
      "Sit and rest your forearms on your thighs, wrists past your knees.",
      "Palms up: let the dumbbell roll down, then curl your wrist up.",
      "Finish the set, then turn palms down for reverse wrist curls.",
      "Move only at the wrist, slow and controlled.",
    ],
    poses: ["wrist-curl"],
    demoQuery: demo("dumbbell wrist curl and reverse wrist curl seated"),
  },
  "farmers-carry": {
    id: "farmers-carry",
    name: "Farmer's Carry",
    muscles: ["Forearms", "Grip", "Traps", "Core"],
    steps: [
      "Pick up a dumbbell in each hand, arms by your sides.",
      "Stand tall with shoulders back and down.",
      "Walk with short, steady steps for the time.",
      "Keep your core braced. Don't lean to one side.",
    ],
    poses: ["farmers-carry"],
    demoQuery: demo("dumbbell farmers carry form"),
  },
  "goblet-squat": {
    id: "goblet-squat",
    name: "Goblet Squat to Bench",
    muscles: ["Quads", "Glutes"],
    steps: [
      "Hold one dumbbell upright at your chest, bench behind you.",
      "Feet shoulder-width apart, toes slightly out.",
      "Sit back and down until you lightly touch the bench.",
      "Drive through your whole foot to stand up.",
    ],
    poses: ["goblet-squat"],
    demoQuery: demo("goblet squat to bench form"),
  },
  "split-squat": {
    id: "split-squat",
    name: "Static Split Squat (Bulgarian style)",
    muscles: ["Quads", "Glutes"],
    steps: [
      "Back foot on the bench, front foot a big step ahead.",
      "Keep your torso upright.",
      "Lower straight down until your front thigh is nearly level.",
      "Push through the front heel to rise. Bodyweight first.",
    ],
    poses: ["split-squat"],
    demoQuery: demo("bulgarian split squat dumbbell form"),
  },
  "hip-thrust": {
    id: "hip-thrust",
    name: "Dumbbell Hip Thrust",
    muscles: ["Glutes", "Hamstrings"],
    steps: [
      "Upper back on the bench edge, feet flat, dumbbell on your hips.",
      "Drive through your heels to lift your hips until level.",
      "Keep ribs down and squeeze your glutes at the top.",
      "Lower your hips slowly toward the floor.",
    ],
    poses: ["hip-thrust"],
    demoQuery: demo("dumbbell hip thrust bench form"),
  },
  "step-ups": {
    id: "step-ups",
    name: "Step-Ups onto Bench",
    muscles: ["Quads", "Glutes"],
    steps: [
      "Stand facing the bench, dumbbells at your sides.",
      "Place one whole foot on the bench.",
      "Push through that foot to stand up tall on the bench.",
      "Step down slowly with control and repeat.",
    ],
    poses: ["step-ups"],
    demoQuery: demo("dumbbell step ups bench form"),
  },
  "calf-raise": {
    id: "calf-raise",
    name: "Standing Calf Raise",
    muscles: ["Calves"],
    steps: [
      "Stand tall, dumbbells at your sides.",
      "Rise up onto the balls of your feet.",
      "Pause for a second at the top.",
      "Lower slowly until your heels touch down.",
    ],
    poses: ["calf-raise"],
    demoQuery: demo("standing dumbbell calf raise form"),
  },
  "dead-bug": {
    id: "dead-bug",
    name: "Dead Bug",
    muscles: ["Core"],
    steps: [
      "Lie on your back, arms up, knees bent over your hips.",
      "Press your lower back into the floor.",
      "Slowly lower one arm and the opposite leg toward the floor.",
      "Return and switch sides. Keep your back flat.",
    ],
    poses: ["dead-bug"],
    demoQuery: demo("dead bug exercise form"),
  },
  "side-plank": {
    id: "side-plank",
    name: "Side Plank",
    muscles: ["Obliques", "Core"],
    steps: [
      "Lie on your side, elbow under your shoulder.",
      "Stack your feet and lift your hips.",
      "Hold a straight line from head to heels.",
      "Hold for the time, then switch sides.",
    ],
    poses: ["side-plank"],
    demoQuery: demo("side plank proper form"),
  },
  "curl-to-press": {
    id: "curl-to-press",
    name: "Seated Curl-to-Press",
    muscles: ["Biceps", "Shoulders"],
    steps: [
      "Sit tall with the dumbbells at your sides.",
      "Curl the dumbbells up to your shoulders.",
      "Press them straight overhead.",
      "Lower to your shoulders, then uncurl to the start.",
    ],
    poses: ["curl-to-press"],
    demoQuery: demo("seated dumbbell curl to press"),
  },
  "close-grip-push-up": {
    id: "close-grip-push-up",
    name: "Close-Grip Push-ups",
    muscles: ["Triceps", "Chest"],
    steps: [
      "Hands under your chest, about shoulder-width or a bit closer.",
      "Body straight, belly braced.",
      "Lower with your elbows brushing your sides.",
      "Push back up until your arms are straight.",
    ],
    poses: ["close-grip-push-up"],
    demoQuery: demo("close grip push up triceps form"),
  },
  "arnold-press": {
    id: "arnold-press",
    name: "Seated Arnold Press",
    muscles: ["Shoulders", "Triceps"],
    steps: [
      "Sit tall, dumbbells in front of your shoulders, palms facing you.",
      "Press up while turning your palms to face forward.",
      "Finish with your arms straight overhead.",
      "Reverse the turn as you lower back down.",
    ],
    poses: ["arnold-press"],
    demoQuery: demo("seated arnold press form"),
  },
  "lateral-front-raise": {
    id: "lateral-front-raise",
    name: "Lateral Raise + Front Raise",
    muscles: ["Side shoulders", "Front shoulders"],
    steps: [
      "Lateral: raise your arms out to the sides to shoulder height.",
      "Lower slowly, then go straight into front raises.",
      "Front: raise your arms forward to shoulder height, palms down.",
      "Lower slowly. Keep elbows soft and don't swing.",
    ],
    poses: ["lateral-raise", "front-raise"],
    poseLabels: ["Lateral raise", "Front raise"],
    demoQuery: demo("dumbbell lateral raise and front raise"),
  },
};

export const PLAN: Record<DayNumber, PlanDay> = {
  1: {
    day: 1,
    kind: "workout",
    focus: "push",
    title: "Push",
    muscles: "Chest, shoulders, triceps",
    duration: "40-50 min",
    warmup: "Arm circles, shoulder rolls, 10 slow push-ups",
    exercises: [
      { exerciseId: "bench-press", sets: "4 × 12-15", note: "Back fully supported on the bench. 3-sec lowering" },
      { exerciseId: "push-up", sets: "3 × near-failure", note: "Hips in line, belly braced" },
      { exerciseId: "flyes", sets: "3 × 15", note: "Light, slow stretch" },
      { exerciseId: "shoulder-press", sets: "3 × 12", note: "Sit tall, ribs down" },
      { exerciseId: "lateral-raise", sets: "3 × 15", note: "No swinging" },
      { exerciseId: "triceps-extension", sets: "3 × 12-15" },
      { exerciseId: "bench-dips", sets: "3 × 15" },
      { exerciseId: "front-plank", sets: "3 × 30-45 sec", note: "Squeeze glutes, don't sag" },
    ],
  },
  2: {
    day: 2,
    kind: "workout",
    focus: "pull",
    title: "Pull",
    muscles: "Back, biceps, forearms",
    duration: "40-50 min",
    warmup: "Cat-cow (gentle), arm swings, shoulder blade squeezes",
    exercises: [
      {
        exerciseId: "single-arm-row",
        sets: "4 × 12-15 per arm",
        note: "One hand and one knee on the bench, back flat, pull the elbow to the hip",
      },
      { exerciseId: "pullover", sets: "3 × 12-15", note: "Both hands on one dumbbell. Targets lats" },
      { exerciseId: "bird-dog", sets: "3 × 10 per side", note: "Slow, hold 2 sec" },
      { exerciseId: "seated-curl", sets: "4 × 12-15", note: "Seated, upright, no leaning back" },
      { exerciseId: "hammer-curl", sets: "3 × 12-15", note: "Also works forearms" },
      { exerciseId: "reverse-curl", sets: "3 × 12-15", note: "Forearms and top of the arm" },
      { exerciseId: "wrist-curl", sets: "3 × 20 each", note: "Forearms resting on thighs" },
      { exerciseId: "farmers-carry", sets: "3 × 30 sec", note: "Stand tall, shoulders back" },
    ],
  },
  3: { day: 3, kind: "rest", focus: "rest", title: "Rest", muscles: "Walk 20-30 min + light stretching" },
  4: {
    day: 4,
    kind: "workout",
    focus: "legs",
    title: "Legs + Core",
    muscles: "Quads, glutes, hamstrings, calves, abs",
    duration: "40-50 min",
    warmup: "Bodyweight squats, leg swings, glute bridges",
    exercises: [
      { exerciseId: "goblet-squat", sets: "4 × 12-15", note: "Sit back to lightly touch the bench, then stand" },
      {
        exerciseId: "split-squat",
        sets: "3 × 10-12 per leg",
        note: "Back foot on the bench, torso upright. Bodyweight first, add dumbbells when easy",
      },
      {
        exerciseId: "hip-thrust",
        sets: "4 × 12-15",
        note: "Upper back on the bench, dumbbell on hips, ribs down at the top",
      },
      { exerciseId: "step-ups", sets: "3 × 12 per leg", note: "Dumbbells at sides, torso upright" },
      { exerciseId: "calf-raise", sets: "4 × 20", note: "Slow, pause at the top" },
      { exerciseId: "dead-bug", sets: "3 × 10 per side", note: "Lower back stays pressed to the floor" },
      { exerciseId: "side-plank", sets: "3 × 20-30 sec per side" },
    ],
  },
  5: { day: 5, kind: "rest", focus: "rest", title: "Rest", muscles: "Walk 20-30 min + light stretching" },
  6: {
    day: 6,
    kind: "workout",
    focus: "full",
    title: "Full Body",
    muscles: "Arms + shoulders focus",
    duration: "40-50 min",
    warmup: "Arm circles, shoulder rolls",
    exercises: [
      { exerciseId: "push-up", sets: "3 × near-failure", note: "Floor, braced core" },
      { exerciseId: "shoulder-press", sets: "3 × 12" },
      { exerciseId: "curl-to-press", sets: "3 × 12", note: "Curl, then press overhead, seated" },
      { exerciseId: "close-grip-push-up", sets: "3 × near-failure", note: "Triceps focus" },
      { exerciseId: "arnold-press", sets: "3 × 12", note: "Rotate palms as you press" },
      { exerciseId: "lateral-front-raise", sets: "3 × 15 each", note: "Back to back" },
      { exerciseId: "front-plank", sets: "3 × 45 sec" },
    ],
  },
  7: { day: 7, kind: "rest", focus: "rest", title: "Rest", muscles: "Walk 20-30 min + light stretching" },
};

export const FOCUS_LABEL: Record<Focus, string> = {
  push: "Push",
  pull: "Pull",
  legs: "Legs",
  full: "Full body",
  rest: "Rest",
};

export const PLAN_OVERVIEW = [
  { label: "Goal", value: "Lean muscle gain with a better physique. Not competition bodybuilding." },
  { label: "Equipment", value: "2 × 7.5 kg dumbbells + 1 flat bench" },
  { label: "Training", value: "4 days per week" },
  { label: "Stats", value: "65 kg, 5'7\" (about 170 cm), BMI about 22.4" },
];

export const REST_DAY_TEXT = "Walk 20-30 minutes + light stretching";

export function getExercise(id: string): Exercise {
  const ex = EXERCISES[id];
  if (!ex) throw new Error(`Unknown exercise: ${id}`);
  return ex;
}
