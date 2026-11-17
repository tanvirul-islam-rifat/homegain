import type { ReactNode } from "react";

export type FoodIconId =
  | "egg"
  | "bread"
  | "milk"
  | "banana"
  | "yogurt"
  | "almonds"
  | "chicken"
  | "potato"
  | "salad"
  | "peanut-butter"
  | "oil"
  | "water";

/* Flat two-tone set: one main tone, one accent tone, same 1.5 stroke. */
const ICONS: Record<FoodIconId, { label: string; body: ReactNode }> = {
  egg: {
    label: "Egg",
    body: (
      <>
        <path d="M12 3.5c3.6 0 6 5.2 6 9.3A6 6 0 0 1 6 12.8c0-4.1 2.4-9.3 6-9.3z" fill="#F3E9DC" />
        <circle cx="12" cy="13.5" r="2.8" fill="#E7A73B" />
      </>
    ),
  },
  bread: {
    label: "Bread",
    body: (
      <>
        <path d="M5.5 10.5a3.5 3.5 0 0 1 1-6.5h11a3.5 3.5 0 0 1 1 6.5V19a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1z" fill="#C98E52" />
        <path d="M8 11.5h8v6H8z" fill="#EBC896" stroke="none" />
      </>
    ),
  },
  milk: {
    label: "Milk",
    body: (
      <>
        <path d="M7 4h10l-1.2 16H8.2z" fill="#E9EEF2" />
        <path d="M7.6 10h8.8l-.7 10H8.3z" fill="#FFFFFF" stroke="none" />
      </>
    ),
  },
  banana: {
    label: "Banana",
    body: (
      <>
        <path d="M4.5 13c3 4.5 10.5 5.5 15-2l-1.8-.8c-2.8 4.4-8.7 5-13.2 2.8z" fill="#EFC94C" />
        <path d="M17.7 10.2l.9-3.2" />
      </>
    ),
  },
  yogurt: {
    label: "Yogurt",
    body: (
      <>
        <path d="M4.5 10.5h15l-1.6 8a2 2 0 0 1-2 1.5H8.1a2 2 0 0 1-2-1.5z" fill="#B88A63" />
        <path d="M5 10.5c0-2.5 3.1-4.5 7-4.5s7 2 7 4.5" fill="#F6F0E6" />
      </>
    ),
  },
  almonds: {
    label: "Nuts",
    body: (
      <>
        <path d="M8.5 5c2.5 1.5 3 6 1.5 9-1.2 2.4-3.9 2-4.6-.4C4.6 10.8 6 6.5 8.5 5z" fill="#B97A4B" />
        <path d="M15.5 8.5c2.7 1 3.5 5.4 2.2 8.3-1 2.4-3.8 2.2-4.6-.1-.9-2.8.2-7 2.4-8.2z" fill="#A86A3D" />
      </>
    ),
  },
  chicken: {
    label: "Chicken",
    body: (
      <>
        <path d="M14 4.5a5.5 5.5 0 0 1 2.4 10.4c-1.5.8-3.4.6-4.6 1.8L9.6 19" fill="#D99A62" />
        <path d="M14 4.5a5.5 5.5 0 0 0-5.3 7.1c.3 1-.2 2-1 2.6L6.9 15" fill="#D99A62" />
        <path d="M5.2 17.6a1.6 1.6 0 1 1 2.3-2.2l2.1 2.1a1.6 1.6 0 1 1-2.2 2.3z" fill="#F3E9DC" />
      </>
    ),
  },
  potato: {
    label: "Potato",
    body: (
      <>
        <path d="M6.2 8.2c2.6-3.6 9.2-4.6 12 .2 2.4 4.1-.8 10.2-6.6 10.3-5.6.1-8.3-6.4-5.4-10.5z" fill="#CFA26B" />
        <circle cx="10" cy="10.5" r=".6" fill="#7A5634" stroke="none" />
        <circle cx="14.5" cy="13.5" r=".6" fill="#7A5634" stroke="none" />
        <circle cx="11" cy="15" r=".6" fill="#7A5634" stroke="none" />
      </>
    ),
  },
  salad: {
    label: "Vegetables",
    body: (
      <>
        <path d="M7 10.5c-.5-3 2-5.5 4.5-4.5 1-2 4.5-2 5.5.5 2.5 0 3.5 2.5 2.5 4" fill="#7FA36A" />
        <circle cx="10" cy="9" r="1.6" fill="#D9604A" />
        <path d="M3.5 11h17a8.5 8.5 0 0 1-17 0z" fill="#E9DFD2" />
      </>
    ),
  },
  "peanut-butter": {
    label: "Peanut butter",
    body: (
      <>
        <rect x="6" y="8" width="12" height="12" rx="2" fill="#B97A43" />
        <rect x="6.8" y="4" width="10.4" height="4" rx="1" fill="#E7A73B" />
        <path d="M9 12.5h6v4H9z" fill="#F3E2C6" stroke="none" />
      </>
    ),
  },
  oil: {
    label: "Oil",
    body: <path d="M12 3.5c2.5 4 5.5 7.4 5.5 10.6a5.5 5.5 0 0 1-11 0C6.5 10.9 9.5 7.5 12 3.5z" fill="#E3C25B" />,
  },
  water: {
    label: "Water",
    body: (
      <>
        <path d="M6.5 4h11l-1.4 16H7.9z" fill="#CFE3EE" />
        <path d="M7.3 10h9.4l-.8 10H8.1z" fill="#8DBBD6" stroke="none" />
      </>
    ),
  },
};

export function FoodIcon({ id, size = 24 }: { id: FoodIconId; size?: number }) {
  const icon = ICONS[id];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className="food-icon"
      role="img"
      aria-label={icon.label}
      stroke="#3A2A1F"
      strokeWidth={1.5}
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {icon.body}
    </svg>
  );
}
