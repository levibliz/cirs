"use client";

import { Report, ReportStatus } from "../types/report";
import { useState } from "react";
import { motion } from "framer-motion";

const STATUS_FLOW: Record<ReportStatus, ReportStatus[]> = {
  pending: ["in-progress", "resolved"],
  "in-progress": ["resolved", "pending"],
  resolved: ["pending", "in-progress"],
};

type CategoryKey =
  | "infrastructure"
  | "security"
  | "emergency"
  | "public-service"
  | "environment";

const CATEGORY_ICONS: Partial<Record<CategoryKey, string>> = {
  infrastructure: "🛣️",
  security: "🔒",
  emergency: "🚨",
  "public-service": "🏛️",
  environment: "🌳",
};

interface EditableReportFields {
  title: string;
  description: string;
  location: string;
}

interface AdminReportCardProps {
  report: Report;
  onUpdate: (id: string, patch: Partial<Report>) => void;
  onDelete: (id: string) => void;
  onEdit?: (id: string, patch: Partial<Report>) => void;
}

export default function AdminReportCard({
  report,
  onUpdate,
  onDelete,
  onEdit,
}: AdminReportCardProps) {
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<EditableReportFields>({
    title: report.title,
    description: report.description,
    location: report.location,
  });

  const setStatus = async (next: ReportStatus) => {
    setBusy(true);
    try {
      onUpdate(report.id, { status: next });
    } finally {
      setBusy(false);
    }
  };

  const saveEdit = () => {
    if (!draft.title.trim() || !draft.description.trim()) {
      alert("Title and description are required.");
      return;
    }
    onEdit?.(report.id, draft);
    setEditing(false);
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className="rounded-lg border p-4 md:p-5 flex flex-col md:flex-row gap-4 md:items-start justify-between"
      style={{
        borderColor: "var(--glass-border)",
        background: "rgba(255,255,255,0.4)",
      }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 text-2xl">
            {CATEGORY_ICONS[report.category as CategoryKey] ?? "📍"}
          </div>

          <div className="min-w-0">
            {!editing ? (
              <>
                <h3 className="font-bold text-base md:text-lg">
                  {report.title}
                </h3>
                <div className="text-xs text-gray-500">
                  {report.location} •{" "}
                  {new Date(report.createdAt).toLocaleString()}
                </div>
              </>
            ) : (
              <div>
                <input
                  value={draft.title}
                  onChange={(e) =>
                    setDraft({ ...draft, title: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-md mb-2"
                />
                <input
                  value={draft.location}
                  onChange={(e) =>
                    setDraft({ ...draft, location: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-md mb-2"
                />
              </div>
            )}
          </div>
        </div>

        {!editing ? (
          <p className="mt-3 text-sm">{report.description}</p>
        ) : (
          <textarea
            value={draft.description}
            onChange={(e) =>
              setDraft({ ...draft, description: e.target.value })
            }
            rows={4}
            className="w-full px-3 py-2 rounded-md"
          />
        )}

        {report.imageUrl && (
          <img
            src={report.imageUrl}
            alt="report"
            className="mt-3 w-full md:max-w-xs rounded-md"
          />
        )}
      </div>

      <div className="flex flex-col gap-2 md:items-end">
        <div className="flex gap-2">
          <div className="px-3 py-1 rounded-full text-sm">
            {report.category}
          </div>
          <div className="px-3 py-1 rounded-full text-sm">
            {report.status.replace("-", " ").toUpperCase()}
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <select
            disabled={busy}
            value=""
            onChange={(e) => {
              const val = e.target.value as ReportStatus; // <--- cast to ReportStatus
              if (!val) return;
              setStatus(val);
            }}
            className="px-3 py-2 rounded-md text-sm"
            style={{
              border: "1px solid var(--primary-200)",
              background: "var(--bg)",
              color: "var(--fg)",
            }}
            aria-label="Change status"
          >
            <option value="">Change status</option>
            {STATUS_FLOW[report.status].map((s) => (
              <option key={s} value={s}>
                {s.replace("-", " ")}
              </option>
            ))}
          </select>

          {!editing ? (
            <button onClick={() => setEditing(true)}>Edit</button>
          ) : (
            <button onClick={saveEdit}>Save</button>
          )}

          <button onClick={() => onDelete(report.id)}>Delete</button>
        </div>
      </div>
    </motion.div>
  );
}
