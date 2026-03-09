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
};

const previewActivities: PreviewActivity[] = [
  { id: "walk", title: "Walking", intent: "good", unit: "km", current: 42, target: 100, pace: "6d faster" },
  { id: "water", title: "Water", intent: "good", unit: "glasses", current: 76, target: 100, pace: "steady pace" },
  { id: "cigs", title: "Cigarettes", intent: "risky", unit: "cigs", current: 28, target: 100, pace: "9d slower" },
];

export function DemoPreview() {
  const [selectedId, setSelectedId] = useState(previewActivities[0].id);
  const selected = useMemo(
    () => previewActivities.find((activity) => activity.id === selectedId) ?? previewActivities[0],
    [selectedId],
  );

  const progress = Math.round((selected.current / selected.target) * 100);
  const accent = selected.intent === "good" ? "bg-emerald-600" : "bg-red-600";
  const accentText = selected.intent === "good" ? "text-emerald-700" : "text-red-700";

  return (
    <article className="surface-card bg-white/90 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Live concept preview</p>
        <span className={`rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold ${accentText}`}>
          {selected.intent === "good" ? "Build up" : "Slow down"}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {previewActivities.map((activity) => (
          <button
            key={activity.id}
            onClick={() => setSelectedId(activity.id)}
            className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
              activity.id === selected.id
                ? activity.intent === "good"
                  ? "bg-emerald-600 text-white"
                  : "bg-red-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {activity.title}
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-2xl bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-900">{selected.title}</p>
        <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          {selected.current} / {selected.target} {selected.unit}
        </p>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200">
          <div className={`h-full rounded-full ${accent}`} style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white p-3">
            <p className="text-xs text-slate-500">Progress</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{progress}% complete</p>
          </div>
          <div className="rounded-xl bg-white p-3">
            <p className="text-xs text-slate-500">Trend</p>
            <p className={`mt-1 text-sm font-semibold ${accentText}`}>{selected.pace}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
