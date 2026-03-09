import Link from "next/link";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { login, signup } from "./actions";

type SearchParams = Promise<{
  error?: string;
  message?: string;
  next?: string;
}>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const nextPath = params.next ?? "/dashboard";
  const configured = hasSupabaseConfig();

  return (
    <main className="min-h-screen py-10 sm:py-14">
      <div className="app-container">
        <section className="surface-card mx-auto max-w-md p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
            Project 100
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            Login
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Continue to your dashboard and tracked activities.
          </p>

          {!configured ? (
            <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">
              Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and
              NEXT_PUBLIC_SUPABASE_ANON_KEY.
            </p>
          ) : null}

          {params.error ? (
            <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">
              {params.error}
            </p>
          ) : null}

          {params.message ? (
            <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              {params.message}
            </p>
          ) : null}

          <form className="mt-5 space-y-3">
            <input type="hidden" name="next" value={nextPath} />
            <label className="block text-sm font-medium text-slate-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
            />

            <label className="block text-sm font-medium text-slate-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
            />

            <div className="flex gap-2 pt-2">
              <button
                formAction={login}
                disabled={!configured}
                className="flex-1 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                Log in
              </button>
              <button
                formAction={signup}
                disabled={!configured}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 disabled:opacity-50"
              >
                Sign up
              </button>
            </div>
          </form>

          <Link
            href="/"
            className="mt-5 inline-block text-sm font-medium text-slate-600 underline-offset-4 hover:underline"
          >
            Back to landing
          </Link>
        </section>
      </div>
    </main>
  );
}
