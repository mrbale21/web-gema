"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BlogTextEditor from "@/components/Common/TextEditor";

type CategoryType = {
  id: number;
  name: string;
  slug: string;
};

export default function AddNewsPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [editor, setEditor] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<CategoryType[]>([]);

  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // ambil kategori
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  // jika edit berita
  useEffect(() => {
    if (id) {
      fetch(`/api/news/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setTitle(data.title);
          setContent(data.content);
          setTag(data.tag);
          setEditor(data.editor);
          setCategoryId(data.categoryId || null);
          if (data.image) {
            setImagePreview(data.image);
          }
          setMounted(true);
        });
    } else {
      setMounted(true);
    }
  }, [id]);

  // handle pilih gambar
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);

    if (file) {
      setImagePreview(URL.createObjectURL(file)); // preview langsung
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("tag", tag);
    formData.append("editor", editor);
    if (imageFile) formData.append("image", imageFile);
    if (categoryId) formData.append("categoryId", categoryId.toString());

    try {
      const res = await fetch(id ? `/api/news/${id}` : "/api/news", {
        method: id ? "PUT" : "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Terjadi kesalahan");
        return;
      }

      router.push("/admin/dashboard/news");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-6 rounded-xl shadow-md"
        >
          {/* Judul */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Judul
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border rounded-lg p-3 text-gray-800"
            />
          </div>

          {/* Konten */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Konten
            </label>
            <BlogTextEditor
              value={content}
              onChange={(val) => setContent(val)}
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Kategori
            </label>
            <select
              value={categoryId ?? ""}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              required
              className="w-full border rounded-lg p-3 text-gray-800"
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tag + Editor */}
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="border p-3 rounded-lg text-gray-800"
            />
            <input
              type="text"
              placeholder="Editor"
              value={editor}
              onChange={(e) => setEditor(e.target.value)}
              className="border p-3 rounded-lg text-gray-800"
              required
            />
          </div>

          {/* Upload Gambar + Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gambar
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-gray-700 border border-gray-700 py-1 px-2 rounded-lg"
            />

            {imagePreview && (
              <div className="mt-4 relative w-full h-48 rounded-lg overflow-hidden border">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black/10 hover:bg-black/20 transition flex items-center justify-center text-white text-sm opacity-0 hover:opacity-100">
                  Preview Gambar
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              {id ? "Update" : "Tambah"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/dashboard/news")}
              className="border px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-200"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
