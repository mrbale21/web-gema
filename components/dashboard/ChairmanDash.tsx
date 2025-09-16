"use client";
import BlogTextEditor from "@/components/Common/TextEditor";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify"; // penting untuk sanitize HTML
import { ChairmanType } from "@/types/chairman";
import ConfirmAlert from "../Common/ConfirmAlert";
import Alert from "../Common/Alert";

export default function ChairmanDashboard() {
  const [chairman, setChairman] = useState<ChairmanType | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [fieldValue, setFieldValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [alert, setAlert] = useState<{
    type: "success" | "error" | "warning" | "info";
    message: string;
    show?: boolean;
    onClose?: () => void;
    onConfirm?: () => void;
    onCancel?: () => void;
  } | null>(null);

  useEffect(() => {
    fetchChairman();
  }, []);

  const fetchChairman = async () => {
    try {
      const res = await fetch("/api/chairman");
      const data = await res.json();
      setChairman(data);
    } catch {
      setAlert({ type: "error", message: "Gagal!" });
    }
  };

  const handleEdit = (key: keyof ChairmanType) => {
    if (!chairman) return;
    setEditingField(key);
    setFieldValue(chairman[key] as string);
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
      setAlert({ type: "success", message: "Image berhasil diperbarui!" });
      const updated = await res.json();
      setChairman(updated);
    } catch {
      setAlert({ type: "error", message: "Gagal upload Image!" });
    } finally {
      setUploading(false);
    }
  };

  if (!chairman) return <p className="text-center">Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
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
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Ketua Umum</h1>

      <div className="space-y-6">
        {Object.keys(chairman).map((key) => {
          if (key === "id" || key === "image") return null;
          return (
            <div
              key={key}
              className="bg-white shadow rounded-lg p-4 border border-gray-200"
            >
              <label className="block font-semibold capitalize text-gray-700 mb-2">
                {key}
              </label>

              {editingField === key ? (
                <div className="flex flex-col gap-2">
                  {key === "content" ? (
                    <BlogTextEditor
                      value={fieldValue}
                      onChange={(val: string) => setFieldValue(val)}
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
            Foto Ketua Umum
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
          {uploading && <p className="text-sm text-green-500">Uploading...</p>}
        </div>
      </div>
    </div>
  );
}
