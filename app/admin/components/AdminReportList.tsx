"use client";

import { motion } from "framer-motion";
import AdminReportCard from "./AdminReportCard";
import { Report } from "../types/report";

export default function AdminReportList({
  reports,
  onUpdate,
  onDelete,
  onEdit,
}: {
  reports: Report[];
  onUpdate: (id: string, patch: Partial<Report>) => void;
  onDelete: (id: string) => void;
  onEdit?: (id: string, patch: Partial<Report>) => void;
}) {
  if (!reports.length) {
    return (
      <div className="py-12 text-center" style={{ color: "var(--muted)" }}>
        No reports match your filters.
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
      }}
      className="space-y-4"
    >
      {reports.map((r) => (
        <motion.div key={r.id} variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
          <AdminReportCard report={r} onUpdate={onUpdate} onDelete={onDelete} onEdit={onEdit} />
        </motion.div>
      ))}
    </motion.div>
  );
}