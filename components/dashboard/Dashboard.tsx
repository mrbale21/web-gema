"use client";
import { Plus, Eye, Edit, FileText, BarChart3, Tag } from "lucide-react";
import { Post } from "@/types/types";

interface DashboardProps {
  posts: Post[];
}

// Fungsi helper
const getStatusColor = (status: string) => {
  switch (status) {
    case "published":
      return "bg-green-100 text-green-800";
    case "draft":
      return "bg-yellow-100 text-yellow-800";
    case "archived":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function Dashboard({ posts }: DashboardProps) {
  // Stats cards
  const stats = [
    {
      label: "Total Posts",
      value: posts.length,
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      label: "Published",
      value: posts.filter((p) => p.status === "published").length,
      icon: Eye,
      color: "bg-green-500",
    },
    {
      label: "Drafts",
      value: posts.filter((p) => p.status === "draft").length,
      icon: Edit,
      color: "bg-yellow-500",
    },
    {
      label: "Total Views",
      value: "12,543",
      icon: BarChart3,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with your content.
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>New Post</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Recent Posts</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {posts.slice(0, 5).map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{post.title}</h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    <span>By {post.author}</span>
                    <span>{post.createdAt}</span>
                    <span className="flex items-center space-x-1">
                      <Tag className="h-3 w-3" />
                      <span>{post.category}</span>
                    </span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    post.status
                  )}`}
                >
                  {post.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
