
export interface Report {
  id: number;
  title: string;
  description: string;
  location: string;
  category: string;
  status: "Pending" | "In Progress" | "Resolved";
  user_id: string;
  created_at: string;
  image_url?: string;
  user_name?: string;
  user_image?: string;
}
