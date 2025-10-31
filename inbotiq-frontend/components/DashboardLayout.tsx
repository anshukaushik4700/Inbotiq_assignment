"use client";
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h3 className="text-lg font-bold mb-4">Inbotiq Dashboard</h3>
        <div className="mb-6">Role: {user?.role || "—"}</div>
        <button className="bg-red-500 px-3 py-2 rounded" onClick={handleLogout}>Logout</button>
      </aside>
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  );
}
