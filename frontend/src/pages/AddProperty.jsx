import React, { useState } from "react";
import Navbar from "../components/Navbar";
import RoleRoute from "../components/RoleRoute";
import Button from "../components/Button";
import { createProperty } from "../api/propertyApi";
import { useNavigate } from "react-router-dom";

export default function AddProperty() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    city: "",
    address: "",
    area: "",
    bedrooms: 1,
    bathrooms: 1,
    imageUrl: "", // Added placeholder if supported by API or just for UI
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      await createProperty(
        {
          ...form,
          price: Number(form.price),
          area: Number(form.area) || 1000, // Default to 1000 sqft if empty
          bedrooms: Number(form.bedrooms),
          bathrooms: Number(form.bathrooms),
        },
        token
      );

      // alert("Property Added!");
      navigate("/owner/my-listings");
    } catch (err) {
      alert(err?.response?.data?.message || "Error creating property");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all";
  const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";

  return (
    <RoleRoute roles={["OWNER", "ADMIN"]}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />

        <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-8 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">List New Property</h2>
              <p className="text-slate-500 mt-1">Fill in the details to list your property for rent.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className={labelClass}>Property Title</label>
                  <input
                    name="title"
                    placeholder="e.g. Luxury Apartment in City Center"
                    value={form.title}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>City</label>
                    <input
                      name="city"
                      placeholder="e.g. Mumbai"
                      value={form.city}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Monthly Rent (₹)</label>
                    <input
                      name="price"
                      type="number"
                      placeholder="e.g. 25000"
                      value={form.price}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Full Address</label>
                  <input
                    name="address"
                    placeholder="e.g. 123, Green Park, Main Road"
                    value={form.address}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Area (Square Feet)</label>
                  <input
                    name="area"
                    type="number"
                    placeholder="e.g. 1200"
                    value={form.area}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Bedrooms</label>
                    <select
                      name="bedrooms"
                      value={form.bedrooms}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} BHK</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Bathrooms</label>
                    <select
                      name="bathrooms"
                      value={form.bathrooms}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Description</label>
                  <textarea
                    name="description"
                    rows="4"
                    placeholder="Describe the property features, amenities, etc."
                    value={form.description}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                  className="!px-8"
                >
                  {loading ? "Creating..." : "Create Listing"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </RoleRoute>
  );
}
