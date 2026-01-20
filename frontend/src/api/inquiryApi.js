import api from "./axios";

export const createInquiry = (propertyId, data) =>
  api.post(`/inquiries/${propertyId}`, data);

export const getOwnerInquiries = () => api.get("/inquiries/owner/all");

export const updateInquiryStatus = (id, data) =>
  api.put(`/inquiries/${id}/status`, data);
