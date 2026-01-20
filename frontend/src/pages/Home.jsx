import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import FiltersAside from "../components/FiltersAside";
import PropertyCard from "../components/PropertyCard";
import PropertySkeleton from "../components/PropertySkeleton";
import Button from "../components/Button";
import { getAllProperties } from "../api/propertyApi";

export default function Home() {
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState({
    total: 0,
    page: 1,
    limit: 9, // changed to 9 for better grid layout (3x3)
    properties: [],
  });

  const [searchText, setSearchText] = useState("");

  const [filters, setFilters] = useState({
    city: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    furnished: "",
    sort: "newest",
  });

  const totalPages = useMemo(() => {
    return Math.ceil((data.total || 0) / (data.limit || 10));
  }, [data.total, data.limit]);

  const fetchProperties = async (page = 1, limit = data.limit) => {
    try {
      setLoading(true);

      const res = await getAllProperties({
        page,
        limit,
        search: searchText,
        city: filters.city,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        bedrooms: filters.bedrooms,
        furnished: filters.furnished,
        sort: filters.sort,
      });

      setData({
        total: res.data.total ?? 0,
        page: res.data.page ?? page,
        limit: res.data.limit ?? limit,
        properties: res.data.properties ?? [],
      });
    } catch (err) {
      console.log(err);
      setData((prev) => ({ ...prev, properties: [] }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(1, data.limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyFilters = () => fetchProperties(1, data.limit);

  const clearFilters = () => {
    setSearchText("");
    setFilters({
      city: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      furnished: "",
      sort: "newest",
    });
    setTimeout(() => fetchProperties(1, data.limit), 0);
  };

  const goToPage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchProperties(newPage, data.limit);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 font-sans">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Hero background"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 animate-fade-in">
            Find Your Dream <span className="text-primary-400">Home</span>
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-slate-300 mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Discover the perfect property from our wide selection of verified listings.
            Rent or buy with confidence and ease.
          </p>

          <div className="w-full max-w-3xl bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search by city, locality or property name..."
                className="flex-1 bg-white/95 border-0 rounded-xl px-5 py-3 text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-primary-500 outline-none"
                onKeyDown={(e) => e.key === 'Enter' && fetchProperties(1, data.limit)}
              />
              <Button
                onClick={() => fetchProperties(1, data.limit)}
                variant="primary"
                className="sm:w-auto w-full !px-8 !py-3 !text-base"
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <FiltersAside
            filters={filters}
            setFilters={setFilters}
            onApply={applyFilters}
            onClear={clearFilters}
          />

          <main className="lg:col-span-9">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Latest Listings
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Showing {data.properties.length} of {data.total} properties
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Show:
                </span>
                <select
                  value={data.limit}
                  onChange={(e) => fetchProperties(1, Number(e.target.value))}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value={6}>6</option>
                  <option value={9}>9</option>
                  <option value={12}>12</option>
                </select>
              </div>
            </div>

            {/* Cards */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: data.limit }).map((_, i) => (
                  <PropertySkeleton key={i} />
                ))}
              </div>
            ) : data.properties.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center">
                <div className="text-5xl mb-4">🏠</div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  No properties found
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                  We couldn't find any matches. Try adjusting your filters.
                </p>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="mt-6"
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.properties.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <Button
                  onClick={() => goToPage(data.page - 1)}
                  disabled={data.page === 1}
                  variant="outline"
                  className="!px-3"
                >
                  ←
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToPage(i + 1)}
                      className={`w-10 h-10 rounded-lg text-sm font-bold transition-colors ${data.page === i + 1
                        ? "bg-primary-600 text-white shadow-lg shadow-primary-500/30"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <Button
                  onClick={() => goToPage(data.page + 1)}
                  disabled={data.page === totalPages}
                  variant="outline"
                  className="!px-3"
                >
                  →
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
