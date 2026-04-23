interface RoomAgeFilterProps {
  minAge: string;
  maxAge: string;
  onMinAgeChange: (value: string) => void;
  onMaxAgeChange: (value: string) => void;
}

const RoomAgeFilter = ({
  minAge,
  maxAge,
  onMinAgeChange,
  onMaxAgeChange,
}: RoomAgeFilterProps) => (
  <div className="grid gap-3 md:grid-cols-2">
    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-slate-700">최소 나이</span>
      <input
        type="number"
        min="0"
        value={minAge}
        onChange={(event) => onMinAgeChange(event.target.value)}
        placeholder="예: 20"
        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
      />
    </label>
    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-slate-700">최대 나이</span>
      <input
        type="number"
        min="0"
        value={maxAge}
        onChange={(event) => onMaxAgeChange(event.target.value)}
        placeholder="예: 24"
        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
      />
    </label>
  </div>
);

export default RoomAgeFilter;
