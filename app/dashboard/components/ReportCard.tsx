"use client";

import { motion } from "framer-motion";
import { Report } from "../types/report";

const STATUS_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  pending: { bg: "rgba(251, 113, 133, 0.1)", text: "var(--accent-600)", icon: "⏳" },
  "in-progress": { bg: "rgba(245, 158, 11, 0.1)", text: "var(--gold-600)", icon: "🔄" },
  resolved: { bg: "rgba(37, 99, 235, 0.1)", text: "var(--primary-600)", icon: "✅" },
};

const CATEGORY_ICONS: Record<string, string> = {
  infrastructure: "🛣️",
  security: "🔒",
  emergency: "🚨",
  "public-service": "🏛️",
  environment: "🌱",
  health: "⚕️",
};

export default function ReportCard({ report }: { report: Report }) {
  const statusColor = STATUS_COLORS[report.status] || STATUS_COLORS.pending;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="rounded-lg border p-4 md:p-5 shadow-sm hover:shadow-md transition-all"
      style={{
        borderColor: "var(--glass-border)",
        backgroundColor: "rgba(255, 255, 255, 0.3)",
      }}
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
        
        {/* Left Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-2">
            <span className="text-lg md:text-xl flex-shrink-0">
              {CATEGORY_ICONS[report.category] || "📍"}
            </span>
            <h3 className="text-base md:text-lg font-bold break-words" style={{ color: 'var(--fg)' }}>
              {report.title}
            </h3>
          </div>

          <p style={{ color: 'var(--muted)' }} className="text-xs md:text-sm mb-2">
            📍 {report.location}
          </p>

          <p style={{ color: 'var(--fg)' }} className="text-sm md:text-base break-words mb-3">
            {report.description}
          </p>

          {report.imageUrl && (
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={report.imageUrl}
              alt="Report"
              className="w-full md:max-w-xs rounded-lg mb-3"
            />
          )}

          <p style={{ color: 'var(--muted)' }} className="text-xs">
            📅 {new Date(report.createdAt).toLocaleDateString()} at {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex flex-col gap-2 md:items-end flex-shrink-0">
          <div
            className="px-3 py-1 rounded-full text-xs md:text-sm font-medium whitespace-nowrap"
            style={{
              backgroundColor: statusColor.bg,
              color: statusColor.text,
              border: `1px solid ${statusColor.text}20`,
            }}
          >
            <span className="mr-1">{statusColor.icon}</span>
            {report.status.toUpperCase().replace('-', ' ')}
          </div>
          
          <span
            className="text-xs md:text-sm font-medium px-2 py-1 rounded-lg"
            style={{
              backgroundColor: 'var(--primary-100)',
              color: 'var(--primary-700)',
            }}
          >
            {report.category}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
