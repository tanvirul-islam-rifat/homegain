import type { Metadata } from "next";
import { BmiView } from "@/components/bmi/BmiView";

export const metadata: Metadata = { title: "BMI" };

export default function Page() {
  return <BmiView />;
}
