import Link from "next/link";
import { DemoPreview } from "@/components/landing/demo-preview";

const principles = [
  "Track one activity from 0 to 100",
  "Focus on elapsed time instead of checkbox streaks",
  "See acceleration for healthy habits and braking for risky ones",
  "Use one-tap logging on mobile without friction",
];

const sections = [
  {
    title: "Dashboard rhythm",
    text: "Cards behave like an iPhone control center: one strong hero card, smaller insight tiles, and quick actions anchored low on the screen.",
  },
  {
    title: "Trend-first tracking",
    text: "Every attempt is judged by time to 100. The UI keeps pace, comparison, and warning signals visible before you need charts.",
  },
  {
    title: "Soft Apple surfaces",
    text: "Milk-glass panels, subtle gradients, rounded geometry, and deeper shadows replace generic SaaS boxes.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen py-8 sm:py-12">
      <div className="app-container space-y-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/50 bg-white/55 px-6 py-7 shadow-[0_24px_80px_rgba(109,129,168,0.18)] backdrop-blur-2xl sm:px-8 sm:py-9 lg:px-10 lg:py-10">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_12%_12%,rgba(158,140,255,0.28),transparent_26%),radial-gradient(circle_at_86%_8%,rgba(110,168,255,0.26),transparent_24%)]" />
          <div className="pointer-events-none absolute -bottom-16 left-1/3 h-44 w-44 rounded-full bg-[radial-gradient(circle,_rgba(242,201,109,0.22),_transparent_66%)]" />

          <div className="relative grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div>
              <p className="inline-flex rounded-full border border-white/60 bg-white/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-500">
                Apple-like habit cockpit
              </p>
              <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[0.96] tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-7xl">
                Project 100,
                <br />
                redesigned like a calm iPhone dashboard.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Inspired by fitness cards, clean habit widgets, and premium mobile analytics. The app now
                leans into bright glass surfaces outside and focused dark mobile panels inside.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/dashboard"
                  className="ios-button shine bg-[linear-gradient(135deg,#7fb4ff,#9d8dff_58%,#f2c96d)] px-6 py-3 text-sm font-semibold text-slate-950"
                >
                  Open dashboard
                </Link>
                <Link
                  href="/login"
                  className="ios-button border border-white/70 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700"
                >
                  Login
                </Link>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {principles.map((item) => (
                  <div key={item} className="ios-stat px-4 py-3 text-sm text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <DemoPreview />
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="surface-card p-6 sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Visual direction</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                  Built for mobile cards first
                </h2>
              </div>
              <div className="hidden h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#8cb8ff,#b39cff)] text-lg font-semibold text-white sm:flex">
                100
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {sections.map((section) => (
                <div key={section.title} className="ios-stat px-4 py-4">
                  <p className="text-base font-semibold text-slate-900">{section.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{section.text}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="surface-card p-6 sm:p-7">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">What changed</p>
            <div className="mt-4 space-y-3">
              <div className="ios-stat px-4 py-4">
                <p className="text-sm font-semibold text-slate-900">Soft dashboard shell</p>
                <p className="mt-1 text-sm text-slate-600">
                  White-on-mist background with deeper card depth and less sharp border noise.
                </p>
              </div>
              <div className="ios-stat px-4 py-4">
                <p className="text-sm font-semibold text-slate-900">Dark mobile hero</p>
                <p className="mt-1 text-sm text-slate-600">
                  The hero mockup now echoes your dark phone references with blue, violet, and gold accents.
                </p>
              </div>
              <div className="ios-stat px-4 py-4">
                <p className="text-sm font-semibold text-slate-900">Rounded quick actions</p>
                <p className="mt-1 text-sm text-slate-600">
                  Primary actions now read as tappable iOS controls instead of plain rectangular form buttons.
                </p>
              </div>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
