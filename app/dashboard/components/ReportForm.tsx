"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { createReport } from "../lib/api";
import { Report } from "../types/report";
import { useUser, useAuth } from "@clerk/nextjs";
import { supabase } from "../../../lib/supabaseClient";

type CreateReportInput = {
  title: string;
  description: string;
  category: string;
  location: string;
  imageUrl?: string;
};

const ReportForm = ({ onCreate }: { onCreate: (report: Report) => void }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUser();
  const { getToken } = useAuth();

  const predefinedCategories = [
    "Roads & Streets",
    "Public Transport",
    "Waste Management",
    "Parks & Recreation",
    "Public Safety",
  ];

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in to create a report.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const reportData: CreateReportInput = {
        title,
        description,
        location,
        category: "",
      };

      // Handle image upload
      if (imageFile) {
        const fileName = `${user.id}/${Date.now()}_${imageFile.name}`;

        const { data: buckets } = await supabase.storage.listBuckets();
        const bucketExists = buckets?.some(
          (bucket) => bucket.name === "report-images"
        );

        if (bucketExists) {
          const { data, error: uploadError } = await supabase.storage
            .from("report-images")
            .upload(fileName, imageFile);

          if (!uploadError && data) {
            const { data: urlData } = supabase.storage
              .from("report-images")
              .getPublicUrl(data.path);

            reportData.imageUrl = urlData.publicUrl;
          }
        }
      }

      const finalCategory =
        category === "Other" ? otherCategory.trim() : category;

      if (!finalCategory) {
        throw new Error("Category is required.");
      }

      reportData.category = finalCategory;

      const token = await getToken({ template: "supabase" });
      const newReport = await createReport(reportData, token);

      setTitle("");
      setDescription("");
      setCategory("");
      setOtherCategory("");
      setLocation("");
      setImageFile(null);

      onCreate(newReport);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-8 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold text-gray-800">
        Create a New Report
      </h2>

      {error && (
        <div className="border px-4 py-3 rounded bg-red-100 border-red-400 text-red-700">
          {error}
        </div>
      )}

      {/* Rest of JSX remains unchanged */}
    </form>
  );
};

export default ReportForm;
