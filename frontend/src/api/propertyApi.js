import api from "./axios";

// Get all properties (with filters)
export const getAllProperties = (params) => api.get("/properties", { params });

// Get property by id
export const getPropertyById = (id) => api.get(`/properties/${id}`);

// Create property (OWNER/ADMIN)
export const createProperty = (data) => api.post("/properties", data);

// Update property
export const updateProperty = (id, data) => api.put(`/properties/${id}`, data);

// Delete property
export const deleteProperty = (id) => api.delete(`/properties/${id}`);

// Owner listings
export const getOwnerProperties = () => api.get("/properties/owner/my");
