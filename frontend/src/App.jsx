import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PropertyDetails from "./pages/PropertyDetails";
import Wishlist from "./pages/Wishlist";
import OwnerDashboard from "./pages/OwnerDashboard";
import AddProperty from "./pages/AddProperty";
import MyListings from "./pages/MyListings";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import ForgotPassword from "./pages/ForgotPassword";
import EditProperty from "./pages/EditProperty";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin" element={<AdminLogin />} />

        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/property/edit/:id" element={<EditProperty />} />

        <Route path="/wishlist" element={<Wishlist />} />

        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/owner/add-property" element={<AddProperty />} />
        <Route path="/owner/my-listings" element={<MyListings />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
