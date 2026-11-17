"use client";

import { GUIDE } from "@/data/guide";
import { IconGuide, IconMeals, IconProgress } from "./Icons";
import { Disclosure, PageHeader } from "./ui";

const ICONS = { progression: IconProgress, habits: IconGuide, food: IconMeals } as const;

export function GuideView() {
  return (
    <div className="stack">
      <PageHeader eyebrow="How it works" title="Guide" />
      {GUIDE.map((g) => {
        const Icon = ICONS[g.id as keyof typeof ICONS] ?? IconGuide;
        const List = g.ordered ? "ol" : "ul";
        return (
          <Disclosure
            key={g.id}
            title={g.title}
            leading={
              <span className="lead-icon">
                <Icon width={20} height={20} />
              </span>
            }
          >
            {g.intro ? <p className="guide-intro">{g.intro}</p> : null}
            <List className={g.ordered ? "steps" : "bullets"}>
              {g.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </List>
            {g.tip ? <p className="tip">{g.tip}</p> : null}
          </Disclosure>
        );
      })}
    </div>
  );
}
