import { Report } from "../types/report";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/**
 * GET all reports
 */
export async function getReports(token: string | null): Promise<Report[]> {
  if (!token) {
    console.warn("No auth token provided to getReports");
    return [];
  }

  const res = await fetch(`${API_URL}/report`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.error("Failed to fetch reports:", await res.text());
    throw new Error("Failed to fetch reports");
  }

  return res.json();
}

/**
 * CREATE report
 */
export async function createReport(
  report: Omit<Report, "id" | "createdAt" | "status">,
  token: string | null
): Promise<Report> {
  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const res = await fetch(`${API_URL}/report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(report),
  });

  if (!res.ok) {
    console.error("Failed to create report:", await res.text());
    throw new Error("Failed to create report");
  }

  return res.json();
}
