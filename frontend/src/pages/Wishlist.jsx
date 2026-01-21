import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import { getWishlist, removeFromWishlist } from "../api/wishlistApi";
import Button from "../components/Button";
import PropertyCard from "../components/PropertyCard";

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
        setMessage("Please login to view your wishlist.");
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
      setMessage("Please login to view your wishlist.");
      setFetching(false);
      return;
    }

    fetchWishlist();
  }, [user, loading]);

  const handleRemove = async (propertyId) => {
    try {
      if (window.confirm("Remove this property from wishlist?")) {
        await removeFromWishlist(propertyId);
        fetchWishlist();
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to remove");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">my Wishlist</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Saved properties you are interested in
          </p>
        </div>

        {fetching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
            <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
          </div>
        ) : message ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{message}</h3>
            {!user && (
              <Button onClick={() => window.location.href = '/login'} variant="primary" className="mt-4">
                Login Now
              </Button>
            )}
          </div>
        ) : wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dotted border-slate-300 dark:border-slate-700">
            <div className="text-4xl mb-4">🤍</div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Your wishlist is empty</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 mb-6">Start exploring properties to add them here.</p>
            <Button onClick={() => window.location.href = '/'} variant="outline">
              Browse Properties
            </Button>
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
                  className="absolute top-4 right-4 z-50 p-2 bg-white/90 text-red-500 rounded-full shadow-sm hover:bg-red-50 transition-colors"
                  title="Remove from wishlist"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
