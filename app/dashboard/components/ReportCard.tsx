"use client";

import { motion } from "framer-motion";
import { Report } from "../types/report";

const STATUS_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  pending: { bg: "rgba(251, 113, 133, 0.1)", text: "var(--accent-600)", icon: "⏳" },
  "in-progress": { bg: "rgba(245, 158, 11, 0.1)", text: "var(--gold-600)", icon: "🔄" },
  resolved: { bg: "rgba(37, 99, 235, 0.1)", text: "var(--primary-600)", icon: "✅" },
};

interface ReportCardProps {
  report: Report;
}

export default function ReportCard({ report }: ReportCardProps) {
  const statusConfig = STATUS_COLORS[report.status] || STATUS_COLORS.pending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
      style={{
        borderColor: "var(--glass-border)",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
      }}
    >
      {/* Image Section - Display if imageUrl exists */}
      {report.imageUrl && (
        <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
          <img
            src={report.imageUrl}
            alt={report.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Hide image if it fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Content Section */}
      <div className="p-4 md:p-6">
        {/* Header with Status Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 flex-1">
            {report.title}
          </h3>
          <div
            className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap"
            style={{
              backgroundColor: statusConfig.bg,
              color: statusConfig.text,
            }}
          >
            <span className="mr-1">{statusConfig.icon}</span>
            {report.status.replace("-", " ")}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm md:text-base mb-4 line-clamp-2">
          {report.description}
        </p>

        {/* Metadata */}
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <span className="font-medium">{report.category}</span>
          </div>

          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{report.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              {new Date(report.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
