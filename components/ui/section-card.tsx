import { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
};

export function SectionCard({
  title,
  subtitle,
  children,
  className = "",
}: SectionCardProps) {
  return (
    <section className={`surface-card p-5 ${className}`.trim()}>
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{title}</p>
      {subtitle ? (
        <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>
      ) : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </section>
  );
}
