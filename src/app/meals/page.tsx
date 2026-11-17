import type { Metadata } from "next";
import { MealsView } from "@/components/meals/MealsView";

export const metadata: Metadata = { title: "Meals" };

export default function Page() {
  return <MealsView />;
}
