"use client";

import { useEffect, useState, useRef, ChangeEvent } from "react";
import { BannerPageType } from "@/types/bannerpage";
import Alert from "../Common/Alert";
import ConfirmAlert from "../Common/ConfirmAlert";

// === Modal Reusable ===
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>
        {children}
        <button
          type="button"
          onClick={onClose}
          className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

// === BannerPage Modal (Tambah / Edit) ===
const BannerPageModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  name: string;
  setName: (val: string) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  preview: string | null;
  setPreview: (val: string | null) => void;
  isEdit: boolean;
  currentBanner?: BannerPageType | null;
  error?: string;
}> = ({
  isOpen,
  onClose,
  onSubmit,
  name,
  setName,
  imageFile,
  setImageFile,
  preview,
  setPreview,
  isEdit,
  currentBanner,
  error,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveFile = () => {
    setImageFile(null);
    setPreview(currentBanner?.image || null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Banner Page" : "Tambah Banner Page"}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Judul"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border rounded-lg p-3"
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />

        {/* Preview */}
        {preview && (
          <div className="mt-2 relative">
            <img
              src={preview}
              alt="Preview Banner"
              className="w-full h-40 object-cover rounded"
            />
            {imageFile && (
              <button
                type="button"
                onClick={handleRemoveFile}
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs"
              >
                Hapus
              </button>
            )}
          </div>
        )}

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className={`w-full ${
            isEdit
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-green-600 hover:bg-green-700"
          } text-white py-3 rounded-lg font-semibold`}
        >
          {isEdit ? "Update" : "Tambah"}
        </button>
      </form>
    </Modal>
  );
};

// === MAIN PAGE ===
export default function BannerPagePage() {
  const [bannerPage, setBannerPage] = useState<BannerPageType[]>([]);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedBannerPage, setSelectedBannerPage] =
    useState<BannerPageType | null>(null);

  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [alert, setAlert] = useState<any>(null);

  const fetchBannerPage = async () => {
    const res = await fetch("/api/bannerpage");
    const data = await res.json();
    setBannerPage(data);
  };

  useEffect(() => {
    fetchBannerPage();
  }, []);

  // === ADD ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const formData = new FormData();
    formData.append("name", name);
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await fetch("/api/bannerpage", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      setAddModal(false);
      resetForm();
      fetchBannerPage();
      setAlert({ type: "success", message: "Data berhasil ditambahkan!" });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  // === UPDATE ===
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBannerPage) return;
    const formData = new FormData();
    formData.append("name", name);
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await fetch(`/api/bannerpage/${selectedBannerPage.id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      setEditModal(false);
      resetForm();
      fetchBannerPage();
      setAlert({ type: "success", message: "Data berhasil diperbarui!" });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  // === DELETE ===
  const handleDelete = async (id: number) => {
    setAlert({
      type: "warning",
      message: `Apakah anda yakin ingin menghapus ?`,
      show: true,
      onConfirm: async () => {
        setAlert(null);
        try {
          const res = await fetch(`/api/bannerpage/${id}`, {
            method: "DELETE",
          });
          const data = await res.json();
          if (!res.ok) {
            setAlert({
              type: "error",
              message: data.error || "Gagal hapus data",
              show: true,
            });
            return;
          }
          fetchBannerPage();
          setAlert({
            type: "success",
            message: "data berhasil dihapus!",
            show: true,
          });
        } catch (err: any) {
          setAlert({
            type: "error",
            message: err.message || "Terjadi kesalahan",
            show: true,
          });
        }
      },
      onCancel: () => setAlert(null),
    });
  };

  const resetForm = () => {
    setName("");
    setImageFile(null);
    setPreview(null);
    setSelectedBannerPage(null);
    setError("");
  };

  return (
    <div className="min-h-screen text-gray-800">
      {/* Alert / Confirm */}
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

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Banner Page</h1>
        <button
          onClick={() => {
            resetForm();
            setAddModal(true);
          }}
          disabled={bannerPage.length > 0}
          className={`py-2 px-4 rounded-lg text-white ${
            bannerPage.length > 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-primary/90"
          }`}
        >
          Tambah Data
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-6">
        {bannerPage.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-4 p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
          >
            <div className="w-32 h-24 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-500">
                  No Image
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-black">{item.name}</h2>
              <div className="mt-2 flex gap-2 text-sm">
                <button
                  onClick={() => {
                    setSelectedBannerPage(item);
                    setName(item.name);
                    setPreview(item.image ?? "");
                    setEditModal(true);
                  }}
                  className="text-blue-500 hover:text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL Tambah */}
      <BannerPageModal
        isOpen={addModal}
        onClose={() => setAddModal(false)}
        onSubmit={handleSubmit}
        name={name}
        setName={setName}
        imageFile={imageFile}
        setImageFile={setImageFile}
        preview={preview}
        setPreview={setPreview}
        isEdit={false}
        error={error}
      />

      {/* MODAL Edit */}
      <BannerPageModal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        onSubmit={handleUpdate}
        name={name}
        setName={setName}
        imageFile={imageFile}
        setImageFile={setImageFile}
        preview={preview}
        setPreview={setPreview}
        isEdit={true}
        currentBanner={selectedBannerPage}
        error={error}
      />
    </div>
  );
}
