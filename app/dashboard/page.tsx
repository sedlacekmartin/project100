import Link from "next/link";
import { redirect } from "next/navigation";
import { CreateActivityForm } from "@/components/dashboard/create-activity-form";
import { LogProgressForm } from "@/components/dashboard/log-progress-form";
import { MetricCard } from "@/components/dashboard/metric-card";
import { StartNextAttemptForm } from "@/components/dashboard/start-next-attempt-form";
import {
  formatDate,
  getAttemptDurationDays,
  getProgress,
  getTrendLabel,
} from "@/lib/project100/types";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { getDashboardData } from "@/lib/supabase/project100";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

type SearchParams = Promise<{
  error?: string;
  message?: string;
}>;

function getAccent(intent: "good" | "risky") {
  return intent === "good"
    ? {
        bar: "bg-[linear-gradient(90deg,#7fb4ff,#9d8dff,#f2c96d)]",
        button: "bg-[linear-gradient(135deg,#7fb4ff,#9d8dff)]",
        text: "text-[#5a77c8]",
        badge: "bg-[rgba(127,180,255,0.14)] text-[#5a77c8]",
      }
    : {
        bar: "bg-[linear-gradient(90deg,#f2c96d,#f5a16b,#d88cff)]",
        button: "bg-[linear-gradient(135deg,#f2c96d,#d88cff)]",
        text: "text-[#b86f8c]",
        badge: "bg-[rgba(242,201,109,0.16)] text-[#ad7c22]",
      };
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  if (!hasSupabaseConfig()) {
    return (
      <main className="min-h-screen py-10 sm:py-14">
        <div className="app-container">
          <section className="surface-card mx-auto max-w-2xl p-6 sm:p-8">
            <h1 className="text-2xl font-semibold text-slate-950">Dashboard unavailable</h1>
            <p className="mt-3 text-sm text-slate-600">
              Missing Supabase env vars. Configure `NEXT_PUBLIC_SUPABASE_URL` and
              `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
            </p>
            <Link
              href="/"
              className="ios-button mt-5 inline-block border border-white/70 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-800"
            >
              Back to landing
            </Link>
          </section>
        </div>
      </main>
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const data = await getDashboardData(supabase, user.id);

  return (
    <main className="min-h-screen py-8 sm:py-12">
      <div className="app-container space-y-6">
        <section className="surface-card-dark apple-grid relative overflow-hidden px-6 py-6 text-white sm:px-8 sm:py-8">
          <div className="pointer-events-none absolute -left-10 top-6 h-40 w-40 rounded-full bg-[radial-gradient(circle,_rgba(110,168,255,0.24),_transparent_66%)]" />
          <div className="pointer-events-none absolute right-0 top-0 h-52 w-52 rounded-full bg-[radial-gradient(circle,_rgba(158,140,255,0.22),_transparent_68%)]" />
          <div className="relative grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-slate-300">Project 100 cockpit</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
                Apple-like dashboard for attempts, pace, and warnings.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
                Logged in as <span className="font-semibold text-white">{user.email}</span>. The layout now
                follows the iPhone card references: dark hero, bright secondary panels, rounded controls,
                and faster visual scanning.
              </p>

              {params.error ? (
                <p className="mt-4 rounded-2xl border border-red-300/25 bg-red-500/12 px-4 py-3 text-sm text-red-100">
                  {params.error}
                </p>
              ) : null}
              {params.message ? (
                <p className="mt-4 rounded-2xl border border-emerald-300/25 bg-emerald-500/12 px-4 py-3 text-sm text-emerald-100">
                  {params.message}
                </p>
              ) : null}
              {data.setupError ? (
                <p className="mt-4 rounded-2xl border border-amber-300/25 bg-amber-500/12 px-4 py-3 text-sm text-amber-100">
                  {data.setupError}
                </p>
              ) : null}
            </div>

            <div className="grid gap-3 self-start sm:grid-cols-2">
              <div className="rounded-[1.7rem] border border-white/10 bg-white/8 p-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Today</p>
                <p className="mt-3 text-3xl font-semibold text-white">{data.metrics.activeAttempts}</p>
                <p className="mt-1 text-sm text-slate-300">active attempt tiles</p>
              </div>
              <div className="rounded-[1.7rem] border border-white/10 bg-white/8 p-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">History</p>
                <p className="mt-3 text-3xl font-semibold text-white">{data.metrics.completedAttempts}</p>
                <p className="mt-1 text-sm text-slate-300">finished runs saved</p>
              </div>
              <div className="rounded-[1.7rem] border border-white/10 bg-white/8 p-4 sm:col-span-2">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Next step</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {data.activities.length === 0 ? "Create your first activity" : "Keep the current attempt moving"}
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  Schema is ready in `db/migrations/0001_project100.sql`, so the UI is designed around real data flow.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href="/"
                    className="ios-button border border-white/14 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    Landing
                  </Link>
                  <form action={signOut}>
                    <button className="ios-button bg-white px-4 py-2.5 text-sm font-semibold text-slate-950">
                      Sign out
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Activities" value={data.metrics.totalActivities} detail="tracked categories" />
          <MetricCard label="Active attempts" value={data.metrics.activeAttempts} detail="currently in progress" />
          <MetricCard label="Completed" value={data.metrics.completedAttempts} detail="history cards ready" />
          <MetricCard label="Recent logs" value={data.metrics.recentLogs} detail="quick add events" />
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
          <article className="surface-card p-5 sm:p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Create activity</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Start a new 100-unit challenge
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Shaped like an iOS composer sheet: focused inputs, gentle depth, and one primary action.
            </p>
            <div className="mt-5">
              <CreateActivityForm />
            </div>
          </article>

          <article className="surface-card p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">History and trends</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Completed attempts</h2>
              </div>
              <div className="rounded-full bg-[linear-gradient(135deg,#8cb8ff,#c7b7ff)] px-3 py-1 text-xs font-semibold text-slate-950">
                tempo
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {data.activities.flatMap((activity) => activity.completedAttempts.slice(0, 2)).length === 0 ? (
                <p className="ios-stat px-4 py-4 text-sm text-slate-600">
                  Completed attempts will appear here once one of your activities reaches 100.
                </p>
              ) : (
                data.activities.flatMap((activity) =>
                  activity.completedAttempts.slice(0, 2).map((attempt, index, attempts) => {
                    const days = getAttemptDurationDays(attempt);
                    const previous = attempts[index + 1] ? getAttemptDurationDays(attempts[index + 1]) : null;
                    const accent = getAccent(activity.intent);
                    return (
                      <div key={attempt.id} className="ios-stat px-4 py-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                          <span className="text-xs text-slate-500">{formatDate(attempt.completed_at ?? attempt.started_at)}</span>
                        </div>
                        <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{days} days</p>
                        <p className={`mt-1 text-sm ${accent.text}`}>
                          {getTrendLabel(activity.intent, days, previous)}
                        </p>
                      </div>
                    );
                  }),
                )
              )}
            </div>
          </article>
        </section>

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Active attempts</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                Quick actions and current state
              </h2>
            </div>
            <div className="hidden rounded-full border border-white/55 bg-white/70 px-4 py-2 text-sm text-slate-600 shadow-[0_12px_24px_rgba(109,129,168,0.12)] sm:block">
              mobile-first card flow
            </div>
          </div>

          {data.activities.length === 0 ? (
            <article className="surface-card p-6">
              <p className="text-base text-slate-700">
                No activities yet. Create the first one above to unlock logging, completion history, and trend comparisons.
              </p>
            </article>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {data.activities.map((activity) => {
                const activeAttempt = activity.activeAttempt;
                const accent = getAccent(activity.intent);
                const completedCount = activity.completedAttempts.length;

                return (
                  <article key={activity.id} className="surface-card shine overflow-hidden p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                          {activity.intent === "good" ? "Positive habit" : "Harm reduction"}
                        </p>
                        <h3 className="mt-2 text-[2rem] font-semibold tracking-tight text-slate-950">
                          {activity.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          Target {activity.target_value} {activity.unit}
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${accent.badge}`}>
                        {completedCount} completed
                      </span>
                    </div>

                    {activeAttempt ? (
                      <>
                        <div className="ios-stat mt-5 px-4 py-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-slate-900">Current attempt</p>
                            <span className="text-sm text-slate-500">
                              started {formatDate(activeAttempt.started_at)}
                            </span>
                          </div>
                          <p className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
                            {activeAttempt.current_value}
                            <span className="text-slate-400"> / {activeAttempt.target_value}</span>
                            <span className="ml-2 text-lg font-medium text-slate-500">{activity.unit}</span>
                          </p>
                          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200/80">
                            <div
                              className={`h-full rounded-full ${accent.bar}`}
                              style={{ width: `${getProgress(activeAttempt)}%` }}
                            />
                          </div>
                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-[1.2rem] bg-white/80 px-3 py-3">
                              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Progress</p>
                              <p className="mt-1 text-lg font-semibold text-slate-950">{getProgress(activeAttempt)}%</p>
                            </div>
                            <div className="rounded-[1.2rem] bg-white/80 px-3 py-3">
                              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Elapsed</p>
                              <p className="mt-1 text-lg font-semibold text-slate-950">
                                {getAttemptDurationDays(activeAttempt)} day(s)
                              </p>
                            </div>
                          </div>
                        </div>

                        <LogProgressForm attemptId={activeAttempt.id} accentClassName={accent.button} />
                      </>
                    ) : (
                      <div className="ios-stat mt-5 px-4 py-4">
                        <p className="text-sm text-slate-600">
                          No active attempt for this activity. Start a fresh run from zero.
                        </p>
                        <div className="mt-4">
                          <StartNextAttemptForm activityId={activity.id} />
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <article className="surface-card p-5 sm:p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Recent logs</p>
            <div className="mt-4 space-y-3">
              {data.recentLogs.length === 0 ? (
                <p className="ios-stat px-4 py-4 text-sm text-slate-600">
                  Your latest `+1`, `+5`, and `+10` actions will appear here.
                </p>
              ) : (
                data.recentLogs.map((log) => (
                  <div key={log.id} className="ios-stat flex items-center justify-between gap-4 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{log.activityTitle}</p>
                      <p className="text-xs text-slate-500">
                        +{log.delta} {log.activityUnit}
                        {log.mood ? ` • ${log.mood}` : ""}
                      </p>
                    </div>
                    <span className="text-xs text-slate-500">{formatDate(log.logged_at)}</span>
                  </div>
                ))
              )}
            </div>
          </article>

          <article className="surface-card p-5 sm:p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Product status</p>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <p className="ios-stat px-4 py-4">
                Auth is live. Dashboard reads activities, attempts, and logs from Supabase instead of local demo state.
              </p>
              <p className="ios-stat px-4 py-4">
                MVP flow is covered: create activity, auto-start attempt, log progress, auto-complete at 100, start next attempt.
              </p>
              <p className="ios-stat px-4 py-4">
                The next layer after this is dedicated activity detail pages, charts, and stronger mobile transitions.
              </p>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
