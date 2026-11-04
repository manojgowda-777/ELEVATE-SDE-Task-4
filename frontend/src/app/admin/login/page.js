
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Invalid username or password.");
      }

      if (!result.token) {
        throw new Error("Login response did not contain an authentication token.");
      }

      localStorage.setItem("credvault-admin-token", result.token);
      router.push("/admin/applications");
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0b1120] px-5 py-12 text-white flex items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="mb-8 text-center text-3xl font-bold">
          Admin Login
        </h1>

        <form
          onSubmit={handleLogin}
          className="space-y-5 rounded-xl border border-slate-700 bg-slate-800/60 p-6"
        >
          <div>
            <label htmlFor="username" className="mb-2 block">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter username"
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && (
            <p className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-red-300">
              {error}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
