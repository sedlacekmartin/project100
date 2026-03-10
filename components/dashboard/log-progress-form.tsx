"use client";

import { useActionState, useEffect, useRef, startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { logProgress } from "@/app/dashboard/actions";
import { initialDashboardActionState } from "@/components/dashboard/action-state";

const moodOptions = [
  { value: "excited", emoji: "🤩", label: "Excited" },
  { value: "good", emoji: "😊", label: "Good" },
  { value: "neutral", emoji: "😐", label: "Neutral" },
  { value: "low", emoji: "🙁", label: "Low" },
  { value: "sad", emoji: "😞", label: "Sad" },
];

export function LogProgressForm({
  attemptId,
  accentClassName,
}: {
  attemptId: string;
  accentClassName: string;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedMood, setSelectedMood] = useState("neutral");
  const [state, formAction, isPending] = useActionState(
    logProgress,
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
    <form ref={formRef} action={formAction} className="mt-4 grid gap-2">
      <input type="hidden" name="attemptId" value={attemptId} />
      <input type="hidden" name="mood" value={selectedMood} />
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

      <div className="grid gap-1.5 text-sm text-slate-700">
        <span className="font-medium">Mood</span>
        <div className="grid grid-cols-5 gap-2">
          {moodOptions.map((option) => {
            const isSelected = selectedMood === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelectedMood(option.value)}
                className={`ios-button flex flex-col items-center gap-1 px-2 py-3 text-center transition ${
                  isSelected
                    ? "bg-[linear-gradient(135deg,#8bb6ff,#8e88ff_58%,#f2c96d)] text-slate-950"
                    : "border border-[rgba(160,177,217,0.28)] bg-white/90 text-slate-700"
                }`}
                aria-pressed={isSelected}
                title={option.label}
              >
                <span className="text-xl leading-none">{option.emoji}</span>
                <span className="text-[11px] font-medium">{option.label}</span>
              </button>
            );
          })}
        </div>
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
        type="submit"
        name="delta"
        value={1}
        disabled={isPending}
        className="ios-button border border-[rgba(160,177,217,0.28)] bg-white/90 px-4 py-2.5 text-sm font-semibold text-slate-800 disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Save mood and +1"}
      </button>
    </form>
  );
}
