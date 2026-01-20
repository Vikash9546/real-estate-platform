import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPropertyById } from "../api/propertyApi";

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getPropertyById(id)
      .then((data) => {
        setProperty(data);
        setError("");
      })
      .catch((err) => {
        setError("Failed to load property.");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!property) return <div className="p-6">Property not found.</div>;

  return (
    <main className="max-w-4xl mx-auto p-6">
      <Link to="/" className="text-sm text-slate-500 hover:underline">← Back</Link>

      <h1 className="mt-4 text-2xl font-semibold">{property.title || "Property"}</h1>
      <p className="text-sm text-slate-500 mt-1">{property.address || ""}</p>

      {property.images?.length ? (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {property.images.map((src, i) => (
            <img key={i} src={src} alt={`property-${i}`} className="w-full h-64 object-cover rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="mt-4 h-64 bg-gray-100 rounded-lg flex items-center justify-center">No images</div>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <h2 className="text-lg font-medium">Description</h2>
          <p className="mt-2 text-slate-700">{property.description || "No description available."}</p>
        </div>

        <aside className="p-4 border rounded-lg">
          <div className="text-xl font-semibold">{property.price ? `$${property.price}` : "Contact for price"}</div>
          <div className="text-sm text-slate-500 mt-2">
            {property.bedrooms != null && `${property.bedrooms} bed${property.bedrooms > 1 ? "s" : ""}`} ·{" "}
            {property.bathrooms != null && `${property.bathrooms} bath${property.bathrooms > 1 ? "s" : ""}`}
          </div>
          <div className="mt-4 text-sm">
            <div>Furnished: {property.furnished ? "Yes" : "No"}</div>
            <div>Owner: {property.owner?.name || "—"}</div>
            <div className="mt-3">
              <Link to={`/contact/${property.owner?.id || ""}`} className="text-sm text-blue-600 hover:underline">
                Contact owner
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}