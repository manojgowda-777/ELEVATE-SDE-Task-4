
"use client";

import { useState } from "react";

export default function VerifyCertificate() {
  const [certificateId, setCertificateId] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleVerify(event) {
    event.preventDefault();

    setCertificate(null);
    setError("");

    if (!certificateId.trim()) {
      setError("Please enter your Certificate ID.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/certificates/verify/${encodeURIComponent(certificateId.trim())}`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Certificate not found.");
      }

      setCertificate(result);
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
          Verify Certificate
        </h1>

        <form
          onSubmit={handleVerify}
          className="space-y-5 rounded-xl border border-slate-700 bg-slate-800/60 p-6"
        >
          <div>
            <label className="mb-2 block font-medium">
              Certificate ID
            </label>

            <input
              type="text"
              value={certificateId}
              onChange={(event) => setCertificateId(event.target.value)}
              placeholder="Enter your Certificate ID"
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 p-5 text-red-300">
            {error}
          </div>
        )}

        {certificate && (
          <div className="mt-6 space-y-3 rounded-xl border border-green-500/40 bg-slate-800/60 p-6">
            <h2 className="mb-4 text-xl font-semibold text-green-400">
              Certificate Details
            </h2>

            <p><strong>Certificate ID:</strong> {certificate.certificateId}</p>
            <p><strong>Name:</strong> {certificate.name}</p>
            <p><strong>Phone:</strong> {certificate.phone}</p>
            <p><strong>Issued On:</strong> {certificate.issuedOn}</p>
            <p><strong>Status:</strong> {certificate.status}</p>
          </div>
        )}
      </div>
    </main>
  );
}
