import Button from "./Button";

export default function FiltersAside({ filters, setFilters, onApply, onClear }) {
  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const inputClasses = "mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all";
  const labelClasses = "text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400";

  return (
    <aside className="lg:col-span-3">
      <div className="sticky top-24 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Filters
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Refine your property search
          </p>
        </div>

        {/* City */}
        <div>
          <label className={labelClasses}>City</label>
          <input
            name="city"
            value={filters.city}
            onChange={handleChange}
            placeholder="e.g. Pune"
            className={inputClasses}
          />
        </div>

        {/* Price */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClasses}>Min Price</label>
            <input
              name="minPrice"
              type="number"
              value={filters.minPrice}
              onChange={handleChange}
              placeholder="0"
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses}>Max Price</label>
            <input
              name="maxPrice"
              type="number"
              value={filters.maxPrice}
              onChange={handleChange}
              placeholder="50000"
              className={inputClasses}
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <label className={labelClasses}>Bedrooms</label>
          <select
            name="bedrooms"
            value={filters.bedrooms}
            onChange={handleChange}
            className={inputClasses}
          >
            <option value="">Any</option>
            <option value="1">1 BHK</option>
            <option value="2">2 BHK</option>
            <option value="3">3 BHK</option>
            <option value="4">4+ BHK</option>
          </select>
        </div>

        {/* Furnished */}
        <div>
          <label className={labelClasses}>Furnished</label>
          <select
            name="furnished"
            value={filters.furnished}
            onChange={handleChange}
            className={inputClasses}
          >
            <option value="">Any</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className={labelClasses}>Sort By</label>
          <select
            name="sort"
            value={filters.sort}
            onChange={handleChange}
            className={inputClasses}
          >
            <option value="newest">Newest Listed</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={onApply}
            variant="primary"
            className="flex-1"
          >
            Apply
          </Button>

          <Button
            onClick={onClear}
            variant="outline"
            className="flex-1"
          >
            Reset
          </Button>
        </div>
      </div>
    </aside>
  );
}
