export type ReportStatus = "pending" | "in-progress" | "resolved";

export interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  imageUrl?: string | null;
  status: ReportStatus;
  createdAt: string;
}
