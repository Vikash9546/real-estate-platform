import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import RoleRoute from "../components/RoleRoute";
import Button from "../components/Button";
import { getPropertyById, updateProperty } from "../api/propertyApi";
import { useNavigate, useParams } from "react-router-dom";

export default function EditProperty() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        city: "",
        address: "",
        area: "",
        bedrooms: 1,
        bathrooms: 1,
    });

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await getPropertyById(id);
                const p = res.data;
                setForm({
                    title: p.title,
                    description: p.description,
                    price: p.price,
                    city: p.city,
                    address: p.address,
                    area: p.area,
                    bedrooms: p.bedrooms,
                    bathrooms: p.bathrooms,
                });
            } catch (err) {
                alert("Failed to load property details");
                navigate("/admin/dashboard");
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id, navigate]);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            await updateProperty(id, {
                ...form,
                price: Number(form.price),
                area: Number(form.area),
                bedrooms: Number(form.bedrooms),
                bathrooms: Number(form.bathrooms),
            });

            alert("Property Updated!");
            navigate(-1); // Go back
        } catch (err) {
            alert(err?.response?.data?.message || "Error updating property");
        } finally {
            setSaving(false);
        }
    };

    const inputClass = "w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all";
    const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";

    if (loading) return <div className="p-8 text-center text-slate-500">Loading...</div>;

    return (
        <RoleRoute roles={["OWNER", "ADMIN"]}>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
                <Navbar />

                <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="p-8 border-b border-slate-200 dark:border-slate-800">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Property</h2>
                            <p className="text-slate-500 mt-1">Update property details.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className={labelClass}>Property Title</label>
                                    <input
                                        name="title"
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
                                    disabled={saving}
                                    className="!px-8"
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </RoleRoute>
    );
}
