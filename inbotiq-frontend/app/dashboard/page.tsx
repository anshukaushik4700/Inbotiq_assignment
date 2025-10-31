"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function DashboardPage() {
  const { token, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 401) {
            logout();
            return;
          }
          throw new Error(`Error ${res.status}`);
        }

        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, logout]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600 text-lg">
        Loading your dashboard...
      </div>
    );

  if (!data)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600 text-lg">
        No data available or unauthorized.
      </div>
    );

  const { user } = data;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white px-4">
      <div className="max-w-md w-full bg-white text-gray-900 rounded-3xl shadow-2xl p-10 text-center">
        <h1 className="text-3xl font-bold mb-2">
          Welcome, {user?.name || "User"} 👋
        </h1>
        <p className="text-gray-500 mb-8">
          You’re logged in as <span className="font-medium">{user?.role}</span>
        </p>

        <div className="space-y-2 text-left">
          <p>
            <span className="font-semibold text-gray-700">Email:</span>{" "}
            {user?.email}
          </p>
          <p>
            <span className="font-semibold text-gray-700">Role:</span>{" "}
            {user?.role}
          </p>
          <p>
            <span className="font-semibold text-gray-700">User ID:</span>{" "}
            {user?._id}
          </p>
        </div>

       <div className="mt-8 flex flex-col items-center space-y-4">
        <button
          onClick={logout}
          className="w-full bg-red-500 cursor-pointer hover:bg-red-600 text-white py-2 rounded-lg transition-colors"
        >
          Logout
        </button>

        <Link
          href="/me"
          className="text-gray-500 cursor-pointer hover:underline"
        >
          View My Profile →
        </Link>
        </div>
      </div>
    </div>
  );
}
