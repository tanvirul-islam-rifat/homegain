"use client";

import { useId, useState, type ReactNode } from "react";
import { IconChevron } from "./Icons";

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
  size = "md",
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  label: string;
  size?: "sm" | "md";
}) {
  return (
    <div className={`segmented segmented-${size}`} role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          className={value === o.value ? "is-on" : ""}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Collapsible card. Controlled when `open` is passed. */
export function Disclosure({
  title,
  subtitle,
  leading,
  trailing,
  children,
  open: openProp,
  onToggle,
  defaultOpen = false,
  className = "",
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  children: ReactNode;
  open?: boolean;
  onToggle?: (open: boolean) => void;
  defaultOpen?: boolean;
  className?: string;
}) {
  const [inner, setInner] = useState(defaultOpen);
  const open = openProp ?? inner;
  const id = useId();
  const toggle = () => {
    const next = !open;
    if (openProp === undefined) setInner(next);
    onToggle?.(next);
  };
  return (
    <section className={`card fold ${open ? "is-open" : ""} ${className}`}>
      <button type="button" className="fold-head" aria-expanded={open} aria-controls={id} onClick={toggle}>
        {leading}
        <span className="fold-titles">
          <span className="fold-title">{title}</span>
          {subtitle ? <span className="fold-sub">{subtitle}</span> : null}
        </span>
        {trailing}
        <IconChevron className="chev" width={20} height={20} />
      </button>
      <div id={id} className="fold-body" hidden={!open}>
        {children}
      </div>
    </section>
  );
}

export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <header className="page-header">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 className="page-title">{title}</h1>
      </div>
      {children}
    </header>
  );
}

/** Progress ring (0..1). */
export function Ring({
  value,
  size = 56,
  stroke = 6,
  children,
  label,
}: {
  value: number;
  size?: number;
  stroke?: number;
  children?: ReactNode;
  label?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.min(1, Math.max(0, value));
  return (
    <div className="ring" style={{ width: size, height: size }} role={label ? "img" : undefined} aria-label={label}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} className="ring-track" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className="ring-value"
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - v)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="ring-center">{children}</div>
    </div>
  );
}
