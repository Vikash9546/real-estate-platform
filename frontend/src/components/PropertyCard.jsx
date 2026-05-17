import { useState } from "react";
import { Link } from "react-router-dom";
import { addToWishlist } from "../api/wishlistApi";

const defaultImages = [
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1628113426177-baae051ef40d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=800&q=80"
];

const getSeededImage = (id = "") => {
  const hash = String(id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return defaultImages[hash % defaultImages.length];
};

export default function PropertyCard({ property }) {
  const [adding, setAdding] = useState(false);

  const handleAddToWishlist = async (e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();

    try {
      setAdding(true);
      await addToWishlist(property.id);
      alert("Added to wishlist! ❤️");
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to add";
      if (msg.includes("Already")) {
        alert("This property is already in your wishlist!");
      } else if (msg.includes("token") || err.response?.status === 401) {
        alert("Please log in to add this property to your wishlist");
      } else {
        alert(msg);
      }
    } finally {
      setAdding(false);
    }
  };

  const isNew = new Date(property.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const imageUrl =
    property.image?.[0] ||
    property.imageUrl ||
    getSeededImage(property.id || property.title);

  const translateType = (type) => {
    switch (String(type).toLowerCase()) {
      case "apartment": return "Apartment";
      case "house": return "Villa / House";
      case "commercial": return "Commercial Property";
      case "villa": return "Luxury Villa";
      default: return type;
    }
  };

  return (
    <div className="group relative rounded-[28px] border border-[#E6C594]/20 bg-[#FDFBF9] hover:bg-[#F9F6F0] shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col h-full p-4">
      
      {/* Image Container */}
      <Link to={`/property/${property.id}`} className="relative overflow-hidden w-full pt-[75%] rounded-[20px] block">
        <img
          src={imageUrl}
          alt={property.title}
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        
        {/* Hover overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E140F]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#1E140F]/80 text-[#E6C594] backdrop-blur-md shadow-sm">
            {property.city || "Jaipur"}
          </span>
          {isNew && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#E6C594] text-[#1E140F] shadow-sm font-sans">
              NEW
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleAddToWishlist}
          disabled={adding}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-[#1E140F] hover:text-red-500 hover:bg-white shadow-md transition-all z-10 scale-90 group-hover:scale-100 duration-300"
          title="Add to Wishlist"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.691 2.25 5.353 4.681 3 8 3c1.252 0 2.53.435 3.548 1.385C12.597 3.435 13.875 3 15.125 3c3.319 0 5.75 2.353 5.75 5.691 0 3.483-2.437 6.67-4.739 8.812a25.181 25.181 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
        </button>
      </Link>

      {/* Content */}
      <div className="pt-5 px-1 flex flex-col flex-1">
        <div className="flex-1">
          
          {/* Card Title */}
          <Link to={`/property/${property.id}`} className="block">
            <h3 className="font-serif font-medium text-[22px] leading-tight text-[#2A1E17] line-clamp-1 group-hover:text-[#B39359] transition-colors duration-300">
              {property.title}
            </h3>
          </Link>
          
          {/* Subtitle specifications */}
          <p className="text-xs text-[#807268] mt-1 font-light tracking-wide">
            {translateType(property.type)} • {property.bedrooms ? `${property.bedrooms} Beds` : "Open Layout"} • {property.area || 1200} sqft • {property.furnished ? "Furnished" : "Unfurnished"}
          </p>

          {/* Location details */}
          <p className="text-[11px] text-[#A6978E] mt-3 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#B39359]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{property.address || "Address on Request"}</span>
          </p>

        </div>

        {/* Price & Action Button Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#E6C594]/15">
          <div>
            <p className="text-[9px] text-[#A6978E] font-medium uppercase tracking-[0.15em]">Asking Price</p>
            <p className="text-lg font-serif font-bold text-[#1E140F] mt-0.5">
              from ₹{Number(property.price).toLocaleString("en-IN")} {property.listingType === "RENT" ? " / mo" : ""}
            </p>
          </div>

          <Link 
            to={`/property/${property.id}`}
            className="w-10 h-10 rounded-full bg-[#1E140F] hover:bg-[#E6C594] text-white hover:text-[#1E140F] flex items-center justify-center transition-all duration-300 shadow-md group-hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

      </div>
    </div>
  );
}
