
"use server";

import { createClerkClient } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { Report } from "@/types";

export async function getAllReports(): Promise<Report[]> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  });

  try {
    const { data: reports, error } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reports:", error);
      return [];
    }

    if (!reports) {
      return [];
    }

    const userIds = [...new Set(reports.map((report) => report.user_id))];
    const users = await clerkClient.users.getUserList({
      userId: userIds,
      limit: userIds.length,
    });

    const reportsWithUserDetails: Report[] = reports.map((report) => {
      const user = users.data.find((u) => u.id === report.user_id);
      return {
        ...report,
        user_name: user
          ? `${user.firstName} ${user.lastName}`
          : "Unknown User",
        user_image: user?.imageUrl ?? "",
      };
    });

    return reportsWithUserDetails;
  } catch (error) {
    console.error("Error in getAllReports:", error);
    return [];
  }
}
