"use client";

import { useActionState, useEffect, useRef, startTransition } from "react";
import { useRouter } from "next/navigation";
import { createActivity } from "@/app/dashboard/actions";
import { initialDashboardActionState } from "@/components/dashboard/action-state";

export function CreateActivityForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    createActivity,
    initialDashboardActionState,
  );

  useEffect(() => {
    if (state.status !== "success") {
      return;
    }

    formRef.current?.reset();
    startTransition(() => {
      router.refresh();
    });
  }, [router, state.status]);

  return (
    <form ref={formRef} action={formAction} className="grid gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm text-slate-700">
          <span className="font-medium">Title</span>
          <input
            name="title"
            required
            placeholder="Water, Walk, Cigarettes..."
            className="ios-input px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[rgba(110,168,255,0.55)]"
          />
        </label>
        <label className="grid gap-1.5 text-sm text-slate-700">
          <span className="font-medium">Unit</span>
          <input
            name="unit"
            required
            placeholder="glasses, km, reps, cigs"
            className="ios-input px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[rgba(110,168,255,0.55)]"
          />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm text-slate-700">
          <span className="font-medium">Intent</span>
          <select
            name="intent"
            defaultValue="good"
            className="ios-input px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[rgba(110,168,255,0.55)]"
          >
            <option value="good">Positive habit</option>
            <option value="risky">Harm reduction</option>
          </select>
        </label>
        <label className="grid gap-1.5 text-sm text-slate-700">
          <span className="font-medium">Target</span>
          <input
            name="targetValue"
            type="number"
            min={1}
            defaultValue={100}
            className="ios-input px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[rgba(110,168,255,0.55)]"
          />
        </label>
      </div>

      {state.message ? (
        <p
          className={`rounded-2xl px-4 py-3 text-sm ${
            state.status === "error"
              ? "bg-red-50 text-red-800"
              : "bg-emerald-50 text-emerald-800"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <button
        disabled={isPending}
        className="ios-button shine bg-[linear-gradient(135deg,#8bb6ff,#8e88ff_58%,#f2c96d)] px-4 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60"
      >
        {isPending ? "Creating..." : "Create activity and first attempt"}
      </button>
    </form>
  );
}
