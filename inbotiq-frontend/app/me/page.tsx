"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from 'next/navigation';


export default function MePage() {
  const { token, logout } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) logout();
          throw new Error("Unauthorized");
        }

        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, logout]);

  if (loading) return <div className="text-center mt-10">Loading user info...</div>;

  if (!user)
    return <div className="text-center mt-10">No user info found or unauthorized.</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md text-center">
       <div className="text-left mb-4">
      <button
        className="text-gray-400 cursor-pointer hover:text-gray-600"
        onClick={() => router.back()}
      >
        ← Back
      </button>
    </div>
        <h1 className="text-3xl font-semibold mb-4">{user.role} Information</h1>

        <p className="text-gray-700 mb-2">
          <strong>Name:</strong> {user.name}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Email:</strong> {user.email}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Role:</strong> {user.role}
        </p>

        <button
          onClick={logout}
          className="mt-6 px-4 py-2 cursor-pointer bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
