import React, { useEffect, useMemo, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import FiltersAside from "../components/FiltersAside";
import PropertyCard from "../components/PropertyCard";
import PropertySkeleton from "../components/PropertySkeleton";
import Button from "../components/Button";
import { getAllProperties } from "../api/propertyApi";
import Footer from "../components/Footer";
import ContactModal from "../components/ContactModal";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const resultsRef = useRef(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(true);

  const [data, setData] = useState({
    total: 0,
    page: 1,
    limit: 6,
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
    return Math.ceil((data.total || 0) / (data.limit || 6));
  }, [data.total, data.limit]);

  const fetchProperties = async (page = 1, limit = data.limit, queryText = searchText, typeFilter = "") => {
    try {
      setLoading(true);
      const res = await getAllProperties({
        page,
        limit,
        search: queryText,
        city: filters.city,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        bedrooms: filters.bedrooms,
        furnished: filters.furnished,
        sort: filters.sort,
        type: typeFilter,
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

  const applyFilters = () => {
    fetchProperties(1, data.limit);
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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
    setTimeout(() => {
      fetchProperties(1, data.limit, "");
    }, 0);
  };

  const goToPage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchProperties(newPage, data.limit);
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      const start = Math.max(2, data.page - 1);
      const end = Math.min(totalPages - 1, data.page + 1);
      if (start > 2) {
        pageNumbers.push("ellipsis-1");
      }
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      if (end < totalPages - 1) {
        pageNumbers.push("ellipsis-2");
      }
      pageNumbers.push(totalPages);
    }
    return pageNumbers;
  };

  const handleCategoryClick = (categoryName, typeValue) => {
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    fetchProperties(1, data.limit, "", typeValue);
  };

  const handleConsultationSubmit = (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      alert("Please enter a valid phone number!");
      return;
    }
    if (!consent) {
      alert("You must agree to the processing of personal data!");
      return;
    }
    alert(`Request submitted successfully! Our senior estate advisor will reach back to you at ${phone} shortly to organize your private tour. Thank you! 🌟`);
    setPhone("");
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2A1E17] font-sans antialiased">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex flex-col justify-between pt-32 pb-16 bg-[#120B08] overflow-hidden">
        {/* Luxury home background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
            alt="EstateX Architectural Masterpiece Estate"
            className="w-full h-full object-cover opacity-50"
          />
          {/* Moody warm gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-[#120B08]/60 to-[#120B08]/90"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 flex-1 flex flex-col justify-center">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-5xl md:text-7xl font-serif font-light text-white leading-[1.1] tracking-wide animate-fade-in">
              Spaces, <br />
              that define the <br />
              <span className="italic font-normal text-[#E6C594]">shape</span> of your life
            </h1>
            <p className="max-w-xl text-[#D9D2C9] text-sm md:text-base font-light leading-relaxed tracking-wide animate-slide-up pl-1 border-l border-[#E6C594]/30" style={{ animationDelay: '0.15s' }}>
              A curated collection of architectural masterpieces and luxury estates. Discover a seamless experience to buy, sell, or rent your dream home or commercial space.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-start gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              {/* Premium Pill Catalog Scroll Button */}
              <button
                onClick={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })}
                className="group flex items-center justify-between gap-6 bg-[#E6C594] hover:bg-white text-[#120B08] rounded-full pl-8 pr-3 py-3 font-medium uppercase tracking-[0.15em] text-xs transition-all duration-300 shadow-xl shadow-[#E6C594]/10"
              >
                Explore Estates
                <span className="w-8 h-8 rounded-full bg-[#120B08] text-white flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 Trust Badges Bar */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-8 mt-16">
          <div className="border-t border-[#E6C594]/30 pt-8 flex flex-col md:flex-row gap-6 md:gap-12">
            
            <div className="flex items-center gap-3">
              <span className="text-xl">🏰</span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1E140F]">Curated Estates</p>
                <p className="text-[10px] text-[#594B41] font-light mt-0.5">Architect-designed homes, historic villas, and luxury penthouses</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xl">🤝</span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1E140F]">Seamless Transactions</p>
                <p className="text-[10px] text-[#594B41] font-light mt-0.5">Direct communication with verified owners and transparent inquiries</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xl">🌿</span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1E140F]">Sustainable Living</p>
                <p className="text-[10px] text-[#594B41] font-light mt-0.5">Eco-friendly architectures, solar integrations, and smart standards</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Our Heritage Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8">
        <div className="bg-[#F6F3ED] rounded-[36px] overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-10 p-8 sm:p-12 items-center">
          
          {/* Left Crafting Image */}
          <div className="lg:col-span-5 h-[340px] lg:h-[400px] rounded-[24px] overflow-hidden relative shadow-md">
            <img
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"
              alt="Luxury modern estate pool terrace"
              className="w-full h-full object-cover"
            />
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-[#E6C594]/5 mix-blend-multiply"></div>
          </div>

          {/* Right Text Content */}
          <div className="lg:col-span-7 space-y-6 lg:pl-6">
            <h2 className="text-4xl md:text-5xl font-serif font-light text-[#1E140F]">
              Our Heritage
            </h2>
            <p className="text-[#594B41] font-light text-sm md:text-base leading-relaxed tracking-wide">
              EstateX is a premier real estate platform dedicated to connecting discerning buyers and tenants with architectural masterpieces. Built on a foundation of trust, aesthetic excellence, and white-glove service, we curate properties that represent the pinnacle of design, construction, and lifestyle. Every listing is verified, and every detail scrutinized.
            </p>
          </div>

        </div>
      </section>

      {/* Architectural Categories Section */}
      <section id="catalog" className="py-16 max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-[#1E140F]">
              Portfolio Showcases
            </h2>
            <p className="text-xs text-[#807268] uppercase tracking-[0.2em] mt-2">Select a class to filter our active listings</p>
          </div>
          <button
            onClick={() => handleCategoryClick("All Estates", "")}
            className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B39359] hover:text-[#1E140F] transition-colors"
          >
            Explore All Listings
            <span className="text-sm">→</span>
          </button>
        </div>

        {/* 4 Curation category cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Apartments */}
          <div 
            onClick={() => handleCategoryClick("apartment", "apartment")}
            className="group cursor-pointer rounded-[24px] border border-[#E6C594]/20 bg-white p-4 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full"
          >
            <div className="overflow-hidden rounded-[16px] aspect-video w-full relative">
              <img
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80"
                alt="Architectural Luxury Apartment"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="pt-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif font-semibold text-lg text-[#1E140F]">Modern Apartments</h3>
                <p className="text-[11px] text-[#807268] mt-1 font-light">High ceilings, open layouts, skyline views</p>
              </div>
              <div className="flex items-center justify-between mt-6 pt-2 border-t border-[#FAF8F5]">
                <p className="text-xs font-bold text-[#B39359]">from ₹120,000 / mo</p>
                <span className="w-7 h-7 rounded-full bg-[#1E140F]/10 text-[#1E140F] flex items-center justify-center group-hover:bg-[#1E140F] group-hover:text-white transition-colors duration-300 text-xs">
                  →
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Villas */}
          <div 
            onClick={() => handleCategoryClick("villa", "villa")}
            className="group cursor-pointer rounded-[24px] border border-[#E6C594]/20 bg-white p-4 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full"
          >
            <div className="overflow-hidden rounded-[16px] aspect-video w-full relative">
              <img
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80"
                alt="Elite Luxury Villa"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="pt-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif font-semibold text-lg text-[#1E140F]">Luxury Villas</h3>
                <p className="text-[11px] text-[#807268] mt-1 font-light">Infinity pools, glass structures, private gardens</p>
              </div>
              <div className="flex items-center justify-between mt-6 pt-2 border-t border-[#FAF8F5]">
                <p className="text-xs font-bold text-[#B39359]">from ₹289,000 / mo</p>
                <span className="w-7 h-7 rounded-full bg-[#1E140F]/10 text-[#1E140F] flex items-center justify-center group-hover:bg-[#1E140F] group-hover:text-white transition-colors duration-300 text-xs">
                  →
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Houses */}
          <div 
            onClick={() => handleCategoryClick("house", "house")}
            className="group cursor-pointer rounded-[24px] border border-[#E6C594]/20 bg-white p-4 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full"
          >
            <div className="overflow-hidden rounded-[16px] aspect-video w-full relative">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
                alt="Classic Country House"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="pt-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif font-semibold text-lg text-[#1E140F]">Exclusive Houses</h3>
                <p className="text-[11px] text-[#807268] mt-1 font-light">Slate roofs, custom woodwork, private acreage</p>
              </div>
              <div className="flex items-center justify-between mt-6 pt-2 border-t border-[#FAF8F5]">
                <p className="text-xs font-bold text-[#B39359]">from ₹210,000 / mo</p>
                <span className="w-7 h-7 rounded-full bg-[#1E140F]/10 text-[#1E140F] flex items-center justify-center group-hover:bg-[#1E140F] group-hover:text-white transition-colors duration-300 text-xs">
                  →
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: Commercial */}
          <div 
            onClick={() => handleCategoryClick("commercial", "commercial")}
            className="group cursor-pointer rounded-[24px] border border-[#E6C594]/20 bg-white p-4 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full"
          >
            <div className="overflow-hidden rounded-[16px] aspect-video w-full relative">
              <img
                src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80"
                alt="Premium Commercial Office Hub"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="pt-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif font-semibold text-lg text-[#1E140F]">Commercial Spaces</h3>
                <p className="text-[11px] text-[#807268] mt-1 font-light">Office hubs, retail locations, creative lofts</p>
              </div>
              <div className="flex items-center justify-between mt-6 pt-2 border-t border-[#FAF8F5]">
                <p className="text-xs font-bold text-[#B39359]">from ₹350,000 / mo</p>
                <span className="w-7 h-7 rounded-full bg-[#1E140F]/10 text-[#1E140F] flex items-center justify-center group-hover:bg-[#1E140F] group-hover:text-white transition-colors duration-300 text-xs">
                  →
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Concierge Bespoke Acquisition Banner */}
      <section className="py-20 relative bg-[#1A110C] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80"
            alt="Luxury Architect blueprints"
            className="w-full h-full object-cover opacity-15 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A110C] via-[#1A110C]/90 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-serif font-light text-white leading-tight">
              Acquire Your <br />
              Bespoke Space
            </h2>
            <p className="text-[#C4B7AE] font-light text-sm md:text-base leading-relaxed">
              Our elite concierge team partners with world-renowned architects, interior consultants, and developers to build or source custom estates tailored entirely to your lifestyle, dimensions, and aesthetic desires. From site scouting to staging — we govern everything.
            </p>
            
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="group flex items-center gap-4 bg-[#FAF8F5] hover:bg-[#E6C594] text-[#1E140F] rounded-full pl-6 pr-2 py-2.5 font-medium uppercase tracking-[0.15em] text-xs transition-all duration-300"
            >
              Order Bespoke Acquisition
              <span className="w-8 h-8 rounded-full bg-[#1E140F] text-white flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 text-xs">
                →
              </span>
            </button>
          </div>

          {/* Process flow */}
          <div className="space-y-6 border-l border-[#FAF8F5]/10 pl-6 sm:pl-10">
            
            <div className="flex gap-4">
              <span className="w-10 h-10 rounded-full border border-[#FAF8F5]/10 flex items-center justify-center text-[#E6C594] text-xs shrink-0 bg-[#FAF8F5]/5">
                01
              </span>
              <div>
                <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Architectural Consultation & Survey</h4>
                <p className="text-xs text-[#A6978E] font-light mt-1 leading-relaxed">We analyze your geographical, spatial, and visual desires to draft a custom property curation brief.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="w-10 h-10 rounded-full border border-[#FAF8F5]/10 flex items-center justify-center text-[#E6C594] text-xs shrink-0 bg-[#FAF8F5]/5">
                02
              </span>
              <div>
                <h4 className="text-sm font-semibold text-white tracking-wider uppercase">3D Spatial & Landscape Design</h4>
                <p className="text-xs text-[#A6978E] font-light mt-1 leading-relaxed">Generate full-scale immersive virtual blueprints and photorealistic exterior/interior architectural renders.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="w-10 h-10 rounded-full border border-[#FAF8F5]/10 flex items-center justify-center text-[#E6C594] text-xs shrink-0 bg-[#FAF8F5]/5">
                03
              </span>
              <div>
                <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Turnkey Delivery & Handover</h4>
                <p className="text-xs text-[#A6978E] font-light mt-1 leading-relaxed">Coordinate structural builds, legal acquisitions, dynamic smart integrations, and high-end staging for seamless handover.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* House & Properties Catalog Section */}
      <section ref={resultsRef} className="py-24 bg-[#F6F3ED] border-y border-[#E6C594]/10 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B39359]">Our Exclusive Portfolio</span>
              <h2 className="text-4xl md:text-5xl font-serif font-light text-[#1E140F] mt-1">
                Elite Real Estate
              </h2>
              <p className="text-xs text-[#807268] mt-2 font-light">
                Found {data.properties.length} of {data.total} exclusive offers
              </p>
            </div>

            {/* Custom Limit and Sort selector */}
            <div className="flex items-center gap-4 bg-white rounded-full px-4 py-2 border border-[#E6C594]/20 shadow-sm">
              <span className="text-xs text-[#807268]">Show:</span>
              <select
                value={data.limit}
                onChange={(e) => fetchProperties(1, Number(e.target.value))}
                className="bg-transparent border-none text-xs font-semibold text-[#1E140F] outline-none cursor-pointer"
              >
                <option value={6}>6</option>
                <option value={9}>9</option>
                <option value={12}>12</option>
              </select>
            </div>
          </div>

          {/* Premium search bar */}
          <div className="mb-10 p-3 bg-white rounded-[24px] border border-[#E6C594]/20 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search by city, neighborhood, estate, or architectural style..."
                className="flex-1 bg-transparent px-4 py-3 text-sm text-[#1E140F] placeholder-[#A6978E] focus:outline-none"
                onKeyDown={(e) => e.key === 'Enter' && fetchProperties(1, data.limit)}
              />
              <button
                onClick={() => fetchProperties(1, data.limit)}
                className="bg-[#1E140F] hover:bg-[#B39359] text-white rounded-full px-8 py-3 text-xs font-semibold uppercase tracking-wider transition-all duration-300"
              >
                Search
              </button>
            </div>
          </div>

          {/* Filter Aside + Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <FiltersAside
              filters={filters}
              setFilters={setFilters}
              onApply={applyFilters}
              onClear={clearFilters}
            />

            <main className="lg:col-span-9">
              {/* Properties Grid */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: data.limit }).map((_, i) => (
                    <PropertySkeleton key={i} />
                  ))}
                </div>
              ) : data.properties.length === 0 ? (
                <div className="rounded-[32px] border border-dashed border-[#E6C594]/40 bg-white p-16 text-center">
                  <div className="text-5xl mb-4 text-[#B39359]">🏰</div>
                  <h3 className="text-xl font-serif font-medium text-[#1E140F]">
                    No Properties Found
                  </h3>
                  <p className="text-[#807268] text-xs font-light mt-2 max-w-sm mx-auto">
                    We couldn't find any properties matching these parameters. Try adjusting filters or resetting search.
                  </p>
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="mt-6 !rounded-full !px-6 border-[#E6C594]/40 text-[#1E140F] hover:bg-[#FAF8F5]"
                  >
                    Reset All Filters
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
                <div className="flex items-center justify-center gap-3 mt-16 flex-wrap">
                  <button
                    onClick={() => goToPage(data.page - 1)}
                    disabled={data.page === 1}
                    className="group flex items-center justify-center w-10 h-10 rounded-full border border-[#E6C594]/30 hover:border-[#1E140F] text-[#1E140F] hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-all duration-300"
                    aria-label="Previous Page"
                  >
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <div className="flex items-center gap-1.5 bg-white rounded-full p-1.5 border border-[#E6C594]/20">
                    {getPageNumbers().map((p, idx) => {
                      if (typeof p === "string" && p.startsWith("ellipsis")) {
                        return (
                          <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-xs font-light text-[#807268] select-none">
                            •••
                          </span>
                        );
                      }
                      return (
                        <button
                          key={p}
                          onClick={() => goToPage(p)}
                          className={`w-9 h-9 rounded-full text-xs font-bold transition-all duration-300 ${data.page === p
                            ? "bg-[#1E140F] text-white shadow-md shadow-[#1E140F]/15 scale-105"
                            : "text-[#807268] hover:bg-[#FAF8F5] hover:text-[#1E140F] hover:scale-105"
                            }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => goToPage(data.page + 1)}
                    disabled={data.page === totalPages}
                    className="group flex items-center justify-center w-10 h-10 rounded-full border border-[#E6C594]/30 hover:border-[#1E140F] text-[#1E140F] hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-all duration-300"
                    aria-label="Next Page"
                  >
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </main>
          </div>

        </div>
      </section>

      {/* Blog & News ("Блог и новости") Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B39359]">Our Journal</span>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-[#1E140F] mt-1">
              Journal & Insights
            </h2>
          </div>
          <a href="#" className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B39359] hover:text-[#1E140F] transition-colors">
            Read All Articles
            <span className="text-sm">→</span>
          </a>
        </div>

        {/* 3 Horizontal Blog Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Blog 1 */}
          <div className="group bg-white rounded-[24px] border border-[#E6C594]/15 overflow-hidden flex flex-col sm:flex-row lg:flex-col p-4 gap-4 hover:shadow-md transition-all duration-300">
            <div className="overflow-hidden rounded-[16px] aspect-video w-full sm:w-[220px] lg:w-full shrink-0">
              <img
                src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80"
                alt="House stairs design ideas"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex-1 flex flex-col justify-between py-2">
              <div>
                <p className="text-[10px] text-[#A6978E] font-medium tracking-wider uppercase">May 20, 2026</p>
                <h3 className="font-serif font-medium text-lg text-[#1E140F] mt-2 group-hover:text-[#B39359] transition-colors line-clamp-2 leading-snug">
                  How to Select Your Ideal Architectural Estate
                </h3>
              </div>
              <a href="#" className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-[#B39359] hover:text-[#1E140F] transition-colors mt-6">
                Read Article
                <span className="text-xs">→</span>
              </a>
            </div>
          </div>

          {/* Blog 2 */}
          <div className="group bg-white rounded-[24px] border border-[#E6C594]/15 overflow-hidden flex flex-col sm:flex-row lg:flex-col p-4 gap-4 hover:shadow-md transition-all duration-300">
            <div className="overflow-hidden rounded-[16px] aspect-video w-full sm:w-[220px] lg:w-full shrink-0">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
                alt="Modern luxury interior design"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex-1 flex flex-col justify-between py-2">
              <div>
                <p className="text-[10px] text-[#A6978E] font-medium tracking-wider uppercase">May 12, 2026</p>
                <h3 className="font-serif font-medium text-lg text-[#1E140F] mt-2 group-hover:text-[#B39359] transition-colors line-clamp-2 leading-snug">
                  Luxury Interior & Architectural Trends for 2026
                </h3>
              </div>
              <a href="#" className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-[#B39359] hover:text-[#1E140F] transition-colors mt-6">
                Read Article
                <span className="text-xs">→</span>
              </a>
            </div>
          </div>

          {/* Blog 3 */}
          <div className="group bg-white rounded-[24px] border border-[#E6C594]/15 overflow-hidden flex flex-col sm:flex-row lg:flex-col p-4 gap-4 hover:shadow-md transition-all duration-300">
            <div className="overflow-hidden rounded-[16px] aspect-video w-full sm:w-[220px] lg:w-full shrink-0">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80"
                alt="High value real estate investment insights"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex-1 flex flex-col justify-between py-2">
              <div>
                <p className="text-[10px] text-[#A6978E] font-medium tracking-wider uppercase">May 5, 2026</p>
                <h3 className="font-serif font-medium text-lg text-[#1E140F] mt-2 group-hover:text-[#B39359] transition-colors line-clamp-2 leading-snug">
                  Protecting Your Investment: High-Value Real Estate Insights
                </h3>
              </div>
              <a href="#" className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-[#B39359] hover:text-[#1E140F] transition-colors mt-6">
                Read Article
                <span className="text-xs">→</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Schedule a private tour Section */}
      <section id="consultation-form-section" className="py-16 max-w-7xl mx-auto px-6 sm:px-8">
        <div className="bg-[#F6F3ED] rounded-[36px] overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-10 p-8 sm:p-16 items-center border border-[#E6C594]/20 shadow-sm relative">
          
          {/* Left Decorative vase branches image */}
          <div className="hidden lg:block lg:col-span-5 h-[360px] rounded-[24px] overflow-hidden shadow-inner relative">
            <img
              src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
              alt="Luxury Vase and Dried Branches Decor"
              className="w-full h-full object-cover"
            />
            {/* Soft tint */}
            <div className="absolute inset-0 bg-[#E6C594]/10 mix-blend-color-burn"></div>
          </div>

          {/* Right Consultation Form */}
          <div className="lg:col-span-7 space-y-6 lg:pl-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-light text-[#1E140F]">
                Schedule a Private Tour
              </h2>
              <p className="text-xs text-[#807268] uppercase tracking-[0.2em] mt-2">Request a Free Portfolio Review & Consultation</p>
            </div>
            
            <p className="text-[#594B41] font-light text-sm leading-relaxed max-w-lg">
              Leave your phone number — our senior estate advisor will contact you to answer technical questions, curate a personalized portfolio of off-market properties, and schedule private viewings at your convenience.
            </p>

            <form onSubmit={handleConsultationSubmit} className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="tel"
                  required
                  placeholder="Your Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 bg-white rounded-full px-6 py-4 text-sm text-[#1E140F] border border-[#E6C594]/30 focus:outline-none focus:border-[#B39359] focus:ring-1 focus:ring-[#B39359] transition-all"
                />
                <button
                  type="submit"
                  className="bg-[#1E140F] hover:bg-[#B39359] text-white rounded-full px-10 py-4 text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-md shadow-[#1E140F]/15"
                >
                  Request Consultation
                </button>
              </div>

              {/* Consent check */}
              <div className="flex items-start gap-3 mt-4">
                <input
                  type="checkbox"
                  id="consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="w-4 h-4 rounded border-[#E6C594]/30 text-[#B39359] focus:ring-[#B39359] mt-0.5 cursor-pointer accent-[#B39359]"
                />
                <label htmlFor="consent" className="text-[11px] text-[#807268] font-light cursor-pointer select-none leading-normal">
                  I agree to the processing of my personal data in accordance with the <a href="#" className="underline text-[#B39359] hover:text-[#1E140F] transition-colors">Privacy Policy</a>.
                </label>
              </div>
            </form>
          </div>

        </div>
      </section>

      {/* Trust Ticker: Forbes, WSJ, Mansion Global, Bloomberg */}
      <section className="bg-[#FAF8F5] py-16 border-t border-[#E6C594]/15 overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#FAF8F5] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#FAF8F5] to-transparent z-10 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto text-center mb-8">
          <p className="text-[10px] font-bold tracking-[0.25em] text-[#807268] uppercase">FEATURED ON GLOBAL PUBLICATIONS</p>
        </div>

        <div className="w-full overflow-hidden">
          <div className="flex w-max animate-marquee opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500 hover:[animation-play-state:paused] gap-24 px-12 items-center">
            {[...Array(4)].map((_, i) => (
              <React.Fragment key={i}>
                <div className="text-xl font-serif font-black text-[#1E140F] tracking-widest">FORBES</div>
                <div className="text-xl font-sans font-bold text-[#1E140F] tracking-tighter">WSJ</div>
                <div className="text-xl font-serif font-light text-[#1E140F] tracking-wide">BLOOMBERG</div>
                <div className="text-xl font-serif font-semibold italic text-[#1E140F]">MANSION GLOBAL</div>
                <div className="text-xl font-sans font-black text-[#1E140F] tracking-wide">AD</div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Project Order Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        propertyId=""
        propertyTitle="Bespoke Design Project of Your Dream Architectural Estate"
        ownerId="69771de15dfedc7b59661c0d" // Seeds it to the default admin/owner
      />
    </div>
  );
}
