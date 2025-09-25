"use client";
import BlogTextEditor from "@/components/Common/TextEditor";
import { ChairmanType } from "@/types/chairman";
import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
import Alert from "../Common/Alert";

export default function ChairmanDashboard() {
  const [chairman, setChairman] = useState<ChairmanType | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [fieldValue, setFieldValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const fieldLabels: Record<string, string> = {
    name: "Nama Ketua",
    title: "Judul",
    sub1: "Sub Judul Atas",
    content: "Konten",
    sub2: "Sub Judul Bawah",
    position: "Posisi Jabatan",
    period: "Periode Jabatan",
    city: "Kota",
    ToS: "Masa Jabatan",
  };

  const [alert, setAlert] = useState<{
    type: "success" | "error" | "warning" | "info";
    message: string;
    show?: boolean;
    onClose?: () => void;
  } | null>(null);

  useEffect(() => {
    fetchChairman();
  }, []);

  const fetchChairman = async () => {
    try {
      const res = await fetch("/api/chairman");
      const data = await res.json();
      if (!data) {
        setShowAddModal(true); // modal tambah jika belum ada data
      } else {
        setChairman(data);
      }
    } catch {
      setAlert({ type: "error", message: "Gagal fetch data!" });
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      const res = await fetch("/api/chairman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal tambah data");
      setChairman(data);
      setShowAddModal(false);
      setAlert({ type: "success", message: "Data berhasil ditambahkan!" });
      setName("");
    } catch (err: any) {
      setAlert({ type: "error", message: err.message || "Gagal tambah data" });
    }
  };

  const handleEdit = (key: keyof ChairmanType) => {
    if (!chairman) return;
    setEditingField(key);
    setFieldValue((chairman[key] as string) || "");
  };

  const handleSave = async (field: keyof ChairmanType) => {
    if (!chairman) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/chairman/${chairman.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: fieldValue }),
      });
      const updated = await res.json();
      setChairman(updated);
      setEditingField(null);
      setAlert({ type: "success", message: "Data berhasil diperbarui!" });
    } catch {
      setAlert({ type: "error", message: "Gagal update!" });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!chairman || !e.target.files?.[0]) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", e.target.files[0]);
      const res = await fetch(`/api/chairman/${chairman.id}`, {
        method: "PUT",
        body: formData,
      });
      const updated = await res.json();
      setChairman(updated);
      setAlert({ type: "success", message: "Image berhasil diperbarui!" });
    } catch {
      setAlert({ type: "error", message: "Gagal upload Image!" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          duration={6000}
          onClose={() => setAlert(null)}
        />
      )}

      <h1 className="text-3xl font-bold mb-8 text-gray-800">Ketua Umum</h1>

      {chairman && (
        <div className="space-y-6">
          {Object.keys(chairman).map((key) => {
            if (
              key === "id" ||
              key === "image" ||
              key === "slug" ||
              key === "createdAt"
            )
              return null;
            return (
              <div
                key={key}
                className="bg-white shadow rounded-lg p-4 border border-gray-200"
              >
                <label className="block font-semibold capitalize text-gray-700 mb-2">
                  {fieldLabels[key] || key}
                </label>
                {editingField === key ? (
                  <div className="flex flex-col gap-2">
                    {key === "content" ? (
                      <BlogTextEditor
                        value={fieldValue}
                        onChange={(val) => setFieldValue(val)}
                      />
                    ) : (
                      <input
                        type="text"
                        value={fieldValue}
                        onChange={(e) => setFieldValue(e.target.value)}
                        className="border p-2 rounded w-full focus:ring-2 focus:ring-green-400"
                      />
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave(key as keyof ChairmanType)}
                        disabled={loading}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        {loading ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => setEditingField(null)}
                        className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    {key === "content" ? (
                      <div
                        className="prose max-w-none text-gray-800 text-justify"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(
                            (chairman as any)[key] || ""
                          ),
                        }}
                      />
                    ) : (
                      <span
                        className={
                          (chairman as any)[key]
                            ? "text-gray-800"
                            : "italic text-gray-400"
                        }
                      >
                        {(chairman as any)[key] || "Belum diisi"}
                      </span>
                    )}
                    <button
                      onClick={() => handleEdit(key as keyof ChairmanType)}
                      className="text-blue-500 hover:text-blue-700 font-medium ml-3 border px-2 text-sm"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* khusus image */}
          <div className="bg-white shadow rounded-lg p-4 border border-gray-200">
            <label className="block font-semibold mb-2 text-gray-700">
              Foto Ketua Umum (ukuran maks 640x480 potrait)
            </label>
            {chairman.image ? (
              <img
                src={chairman.image}
                alt="Foto Ketua Umum"
                className="h-32 w-32 object-cover rounded-lg mb-3"
              />
            ) : (
              <p className="italic text-gray-400 mb-3">Belum ada foto</p>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block text-xs text-gray-500 border px-4 w-32 rounded-sm"
            />
            {uploading && (
              <p className="text-sm text-green-500">Uploading...</p>
            )}
          </div>
        </div>
      )}

      {/* MODAL TAMBAH DATA NAMA */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleAdd} className="space-y-4 p-6">
              <h2 className="text-xl font-bold mb-2">Tambah Ketua Umum</h2>
              <input
                type="text"
                placeholder="Nama Ketua Umum"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border rounded-lg p-3"
              />
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90"
              >
                Tambah
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
