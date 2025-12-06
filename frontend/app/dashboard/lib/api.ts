import { Report } from "../types/report";

const BASE = process.env.NEXT_PUBLIC_API_URL || "";

export const getReports = async (): Promise<Report[]> => {
  const res = await fetch(`${BASE}/api/report`, { cache: "no-store" });
  return res.json();
};

export const createReport = async (data: Partial<Report>) => {
  const res = await fetch(`${BASE}/api/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
};
