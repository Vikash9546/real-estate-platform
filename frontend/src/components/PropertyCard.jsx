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

  const isNew = new Date(property.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const imageUrl =
    property.image?.[0] ||
    property.imageUrl ||
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  return (
    <div className="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col h-full">
      <Link to={`/property/${property.id}`} className="relative overflow-hidden w-full pt-[66%]">
        <img
          src={imageUrl}
          alt={property.title}
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="absolute top-3 left-3 flex gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-slate-800 shadow-sm">
            {property.city || "Unknown City"}
          </span>
          {isNew && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-white shadow-sm">
              New
            </span>
          )}
        </div>



        {/* Wishlist Button */}
        <button
          onClick={handleAddToWishlist}
          disabled={adding}
          className="absolute bottom-3 right-3 p-2.5 rounded-full bg-white/95 text-slate-400 hover:text-red-500 hover:bg-white shadow-lg transition-all z-10 scale-90 group-hover:scale-100 duration-300"
          title="Add to Wishlist"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.691 2.25 5.353 4.681 3 8 3c1.252 0 2.53.435 3.548 1.385C12.597 3.435 13.875 3 15.125 3c3.319 0 5.75 2.353 5.75 5.691 0 3.483-2.437 6.67-4.739 8.812a25.181 25.181 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
        </button>
      </Link>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-tighter text-primary-600 dark:text-primary-400">
              {property.type} • {property.listingType}
            </span>
            <span className="text-[10px] font-medium text-slate-400">
              {new Date(property.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h3 className="font-bold text-xl text-slate-900 dark:text-white line-clamp-1 mb-1 group-hover:text-primary-600 transition-colors duration-300">
            {property.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 mb-5 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {property.address || "No address provided"}
          </p>

          <div className="grid grid-cols-3 gap-2 py-4 border-y border-slate-50 dark:border-slate-900 mb-5">
            <div className="text-center">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Beds</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{property.bedrooms || 0}</p>
            </div>
            <div className="text-center border-x border-slate-50 dark:border-slate-900">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Baths</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{property.bathrooms || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Sqft</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{property.area || 1200}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Price</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              ₹{Number(property.price).toLocaleString()}
              <span className="text-xs font-normal text-slate-500 lowercase ml-0.5">/mo</span>
            </p>
          </div>

          <Link to={`/property/${property.id}`}>
            <Button variant="primary" className="!rounded-xl !px-6 !py-2.5 text-sm font-bold shadow-lg shadow-primary-500/30">
              View
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
