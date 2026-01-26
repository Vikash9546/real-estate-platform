import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Get all properties (with filters/pagination)
export const getAllProperties = async (params) => {
  const res = await api.get("/properties", { params });
  return res.data;
};

// ✅ Create property (OWNER / ADMIN)
export const createProperty = async (data, token) => {
  const res = await api.post("/properties", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
export default api;