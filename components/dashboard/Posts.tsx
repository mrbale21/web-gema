// components/dashboard/Posts.tsx
import React, { Dispatch, SetStateAction, useState } from "react";
import { Post } from "@/types/types";
import { Plus, Edit, Trash2, Search, Tag } from "lucide-react";

interface PostsProps {
  posts: Post[];
  setPosts: Dispatch<SetStateAction<Post[]>>;
  setCurrentPage: Dispatch<SetStateAction<string>>;
}

export default function Posts({ posts, setPosts, setCurrentPage }: PostsProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  const handleEdit = (post: Post) => {
    // Pindah ke halaman add-post dan bisa set editing post di PostForm
    setCurrentPage("add-post");
    // implementasi editingPost bisa ditambahkan di PostForm jika perlu
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "published":
        return "bg-green-100 text-green-800";
      case "archived":
        return "bg-red-100 text-red-800";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Posts Management</h1>
          <p className="text-gray-600 mt-1">
            Manage all your content in one place.
          </p>
        </div>
        <button
          onClick={() => setCurrentPage("add-post")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Post</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search posts..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
    </div>
  );
}
