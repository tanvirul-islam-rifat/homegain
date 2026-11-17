import { Suspense } from "react";
import { PlanSkeleton, PlanView } from "@/components/plan/PlanView";

export default function PlanPage() {
  return (
    <Suspense fallback={<PlanSkeleton />}>
      <PlanView />
    </Suspense>
  );
}
