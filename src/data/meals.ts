import type { FoodIconId } from "@/components/FoodIcon";

export interface MealItem {
  icon: FoodIconId;
  text: string;
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  items: MealItem[];
  kcal: number;
  protein: number;
  trainingOnly?: boolean;
  /** Show the plate diagram (lunch, dinner) */
  plate?: boolean;
}

export const MEALS: Meal[] = [
  {
    id: "breakfast",
    name: "Breakfast",
    time: "7:30-8:00 AM",
    items: [
      { icon: "egg", text: "2 whole eggs" },
      { icon: "bread", text: "2 slices whole-wheat bread (or 1-2 parathas/rotis)" },
      { icon: "milk", text: "1 glass milk" },
      { icon: "banana", text: "1 banana" },
    ],
    kcal: 560,
    protein: 29,
  },
  {
    id: "mid-morning",
    name: "Mid-morning",
    time: "10:30 AM",
    items: [
      { icon: "yogurt", text: "1 cup plain yogurt (doi)" },
      { icon: "almonds", text: "20 g almonds or roasted chana" },
    ],
    kcal: 265,
    protein: 12,
  },
  {
    id: "lunch",
    name: "Lunch",
    time: "1:00-2:00 PM",
    items: [
      { icon: "chicken", text: "250 g raw chicken" },
      { icon: "potato", text: "400 g potatoes (about 3 medium)" },
      { icon: "salad", text: "Big salad or vegetables" },
      { icon: "oil", text: "1 tsp oil" },
    ],
    kcal: 655,
    protein: 65,
    plate: true,
  },
  {
    id: "pre-workout",
    name: "Pre-workout",
    time: "30-45 min before training",
    items: [
      { icon: "banana", text: "1 banana" },
      { icon: "peanut-butter", text: "1 tbsp peanut butter" },
    ],
    kcal: 200,
    protein: 4,
    trainingOnly: true,
  },
  {
    id: "post-workout",
    name: "Post-workout",
    time: "Within 1 hour after training",
    items: [
      { icon: "milk", text: "1 glass milk" },
      { icon: "banana", text: "1 banana (or 2 boiled eggs)" },
    ],
    kcal: 270,
    protein: 9,
  },
  {
    id: "dinner",
    name: "Dinner",
    time: "8:00-9:00 PM",
    items: [
      { icon: "chicken", text: "250 g raw chicken" },
      { icon: "potato", text: "400 g potatoes" },
      { icon: "salad", text: "Vegetables" },
    ],
    kcal: 655,
    protein: 65,
    plate: true,
  },
  {
    id: "before-bed",
    name: "Before bed",
    time: "About 10 PM",
    items: [
      { icon: "milk", text: "1 glass milk" },
      { icon: "almonds", text: "A few nuts" },
    ],
    kcal: 200,
    protein: 10,
  },
];

export type DayType = "training" | "rest";

export function mealsFor(type: DayType): Meal[] {
  return type === "training" ? MEALS : MEALS.filter((m) => !m.trainingOnly);
}

export function totalsFor(type: DayType): { kcal: number; protein: number } {
  return mealsFor(type).reduce(
    (acc, m) => ({ kcal: acc.kcal + m.kcal, protein: acc.protein + m.protein }),
    { kcal: 0, protein: 0 },
  );
}

/** Stated daily targets from the plan */
export const TARGETS: Record<DayType, { kcal: number; protein: number }> = {
  training: { kcal: 2800, protein: 195 },
  rest: { kcal: 2600, protein: 190 },
};

export const PLATE = [
  { label: "Chicken", amount: "250 g raw", icon: "chicken" as const, share: 0.32 },
  { label: "Potatoes", amount: "400 g", icon: "potato" as const, share: 0.36 },
  { label: "Vegetables", amount: "Big portion", icon: "salad" as const, share: 0.32 },
];

export const MEAL_NOTE = "Quantities are raw weight.";
