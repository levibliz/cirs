"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getReports } from "./lib/api";
import ReportForm from "./components/ReportForm";
import ReportList from "./components/ReportList";
import { Report } from "./types/report";
import Link from "next/link";

export default function Dashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await getReports();
      setReports(data);
    } catch (error) {
      console.error("Failed to load reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const filteredReports =
    filter === "all"
      ? reports
      : reports.filter((r) => r.status === filter);

  const stats = [
    {
      label: "Total Reports",
      value: reports.length,
      color: "var(--primary-600)",
    },
    {
      label: "Pending",
      value: reports.filter((r) => r.status === "pending").length,
      color: "var(--accent-500)",
    },
    {
      label: "In Progress",
      value: reports.filter((r) => r.status === "in-progress").length,
      color: "var(--gold-500)",
    },
    {
      label: "Resolved",
      value: reports.filter((r) => r.status === "resolved").length,
      color: "var(--primary-500)",
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-4 transition hover:opacity-80"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span style={{ color: "var(--muted)" }}>Back to Home</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            My Dashboard
          </h1>
          <p style={{ color: "var(--muted)" }}>
            Track and manage your community reports
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="rounded-xl p-4 md:p-5 border shadow-sm transition"
              style={{
                borderColor: "var(--glass-border)",
                backgroundColor: "rgba(37, 99, 235, 0.02)",
              }}
            >
              <p
                style={{ color: "var(--muted)", fontSize: "0.875rem" }}
                className="mb-1"
              >
                {stat.label}
              </p>
              <p
                className="text-2xl md:text-3xl font-bold"
                style={{ color: stat.color }}
              >
                {stat.value}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left: Report Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <ReportForm onCreate={(r) => setReports([r, ...reports])} />
          </motion.div>

          {/* Right: Report List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div
              className="rounded-xl border shadow-sm"
              style={{
                borderColor: "var(--glass-border)",
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                backdropFilter: "blur(10px)",
              }}
            >
              {/* Header with Filter */}
              <div
                className="border-b p-4 md:p-6"
                style={{ borderColor: "var(--glass-border)" }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">
                      Your Reports
                    </h2>
                    <p
                      style={{ color: "var(--muted)", fontSize: "0.875rem" }}
                      className="mt-1"
                    >
                      {filteredReports.length} report
                      {filteredReports.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* Filter Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {["all", "pending", "in-progress", "resolved"].map((status) => (
                      <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className="px-3 py-1 md:px-4 md:py-2 rounded-lg text-sm font-medium transition-all"
                        style={{
                          backgroundColor:
                            filter === status
                              ? "var(--primary-500)"
                              : "var(--primary-100)",
                          color:
                            filter === status
                              ? "white"
                              : "var(--primary-700)",
                        }}
                      >
                        {status
                          .charAt(0)
                          .toUpperCase()
                          .concat(status.slice(1).replace("-", " "))}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Report List */}
              <div className="p-4 md:p-6">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div
                      className="animate-spin rounded-full h-12 w-12"
                      style={{
                        borderColor: "var(--primary-200)",
                        borderTop: "3px solid var(--primary-600)",
                      }}
                    />
                  </div>
                ) : filteredReports.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="text-4xl mb-2">📋</div>
                    <p style={{ color: "var(--muted)" }}>
                      No reports in this category yet.
                    </p>
                    <p
                      style={{ color: "var(--muted)", fontSize: "0.875rem" }}
                      className="mt-1"
                    >
                      Create your first report to get started!
                    </p>
                  </motion.div>
                ) : (
                  <ReportList reports={filteredReports} />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
