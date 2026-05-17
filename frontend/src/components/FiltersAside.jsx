import React from "react";

export default function FiltersAside({ filters, setFilters, onApply, onClear }) {
  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const inputClasses = 
    "mt-2 w-full rounded-full border border-[#E6C594]/30 bg-[#FDFBF9] px-4 py-2.5 text-xs text-[#1E140F] placeholder-[#A6978E] focus:outline-none focus:border-[#B39359] focus:ring-1 focus:ring-[#B39359] transition-all duration-300";
  
  const labelClasses = 
    "text-[9px] font-bold uppercase tracking-[0.15em] text-[#807268]";

  // Custom premium gold chevron down arrow style for select boxes
  const selectStyle = {
    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23B39359' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
    backgroundPosition: 'right 16px center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '16px',
    paddingRight: '36px'
  };

  return (
    <aside className="lg:col-span-3">
      <div className="lg:sticky lg:top-28 rounded-[28px] border border-[#E6C594]/20 bg-white shadow-sm p-6 space-y-6">
        
        <div>
          <h2 className="text-2xl font-serif font-medium text-[#1E140F]">
            Parameters
          </h2>
          <p className="text-[11px] text-[#807268] font-light mt-1">
            Refine your search parameters
          </p>
        </div>

        {/* City */}
        <div>
          <label className={labelClasses}>City / Location</label>
          <input
            name="city"
            value={filters.city}
            onChange={handleChange}
            placeholder="e.g. Jaipur"
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
              placeholder="100000"
              className={inputClasses}
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <label className={labelClasses}>Bedrooms / BHK</label>
          <select
            name="bedrooms"
            value={filters.bedrooms}
            onChange={handleChange}
            style={selectStyle}
            className={`${inputClasses} appearance-none cursor-pointer`}
          >
            <option value="">Any Bedrooms</option>
            <option value="1">1 Bed (1 BHK)</option>
            <option value="2">2 Beds (2 BHK)</option>
            <option value="3">3 Beds (3 BHK)</option>
            <option value="4">4+ Beds (4+ BHK)</option>
          </select>
        </div>

        {/* Furnished */}
        <div>
          <label className={labelClasses}>Furnished</label>
          <select
            name="furnished"
            value={filters.furnished}
            onChange={handleChange}
            style={selectStyle}
            className={`${inputClasses} appearance-none cursor-pointer`}
          >
            <option value="">Any</option>
            <option value="true">Furnished</option>
            <option value="false">Unfurnished</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className={labelClasses}>Sort By</label>
          <select
            name="sort"
            value={filters.sort}
            onChange={handleChange}
            style={selectStyle}
            className={`${inputClasses} appearance-none cursor-pointer`}
          >
            <option value="newest">Newest Listed</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onApply}
            className="flex-1 bg-[#1E140F] hover:bg-[#B39359] text-white rounded-full py-2.5 text-[10px] font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm"
          >
            Apply
          </button>

          <button
            onClick={onClear}
            className="flex-1 border border-[#E6C594]/40 hover:border-[#1E140F] text-[#1E140F] rounded-full py-2.5 text-[10px] font-semibold uppercase tracking-wider hover:bg-[#FAF8F5] transition-all duration-300"
          >
            Reset
          </button>
        </div>
      </div>
    </aside>
  );
}
