"use client";

import { Report } from "../types/report";
import AdminReportCard from "./AdminReportCard";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface AdminReportListProps {
  reports: Report[];
  onUpdate: (id: string, patch: Partial<Report>) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, patch: Partial<Report>) => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function AdminReportList({
  reports,
  onUpdate,
  onDelete,
  onEdit,
}: AdminReportListProps) {
  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <p style={{ color: "var(--muted)" }}>No reports found.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="popLayout">
        {reports.map((report) => (
          <motion.div
            key={report.id}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <AdminReportCard
              report={report}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
