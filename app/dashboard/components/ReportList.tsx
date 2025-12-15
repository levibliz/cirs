"use client";

import { motion } from "framer-motion";
import ReportCard from "./ReportCard";
import { Report } from "../types/report";
import { AnimatePresence } from "framer-motion";

interface ReportListProps {
  reports: Report[];
}

export default function ReportList({ reports }: ReportListProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      className="space-y-3 md:space-y-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <AnimatePresence mode="popLayout">
        {reports.map((r) => (
          <motion.div key={r.id} variants={itemVariants}>
            <ReportCard report={r} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
