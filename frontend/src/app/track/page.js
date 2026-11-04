
"use client";

import { useState } from "react";

export default function TrackApplication() {
  const [applicationId, setApplicationId] = useState("");
  const [application, setApplication] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleTrack(event) {
    event.preventDefault();

    setApplication(null);
    setError("");

    if (!applicationId.trim()) {
      setError("Please enter your Application ID.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/applications/track/${encodeURIComponent(applicationId.trim())}`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Application not found.");
      }

      setApplication(result);
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0b1120] px-5 py-12 text-white">
      <div className="mx-auto w-full max-w-xl">
        <h1 className="mb-8 text-center text-3xl font-bold">
          Track Application
        </h1>

        <form
          onSubmit={handleTrack}
          className="space-y-5 rounded-xl border border-slate-700 bg-slate-800/60 p-6"
        >
          <div>
            <label className="mb-2 block font-medium">
              Application ID
            </label>

            <input
              type="text"
              value={applicationId}
              onChange={(event) => setApplicationId(event.target.value)}
              placeholder="Enter your Application ID"
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Checking..." : "Track"}
          </button>
        </form>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 p-5 text-red-300">
            {error}
          </div>
        )}

        {application && (
          <div className="mt-6 space-y-3 rounded-xl border border-green-500/40 bg-slate-800/60 p-6">
            <h2 className="mb-4 text-xl font-semibold text-green-400">
              Application Details
            </h2>

            <p>
              <strong>Application ID:</strong>{" "}
              {application.applicationId}
            </p>

            <p>
              <strong>Name:</strong> {application.name}
            </p>

            <p>
              <strong>Status:</strong> {application.status}
            </p>

            <p>
              <strong>Submission Date:</strong>{" "}
              {application.submittedAt
                ? new Date(application.submittedAt).toLocaleDateString("en-GB")
                : "Not available"}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
