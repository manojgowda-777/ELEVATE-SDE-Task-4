
"use client";

import { useEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "credvault-data";

const initialData = {
  applications: [],
  certificates: [],
};

let data = initialData;
let isLoaded = false;
const listeners = new Set();

function loadData() {
  if (typeof window === "undefined" || isLoaded) return;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);

      data = {
        applications: Array.isArray(parsed.applications)
          ? parsed.applications
          : [],
        certificates: Array.isArray(parsed.certificates)
          ? parsed.certificates
          : [],
      };
    }
  } catch (error) {
    console.error("Could not load CredVault data:", error);
    data = initialData;
  }

  isLoaded = true;
}

function saveData() {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return data;
}

function getServerSnapshot() {
  return initialData;
}

export function useCredVaultData() {
  const currentData = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    loadData();
    listeners.forEach((listener) => listener());
  }, []);

  return currentData;
}

export function addApplication(application) {
  loadData();

  const nextNumber =
    data.applications.reduce((max, item) => {
      const number = Number(item.id?.replace("APP-", ""));
      return Number.isFinite(number) ? Math.max(max, number) : max;
    }, 0) + 1;

  const newApplication = {
    ...application,
    id: `APP-${String(nextNumber).padStart(4, "0")}`,
    status: "Pending",
    submissionDate: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
  };

  data = {
    ...data,
    applications: [...data.applications, newApplication],
  };

  saveData();
  return newApplication;
}

export function updateApplicationStatus(id, status) {
  loadData();

  data = {
    ...data,
    applications: data.applications.map((application) =>
      application.id === id ? { ...application, status } : application
    ),
  };

  if (status === "Approved") {
    const application = data.applications.find((item) => item.id === id);

    const alreadyIssued = data.certificates.some(
      (certificate) => certificate.applicationId === id
    );

    if (application && !alreadyIssued) {
      const nextCertificateNumber =
        data.certificates.reduce((max, certificate) => {
          const number = Number(
            certificate.id?.replace("CERT-", "")
          );
          return Number.isFinite(number)
            ? Math.max(max, number)
            : max;
        }, 0) + 1;

      data = {
        ...data,
        certificates: [
          ...data.certificates,
          {
            id: `CERT-${String(nextCertificateNumber).padStart(4, "0")}`,
            applicationId: id,
            name: application.name,
            phone: application.phone,
            city: application.city,
            state: application.state,
            issuedOn: new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }),
            status: "Valid",
          },
        ],
      };
    }
  }

  saveData();
}

export function revokeCertificate(id) {
  loadData();

  data = {
    ...data,
    certificates: data.certificates.map((certificate) =>
      certificate.id === id
        ? { ...certificate, status: "Revoked" }
        : certificate
    ),
  };

  saveData();
}