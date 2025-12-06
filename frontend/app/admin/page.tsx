"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import AdminReportList from "./components/AdminReportList"
import { Report } from "./types/report";

const STORAGE_KEY = "cirs_admin_reports_v1";

const SAMPLE: Report[] = [
  {
    id: "r-1",
    title: "Pothole on Main St",
    description: "Large pothole near the crosswalk, dangerous for cyclists.",
    category: "infrastructure",
    location: "Main St & 3rd Ave",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: "r-2",
    title: "Broken streetlight",
    description: "Streetlight not working at night near park entrance.",
    category: "public-service",
    location: "Maple Park",
    status: "in-progress",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "r-3",
    title: "Illegal dumping",
    description: "Someone dumped furniture behind the community center.",
    category: "environment",
    location: "Community Center Alley",
    status: "resolved",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

export default function AdminDashboardPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    // load from localStorage (frontend only)
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Report[];
        setReports(parsed);
      } catch {
        setReports(SAMPLE);
      }
    } else {
      // seed with sample
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE));
      setReports(SAMPLE);
    }
    setLoading(false);
  }, []);

  const save = (next: Report[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setReports(next);
  };

  const handleUpdate = (id: string, patch: Partial<Report>) => {
    const next = reports.map((r) => (r.id === id ? { ...r, ...patch } : r));
    save(next);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this report? This action cannot be undone.")) return;
    const next = reports.filter((r) => r.id !== id);
    save(next);
  };

  const handleEdit = (id: string, patch: Partial<Report>) => {
    // identical to update; provided for clarity
    handleUpdate(id, patch);
  };

  const categories = useMemo(() => {
    const set = new Set(reports.map((r) => r.category));
    return ["all", ...Array.from(set)];
  }, [reports]);

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (categoryFilter !== "all" && r.category !== categoryFilter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q)
      );
    });
  }, [reports, statusFilter, categoryFilter, query]);

  const stats = useMemo(() => {
    const total = reports.length;
    const pending = reports.filter((r) => r.status === "pending").length;
    const inProgress = reports.filter((r) => r.status === "in-progress").length;
    const resolved = reports.filter((r) => r.status === "resolved").length;
    return { total, pending, inProgress, resolved };
  }, [reports]);

  return (
    <div style={{ background: "var(--bg)" }} className="min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 flex-col sm:flex-row gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--fg)" }}>
              Admin Dashboard (Frontend-only)
            </h1>
            <p style={{ color: "var(--muted)" }} className="text-sm mt-1">
              Manage reports locally in your browser (stored in localStorage).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                // reset to sample
                if (!confirm("Reset local admin data to sample reports?")) return;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE));
                setReports(SAMPLE);
              }}
              className="px-3 py-2 rounded-md text-sm font-medium"
              style={{ background: "var(--primary-100)", color: "var(--primary-700)" }}
            >
              Reset Data
            </button>

            <Link
              href="/dashboard"
              className="px-3 py-2 rounded-md text-sm font-medium"
              style={{ background: "linear-gradient(90deg,var(--primary-500),var(--accent-500))", color: "white" }}
            >
              View User Dashboard
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <motion.div whileHover={{ scale: 1.03 }} className="p-4 rounded-lg" style={{ background: "var(--primary-50)", border: `1px solid var(--glass-border)` }}>
            <div className="text-sm" style={{ color: "var(--muted)" }}>
              Total
            </div>
            <div className="text-xl font-bold" style={{ color: "var(--primary-600)" }}>
              {stats.total}
            </div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} className="p-4 rounded-lg" style={{ background: "var(--accent-50)", border: `1px solid var(--glass-border)` }}>
            <div className="text-sm" style={{ color: "var(--muted)" }}>
              Pending
            </div>
            <div className="text-xl font-bold" style={{ color: "var(--accent-600)" }}>
              {stats.pending}
            </div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} className="p-4 rounded-lg" style={{ background: "var(--gold-50)", border: `1px solid var(--glass-border)` }}>
            <div className="text-sm" style={{ color: "var(--muted)" }}>
              In Progress
            </div>
            <div className="text-xl font-bold" style={{ color: "var(--gold-600)" }}>
              {stats.inProgress}
            </div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} className="p-4 rounded-lg" style={{ background: "var(--primary-50)", border: `1px solid var(--glass-border)` }}>
            <div className="text-sm" style={{ color: "var(--muted)" }}>
              Resolved
            </div>
            <div className="text-xl font-bold" style={{ color: "var(--primary-500)" }}>
              {stats.resolved}
            </div>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 w-full md:w-1/2">
            <input
              placeholder="Search reports (title, location, description)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-3 py-2 rounded-lg"
              style={{ border: "1px solid var(--primary-200)", background: "var(--bg)", color: "var(--fg)" }}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg"
              style={{ border: "1px solid var(--primary-200)", background: "var(--bg)", color: "var(--fg)" }}
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-lg"
              style={{ border: "1px solid var(--primary-200)", background: "var(--bg)", color: "var(--fg)" }}
            >
              <option value="all">All categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Report list */}
        <div>
          {loading ? (
            <div className="py-12 text-center">
              <div className="animate-spin inline-block h-10 w-10 rounded-full" style={{ border: "3px solid var(--primary-200)", borderTop: "3px solid var(--primary-600)" }} />
            </div>
          ) : (
            <AdminReportList reports={filtered} onUpdate={handleUpdate} onDelete={handleDelete} onEdit={handleEdit} />
          )}
        </div>
      </div>
    </div>
  );
}