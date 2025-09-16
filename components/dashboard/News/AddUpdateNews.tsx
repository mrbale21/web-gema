"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BlogTextEditor from "@/components/Common/TextEditor";
import ConfirmAlert from "@/components/Common/ConfirmAlert";
import Alert from "@/components/Common/Alert";

export default function AddNewsPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [editor, setEditor] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [alert, setAlert] = useState<{
    type: "success" | "error" | "warning" | "info";
    message: string;
    show?: boolean;
    onClose?: () => void;
    onConfirm?: () => void;
    onCancel?: () => void;
  } | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/news/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setTitle(data.title);
          setContent(data.content);
          setTag(data.tag);
          setEditor(data.editor);
          setMounted(true);
        });
    } else {
      setMounted(true);
    }
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
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
      {alert && alert.onConfirm ? (
        <ConfirmAlert
          type={alert.type}
          message={alert.message}
          show={alert.show ?? true}
          onConfirm={alert.onConfirm}
          onCancel={alert.onCancel}
        />
      ) : (
        alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            duration={6000}
            onClose={() => setAlert(null)}
          />
        )
      )}
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">
          {id ? "Edit Berita" : "Tambah Berita"}
        </h1>

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
              placeholder="Masukkan judul berita"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 text-gray-800"
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

          {/* Tag dan Editor */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tag
              </label>
              <input
                type="text"
                placeholder="Contoh: Wisata, Kuliner"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 text-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Editor
              </label>
              <input
                type="text"
                placeholder="Nama editor"
                value={editor}
                onChange={(e) => setEditor(e.target.value)}
                required
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 text-gray-800"
              />
            </div>
          </div>

          {/* Upload Gambar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gambar Thumbnail
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none py-2"
            />
            {imageFile && (
              <p className="mt-2 text-sm text-gray-500">
                File dipilih: {imageFile.name}
              </p>
            )}
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {id ? "Update" : "Tambah"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/dashboard/news")}
              className="border px-6 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
