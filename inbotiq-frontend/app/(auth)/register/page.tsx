"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin"]),
});

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: "" }); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");


    const validation = registerSchema.safeParse(formData);
    if (!validation.success) {
      const errors: { [key: string]: string } = {};
      validation.error.issues.forEach((err: z.ZodIssue) => {
        const field = err.path[0] as string;
        errors[field] = err.message;
      });
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      if (data.token && data.user) {
        login(data.token, data.user);
        router.push("/dashboard");
      } else {
        throw new Error("Token not received from server");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-950 to-black justify-center items-center rounded-r-3xl text-white p-10">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold mb-4">Create your Account 😃</h1>
          <p className="text-gray-300">A new journey waiting for you!</p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-semibold text-center mb-6">Sign Up</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                name="name"
                placeholder="Full name"
                onChange={handleChange}
                value={formData.name}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black focus:outline-none"
              />
              {fieldErrors.name && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>
              )}
            </div>

            <div>
              <input
                name="email"
                type="email"
                placeholder="Email address"
                onChange={handleChange}
                value={formData.email}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black focus:outline-none"
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                value={formData.password}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black focus:outline-none"
              />
              {fieldErrors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <div>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black focus:outline-none"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              {fieldErrors.role && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.role}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black cursor-pointer text-white rounded-lg py-2 mt-2 hover:bg-gray-800 transition-colors"
            >
              {loading ? "Creating account..." : "Join us →"}
            </button>

            {error && (
              <p className="text-red-500 text-sm text-center mt-2">{error}</p>
            )}
          </form>

          <p className="text-sm text-center text-gray-500 mt-4">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-black hover:underline cursor-pointer"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
