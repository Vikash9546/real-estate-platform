import React from "react";
import Navbar from "../components/Navbar";
import RoleRoute from "../components/RoleRoute";

export default function OwnerDashboard() {
  return (
    <RoleRoute roles={["OWNER", "ADMIN"]}>
      <Navbar />
      <div style={{ padding: 20 }}>
        <h2>Owner Dashboard</h2>
        <p>Manage your properties and inquiries.</p>
      </div>
    </RoleRoute>
  );
}
