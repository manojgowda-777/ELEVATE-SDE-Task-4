
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API = "http://localhost:5000/api";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function loadApplications() {
    const token = localStorage.getItem("credvault-admin-token");

    if (!token) {
      router.replace("/admin/login");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API}/admin/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("credvault-admin-token");
        router.replace("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error(result.message || "Could not load applications.");
      }

      setApplications(
        Array.isArray(result)
          ? result
          : result.applications || result.data || []
      );
    } catch (err) {
      setError(err.message || "Server connection failed.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, action) {
    setMessage("");
    setError("");

    const token = localStorage.getItem("credvault-admin-token");

    try {
      const response = await fetch(
        `${API}/admin/applications/${encodeURIComponent(id)}/${action}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Action failed.");
      }

      setMessage(
        action === "approve"
          ? `Application approved. Certificate ID: ${result.certificateId || "Generated"}`
          : "Application rejected successfully."
      );

      await loadApplications();
    } catch (err) {
      setError(err.message || "Could not update application.");
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  return (
    <main className="min-h-screen bg-[#0b1120] px-5 py-10 text-white">
      <div className="mx-auto max-w-7xl">

        {/* Admin Navigation */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => router.push("/admin/applications")}
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold"
          >
            Applications
          </button>

          <button
            onClick={() => router.push("/admin/certificates")}
            className="rounded-lg border border-slate-600 px-5 py-3 font-semibold hover:bg-slate-800"
          >
            Certificates
          </button>
        </div>

        <h1 className="mb-6 text-3xl font-bold">Applications</h1>

        {loading && <p>Loading applications...</p>}
        {message && <p className="mb-4 text-green-400">{message}</p>}
        {error && <p className="mb-4 text-red-400">{error}</p>}

        {!loading && !error && applications.length === 0 && (
          <p className="text-slate-400">No applications found.</p>
        )}

        {!loading && applications.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-slate-700">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800">
                <tr>
                  {[
                    "Application ID",
                    "Name",
                    "Phone",
                    "Gender",
                    "City",
                    "State",
                    "Status",
                    "Action",
                  ].map((heading) => (
                    <th key={heading} className="p-3">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {applications.map((app) => {
                  const id = app.applicationId || app.application_id;

                  return (
                    <tr key={id} className="border-t border-slate-700">
                      <td className="p-3">{id}</td>
                      <td className="p-3">{app.name}</td>
                      <td className="p-3">{app.phone}</td>
                      <td className="p-3">{app.gender}</td>
                      <td className="p-3">{app.city}</td>
                      <td className="p-3">{app.state}</td>
                      <td className="p-3">{app.status}</td>
                      <td className="space-x-2 p-3">
                        {app.status === "Pending" && (
                          <>
                            <button
                              onClick={() => updateStatus(id, "approve")}
                              className="rounded bg-green-600 px-3 py-2"
                            >
                              Issue
                            </button>

                            <button
                              onClick={() => updateStatus(id, "reject")}
                              className="rounded bg-red-600 px-3 py-2"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
