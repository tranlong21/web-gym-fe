import React from "react";
import AdminSidebar from "../layout _admin/AdminSidebar";

const AdminDashboard = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-6 bg-gray-50">
        <h1>Dashboard Content</h1>
      </div>
    </div>
  );
};

export default AdminDashboard;