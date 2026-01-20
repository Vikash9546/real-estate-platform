export default function SearchBar({ value, onChange, onSearch }) {
  return (
    <div className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex gap-3 items-center">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by city or title..."
          className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={onSearch}
          className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 text-sm font-semibold shadow-sm transition"
        >
          Search
        </button>
      </div>
    </div>
  );
}
