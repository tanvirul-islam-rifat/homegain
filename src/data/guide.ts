export interface GuideCard {
  id: string;
  title: string;
  intro?: string;
  ordered?: boolean;
  points: string[];
  tip?: string;
}

export const GUIDE: GuideCard[] = [
  {
    id: "progression",
    title: "Getting stronger with light dumbbells",
    intro: "Dumbbells are fixed at 7.5 kg, so progress by making each set harder, in this order:",
    ordered: true,
    points: [
      "Reach the top of each rep range with clean form.",
      "Slow the lowering phase to 3-4 seconds.",
      "Add a 1-2 second pause at the hardest point.",
      "Cut rest between sets from 90 sec to 60 sec.",
      "Switch to single-arm versions to double the load per arm.",
    ],
    tip: "A pair of resistance bands (about $8-10) would extend this setup a lot, especially for back width and shoulders. Muscle grows well on 10-20 reps taken close to failure, so heavy weights aren't needed.",
  },
  {
    id: "habits",
    title: "Daily habits",
    points: [
      "Drink 3-4 liters of water a day.",
      "Sleep 7-8 hours. Muscle repairs during sleep.",
      "Weigh yourself once a week, same day and time.",
      "Aim to gain about 0.25-0.5 kg per week. Slower: add 1 more potato or a glass of milk. Faster: cut the bedtime snack or a few potatoes.",
      "Keep a quick log of your reps and sets so you know when to progress.",
      "Give it 8-12 weeks before judging results.",
      "Take short walks on rest days, and don't skip rest days. Rest is when muscle rebuilds.",
    ],
  },
  {
    id: "food",
    title: "Food notes",
    points: [
      "Why 250 g of chicken per meal (500 g a day)? About 105-145 g of protein a day is enough to build muscle at 65 kg. Protein beyond that is used as plain fuel, and it crowds out the potatoes and vegetables that power your training.",
      "Add vegetables at every meal: cucumber, tomato, carrot, spinach, broccoli, beans. Chicken plus potato alone is low in fibre and some vitamins.",
      "Healthy fats: the plan is lean, so keep the eggs, nuts, peanut butter and 1 tsp of oil.",
      "Swap chicken for fish (rui, katla, tilapia) two times a week for omega-3 and variety.",
      "Daily shopping for lunch and dinner: about 500 g raw chicken and 800 g potatoes.",
    ],
  },
];
