"use client";

import { useMemo, useState } from "react";

type Intent = "good" | "risky";
type Screen = "home" | "detail" | "log";

type Activity = {
  id: string;
  title: string;
  intent: Intent;
  cadence: "daily" | "weekly";
  windowDays: number;
  target: number;
  unit: string;
  current: number;
  startDaysAgo: number;
  expectedFinishInDays: number;
  currentPace: number;
  recentPace: number;
  lastAttemptDays: number;
};

const baseActivities: Activity[] = [
  {
    id: "water",
    title: "Water",
    intent: "good",
    cadence: "daily",
    windowDays: 1,
    target: 100,
    unit: "glasses",
    current: 63,
    startDaysAgo: 6,
    expectedFinishInDays: 5,
    currentPace: 10.5,
    recentPace: 12.3,
    lastAttemptDays: 11,
  },
  {
    id: "pushups",
    title: "Push-ups",
    intent: "good",
    cadence: "daily",
    windowDays: 1,
    target: 100,
    unit: "reps",
    current: 28,
    startDaysAgo: 2,
    expectedFinishInDays: 4,
    currentPace: 14,
    recentPace: 16,
    lastAttemptDays: 8,
  },
  {
    id: "cigarettes",
    title: "Cigarettes",
    intent: "risky",
    cadence: "weekly",
    windowDays: 7,
    target: 100,
    unit: "cigs",
    current: 71,
    startDaysAgo: 10,
    expectedFinishInDays: 4,
    currentPace: 7.1,
    recentPace: 8.4,
    lastAttemptDays: 14,
  },
];

const attemptCards = [
  { label: "Attempt #24", days: 30, note: "Normal schedule" },
  { label: "Attempt #25", days: 45, note: "More walking, less stress" },
  { label: "Attempt #26", days: 21, note: "Holidays + social events" },
];

const paceBars = [45, 58, 52, 68, 63, 74, 61];
const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function clampProgress(value: number, target: number) {
  return Math.max(0, Math.min(value, target));
}

export default function HomePage() {
  const [screen, setScreen] = useState<Screen>("home");
  const [activities, setActivities] = useState<Activity[]>(baseActivities);
  const [selectedId, setSelectedId] = useState<string>("water");
  const [timerRunning, setTimerRunning] = useState(false);
  const [slowMode, setSlowMode] = useState(false);
  const [lastAction, setLastAction] = useState("Tap any control to simulate app behavior.");
  const [mood, setMood] = useState("🙂");

  const selected = useMemo(
    () => activities.find((activity) => activity.id === selectedId) ?? activities[0],
    [activities, selectedId],
  );
  const dailyActivities = activities.filter((activity) => activity.cadence === "daily");
  const weeklyActivities = activities.filter((activity) => activity.cadence === "weekly");

  const progress = Math.round((selected.current / selected.target) * 100);
  const deltaDays = selected.startDaysAgo - selected.lastAttemptDays;
  const deltaLabel =
    selected.intent === "good"
      ? `${Math.abs(deltaDays)}d ${deltaDays <= 0 ? "faster" : "slower"}`
      : `${Math.abs(deltaDays)}d ${deltaDays >= 0 ? "slower (better)" : "faster (risk)"}`;

  const projectedDate = new Date();
  projectedDate.setDate(projectedDate.getDate() + selected.expectedFinishInDays);
  const isGood = selected.intent === "good";
  const consistencyScore = Math.max(
    42,
    Math.min(98, Math.round((selected.recentPace / Math.max(selected.currentPace, 1)) * 72)),
  );
  const adherence = Math.max(
    35,
    Math.min(99, Math.round((selected.current / Math.max(selected.target, 1)) * 100)),
  );
  const bestAttempt = Math.min(...attemptCards.map((attempt) => attempt.days));
  const worstAttempt = Math.max(...attemptCards.map((attempt) => attempt.days));
  const weeklySplit = [14, 12, 17, 11, 16, 15, 15];

  const patchActivity = (delta: number) => {
    setActivities((previous) =>
      previous.map((item) => {
        if (item.id !== selected.id) return item;
        const current = clampProgress(item.current + delta, item.target);
        const expectedFinishInDays =
          item.intent === "good"
            ? Math.max(1, Math.ceil((item.target - current) / Math.max(item.recentPace, 1)))
            : Math.max(1, Math.ceil((item.target - current) / Math.max(item.currentPace, 1)));
        return { ...item, current, expectedFinishInDays };
      }),
    );
    setLastAction(`${selected.title}: logged +${delta} ${selected.unit}.`);
  };

  const startNextAttempt = () => {
    setActivities((previous) =>
      previous.map((item) =>
        item.id === selected.id
          ? { ...item, current: 0, startDaysAgo: 0, expectedFinishInDays: item.lastAttemptDays }
          : item,
      ),
    );
    setLastAction(`${selected.title}: new attempt started (0/${selected.target}).`);
  };

  return (
    <main className="min-h-screen py-8 sm:py-12">
      <div className="app-container space-y-8">
        <section className="surface-card relative overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(59,130,246,0.20),_transparent_72%)]" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(16,24,38,0.10),_transparent_72%)]" />
          <div className="relative grid gap-7 lg:grid-cols-[1.08fr_0.92fr]">
            <div>
              <p className="inline-flex rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                Project 100
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Apple-like bento dashboard
                <br />
                for habit pace awareness.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Click through Home, Detail, and Log screens. Every control below
                uses dummy data and updates the UI so you can see real product behavior.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                {(["home", "detail", "log"] as Screen[]).map((value) => (
                  <button
                    key={value}
                    onClick={() => setScreen(value)}
                    className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                      screen === value
                        ? "bg-slate-950 text-white shadow-[0_8px_30px_rgba(16,24,38,0.22)]"
                        : "border border-slate-200 bg-white/90 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {value === "home" ? "Home Preview" : value === "detail" ? "Detail Preview" : "Log Preview"}
                  </button>
                ))}
              </div>
            </div>

            <article className="surface-card bg-white/90 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Selected activity</p>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    isGood ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                  }`}
                >
                  {selected.intent === "good" ? "Strengthen" : "Harm reduction"}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {activities.map((activity) => (
                  <button
                    key={activity.id}
                    onClick={() => {
                      setSelectedId(activity.id);
                      setLastAction(`${activity.title} selected.`);
                    }}
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
              <p className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
                {selected.current} / {selected.target} {selected.unit}
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full ${isGood ? "bg-emerald-600" : "bg-red-600"}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Expected finish</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {projectedDate.toLocaleDateString("cs-CZ")}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Delta vs last</p>
                  <p
                    className={`mt-1 text-sm font-semibold ${
                      isGood ? "text-emerald-700" : "text-red-700"
                    }`}
                  >
                    {deltaLabel}
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>

        {screen === "home" ? (
          <section className="space-y-3">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Home bento dashboard</p>
            <div className="grid auto-rows-[145px] gap-4 sm:grid-cols-2 lg:grid-cols-6">
              <article className="surface-card p-5 sm:col-span-2 lg:col-span-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">Everything you track</p>
                  <p className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    {activities.length} activities total
                  </p>
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Daily goals</p>
                    <div className="mt-2 space-y-2">
                      {dailyActivities.map((item) => {
                        const itemProgress = Math.round((item.current / item.target) * 100);
                        return (
                          <button
                            key={item.id}
                            onClick={() => setSelectedId(item.id)}
                            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:bg-slate-50"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-slate-900">{item.title}</span>
                              <span className="text-xs text-slate-500">{item.target} / {item.unit}</span>
                            </div>
                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                              <div className="h-full rounded-full bg-emerald-600" style={{ width: `${itemProgress}%` }} />
                            </div>
                            <p className="mt-1 text-xs text-slate-600">{itemProgress}% complete today</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Weekly goals</p>
                    <div className="mt-2 space-y-2">
                      {weeklyActivities.map((item) => {
                        const itemProgress = Math.round((item.current / item.target) * 100);
                        return (
                          <button
                            key={item.id}
                            onClick={() => setSelectedId(item.id)}
                            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:bg-slate-50"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-slate-900">{item.title}</span>
                              <span className="text-xs text-slate-500">{item.target} / {item.unit}</span>
                            </div>
                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                              <div className="h-full rounded-full bg-red-600" style={{ width: `${itemProgress}%` }} />
                            </div>
                            <p className="mt-1 text-xs text-slate-600">{itemProgress}% complete this week</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </article>

              <article className="surface-card p-5 sm:col-span-2 lg:col-span-4 lg:row-span-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">Current attempt</p>
                  <p className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    {selected.windowDays === 1 ? "daily window" : `${selected.windowDays}-day window`}
                  </p>
                </div>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                  {selected.title}{" "}
                  <span className={isGood ? "text-emerald-600" : "text-red-500"}>
                    {progress}% complete
                  </span>
                </p>
                <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full ${isGood ? "bg-emerald-600" : "bg-red-600"}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Current pace</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{selected.currentPace.toFixed(1)} / day</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Recent pace (7d)</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{selected.recentPace.toFixed(1)} / day</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Projection</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">in {selected.expectedFinishInDays} days</p>
                  </div>
                </div>
              </article>

              <article className="surface-card p-5 lg:col-span-2">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Quick log</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => patchActivity(1)}
                    className={`rounded-xl px-3 py-3 text-sm font-semibold text-white ${
                      isGood ? "bg-emerald-600" : "bg-red-600"
                    }`}
                  >
                    +1
                  </button>
                  <button onClick={() => patchActivity(5)} className="rounded-xl bg-slate-100 px-3 py-3 text-sm font-semibold text-slate-800">
                    +5
                  </button>
                  <button
                    onClick={() => {
                      setTimerRunning((value) => !value);
                      setLastAction(timerRunning ? "Timer paused." : "Timer started.");
                    }}
                    className="rounded-xl bg-slate-100 px-3 py-3 text-sm font-semibold text-slate-800"
                  >
                    {timerRunning ? "Pause timer" : "Start timer"}
                  </button>
                  <button
                    onClick={() => setLastAction("Import opened: Apple Health / CSV (demo).")}
                    className="rounded-xl bg-slate-100 px-3 py-3 text-sm font-semibold text-slate-800"
                  >
                    Scan / Import
                  </button>
                </div>
              </article>

              <article
                className={`surface-card p-5 text-white lg:col-span-2 ${
                  isGood
                    ? "bg-[linear-gradient(135deg,#065f46,#10b981)]"
                    : "bg-[linear-gradient(135deg,#7f1d1d,#ef4444)]"
                }`}
              >
                <p
                  className={`text-xs uppercase tracking-[0.16em] ${
                    isGood ? "text-emerald-100" : "text-red-100"
                  }`}
                >
                  Awareness
                </p>
                <p className="mt-3 text-2xl font-semibold tracking-tight">
                  100 in {selected.startDaysAgo + selected.expectedFinishInDays} days
                </p>
                <p className={`mt-1 text-sm ${isGood ? "text-emerald-100" : "text-red-100"}`}>
                  {selected.intent === "risky"
                    ? `~${selected.currentPace.toFixed(1)} ${selected.unit}/day (faster than last attempt)`
                    : "steady healthy progression"}
                </p>
              </article>

              <article className="surface-card p-5 lg:col-span-2">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Recent activity</p>
                <div className="mt-4 space-y-2">
                  {activities.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
                      <span className="text-sm text-slate-700">{item.title}</span>
                      <span
                        className={`text-sm font-semibold ${
                          item.intent === "good" ? "text-emerald-700" : "text-red-700"
                        }`}
                      >
                        {item.current}/{item.target}
                      </span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="surface-card p-5 lg:col-span-2">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Consistency score</p>
                <p className={`mt-2 text-3xl font-semibold tracking-tight ${isGood ? "text-emerald-700" : "text-red-700"}`}>
                  {consistencyScore}%
                </p>
                <p className="mt-1 text-sm text-slate-600">how stable your pace is in the last 7 days</p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full ${isGood ? "bg-emerald-600" : "bg-red-600"}`}
                    style={{ width: `${consistencyScore}%` }}
                  />
                </div>
              </article>

              <article className="surface-card p-5 lg:col-span-2">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Adherence</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{adherence}%</p>
                <p className="mt-1 text-sm text-slate-600">
                  completed logs vs expected logs in this attempt
                </p>
                <p className={`mt-3 text-xs font-semibold ${isGood ? "text-emerald-700" : "text-red-700"}`}>
                  {isGood ? "On track for healthy progression" : "Track carefully, pace is sensitive"}
                </p>
              </article>

              <article className="surface-card p-5 sm:col-span-2 lg:col-span-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Weekly split</p>
                <div className="mt-4 grid grid-cols-7 gap-2">
                  {weeklySplit.map((value, index) => (
                    <div key={`${dayLabels[index]}-${value}`} className="rounded-xl bg-slate-50 p-2 text-center">
                      <p className="text-[11px] text-slate-500">{dayLabels[index]}</p>
                      <p className={`mt-1 text-sm font-semibold ${isGood ? "text-emerald-700" : "text-red-700"}`}>
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="surface-card p-5 lg:col-span-3">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Attempt stats</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Best attempt</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">{bestAttempt}d</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Worst attempt</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">{worstAttempt}d</p>
                  </div>
                </div>
              </article>

              <article className="surface-card p-5 lg:col-span-3">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Trigger notes</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Stress", "Evening", "Social", "Low sleep"].map((trigger) => (
                    <button
                      key={trigger}
                      onClick={() => setLastAction(`Trigger "${trigger}" noted for ${selected.title}.`)}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      {trigger}
                    </button>
                  ))}
                </div>
              </article>

              <article className="surface-card p-5 sm:col-span-2 lg:col-span-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Live feedback after clicks</p>
                <p className="mt-3 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">{lastAction}</p>
              </article>
            </div>
          </section>
        ) : null}

        {screen === "detail" ? (
          <section className="space-y-3">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Detail: 100 challenge</p>
            <div className="grid gap-4 lg:grid-cols-6">
              <article className="surface-card p-5 lg:col-span-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-lg font-semibold text-slate-900">{selected.title} timeline</p>
                  <button
                    onClick={() => setLastAction("Context note saved: 'More stress this week'.")}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
                  >
                    Add context note
                  </button>
                </div>
                <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
                  <span className="rounded-full bg-slate-100 px-2 py-1">Start</span>
                  <span className="h-px flex-1 bg-slate-200" />
                  <span className="rounded-full bg-slate-100 px-2 py-1">Now</span>
                  <span className="h-px flex-1 bg-slate-200" />
                  <span className="rounded-full bg-slate-100 px-2 py-1">Finish</span>
                </div>
                <div className="mt-6">
                  <p className="text-sm font-medium text-slate-800">Pace over time</p>
                  <div className="mt-3 flex h-40 items-end gap-2 rounded-2xl bg-slate-50 p-3">
                    {paceBars.map((value, index) => (
                      <div
                        key={`pace-${index}`}
                        className={`flex-1 rounded-t-lg ${
                          isGood ? "bg-emerald-300/90" : "bg-red-300/90"
                        }`}
                        style={{ height: `${value}%` }}
                      />
                    ))}
                  </div>
                </div>
              </article>

              <article className="surface-card p-5 lg:col-span-2">
                <p className="text-sm font-semibold text-slate-900">Attempts comparison</p>
                <div className="mt-4 space-y-2">
                  {attemptCards.map((attempt) => (
                    <div key={attempt.label} className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">{attempt.label}</p>
                      <p className="mt-1 text-base font-semibold text-slate-900">{attempt.days} days</p>
                      <p className="mt-1 text-xs text-slate-600">{attempt.note}</p>
                    </div>
                  ))}
                </div>
              </article>

              {selected.intent === "risky" ? (
                <article className="surface-card p-5 lg:col-span-6">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Harm-reduction options</p>
                  <p className="mt-2 text-base text-slate-700">
                    Hard fact: <span className="font-semibold text-slate-900">100 {selected.unit} in {selected.startDaysAgo + selected.expectedFinishInDays} days</span> means around{" "}
                    <span className="font-semibold text-slate-900">{selected.currentPace.toFixed(1)} per day</span>.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setSlowMode(true);
                        setLastAction("Slow-down plan enabled: target minimum duration set to 30 days.");
                      }}
                      className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white"
                    >
                      Chci tempo zpomalit
                    </button>
                    <button
                      onClick={() => setLastAction("Trigger notes opened: time, stress, social context.")}
                      className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700"
                    >
                      Spouštěče
                    </button>
                    <button
                      onClick={() => setLastAction("Help links opened (quiet, non-judgmental support).")}
                      className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700"
                    >
                      Odkaz na pomoc
                    </button>
                  </div>
                  {slowMode ? (
                    <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">
                      Active brake: target for next 100 adjusted from 14 to 30 days.
                    </p>
                  ) : null}
                </article>
              ) : null}
            </div>
          </section>
        ) : null}

        {screen === "log" ? (
          <section className="space-y-3">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Log actions</p>
            <div className="grid gap-4 lg:grid-cols-6">
              <article className="surface-card p-5 lg:col-span-3">
                <p className="text-sm font-semibold text-slate-900">Add units</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[1, 2, 5, 10].map((value) => (
                    <button
                      key={value}
                      onClick={() => patchActivity(value)}
                      className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${
                        isGood
                          ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                          : "bg-red-50 text-red-800 hover:bg-red-100"
                      }`}
                    >
                      +{value} {selected.unit}
                    </button>
                  ))}
                </div>
                <p className="mt-5 text-sm font-semibold text-slate-900">How do you feel?</p>
                <div className="mt-3 flex gap-2">
                  {["😞", "😐", "🙂", "🔥"].map((icon) => (
                    <button
                      key={icon}
                      onClick={() => {
                        setMood(icon);
                        setLastAction(`Mood saved: ${icon}. Correlation updated in analytics (demo).`);
                      }}
                      className={`rounded-xl px-3 py-2 text-xl ${mood === icon ? "bg-slate-900 text-white" : "bg-slate-100"}`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </article>

              <article className="surface-card p-5 lg:col-span-3">
                <p className="text-sm font-semibold text-slate-900">Attempt model</p>
                <p className="mt-2 text-sm text-slate-600">
                  Each completed target creates a separate attempt. No endless counter.
                </p>
                <div className="mt-4 rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Current status</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {selected.current >= selected.target
                      ? "Completed: ready for next 100"
                      : `${selected.current}/${selected.target} in progress`}
                  </p>
                </div>
                <button
                  onClick={startNextAttempt}
                  className={`mt-4 rounded-xl px-4 py-2.5 text-sm font-semibold text-white ${
                    isGood ? "bg-emerald-600" : "bg-red-600"
                  }`}
                >
                  Start next 100
                </button>
              </article>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
