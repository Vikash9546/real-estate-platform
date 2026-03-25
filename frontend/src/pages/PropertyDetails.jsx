import React, { useEffect, useState, useContext } from "react";
import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { getPropertyById } from "../api/propertyApi";
import { addToWishlist } from "../api/wishlistApi";
import Button from "../components/Button";
import ContactModal from "../components/ContactModal";
import { AuthContext } from "../context/AuthContext";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
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
      alert("Added to wishlist!");
    } catch (err) {
      alert(err?.response?.data?.message || "Login required");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl mb-8"></div>
        <div className="h-8 w-1/3 bg-slate-200 dark:bg-slate-800 rounded mb-4"></div>
        <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded mb-8"></div>
      </div>
    </div>
  );

  if (!property) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Property Not Found</h2>
          <p className="text-slate-500 mt-2">The property you are looking for does not exist.</p>
        </div>
      </div>
    </div>
  );

  const imageUrl = property.imageUrl || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Image Gallery (Placeholder for now) */}
        <div className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-lg mb-8 relative">
          <img
            src={imageUrl}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4">
            <span className="px-4 py-2 rounded-full bg-white/90 backdrop-blur text-slate-900 font-bold shadow-sm">
              For Rent
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                {property.title}
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <span>📍</span> {property.city} • {property.address}
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col items-center">
                <span className="text-2xl mb-2 text-primary-500">🛏</span>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Bedrooms</span>
                <span className="font-bold text-slate-900 dark:text-white">{property.bedrooms} Beds</span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col items-center">
                <span className="text-2xl mb-2 text-blue-500">🛁</span>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Bathrooms</span>
                <span className="font-bold text-slate-900 dark:text-white">{property.bathrooms} Baths</span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col items-center">
                <span className="text-2xl mb-2 text-emerald-500">📐</span>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Area</span>
                <span className="font-bold text-slate-900 dark:text-white">{property.area || 1200} sqft</span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col items-center">
                <span className="text-2xl mb-2 text-amber-500">🛋</span>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Furnishing</span>
                <span className="font-bold text-slate-900 dark:text-white">{property.furnished ? "Furnished" : "Unfurnished"}</span>
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Property Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {['WiFi', 'Parking', 'Pool', 'Gym', 'Security', 'Garden', 'AC', 'Elevator'].map(item => (
                  <div key={item} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 transition-colors">
                      <span className="text-lg">
                        {item === 'WiFi' ? '📶' : item === 'Parking' ? '🚗' : item === 'Pool' ? '🏊' : item === 'Gym' ? '🏋️' : item === 'Security' ? '🛡️' : item === 'Garden' ? '🌳' : item === 'AC' ? '❄️' : '🛗'}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Virtual Tour Teaser */}
            <div className="relative rounded-3xl overflow-hidden h-48 group cursor-pointer">
              <img src="https://images.unsplash.com/photo-1558603668-6570496b66f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" className="w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-700" alt="Virtual Tour" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                  </svg>
                </div>
                <span className="font-bold text-xl tracking-wide uppercase">Request 3D Virtual Tour</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">About this property</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line text-lg">
                {property.description || "No description provided for this property."}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-8 space-y-8">
              <div>
                <p className="text-xs text-slate-400 uppercase font-black tracking-[0.2em] mb-2">Exclusive Price</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">₹{Number(property.price).toLocaleString()}</span>
                  <span className="text-slate-500 font-medium">/ month</span>
                </div>
              </div>

              <div className="space-y-4">
                {user?.id !== property.ownerId && (
                  <Button
                    variant="primary"
                    className="w-full !py-4 !text-lg !rounded-2xl shadow-xl shadow-primary-500/30 font-bold"
                    onClick={() => setIsContactModalOpen(true)}
                  >
                    Contact Owner
                  </Button>
                )}
                
                <div className={`grid ${user?.id !== property.ownerId ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
                  {user?.id !== property.ownerId && (
                    <Button
                      variant="outline"
                      className="w-full !py-3 !text-sm !rounded-xl"
                      onClick={() => navigate(`/chat/${property.ownerId}`)}
                    >
                      💬 Chat
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full !py-3 !text-sm !rounded-xl"
                    onClick={handleWishlist}
                  >
                    ❤️ Wishlist
                  </Button>
                </div>

                <Button
                  onClick={() => window.open(property.googleLocation || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address + ", " + property.city)}`, '_blank')}
                  variant="outline"
                  className="w-full !py-3 !text-sm !rounded-xl !border-slate-200 dark:!border-slate-700 !text-slate-600 dark:!text-slate-400 hover:!bg-slate-50 dark:hover:!bg-slate-800"
                >
                  📍 Open in Google Maps
                </Button>
              </div>

              <div className="p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100/50 dark:border-indigo-900/20">
                <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="text-xl">🛡️</span> Verified Property
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  This property has been verified by our agents for documents and location accuracy.
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
    </div>
  );
}
