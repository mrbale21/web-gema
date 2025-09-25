"use client";

import Dashboard from "@/components/dashboard/Dashboard";
import { samplePosts } from "@/types/data";

export default function DashboardPage() {
  // middleware sudah jaga auth, jadi kalau user bisa masuk sini berarti token valid
  return <Dashboard />;
}
