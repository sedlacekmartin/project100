"use client";

import { useActionState, useEffect, startTransition } from "react";
import { useRouter } from "next/navigation";
import { startNextAttempt } from "@/app/dashboard/actions";
import { initialDashboardActionState } from "@/components/dashboard/action-state";

export function StartNextAttemptForm({ activityId }: { activityId: string }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    startNextAttempt,
    initialDashboardActionState,
  );

  useEffect(() => {
    if (state.status !== "success") {
      return;
    }

    startTransition(() => {
      router.refresh();
    });
  }, [router, state.status]);

  return (
    <form action={formAction} className="grid gap-2">
      <input type="hidden" name="activityId" value={activityId} />
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
        className="ios-button border border-[rgba(160,177,217,0.28)] bg-white/90 px-4 py-2.5 text-sm font-semibold text-slate-800 disabled:opacity-60"
      >
        {isPending ? "Starting..." : "Start next 100"}
      </button>
    </form>
  );
}
