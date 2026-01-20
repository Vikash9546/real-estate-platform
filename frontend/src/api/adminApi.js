import api from "./axios";

export const getAllUsers = () => api.get("/admin/users");
export const getPendingProperties = () => api.get("/admin/properties/pending");

export const approveProperty = (id) => api.put(`/admin/properties/${id}/approve`);
export const rejectProperty = (id) => api.put(`/admin/properties/${id}/reject`);
