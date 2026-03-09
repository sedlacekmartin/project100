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
              className="mt-5 inline-block rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800"
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
    <main className="min-h-screen py-10 sm:py-14">
      <div className="app-container space-y-6">
        <section className="surface-card overflow-hidden p-6 sm:p-8">
          <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Project 100</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Real dashboard for active attempts, history, and quick logging
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Logged in as <span className="font-semibold">{user.email}</span>. This screen now reads
                from Supabase tables instead of local demo state.
              </p>

              {params.error ? (
                <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">{params.error}</p>
              ) : null}
              {params.message ? (
                <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                  {params.message}
                </p>
              ) : null}
              {data.setupError ? (
                <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">
                  {data.setupError}
                </p>
              ) : null}
            </div>

            <div className="surface-card bg-slate-950 p-5 text-white">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-300">Next step</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight">
                {data.activities.length === 0 ? "Create your first activity" : "Keep the current attempt moving"}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Expected schema lives in `db/migrations/0001_project100.sql`. Once those tables exist,
                this dashboard is production-oriented rather than demo-only.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href="/"
                  className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Landing
                </Link>
                <form action={signOut}>
                  <button className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950">
                    Sign out
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Activities" value={data.metrics.totalActivities} detail="tracked categories" />
          <MetricCard label="Active attempts" value={data.metrics.activeAttempts} detail="currently in progress" />
          <MetricCard
            label="Completed attempts"
            value={data.metrics.completedAttempts}
            detail="saved history for comparisons"
          />
          <MetricCard label="Recent logs" value={data.metrics.recentLogs} detail="latest progress events" />
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="surface-card p-5 sm:p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Create activity</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Add a new 100-unit challenge
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Every activity starts with a fresh attempt immediately, so the user can log progress with one tap.
            </p>
            <div className="mt-5">
              <CreateActivityForm />
            </div>
          </article>

          <article className="surface-card p-5 sm:p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">History and trends</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Recent completed attempts
            </h2>
            <div className="mt-4 space-y-3">
              {data.activities.flatMap((activity) => activity.completedAttempts.slice(0, 2)).length === 0 ? (
                <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  Completed attempts will appear here once one of your activities reaches 100.
                </p>
              ) : (
                data.activities.flatMap((activity) =>
                  activity.completedAttempts.slice(0, 2).map((attempt, index, attempts) => {
                    const days = getAttemptDurationDays(attempt);
                    const previous = attempts[index + 1] ? getAttemptDurationDays(attempts[index + 1]) : null;
                    return (
                      <div key={attempt.id} className="rounded-2xl bg-slate-50 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                          <span className="text-xs text-slate-500">{formatDate(attempt.completed_at ?? attempt.started_at)}</span>
                        </div>
                        <p className="mt-2 text-xl font-semibold tracking-tight text-slate-950">{days} days</p>
                        <p className="mt-1 text-sm text-slate-600">
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
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Active attempts</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Quick actions and current state
            </h2>
          </div>

          {data.activities.length === 0 ? (
            <article className="surface-card p-6">
              <p className="text-base text-slate-700">
                No activities yet. Create the first one above to unlock logging, completion history, and trend
                comparisons.
              </p>
            </article>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {data.activities.map((activity) => {
                const activeAttempt = activity.activeAttempt;
                const accentClassName = activity.intent === "good" ? "bg-emerald-600" : "bg-red-600";
                const accentTextClassName = activity.intent === "good" ? "text-emerald-700" : "text-red-700";
                const completedCount = activity.completedAttempts.length;

                return (
                  <article key={activity.id} className="surface-card p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                          {activity.intent === "good" ? "Positive habit" : "Harm reduction"}
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                          {activity.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          Target {activity.target_value} {activity.unit}
                        </p>
                      </div>
                      <span className={`rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold ${accentTextClassName}`}>
                        {completedCount} completed
                      </span>
                    </div>

                    {activeAttempt ? (
                      <>
                        <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-slate-900">Current attempt</p>
                            <span className="text-sm text-slate-500">
                              started {formatDate(activeAttempt.started_at)}
                            </span>
                          </div>
                          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                            {activeAttempt.current_value} / {activeAttempt.target_value} {activity.unit}
                          </p>
                          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200">
                            <div
                              className={`h-full rounded-full ${accentClassName}`}
                              style={{ width: `${getProgress(activeAttempt)}%` }}
                            />
                          </div>
                          <p className="mt-2 text-sm text-slate-600">
                            {getProgress(activeAttempt)}% complete in {getAttemptDurationDays(activeAttempt)} day(s)
                          </p>
                        </div>

                        <LogProgressForm attemptId={activeAttempt.id} accentClassName={accentClassName} />
                      </>
                    ) : (
                      <div className="mt-5 rounded-2xl bg-slate-50 p-4">
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
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Recent logs</p>
            <div className="mt-4 space-y-3">
              {data.recentLogs.length === 0 ? (
                <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  Your latest `+1`, `+5`, and `+10` actions will appear here.
                </p>
              ) : (
                data.recentLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3">
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
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Product status</p>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <p className="rounded-xl bg-slate-50 px-4 py-3">
                Auth is live. Dashboard now reads activities, attempts, and logs from Supabase instead of local demo state.
              </p>
              <p className="rounded-xl bg-slate-50 px-4 py-3">
                MVP flow is covered: create activity, auto-start attempt, log progress, auto-complete at 100, start next attempt.
              </p>
              <p className="rounded-xl bg-slate-50 px-4 py-3">
                The next layer after this is dedicated activity detail pages, charts, and PWA/offline refinement.
              </p>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
