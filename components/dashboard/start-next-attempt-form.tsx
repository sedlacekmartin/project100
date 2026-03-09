import { startNextAttempt } from "@/app/dashboard/actions";

export function StartNextAttemptForm({ activityId }: { activityId: string }) {
  return (
    <form action={startNextAttempt}>
      <input type="hidden" name="activityId" value={activityId} />
      <button className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800">
        Start next 100
      </button>
    </form>
  );
}
