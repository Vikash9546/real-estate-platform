import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { getPropertyById } from "../api/propertyApi";
import { addToWishlist } from "../api/wishlistApi";
import Button from "../components/Button";
import ContactModal from "../components/ContactModal";

export default function PropertyDetails() {
  const { id } = useParams();
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
              {property.status || "For Rent"}
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
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center">
                <span className="block text-2xl mb-1">🛏</span>
                <span className="font-semibold text-slate-900 dark:text-white">{property.bedrooms} Beds</span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center">
                <span className="block text-2xl mb-1">🛁</span>
                <span className="font-semibold text-slate-900 dark:text-white">{property.bathrooms} Baths</span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center">
                <span className="block text-2xl mb-1">📐</span>
                <span className="font-semibold text-slate-900 dark:text-white">1,200 sqft</span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center">
                <span className="block text-2xl mb-1">🛋</span>
                <span className="font-semibold text-slate-900 dark:text-white">{property.furnished ? "Furnished" : "Unfurnished"}</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Description</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {property.description || "No description provided for this property."}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 p-6 space-y-6">
              <div>
                <p className="text-sm text-slate-500 uppercase font-semibold tracking-wide">Price</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-primary-600">₹{Number(property.price).toLocaleString()}</span>
                  <span className="text-slate-500 mb-1">/ month</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address + ", " + property.city)}`, '_blank')}
                  variant="outline"
                  className="w-full !py-3 !text-base !border-primary-600 !text-primary-600 hover:!bg-primary-50"
                >
                  📍 Get Directions
                </Button>
                <Button
                  variant="primary"
                  className="w-full !py-3 !text-base"
                  onClick={() => setIsContactModalOpen(true)}
                >
                  Contact Owner
                </Button>
                <Button
                  variant="outline"
                  className="w-full !py-3 !text-base"
                  onClick={handleWishlist}
                >
                  ❤️ Add to Wishlist
                </Button>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Safety Tips</h4>
                <ul className="text-sm text-slate-500 dark:text-slate-400 space-y-2 list-disc list-inside">
                  <li>Never transfer money before viewing</li>
                  <li>Check all documents carefully</li>
                  <li>Meet the owner in person</li>
                </ul>
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
      />
    </div>
  );
}
