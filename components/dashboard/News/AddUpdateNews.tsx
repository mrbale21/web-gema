"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BlogTextEditor from "@/components/Common/TextEditor";
import ConfirmAlert from "@/components/Common/ConfirmAlert";
import Alert from "@/components/Common/Alert";

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
  const [categoryId, setCategoryId] = useState<number | null>(null); // kategori
  const [categories, setCategories] = useState<CategoryType[]>([]);

  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [alert, setAlert] = useState<any>(null);

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
          setMounted(true);
        });
    } else {
      setMounted(true);
    }
  }, [id]);

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

      setAlert({
        type: "success",
        message: id
          ? "Berita berhasil diupdate"
          : "Berita berhasil ditambahkan",
      });

      router.push("/admin/dashboard/news");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* form berita */}
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
              className="w-full border rounded-lg p-3  text-gray-800"
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
              className="border p-3 rounded-lg  text-gray-800"
            />
            <input
              type="text"
              placeholder="Editor"
              value={editor}
              onChange={(e) => setEditor(e.target.value)}
              className="border p-3 rounded-lg  text-gray-800"
              required
            />
          </div>

          {/* Upload Gambar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gambar
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="  text-gray-700"
            />
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
              className="border px-6 py-2 rounded-lg  text-gray-600 hover:bg-gray-200"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
