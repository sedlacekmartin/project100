import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { signOut } from "./actions";

export default async function DashboardPage() {
  if (!hasSupabaseConfig()) {
    return (
      <main className="min-h-screen py-10 sm:py-14">
        <div className="app-container">
          <section className="surface-card mx-auto max-w-2xl p-6 sm:p-8">
            <h1 className="text-2xl font-semibold text-slate-950">
              Dashboard unavailable
            </h1>
            <p className="mt-3 text-sm text-slate-600">
              Missing Supabase env vars. Configure NEXT_PUBLIC_SUPABASE_URL and
              NEXT_PUBLIC_SUPABASE_ANON_KEY.
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

  return (
    <main className="min-h-screen py-10 sm:py-14">
      <div className="app-container space-y-6">
        <section className="surface-card p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                Project 100
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                Authenticated dashboard
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Logged in as <span className="font-semibold">{user.email}</span>
              </p>
            </div>
            <form action={signOut}>
              <button className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">
                Sign out
              </button>
            </form>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article className="surface-card p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
              Activities
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">0</p>
            <p className="mt-1 text-sm text-slate-600">ready for Supabase data</p>
          </article>
          <article className="surface-card p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
              Active attempts
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">0</p>
            <p className="mt-1 text-sm text-slate-600">next step: connect tables</p>
          </article>
          <article className="surface-card p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
              Recent logs
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">0</p>
            <p className="mt-1 text-sm text-slate-600">next step: quick +1/+5</p>
          </article>
          <article className="surface-card p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
              Trend cards
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">0</p>
            <p className="mt-1 text-sm text-slate-600">next step: attempt comparisons</p>
          </article>
        </section>

        <Link
          href="/"
          className="inline-block rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800"
        >
          Back to landing demo
        </Link>
      </div>
    </main>
  );
}
