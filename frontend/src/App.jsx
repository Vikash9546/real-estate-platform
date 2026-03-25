import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PropertyDetails from "./pages/PropertyDetails";
import Wishlist from "./pages/Wishlist";
import OwnerDashboard from "./pages/OwnerDashboard";
import AddProperty from "./pages/AddProperty";
import MyListings from "./pages/MyListings";

import ForgotPassword from "./pages/ForgotPassword";
import EditProperty from "./pages/EditProperty";
import OwnerInquiries from "./pages/OwnerInquiries";
import Chat from "./pages/Chat";
import Messages from "./pages/Messages";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />


        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/property/edit/:id" element={<EditProperty />} />

        <Route path="/wishlist" element={<Wishlist />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/owner/add-property" element={<ProtectedRoute><AddProperty /></ProtectedRoute>} />
        <Route path="/owner/my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
        <Route path="/owner/inquiries" element={<ProtectedRoute><OwnerInquiries /></ProtectedRoute>} />

        <Route path="/chat/:otherUserId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />


      </Routes>
    </BrowserRouter>
  );
}
