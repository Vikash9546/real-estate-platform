import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import { getWishlist, removeFromWishlist } from "../api/wishlistApi";
import Button from "../components/Button";
import PropertyCard from "../components/PropertyCard";
import Footer from "../components/Footer";

export default function Wishlist() {
  const { user, loading } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);
  const [message, setMessage] = useState("");
  const [fetching, setFetching] = useState(true);

  const fetchWishlist = async () => {
    try {
      setFetching(true);
      const res = await getWishlist();
      setWishlist(res.data);
      setMessage("");
    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong";
      if (msg.toLowerCase().includes("token")) {
        setMessage("Please login to view your bookmarked properties.");
      } else {
        setMessage(msg);
      }
      setWishlist([]);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setMessage("Please login to view your bookmarked properties.");
      setFetching(false);
      return;
    }

    fetchWishlist();
  }, [user, loading]);

  const handleRemove = async (propertyId) => {
    try {
      // Optimistic update
      setWishlist((prev) => prev.filter((item) => item.propertyId !== propertyId));
      await removeFromWishlist(propertyId);
      setTimeout(() => alert("Property removed from wishlist"), 100);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to remove property");
      fetchWishlist(); // Revert
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2A1E17] font-sans antialiased flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-7xl mx-auto px-6 py-12 sm:px-8 mt-16">
          
          {/* Editorial Header */}
          <div className="mb-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B39359]">Member Area</span>
            <h1 className="text-4xl md:text-5xl font-serif font-light text-[#1E140F] mt-1">My Curated Bookmarks</h1>
            <p className="text-xs text-[#807268] font-light mt-2">
              Saved architectural portfolios and premium residential structures
            </p>
          </div>

          {fetching ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              <div className="h-96 bg-[#E6C594]/10 rounded-[28px]"></div>
              <div className="h-96 bg-[#E6C594]/10 rounded-[28px]"></div>
            </div>
          ) : message ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[32px] border border-[#E6C594]/25 shadow-sm space-y-4">
              <div className="text-4xl">🔐</div>
              <h3 className="text-lg font-serif font-light text-[#1E140F]">{message}</h3>
              {!user && (
                <button
                  onClick={() => window.location.href = '/login'}
                  className="bg-[#1E140F] hover:bg-[#B39359] text-white rounded-full px-8 py-3 text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm mt-2"
                >
                  Login Now
                </button>
              )}
            </div>
          ) : wishlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[32px] border border-[#E6C594]/25 shadow-sm space-y-4 max-w-xl mx-auto">
              <div className="text-4xl">🤍</div>
              <h3 className="text-lg font-serif font-light text-[#1E140F]">Your Curation is Empty</h3>
              <p className="text-xs text-[#807268] font-light text-center px-6">
                Start discovering dream architectural villas, modern apartments, and lofts to bookmark them in your account.
              </p>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-[#1E140F] hover:bg-[#B39359] text-white rounded-full px-8 py-3 text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm mt-2"
              >
                Explore Properties
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((w) => (
                <div key={w.id} className="relative group">
                  {w.property ? (
                    <PropertyCard property={w.property} />
                  ) : (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl">Property Unavailable</div>
                  )}

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemove(w.propertyId);
                    }}
                    className="absolute top-4 right-4 z-[60] w-8 h-8 flex items-center justify-center bg-white text-red-500 rounded-full shadow-md hover:bg-red-50 hover:scale-110 transition-all font-bold border border-[#E6C594]/25"
                    title="Remove from Curation"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
