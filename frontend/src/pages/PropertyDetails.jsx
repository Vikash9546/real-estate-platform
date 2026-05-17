import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { getPropertyById } from "../api/propertyApi";
import { addToWishlist } from "../api/wishlistApi";
import Button from "../components/Button";
import ContactModal from "../components/ContactModal";
import Footer from "../components/Footer";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const res = await getPropertyById(id);
      setProperty(res.data);
    } catch (err) {
      console.log(err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const handleWishlist = async () => {
    try {
      await addToWishlist(id);
      alert("Added to wishlist! ❤️");
    } catch (err) {
      alert(err?.response?.data?.message || "Please log in to add this property to your wishlist.");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2A1E17] font-sans antialiased">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-12 animate-pulse mt-20">
        <div className="h-[450px] bg-[#E6C594]/10 rounded-[36px] mb-8"></div>
        <div className="h-8 w-1/3 bg-[#E6C594]/10 rounded-full mb-4"></div>
        <div className="h-4 w-1/2 bg-[#E6C594]/10 rounded-full mb-8"></div>
      </div>
    </div>
  );

  if (!property) return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2A1E17] font-sans antialiased flex flex-col justify-between">
      <div>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh] px-6">
          <div className="text-center space-y-4">
            <span className="text-5xl">🏰</span>
            <h2 className="text-3xl font-serif font-light text-[#1E140F]">Property Not Found</h2>
            <p className="text-[#807268] text-sm font-light">The luxury estate you are looking for does not exist or has been archived.</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 bg-[#1E140F] hover:bg-[#B39359] text-white rounded-full px-8 py-3 text-xs font-semibold uppercase tracking-wider transition-all duration-300"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

  const defaultImages = [
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1628113426177-baae051ef40d?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=1600&q=80"
  ];

  const getSeededImage = (id = "") => {
    const hash = String(id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return defaultImages[hash % defaultImages.length];
  };

  const imageUrl = property.image?.[0] || property.imageUrl || getSeededImage(property.id || property.title);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2A1E17] font-sans antialiased">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12 sm:px-8 mt-16">
        
        {/* Curved-3XL Banner Showcase */}
        <div className="w-full h-[400px] md:h-[520px] rounded-[36px] overflow-hidden shadow-md mb-10 relative border border-[#E6C594]/15">
          <img
            src={imageUrl}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          {/* Subtle warm layout shade */}
          <div className="absolute inset-0 bg-[#1E140F]/10 mix-blend-multiply"></div>
          
          <div className="absolute top-6 right-6">
            <span className="px-5 py-2 rounded-full bg-white/95 text-[#1E140F] font-bold text-xs uppercase tracking-widest shadow-sm border border-[#E6C594]/20">
              For {property.type === "commercial" ? "Lease" : "Rent"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Architectural Columns */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Title & Coordinates */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B39359]">{property.type || "Masterpiece"}</span>
              <h1 className="text-4xl md:text-5xl font-serif font-light text-[#1E140F] mt-1 leading-tight">
                {property.title}
              </h1>
              <p className="text-sm text-[#807268] font-light mt-3 flex items-center gap-2">
                <span className="text-[#B39359]">📍</span> {property.city} • {property.address}
              </p>
            </div>

            {/* Curated Spec Pillars */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              <div className="p-6 rounded-[24px] bg-white border border-[#E6C594]/25 flex flex-col items-center shadow-sm">
                <span className="text-2xl mb-2">🛏️</span>
                <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#807268] mb-1">Bedrooms</span>
                <span className="font-semibold text-sm text-[#1E140F]">{property.bedrooms} BHK</span>
              </div>

              <div className="p-6 rounded-[24px] bg-white border border-[#E6C594]/25 flex flex-col items-center shadow-sm">
                <span className="text-2xl mb-2">🚿</span>
                <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#807268] mb-1">Bathrooms</span>
                <span className="font-semibold text-sm text-[#1E140F]">{property.bathrooms || property.bedrooms || 1} Baths</span>
              </div>

              <div className="p-6 rounded-[24px] bg-white border border-[#E6C594]/25 flex flex-col items-center shadow-sm">
                <span className="text-2xl mb-2">📐</span>
                <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#807268] mb-1">Total Area</span>
                <span className="font-semibold text-sm text-[#1E140F]">{property.area || 1200} sqft</span>
              </div>

              <div className="p-6 rounded-[24px] bg-white border border-[#E6C594]/25 flex flex-col items-center shadow-sm">
                <span className="text-2xl mb-2">🛋️</span>
                <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#807268] mb-1">Furnishing</span>
                <span className="font-semibold text-sm text-[#1E140F]">{property.furnished ? "Furnished" : "Unfurnished"}</span>
              </div>

            </div>

            {/* Organic Amenities Block */}
            <div className="bg-white rounded-[28px] p-8 border border-[#E6C594]/25 shadow-sm space-y-6">
              <div>
                <h3 className="text-2xl font-serif font-light text-[#1E140F]">Estate Amenities</h3>
                <p className="text-[11px] text-[#807268] mt-1 font-light">Dynamic luxury accessories included in the contract</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {['WiFi', 'Parking', 'Pool', 'Gym', 'Security', 'Garden', 'AC', 'Elevator'].map(item => (
                  <div key={item} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-[#F6F3ED] border border-[#E6C594]/15 flex items-center justify-center group-hover:bg-[#1E140F] group-hover:text-white transition-colors duration-300">
                      <span className="text-lg">
                        {item === 'WiFi' ? '📶' : item === 'Parking' ? '🚗' : item === 'Pool' ? '🏊' : item === 'Gym' ? '🏋️' : item === 'Security' ? '🛡️' : item === 'Garden' ? '🌳' : item === 'AC' ? '❄️' : '🛗'}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-[#594B41]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Virtual 3D Tour Prompt */}
            <div 
              onClick={() => setIsContactModalOpen(true)}
              className="relative rounded-[28px] overflow-hidden h-48 group cursor-pointer border border-[#E6C594]/20 shadow-sm"
            >
              <img 
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80" 
                className="w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-700" 
                alt="3D Immersive Blueprints Tour" 
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#E6C594]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                  </svg>
                </div>
                <span className="font-serif font-light text-xl tracking-wider uppercase">Request 3D Blueprints Virtual Tour</span>
              </div>
            </div>

            {/* About Curation Text */}
            <div className="bg-white rounded-[28px] p-8 border border-[#E6C594]/25 shadow-sm space-y-4">
              <h3 className="text-2xl font-serif font-light text-[#1E140F]">Architectural Narrative</h3>
              <p className="text-[#594B41] font-light text-sm leading-relaxed whitespace-pre-line">
                {property.description || "No customized architectural description provided for this exclusive portfolio listing. Reach back to our senior concierge for comprehensive floor charts and timber specifications."}
              </p>
            </div>

          </div>

          {/* Right Parameters Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-white rounded-[28px] border border-[#E6C594]/25 p-8 space-y-6 shadow-sm">
              
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#807268] mb-1.5">Asking Rental Value</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-serif font-light text-[#1E140F]">₹{Number(property.price).toLocaleString()}</span>
                  <span className="text-xs text-[#807268] font-light">/ mo</span>
                </div>
              </div>

              <div className="space-y-3.5 pt-4 border-t border-[#E6C594]/20">
                {/* Contact Concierge Primary Button */}
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="group flex items-center justify-between gap-4 bg-[#1E140F] hover:bg-[#B39359] text-white rounded-full pl-6 pr-2 py-3 font-semibold uppercase tracking-wider text-[11px] transition-all duration-300 w-full shadow-sm"
                >
                  Contact Concierge
                  <span className="w-8 h-8 rounded-full bg-[#FAF8F5] text-[#1E140F] flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 text-xs">
                    →
                  </span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => navigate(`/chat/${property.ownerId}`)}
                    className="w-full border border-[#E6C594]/30 hover:border-[#1E140F] text-[#1E140F] rounded-full py-2.5 text-[10px] font-bold uppercase tracking-wider hover:bg-[#FAF8F5] transition-all duration-300 flex items-center justify-center gap-1.5"
                  >
                    💬 Chat
                  </button>
                  <button
                    onClick={handleWishlist}
                    className="w-full border border-[#E6C594]/30 hover:border-[#1E140F] text-[#1E140F] rounded-full py-2.5 text-[10px] font-bold uppercase tracking-wider hover:bg-[#FAF8F5] transition-all duration-300 flex items-center justify-center gap-1.5"
                  >
                    ❤️ Bookmark
                  </button>
                </div>

                <button
                  onClick={() => window.open(property.googleLocation || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address + ", " + property.city)}`, '_blank')}
                  className="w-full border border-[#E6C594]/30 hover:border-[#1E140F] text-[#807268] hover:text-[#1E140F] rounded-full py-2.5 text-[10px] font-bold uppercase tracking-wider hover:bg-[#FAF8F5] transition-all duration-300 flex items-center justify-center gap-1.5"
                >
                  📍 Open in Google Maps
                </button>
              </div>

              {/* Verified Trust Seal */}
              <div className="p-5 rounded-[20px] bg-[#F6F3ED] border border-[#E6C594]/15 space-y-2">
                <h4 className="font-semibold text-xs text-[#1E140F] flex items-center gap-2">
                  <span className="text-[#B39359] text-base">🛡️</span> Verified Portfolio Curation
                </h4>
                <p className="text-[10px] text-[#807268] font-light leading-relaxed">
                  This architectural masterpiece has been fully surveyed, cataloged, and audited by our legal consultants for title accuracy and woodwork tolerances.
                </p>
              </div>

            </div>
          </div>

        </div>
      </main>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        propertyId={id}
        propertyTitle={property.title}
        ownerId={property.ownerId}
      />

      <Footer />
    </div>
  );
}
