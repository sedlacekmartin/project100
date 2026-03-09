import Link from "next/link";
import { DemoPreview } from "@/components/landing/demo-preview";

const principles = [
  "Track one activity from 0 to 100",
  "Measure elapsed time, not just daily streaks",
  "Compare finished attempts and spot trends",
  "Support both positive habits and harm reduction",
];

const roadmap = [
  "Auth and dashboard are wired for Supabase",
  "Activities, attempts, and logs use a real schema",
  "Quick logging and auto-completion at 100 are in place",
  "Next step is deeper history, detail pages, and charts",
];

export default function HomePage() {
  return (
    <main className="min-h-screen py-8 sm:py-12">
      <div className="app-container space-y-8">
        <section className="surface-card relative overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top_left,_rgba(16,24,38,0.10),_transparent_45%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.16),_transparent_35%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="inline-flex rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                Project 100
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Time-based habit tracking instead of another checkbox app.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Build awareness around how long it takes to reach 100 units. Useful for water, walking,
                push-ups, cigarettes, beers, and anything else where time and repetition matter.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/dashboard"
                  className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(16,24,38,0.22)]"
                >
                  Open dashboard
                </Link>
                <Link
                  href="/login"
                  className="rounded-2xl border border-slate-200 bg-white/90 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Login
                </Link>
              </div>
            </div>

            <DemoPreview />
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <article className="surface-card p-6 sm:p-7">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Core idea</p>
            <div className="mt-4 space-y-3">
              {principles.map((item) => (
                <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </article>

          <article className="surface-card p-6 sm:p-7">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Build status</p>
            <div className="mt-4 space-y-3">
              {roadmap.map((item) => (
                <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
