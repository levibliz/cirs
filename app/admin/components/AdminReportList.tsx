"use client";

import { Report } from "../types/report";
import AdminReportCard from "./AdminReportCard";
import { motion, AnimatePresence } from "framer-motion";

interface AdminReportListProps {
  reports: Report[];
  onUpdate: (id: string, patch: Partial<Report>) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, patch: Partial<Report>) => void;
}

export default function AdminReportList({ 
  reports, 
  onUpdate, 
  onDelete, 
  onEdit 
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="popLayout">
        {reports.map((report) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
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