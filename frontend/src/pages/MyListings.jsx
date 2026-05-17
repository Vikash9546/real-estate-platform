import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { deleteProperty, getOwnerProperties } from "../api/propertyApi";
import { useNavigate } from "react-router-dom";

export default function MyListings() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [propertyToDelete, setPropertyToDelete] = useState(null);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await getOwnerProperties();
      setListings(res.data);
    } catch (err) {
      console.log(err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDeleteClick = (id, title) => {
    setPropertyToDelete({ id, title });
  };

  const confirmDelete = async () => {
    if (!propertyToDelete) return;

    try {
      setDeleteLoading(propertyToDelete.id);
      await deleteProperty(propertyToDelete.id);
      setListings(listings.filter(p => p.id !== propertyToDelete.id));
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to delete property");
    } finally {
      setDeleteLoading(null);
      setPropertyToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2A1E17] font-sans antialiased flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-7xl mx-auto px-6 py-12 sm:px-8 mt-16">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-8 border-b border-[#E6C594]/20 gap-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B39359]">Member Area</span>
              <h1 className="text-4xl md:text-5xl font-serif font-light text-[#1E140F] mt-1">My Managed Assets</h1>
              <p className="text-xs text-[#807268] font-light mt-2">
                Manage, edit parameters, and inspect inquiries on your active architectural portfolio
              </p>
            </div>
            {!loading && listings.length > 0 && (
              <button
                onClick={() => navigate("/owner/add-property")}
                className="bg-[#1E140F] hover:bg-[#B39359] text-white rounded-full px-8 py-3 text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm whitespace-nowrap"
              >
                + Add New Property
              </button>
            )}
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="flex justify-center items-center py-20 animate-pulse">
              <div className="w-10 h-10 rounded-full border-2 border-t-transparent border-[#B39359] animate-spin"></div>
            </div>
          ) : listings.length === 0 ? (
            
            /* Empty State */
            <div className="text-center py-20 max-w-xl mx-auto">
              <div className="bg-white rounded-[32px] border border-[#E6C594]/25 p-12 shadow-sm space-y-4">
                <div className="text-5xl">🏰</div>
                <h3 className="text-xl font-serif font-light text-[#1E140F]">No Active Listings</h3>
                <p className="text-xs text-[#807268] font-light leading-relaxed px-4">
                  You have not published any architectural listings on the EstateX platform yet. Post your property now to receive bespoke curations.
                </p>
                <button
                  onClick={() => navigate("/owner/add-property")}
                  className="bg-[#1E140F] hover:bg-[#B39359] text-white rounded-full px-8 py-3 text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm mt-4"
                >
                  Add Your First Property
                </button>
              </div>
            </div>

          ) : (
            
            /* Property list vertical grid */
            <div className="grid grid-cols-1 gap-6">
              {listings.map((property) => (
                <div
                  key={property.id}
                  className="bg-white rounded-[28px] border border-[#E6C594]/25 overflow-hidden shadow-sm transition-all duration-300 hover:border-[#1E140F] p-8"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    
                    {/* Left Info block */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#B39359]">{property.type || "Masterpiece"}</span>
                        <h3 className="text-2xl font-serif font-light text-[#1E140F] mt-0.5">
                          {property.title}
                        </h3>
                      </div>

                      <div className="flex flex-wrap items-center gap-6 text-xs text-[#807268] font-light">
                        <span className="flex items-center gap-1.5">
                          <span>📍</span> {property.city}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span>🛏️</span> {property.bedrooms} BHK
                        </span>
                        <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                          <span>📈</span> {property._count?.inquiries || 0} Inquiries received
                        </span>
                      </div>

                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-serif font-light text-[#1E140F]">₹{property.price.toLocaleString()}</span>
                        <span className="text-xs text-[#807268] font-light">/ month</span>
                      </div>

                      <div className="text-[10px] text-[#A6978E] font-light uppercase tracking-widest pt-2">
                        Published {new Date(property.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Right actions block */}
                    <div className="flex sm:flex-row md:flex-col gap-3 w-full md:w-auto">
                      <button
                        onClick={() => navigate(`/property/${property.id}`)}
                        className="w-full border border-[#E6C594]/30 hover:border-[#1E140F] text-[#1E140F] hover:bg-[#FAF8F5] rounded-full py-2.5 px-6 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center whitespace-nowrap"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleDeleteClick(property.id, property.title)}
                        disabled={deleteLoading === property.id}
                        className="w-full border border-red-200 hover:border-red-500 text-red-600 hover:bg-red-50 rounded-full py-2.5 px-6 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        {deleteLoading === property.id ? "Archiving..." : "Archive List"}
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>

          )}
        </main>
      </div>

      {/* Exquisite custom confirmation modal */}
      {propertyToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#1E140F]/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[32px] border border-[#E6C594]/35 w-full max-w-md p-8 space-y-6 shadow-xl">
            <h3 className="text-2xl font-serif font-light text-[#1E140F]">Archive Listing?</h3>
            <p className="text-xs text-[#807268] leading-relaxed font-light">
              Are you certain you want to archive and delete <span className="font-semibold text-[#1E140F]">"{propertyToDelete.title}"</span>? This will permanently sever all tenant inquiry links.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setPropertyToDelete(null)}
                className="px-6 py-2.5 border border-[#E6C594]/30 hover:border-[#1E140F] text-[#1E140F] hover:bg-[#FAF8F5] rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 shadow-sm"
              >
                Archive Property
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
