
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = "http://localhost:5000";

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  async function fetchCertificates() {
    const token = localStorage.getItem("credvault-admin-token");

    if (!token) {
      router.replace("/admin/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/admin/certificates`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("credvault-admin-token");
        router.replace("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error(result.message || "Unable to load certificates.");
      }

      setCertificates(
        Array.isArray(result)
          ? result
          : result.certificates || result.data || []
      );
    } catch (err) {
      setError(err.message || "Server connection failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRevoke(certificateId) {
    if (!window.confirm("Are you sure you want to revoke this certificate?")) {
      return;
    }

    try {
      setError("");

      const token = localStorage.getItem("credvault-admin-token");

      const response = await fetch(
        `${API_URL}/api/admin/certificates/${encodeURIComponent(certificateId)}/revoke`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("credvault-admin-token");
        router.replace("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error(result.message || "Certificate revocation failed.");
      }

      await fetchCertificates();
    } catch (err) {
      setError(err.message || "Certificate revocation failed.");
    }
  }

  useEffect(() => {
    fetchCertificates();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-slate-400">Manage issued certificates</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/admin/applications"
            className="rounded-lg border border-slate-700 px-5 py-3 text-slate-300 hover:bg-slate-800"
          >
            Applications
          </Link>

          <Link
            href="/admin/certificates"
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white"
          >
            Certificates
          </Link>
        </div>

        {error && (
          <p className="mt-5 rounded-lg bg-red-500/10 p-3 text-red-400">
            {error}
          </p>
        )}

        <div className="mt-8 overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-900 text-slate-300">
              <tr>
                <th className="p-4">Certificate ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Issued On</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Loading certificates...
                  </td>
                </tr>
              ) : certificates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No certificates found.
                  </td>
                </tr>
              ) : (
                certificates.map((certificate) => {
                  const id = certificate.certificateId || certificate.id;

                  return (
                    <tr key={id} className="border-t border-slate-800">
                      <td className="p-4 font-medium">{id}</td>
                      <td className="p-4">{certificate.name || "-"}</td>
                      <td className="p-4">{certificate.phone || "-"}</td>
                      <td className="p-4">{certificate.issuedOn || "-"}</td>

                      <td className="p-4">
                        <span
                          className={
                            certificate.status === "Valid"
                              ? "rounded-full bg-green-500/15 px-3 py-1 text-green-400"
                              : "rounded-full bg-red-500/15 px-3 py-1 text-red-400"
                          }
                        >
                          {certificate.status}
                        </span>
                      </td>

                      <td className="p-4">
                        {certificate.status === "Valid" ? (
                          <button
                            onClick={() => handleRevoke(id)}
                            className="rounded-lg bg-red-600 px-4 py-2 hover:bg-red-700"
                          >
                            Revoke
                          </button>
                        ) : (
                          <span className="text-slate-500">Revoked</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
