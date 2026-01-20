import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import RoleRoute from "../components/RoleRoute";
import Button from "../components/Button";
import { deleteProperty, getOwnerProperties } from "../api/propertyApi";
import { useNavigate } from "react-router-dom";

export default function MyListings() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await getOwnerProperties();
      setListings(res.data);
    } catch (err) {
      console.log(err?.response?.data || err.message);
      alert("Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;

    try {
      setDeleteLoading(id);
      await deleteProperty(id);
      // Remove from UI immediately for better UX
      setListings(listings.filter(p => p.id !== id));
      alert("Property deleted successfully!");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to delete property");
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <RoleRoute roles={["OWNER", "ADMIN"]}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <Navbar />

        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              My Listings
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage your property listings
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : listings.length === 0 ? (
            /* Empty State */
            <div className="text-center py-20">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-12">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  No listings yet
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Start by adding your first property listing
                </p>
                <Button
                  variant="primary"
                  onClick={() => navigate("/owner/add-property")}
                >
                  Add Property
                </Button>
              </div>
            </div>
          ) : (
            /* Property Grid */
            <div className="grid grid-cols-1 gap-6">
              {listings.map((property) => (
                <div
                  key={property.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      {/* Property Info */}
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                          {property.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {property.city}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            {property.bedrooms} BHK
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                            {property.area} sq ft
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                          ₹{property.price.toLocaleString()}
                          <span className="text-sm font-normal text-slate-500">/month</span>
                        </p>
                        {property.address && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                            {property.address}
                          </p>
                        )}
                        {/* Status Badge */}
                        <div className="mt-3">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${property.status === "APPROVED"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : property.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              }`}
                          >
                            {property.status}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 min-w-[120px]">
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/property/${property.id}`)}
                          className="!py-2 !text-sm"
                        >
                          View Details
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(property.id, property.title)}
                          disabled={deleteLoading === property.id}
                          className="!py-2 !text-sm"
                        >
                          {deleteLoading === property.id ? (
                            <span className="flex items-center gap-2">
                              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Deleting...
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </span>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Property Button (if listings exist) */}
          {!loading && listings.length > 0 && (
            <div className="mt-8 text-center">
              <Button
                variant="primary"
                onClick={() => navigate("/owner/add-property")}
                className="!px-8"
              >
                + Add Another Property
              </Button>
            </div>
          )}
        </div>
      </div>
    </RoleRoute>
  );
}
