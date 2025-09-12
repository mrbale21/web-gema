// components/dashboard/PostForm.tsx
import React, { Dispatch, SetStateAction, useState } from "react";
import { Post } from "@/types/types";
import BlogTextEditor from "../Common/TextEditor";

interface PostFormProps {
  setPosts: Dispatch<SetStateAction<Post[]>>;
  setCurrentPage: Dispatch<SetStateAction<string>>;
  editingPost?: Post | null;
}

export default function PostForm({
  setPosts,
  setCurrentPage,
  editingPost,
}: PostFormProps) {
  const [formData, setFormData] = useState<Post>(
    editingPost || {
      id: "",
      title: "",
      content: "",
      author: "",
      status: "draft",
      category: "",
      createdAt: new Date().toLocaleDateString(),
    }
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPost) {
      setPosts((prev) =>
        prev.map((post) => (post.id === formData.id ? formData : post))
      );
    } else {
      setPosts((prev) => [
        ...prev,
        {
          ...formData,
          id: Date.now().toString(),
          createdAt: new Date().toLocaleDateString(),
        },
      ]);
    }
    setCurrentPage("posts");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {editingPost ? "Edit Post" : "Create New Post"}
          </h1>
        </div>
        <button
          onClick={() => setCurrentPage("posts")}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          Cancel
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6"
      >
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Title"
          required
          className="w-full px-4 py-3 border rounded-lg text-black"
        />
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleInputChange}
          placeholder="Author"
          required
          className="w-full px-4 py-3 border rounded-lg text-black"
        />
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          placeholder="Category"
          required
          className="w-full px-4 py-3 border rounded-lg  text-black"
        />

        <BlogTextEditor value={formData.content} />

        <textarea
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          placeholder="Content"
          required
          className="w-full px-4 py-3 border rounded-lg text-black"
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border rounded-lg text-black"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <input
          type="file"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          placeholder="Category"
          required
          className="w-full px-4 py-3 border rounded-lg  text-black"
        />
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => setCurrentPage("posts")}
            className="px-6 py-3 border rounded-lg border-primary text-primary hover:bg-secondary hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 "
          >
            {editingPost ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
