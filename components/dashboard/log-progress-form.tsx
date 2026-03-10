"use client";

import { useActionState, useEffect, useRef, startTransition } from "react";
import { useRouter } from "next/navigation";
import { logProgress } from "@/app/dashboard/actions";
import { initialDashboardActionState } from "@/components/dashboard/action-state";

export function LogProgressForm({
  attemptId,
  accentClassName,
}: {
  attemptId: string;
  accentClassName: string;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    logProgress,
    initialDashboardActionState,
  );

  useEffect(() => {
    if (state.status !== "success") {
      return;
    }

    const moodInput = formRef.current?.elements.namedItem("mood");
    if (moodInput instanceof HTMLInputElement) {
      moodInput.value = "";
    }

    startTransition(() => {
      router.refresh();
    });
  }, [router, state.status]);

  return (
    <form ref={formRef} action={formAction} className="mt-4 grid gap-2">
      <input type="hidden" name="attemptId" value={attemptId} />
      <div className="flex flex-wrap gap-2">
        {[1, 5, 10].map((delta) => (
          <button
            key={delta}
            type="submit"
            name="delta"
            value={delta}
            disabled={isPending}
            className={`ios-button px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60 ${accentClassName}`}
          >
            +{delta}
          </button>
        ))}
      </div>
      <label className="grid gap-1.5 text-sm text-slate-700">
        <span className="font-medium">Mood note</span>
        <input
          name="mood"
          placeholder="optional: calm, stressed, tired..."
          className="ios-input px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[rgba(110,168,255,0.55)]"
        />
      </label>

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
        type="submit"
        name="delta"
        value={1}
        disabled={isPending}
        className="ios-button border border-[rgba(160,177,217,0.28)] bg-white/90 px-4 py-2.5 text-sm font-semibold text-slate-800 disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Save custom mood with +1"}
      </button>
    </form>
  );
}
