"use client";

import { motion } from "framer-motion";
import { Report, ReportStatus } from "../types/report";

const STATUS_COLORS: Record<
  ReportStatus,
  { bg: string; text: string; icon: string }
> = {
  pending: {
    bg: "rgba(251, 113, 133, 0.1)",
    text: "var(--accent-600)",
    icon: "⏳",
  },
  "in-progress": {
    bg: "rgba(245, 158, 11, 0.1)",
    text: "var(--gold-600)",
    icon: "🔄",
  },
  resolved: {
    bg: "rgba(37, 99, 235, 0.1)",
    text: "var(--primary-600)",
    icon: "✅",
  },
};

interface ReportCardProps {
  report: Report;
}

export default function ReportCard({ report }: ReportCardProps) {
  const statusConfig = STATUS_COLORS[report.status];

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
      {report.imageUrl && (
        <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
          <img
            src={report.imageUrl}
            alt={report.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}

      <div className="p-4 md:p-6">
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

        <p className="text-gray-600 text-sm md:text-base mb-4 line-clamp-2">
          {report.description}
        </p>

        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="font-medium">{report.category}</span>
          </div>

          <div className="flex items-center gap-2">
            <span>{report.location}</span>
          </div>

          <div className="flex items-center gap-2">
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
