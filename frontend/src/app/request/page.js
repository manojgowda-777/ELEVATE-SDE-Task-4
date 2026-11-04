
"use client";

import { useState } from "react";
import { apiRequest } from "../../lib/api";

const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

export default function RequestCertificate() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    gender: "",
    city: "",
    state: "",
  });

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await apiRequest("/api/applications", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setApplication({
        id: result.applicationId,
        status: result.status,
      });
    } catch (err) {
      setError(err.message || "Could not submit application.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500";

  return (
    <main className="min-h-screen bg-[#0b1120] px-5 py-12 text-white">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-8 text-center text-3xl font-bold">
          Request Certificate
        </h1>

        {application ? (
          <div className="rounded-xl border border-green-500/40 bg-green-500/10 p-6 text-center">
            <h2 className="text-xl font-semibold text-green-400">
              Application submitted successfully!
            </h2>
            <p className="mt-4 text-lg">
              Application ID: <strong>#{application.id}</strong>
            </p>
            <p className="mt-2">
              Status: <strong>{application.status}</strong>
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-xl border border-slate-700 bg-slate-800/60 p-6"
          >
            <div>
              <label htmlFor="name" className="mb-2 block">Name</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="mb-2 block">Phone</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <fieldset>
              <legend className="mb-2">Gender</legend>
              <div className="flex gap-6">
                {["Male", "Female", "Other"].map((gender) => (
                  <label key={gender} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      checked={form.gender === gender}
                      onChange={handleChange}
                      required
                    />
                    {gender}
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="city" className="mb-2 block">City</label>
              <input
                id="city"
                name="city"
                value={form.city}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter your city"
                required
              />
            </div>

            <div>
              <label htmlFor="state" className="mb-2 block">State</label>
              <select
                id="state"
                name="state"
                value={form.state}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="">Select your state</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>

            {error && (
              <p className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-red-300">
                {error}
              </p>
            )}
          </form>
        )}
      </div>
    </main>
  );
}
