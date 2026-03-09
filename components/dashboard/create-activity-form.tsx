import { createActivity } from "@/app/dashboard/actions";

export function CreateActivityForm() {
  return (
    <form action={createActivity} className="grid gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm text-slate-700">
          <span className="font-medium">Title</span>
          <input
            name="title"
            required
            placeholder="Water, Walk, Cigarettes..."
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
          />
        </label>
        <label className="grid gap-1.5 text-sm text-slate-700">
          <span className="font-medium">Unit</span>
          <input
            name="unit"
            required
            placeholder="glasses, km, reps, cigs"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
          />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm text-slate-700">
          <span className="font-medium">Intent</span>
          <select
            name="intent"
            defaultValue="good"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
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
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
          />
        </label>
      </div>

      <button className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">
        Create activity and first attempt
      </button>
    </form>
  );
}
