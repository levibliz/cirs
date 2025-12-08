"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { createReport } from "../lib/api";
import { v4 as uuid } from "uuid";
import { Report } from "../types/report";

const CATEGORIES = [
  { id: "infrastructure", label: "Infrastructure", icon: "🛣️" },
  { id: "security", label: "Security", icon: "🔒" },
  { id: "emergency", label: "Emergency", icon: "🚨" },
  { id: "public-service", label: "Public Service", icon: "🏛️" },
  { id: "environment", label: "Environment", icon: "🌱" },
  { id: "health", label: "Health", icon: "⚕️" },
];

interface FormData {
  title: string;
  description: string;
  category: string;
  location: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  location?: string;
}

export default function ReportForm({ onCreate }: { onCreate: (r: Report) => void }) {
  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    category: "infrastructure",
    location: "",
  });

  // Clerk auth hook must be at top-level
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    } else if (form.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }

    if (!form.description.trim()) {
      newErrors.description = "Description is required";
    } else if (form.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!form.location.trim()) {
      newErrors.location = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Build payload that matches backend CreateReportDto (no extra properties)
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        location: form.location,
      } as const;

      if (!isLoaded || !isSignedIn) {
        throw new Error('You must be signed in to submit a report');
      }

      const token = await getToken();

      const created = await createReport(payload, token);
      onCreate(created);

      setForm({ title: "", description: "", category: "infrastructure", location: "" });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to create report:", error);
      alert("Failed to create report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border shadow-sm p-4 md:p-6 sticky top-20"
      style={{
        borderColor: 'var(--glass-border)',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <h2 className="text-xl md:text-2xl font-bold mb-4">Report an Issue</h2>

      {/* Success Message */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-4 p-3 rounded-lg text-sm font-medium"
          style={{
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            color: 'var(--primary-600)',
            border: '1px solid var(--primary-200)',
          }}
        >
          ✅ Report submitted successfully!
        </motion.div>
      )}

      {/* Title */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Title *</label>
        <input
          type="text"
          name="title"
          placeholder="Brief title of the issue"
          className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg border text-sm md:text-base transition"
          style={{
            borderColor: errors.title ? 'var(--accent-500)' : 'var(--primary-200)',
            backgroundColor: 'var(--bg)',
            color: 'var(--fg)',
          }}
          value={form.title}
          onChange={handleChange}
          disabled={loading}
        />
        {errors.title && (
          <p style={{ color: 'var(--accent-500)' }} className="text-xs mt-1">
            {errors.title}
          </p>
        )}
      </div>

      {/* Category */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Category *</label>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setForm({ ...form, category: cat.id })}
              className="p-2 md:p-3 rounded-lg border text-xs md:text-sm font-medium transition-all"
              style={{
                borderColor: form.category === cat.id ? 'var(--primary-500)' : 'var(--primary-200)',
                backgroundColor: form.category === cat.id ? 'var(--primary-100)' : 'var(--bg)',
                color: form.category === cat.id ? 'var(--primary-700)' : 'var(--fg)',
              }}
              disabled={loading}
            >
              <span className="mr-1">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Description *</label>
        <textarea
          name="description"
          placeholder="Provide detailed description of the issue"
          className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg border text-sm md:text-base transition resize-none"
          rows={4}
          style={{
            borderColor: errors.description ? 'var(--accent-500)' : 'var(--primary-200)',
            backgroundColor: 'var(--bg)',
            color: 'var(--fg)',
          }}
          value={form.description}
          onChange={handleChange}
          disabled={loading}
        />
        {errors.description && (
          <p style={{ color: 'var(--accent-500)' }} className="text-xs mt-1">
            {errors.description}
          </p>
        )}
      </div>

      {/* Location */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Location *</label>
        <input
          type="text"
          name="location"
          placeholder="Street address or area"
          className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg border text-sm md:text-base transition"
          style={{
            borderColor: errors.location ? 'var(--accent-500)' : 'var(--primary-200)',
            backgroundColor: 'var(--bg)',
            color: 'var(--fg)',
          }}
          value={form.location}
          onChange={handleChange}
          disabled={loading}
        />
        {errors.location && (
          <p style={{ color: 'var(--accent-500)' }} className="text-xs mt-1">
            {errors.location}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full px-4 py-2 md:py-3 rounded-lg font-medium text-white text-sm md:text-base transition-all"
        style={{
          background: 'linear-gradient(90deg, var(--primary-500), var(--accent-500))',
          opacity: loading ? 0.7 : 1,
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            Submitting...
          </span>
        ) : (
          "Submit Report"
        )}
      </motion.button>
    </motion.form>
  );
}
