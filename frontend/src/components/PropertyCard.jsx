import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import { addToWishlist } from "../api/wishlistApi";

export default function PropertyCard({ property }) {
  const [adding, setAdding] = useState(false);

  const handleAddToWishlist = async (e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();

    try {
      setAdding(true);
      await addToWishlist(property.id);
      alert("Added to your wishlist! ❤️");
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to add";
      if (msg.includes("Already")) {
        alert("This property is already in your wishlist!");
      } else if (msg.includes("token") || err.response?.status === 401) {
        alert("Please login to add to wishlist");
      } else {
        alert(msg);
      }
    } finally {
      setAdding(false);
    }
  };

  const imageUrl =
    property.imageUrl ||
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  return (
    <div className="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full">
      <Link to={`/property/${property.id}`} className="relative overflow-hidden w-full pt-[66%]">
        <img
          src={imageUrl}
          alt={property.title}
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-white/90 backdrop-blur-md text-slate-800 shadow-sm">
            {property.city || "Unknown City"}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3 flex gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-primary-600/90 backdrop-blur-md text-white shadow-sm">
            {property.status || "LIVE"}
          </span>
        </div>

        {/* Wishlist Button - Absolute positioned specifically for this card */}
        <button
          onClick={handleAddToWishlist}
          disabled={adding}
          className="absolute bottom-3 right-3 p-2 rounded-full bg-white/90 text-slate-400 hover:text-red-500 hover:bg-white shadow-sm transition-all z-10"
          title="Add to Wishlist"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.691 2.25 5.353 4.681 3 8 3c1.252 0 2.53.435 3.548 1.385C12.597 3.435 13.875 3 15.125 3c3.319 0 5.75 2.353 5.75 5.691 0 3.483-2.437 6.67-4.739 8.812a25.181 25.181 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
        </button>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1 mb-1 group-hover:text-primary-600 transition-colors">
            {property.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 mb-4">
            {property.address || "No address provided"}
          </p>

          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300 mb-4">
            <span className="flex items-center gap-1">
              <span className="text-lg">🛏</span> {property.bedrooms || 0} Beds
            </span>
            <span className="flex items-center gap-1">
              <span className="text-lg">🛁</span> {property.bathrooms || 0} Baths
            </span>
            <span className="flex items-center gap-1">
              <span className="text-lg">📏</span> {property.area || 1200} sqft
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-auto">
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Price</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              ₹{Number(property.price).toLocaleString()}
              <span className="text-sm font-normal text-slate-500">/mo</span>
            </p>
          </div>

          <Link to={`/property/${property.id}`}>
            <Button variant="primary" className="!rounded-lg !px-4 !py-2 text-sm">
              Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
