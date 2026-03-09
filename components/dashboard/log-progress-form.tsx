import { logProgress } from "@/app/dashboard/actions";

export function LogProgressForm({
  attemptId,
  accentClassName,
}: {
  attemptId: string;
  accentClassName: string;
}) {
  return (
    <form action={logProgress} className="mt-4 grid gap-2">
      <input type="hidden" name="attemptId" value={attemptId} />
      <div className="flex flex-wrap gap-2">
        {[1, 5, 10].map((delta) => (
          <button
            key={delta}
            type="submit"
            name="delta"
            value={delta}
            className={`rounded-xl px-3 py-2 text-sm font-semibold text-white ${accentClassName}`}
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
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
        />
      </label>
      <button
        type="submit"
        name="delta"
        value={1}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800"
      >
        Save custom mood with +1
      </button>
    </form>
  );
}
