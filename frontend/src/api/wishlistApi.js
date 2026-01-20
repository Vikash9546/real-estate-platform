import api from "./axios";

export const getWishlist = () => api.get("/wishlist");

export const addToWishlist = (propertyId) =>
  api.post(`/wishlist/${propertyId}`);

export const removeFromWishlist = (propertyId) =>
  api.delete(`/wishlist/${propertyId}`);
