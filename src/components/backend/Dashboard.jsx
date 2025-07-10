// dashboard.jsx
"use client";

import { useState } from "react";
import { Card, Button } from "react-bootstrap";
import DashboardSidebar from "@/components/common/Sidebar";
import DashboardHeader from "@/components/common/HeaderAdmin";
import "@/components/backend/layout/dashboard.scss";

const Dashboard = () => {
  const [isSidebarOpen] = useState(true);

  return (
    <div
      className={`dashboard-container min-vh-100 d-flex ${
        isSidebarOpen ? "sidebar-open" : "sidebar-closed"
      }`}
    >
      <DashboardSidebar isOpen={isSidebarOpen} />

      <main className="main-content-container flex-grow-1 p-4">
        <DashboardHeader toggleSidebar={() => {}} />
      </main>
    </div>
  );
};

export default Dashboard;
