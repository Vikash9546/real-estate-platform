import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { createProperty } from "../api/propertyApi";
import { useNavigate } from "react-router-dom";

export default function AddProperty() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    city: "",
    address: "",
    area: "",
    bedrooms: 1,
    bathrooms: 1,
    googleLocation: "",
    imageUrl: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      await createProperty(
        {
          ...form,
          price: Number(form.price),
          area: Number(form.area) || 1000,
          bedrooms: Number(form.bedrooms),
          bathrooms: Number(form.bathrooms),
        },
        token
      );

      navigate("/owner/my-listings");
    } catch (err) {
      alert(err?.response?.data?.message || "Error creating property");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-[14px] border border-[#E6C594]/30 focus:border-[#1E140F] bg-white px-4 py-3 text-xs text-[#1E140F] placeholder-[#A6978E] outline-none transition-all duration-300";
  const labelClass = "block text-[10px] font-bold uppercase tracking-wider text-[#807268] mb-1.5";

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2A1E17] font-sans antialiased flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-3xl mx-auto px-6 py-12 sm:px-8 mt-16">
          <div className="bg-white rounded-[32px] border border-[#E6C594]/25 shadow-sm overflow-hidden">
            
            {/* Header Title */}
            <div className="p-8 border-b border-[#E6C594]/20 bg-[#F6F3ED]/40 text-center space-y-1">
              <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#B39359]">Owner Portfolio</span>
              <h2 className="text-3xl font-serif font-light text-[#1E140F]">Draft Luxury Listing</h2>
              <p className="text-xs text-[#807268] font-light">Publish an architectural asset to list it on the EstateX platform</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">

              <div className="space-y-6">
                
                <div>
                  <label className={labelClass}>Property Title</label>
                  <input
                    name="title"
                    placeholder="e.g. Minimalist glass penthouse with private botanical garden"
                    value={form.title}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>City Location</label>
                    <input
                      name="city"
                      placeholder="e.g. Jaipur"
                      value={form.city}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Monthly Rental Value (₹)</label>
                    <input
                      name="price"
                      type="number"
                      placeholder="e.g. 150000"
                      value={form.price}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Full Spatial Address</label>
                  <input
                    name="address"
                    placeholder="e.g. 45 Royal Boulevard, C-Scheme"
                    value={form.address}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Google Maps Location URL</label>
                  <input
                    name="googleLocation"
                    placeholder="Paste share link here"
                    value={form.googleLocation}
                    onChange={handleChange}
                    className={inputClass}
                    required
                    type="url"
                  />
                  <p className="mt-1.5 text-[10px] text-[#A6978E] font-light">Copy link from Google Maps &rarr; Share &rarr; Copy link.</p>
                </div>

                <div>
                  <label className={labelClass}>Total Architectural Area (Square Feet)</label>
                  <input
                    name="area"
                    type="number"
                    placeholder="e.g. 2400"
                    value={form.area}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Bedrooms</label>
                    <select
                      name="bedrooms"
                      value={form.bedrooms}
                      onChange={handleChange}
                      className={`${inputClass} appearance-none cursor-pointer`}
                    >
                      {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} BHK</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Bathrooms</label>
                    <select
                      name="bathrooms"
                      value={form.bathrooms}
                      onChange={handleChange}
                      className={`${inputClass} appearance-none cursor-pointer`}
                    >
                      {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} Baths</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Architectural Curation Narrative</label>
                  <textarea
                    name="description"
                    rows="4"
                    placeholder="Describe spatial aspects, materials (glass, timber, stone), solar orientation, and nearby neighborhood metrics."
                    value={form.description}
                    onChange={handleChange}
                    className={`${inputClass} py-3 h-32 resize-none`}
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-[#E6C594]/20 flex items-center justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-2.5 border border-[#E6C594]/30 hover:border-[#1E140F] text-[#1E140F] hover:bg-[#FAF8F5] rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex items-center justify-between gap-4 bg-[#1E140F] hover:bg-[#B39359] text-white rounded-full pl-6 pr-2 py-2.5 font-semibold uppercase tracking-wider text-[10px] transition-all duration-300 shadow-sm disabled:opacity-50"
                >
                  {loading ? "Publishing..." : "Publish Listing"}
                  <span className="w-7 h-7 rounded-full bg-[#FAF8F5] text-[#1E140F] flex items-center justify-center text-xs font-bold transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </button>
              </div>

            </form>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
