import { startNextAttempt } from "@/app/dashboard/actions";

export function StartNextAttemptForm({ activityId }: { activityId: string }) {
  return (
    <form action={startNextAttempt}>
      <input type="hidden" name="activityId" value={activityId} />
      <button className="ios-button border border-[rgba(160,177,217,0.28)] bg-white/90 px-4 py-2.5 text-sm font-semibold text-slate-800">
        Start next 100
      </button>
    </form>
  );
}
