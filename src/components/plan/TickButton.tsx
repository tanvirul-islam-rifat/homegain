"use client";

export function TickButton({
  day,
  on,
  onToggle,
  size = "md",
  disabled,
}: {
  day: number;
  on: boolean;
  onToggle: () => void;
  size?: "md" | "lg";
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={`tick tick-${size}${on ? " is-on" : ""}`}
      aria-pressed={on}
      aria-label={`Mark Day ${day} complete`}
      onClick={onToggle}
      disabled={disabled}
    >
      <svg viewBox="0 0 24 24" aria-hidden>
        <path className="tick-check" d="M6.5 12.5l3.6 3.6 7.4-7.6" pathLength={1} />
      </svg>
    </button>
  );
}
