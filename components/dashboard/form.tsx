"use client";

import React, { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import ButtonDash from "@/components/Common/ButtonDashboard";

// Contoh tipe data Post
interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  status: "draft" | "published" | "archived";
  category: string;
  createdAt: string;
}

// Contoh data dummy
const samplePosts: Post[] = [
  {
    id: "1",
    title: "Next.js Basics",
    content: "Learn the basics of Next.js...",
    author: "John Doe",
    status: "published",
    category: "Development",
    createdAt: "2024-09-08",
  },
  {
    id: "2",
    title: "React Tips",
    content: "Some useful React tips...",
    author: "Jane Smith",
    status: "draft",
    category: "Development",
    createdAt: "2024-09-07",
  },
];

export default function TenantPage() {
  const [posts, setPosts] = useState<Post[]>(samplePosts);

  // Fungsi dummy untuk edit
  const handleEdit = (post: Post) => {
    alert(`Edit post: ${post.title}`);
  };

  // Fungsi dummy untuk delete
  const handleDelete = (id: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== id));
  };

  // Fungsi untuk warna status
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

  const filteredPosts = posts;

  return (
    <>
      <div className="w-full flex justify-between ">
        <h1 className="text-gray-900 font-bold text-xl">Data Tenant</h1>
        <ButtonDash label="Tambah Data" href="#" />
      </div>
      {/* Posts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-700">
                  Title
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">
                  Author
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">
                  Category
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">
                  Status
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">
                  Date
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPosts.map((post) => (
                <tr
                  key={post.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {post.content.substring(0, 50)}...
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{post.author}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {post.category}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        post.status
                      )}`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{post.createdAt}</td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
