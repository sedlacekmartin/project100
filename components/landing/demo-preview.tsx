"use client";

import { useMemo, useState } from "react";

type Intent = "good" | "risky";

type PreviewActivity = {
  id: string;
  title: string;
  intent: Intent;
  unit: string;
  current: number;
  target: number;
  pace: string;
  icon: string;
  tone: string;
};

const previewActivities: PreviewActivity[] = [
  {
    id: "walk",
    title: "100 km Chuze",
    intent: "good",
    unit: "km",
    current: 42,
    target: 100,
    pace: "~ 6 dni",
    icon: "B6",
    tone: "from-[#7fb3ff] via-[#9d8dff] to-[#f4cd73]",
  },
  {
    id: "water",
    title: "100 Sklenic Vody",
    intent: "good",
    unit: "glasses",
    current: 76,
    target: 100,
    pace: "~ 3 dny",
    icon: "C8",
    tone: "from-[#8dc9ff] via-[#88b8ff] to-[#c6b5ff]",
  },
  {
    id: "cigs",
    title: "100 Cigaret",
    intent: "risky",
    unit: "cigs",
    current: 28,
    target: 100,
    pace: "zpomaleno o 9 dni",
    icon: "D7",
    tone: "from-[#ff8c8c] via-[#d98eff] to-[#f2c96d]",
  },
];

export function DemoPreview() {
  const [selectedId, setSelectedId] = useState(previewActivities[0].id);
  const selected = useMemo(
    () => previewActivities.find((activity) => activity.id === selectedId) ?? previewActivities[0],
    [selectedId],
  );

  const progress = Math.round((selected.current / selected.target) * 100);
  const progressWidth = `${progress}%`;

  return (
    <article className="surface-card-dark apple-grid float-card relative overflow-hidden p-4 text-white sm:p-5">
      <div className="pointer-events-none absolute -left-10 top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,_rgba(128,183,255,0.28),_transparent_68%)]" />
      <div className="pointer-events-none absolute -right-14 bottom-0 h-48 w-48 rounded-full bg-[radial-gradient(circle,_rgba(242,201,109,0.22),_transparent_70%)]" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-300">Dnes</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">Projekt 100</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-sm font-semibold text-slate-100">
            MK
          </div>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {previewActivities.map((activity) => (
            <button
              key={activity.id}
              onClick={() => setSelectedId(activity.id)}
              className={`min-w-[92px] rounded-[1.25rem] border px-3 py-3 text-left transition ${
                activity.id === selected.id
                  ? "border-white/25 bg-white/14 shadow-[0_16px_24px_rgba(0,0,0,0.22)]"
                  : "border-white/8 bg-white/6"
              }`}
            >
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-300">{activity.icon}</p>
              <p className="mt-2 text-sm font-semibold text-white">{activity.title.split(" ")[1]}</p>
              <p className="mt-1 text-xs text-slate-300">{activity.current} / 100</p>
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-[1.7rem] border border-white/10 bg-white/8 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-lg font-semibold">{selected.title}</p>
              <p className="mt-1 text-sm text-slate-300">Aktualni pokus #8</p>
            </div>
            <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold text-slate-200">
              {selected.intent === "good" ? "zrychleni" : "zpomaleni"}
            </span>
          </div>

          <p className="mt-5 text-4xl font-semibold tracking-tight">
            {selected.current}
            <span className="text-slate-400"> / {selected.target}</span>
            <span className="ml-2 text-lg font-medium text-slate-300">{selected.unit}</span>
          </p>

          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${selected.tone}`}
              style={{ width: progressWidth }}
            />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-[1.35rem] bg-white/8 p-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Tempo</p>
              <p className="mt-2 text-xl font-semibold text-white">{selected.pace}</p>
            </div>
            <div className="rounded-[1.35rem] bg-white/8 p-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Trend</p>
              <p className="mt-2 text-xl font-semibold text-white">{progress}%</p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr]">
          <button className="ios-button rounded-[1.2rem] bg-[linear-gradient(135deg,#7fb4ff,#9d8dff)] px-4 py-3 text-sm font-semibold text-white">
            +1 rychly log
          </button>
          <button className="ios-button rounded-[1.2rem] bg-[linear-gradient(135deg,#f5d47a,#f2c96d)] px-4 py-3 text-sm font-semibold text-slate-950">
            Start Chuze
          </button>
        </div>
      </div>
    </article>
  );
}
