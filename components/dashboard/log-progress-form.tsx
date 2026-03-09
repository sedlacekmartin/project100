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
            className={`ios-button px-4 py-2.5 text-sm font-semibold text-white ${accentClassName}`}
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
      <button
        type="submit"
        name="delta"
        value={1}
        className="ios-button border border-[rgba(160,177,217,0.28)] bg-white/90 px-4 py-2.5 text-sm font-semibold text-slate-800"
      >
        Save custom mood with +1
      </button>
    </form>
  );
}
