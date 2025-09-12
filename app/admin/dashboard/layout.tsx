"use client";

import "@/app/globals.css";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentPage, setCurrentPage] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* === Sidebar === */}
      <Sidebar />

      {/* === Konten Utama === */}
      <div className="flex-1 ml-64">
        <Header />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
