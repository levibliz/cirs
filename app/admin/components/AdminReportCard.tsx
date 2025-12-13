"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Report } from "../types/report";

const STATUS_FLOW: Record<string, string[]> = {
  pending: ["in-progress", "resolved"],
  "in-progress": ["resolved"],
  resolved: [],
};

export default function AdminReportCard({
  report,
  onUpdate,
  onDelete,
  onEdit,
}: {
  report: Report;
  onUpdate: (id: string, patch: Partial<Report>) => void;
  onDelete: (id: string) => void;
  onEdit?: (id: string, patch: Partial<Report>) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ title: report.title, description: report.description, location: report.location });

  const setStatus = async (next: string) => {
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
    onEdit?.(report.id, { ...draft });
    setEditing(false);
  };

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }} className="rounded-lg border p-4 md:p-5 flex flex-col md:flex-row gap-4 md:items-start justify-between" style={{ borderColor: "var(--glass-border)", background: "rgba(255,255,255,0.4)" }}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 text-2xl">{report.category === "infrastructure" ? "🛣️" : report.category === "security" ? "🔒" : report.category === "emergency" ? "🚨" : "📍"}</div>
          <div className="min-w-0">
            {!editing ? (
              <>
                <h3 className="font-bold text-base md:text-lg" style={{ color: "var(--fg)" }}>{report.title}</h3>
                <div className="text-xs" style={{ color: "var(--muted)" }}>{report.location} • {new Date(report.createdAt).toLocaleString()}</div>
              </>
            ) : (
              <div>
                <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="w-full px-3 py-2 rounded-md mb-2" style={{ border: "1px solid var(--primary-200)", background: "var(--bg)", color: "var(--fg)" }} />
                <input value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} className="w-full px-3 py-2 rounded-md mb-2" style={{ border: "1px solid var(--primary-200)", background: "var(--bg)", color: "var(--fg)" }} />
              </div>
            )}
          </div>
        </div>

        {!editing ? (
          <p className="mt-3 text-sm" style={{ color: "var(--fg)" }}>{report.description}</p>
        ) : (
          <textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} rows={4} className="w-full px-3 py-2 rounded-md" style={{ border: "1px solid var(--primary-200)", background: "var(--bg)", color: "var(--fg)" }} />
        )}

        {report.imageUrl && <img src={report.imageUrl} alt="report" className="mt-3 w-full md:max-w-xs rounded-md" />}
      </div>

      <div className="flex flex-col items-stretch gap-2 md:items-end">
        <div className="flex gap-2 items-center">
          <div className="px-3 py-1 rounded-full text-sm font-medium" style={{ background: "var(--primary-100)", color: "var(--primary-700)" }}>
            {report.category}
          </div>
          <div className="px-3 py-1 rounded-full text-sm font-medium" style={{ background: report.status === "pending" ? "rgba(251,113,133,0.08)" : report.status === "in-progress" ? "rgba(245,158,11,0.08)" : "rgba(37,99,235,0.08)", color: report.status === "pending" ? "var(--accent-600)" : report.status === "in-progress" ? "var(--gold-600)" : "var(--primary-600)" }}>
            {report.status.toUpperCase().replace("-", " ")}
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <select disabled={busy} defaultValue="" onChange={(e) => { const val = e.target.value; if (!val) return; setStatus(val); (e.target as HTMLSelectElement).value = ""; }} className="px-3 py-2 rounded-md text-sm" style={{ border: "1px solid var(--primary-200)", background: "var(--bg)", color: "var(--fg)" }} aria-label="Change status">
            <option value="">Change status</option>
            {STATUS_FLOW[report.status].map((s) => <option key={s} value={s}>{s.replace("-", " ")}</option>)}
          </select>

          {!editing ? (
            <button onClick={() => setEditing(true)} className="px-3 py-2 rounded-md text-sm font-medium" style={{ background: "var(--primary-100)", color: "var(--primary-700)" }}>
              Edit
            </button>
          ) : (
            <button onClick={saveEdit} className="px-3 py-2 rounded-md text-sm font-medium" style={{ background: "linear-gradient(90deg,var(--primary-500),var(--accent-500))", color: "white" }}>
              Save
            </button>
          )}

          <button onClick={() => onDelete(report.id)} className="px-3 py-2 rounded-md text-sm font-medium" style={{ background: "transparent", border: "1px solid rgba(255,0,0,0.08)", color: "var(--accent-600)" }}>
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}