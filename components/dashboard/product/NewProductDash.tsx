/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Alert from "@/components/Common/Alert";
import { availableIcons } from "@/components/Common/AvailableIcons";
import { useEffect, useState } from "react";

interface NewProductImage {
  id: number;
  name: string | null;
  desc: string | null;
  image: string | null;
}

interface NewProductDetail {
  id: number;
  title: string | null;
  desc: string | null;
  icon: string | null;
}

export default function NewProductDashboard({
  productId,
}: {
  productId: number;
}) {
  // STATE IMAGE
  const [images, setImages] = useState<NewProductImage[]>([]);
  const [imageName, setImageName] = useState("");
  const [imageDesc, setImageDesc] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // STATE DETAIL
  const [details, setDetails] = useState<NewProductDetail[]>([]);
  const [detailTitle, setDetailTitle] = useState("");
  const [detailDesc, setDetailDesc] = useState("");
  const [detailIcon, setDetailIcon] = useState("");

  // ALERT
  const [alert, setAlert] = useState<any>(null);

  // MODAL
  const [openImageModal, setOpenImageModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);

  // MODE EDIT
  const [editingImage, setEditingImage] = useState<NewProductImage | null>(
    null
  );
  const [editingDetail, setEditingDetail] = useState<NewProductDetail | null>(
    null
  );

  // FETCH
  const fetchData = async () => {
    const res = await fetch(`/api/newprod/${productId}`);
    if (!res.ok) {
      console.error("Failed to fetch product", res.status);
      return;
    }

    let data = {};
    try {
      data = await res.json();
    } catch {
      console.warn("Response not JSON");
    }

    setImages((data as any)?.image || []);
    setDetails((data as any)?.detail || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // IMAGE CRUD
  const handleSaveImage = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", imageName);
    formData.append("desc", imageDesc);
    if (imageFile) formData.append("image", imageFile);

    const url = editingImage
      ? `/api/newprod/${productId}/image/${editingImage.id}`
      : `/api/newprod/${productId}/image`;
    const method = editingImage ? "PUT" : "POST";

    const res = await fetch(url, { method, body: formData });
    if (res.ok) {
      fetchData();
      setAlert({
        type: "success",
        message: editingImage ? "Image diperbarui!" : "Image ditambahkan!",
      });
      setOpenImageModal(false);
      setEditingImage(null);
      setImageName("");
      setImageDesc("");
      setImageFile(null);
    }
  };

  const handleDeleteImage = async (id: number) => {
    await fetch(`/api/newprod/${productId}/image/${id}`, { method: "DELETE" });
    fetchData();
  };

  // DETAIL CRUD
  const handleSaveDetail = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      title: detailTitle,
      desc: detailDesc,
      icon: detailIcon,
    };

    const url = editingDetail
      ? `/api/newprod/${productId}/detail/${editingDetail.id}`
      : `/api/newprod/${productId}/detail`;
    const method = editingDetail ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      fetchData();
      setAlert({
        type: "success",
        message: editingDetail ? "Detail diperbarui!" : "Detail ditambahkan!",
      });
      setOpenDetailModal(false);
      setEditingDetail(null);
      setDetailTitle("");
      setDetailDesc("");
      setDetailIcon("");
    }
  };

  const handleDeleteDetail = async (id: number) => {
    await fetch(`/api/newprod/${productId}/detail/${id}`, { method: "DELETE" });
    fetchData();
  };

  // HELPER buka modal edit image
  const openEditImageModal = (img: NewProductImage) => {
    setEditingImage(img);
    setImageName(img.name || "");
    setImageDesc(img.desc || "");
    setImageFile(null);
    setOpenImageModal(true);
  };

  // HELPER buka modal edit detail
  const openEditDetailModal = (d: NewProductDetail) => {
    setEditingDetail(d);
    setDetailTitle(d.title || "");
    setDetailDesc(d.desc || "");
    setDetailIcon(d.icon || "");
    setOpenDetailModal(true);
  };

  return (
    <div className="p-6 space-y-10">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          duration={5000}
          onClose={() => setAlert(null)}
        />
      )}

      {/* ================= IMAGE ================= */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Kelola Images</h2>
          <button
            onClick={() => {
              setEditingImage(null);
              setImageName("");
              setImageDesc("");
              setImageFile(null);
              setOpenImageModal(true);
            }}
            className="bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-primary/90 transition"
          >
            + Tambah Image
          </button>
        </div>

        <div className="grid gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="flex items-center justify-between p-4 bg-white shadow rounded-lg"
            >
              <div className="flex items-center gap-4">
                {img.image ? (
                  <img
                    src={img.image}
                    alt={img.name || ""}
                    className="w-20 h-16 object-cover rounded"
                  />
                ) : (
                  <div className="w-20 h-16 bg-gray-200 flex items-center justify-center rounded">
                    No Image
                  </div>
                )}
                <div>
                  <p className="font-semibold">{img.name}</p>
                  <p className="text-sm text-gray-600">{img.desc}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => openEditImageModal(img)}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteImage(img.id)}
                  className="text-red-500 hover:underline"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= DETAIL ================= */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Kelola Detail</h2>
          <button
            onClick={() => {
              setEditingDetail(null);
              setDetailTitle("");
              setDetailDesc("");
              setDetailIcon("");
              setOpenDetailModal(true);
            }}
            className="bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-primary/90 transition"
          >
            + Tambah Detail
          </button>
        </div>

        <div className="grid gap-4">
          {details.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between p-4 bg-white shadow rounded-lg"
            >
              <div>
                <p className="font-semibold">{d.title}</p>
                <p className="text-sm text-gray-600">{d.desc}</p>
                <p className="text-xs text-gray-400">Icon: {d.icon}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => openEditDetailModal(d)}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteDetail(d.id)}
                  className="text-red-500 hover:underline"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= MODAL ADD/EDIT IMAGE ================= */}
      {openImageModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <form
            onSubmit={handleSaveImage}
            className="bg-white rounded-2xl shadow-xl w-[420px] p-6 space-y-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
              {editingImage ? "Edit Image" : "Tambah Image"}
            </h2>

            <div>
              <label className="block text-sm mb-1">Nama</label>
              <input
                type="text"
                value={imageName}
                onChange={(e) => setImageName(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Deskripsi</label>
              <textarea
                value={imageDesc}
                onChange={(e) => setImageDesc(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 h-20"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Gambar</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setImageFile(e.target.files ? e.target.files[0] : null)
                }
              />
              {editingImage?.image && !imageFile && (
                <p className="text-xs text-gray-500 mt-1">
                  (Tetap gunakan gambar lama jika tidak diubah)
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpenImageModal(false);
                  setEditingImage(null);
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= MODAL ADD/EDIT DETAIL ================= */}
      {openDetailModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <form
            onSubmit={handleSaveDetail}
            className="bg-white rounded-2xl shadow-xl w-[420px] p-6 space-y-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
              {editingDetail ? "Edit Detail" : "Tambah Detail"}
            </h2>

            <div>
              <label className="block text-sm mb-1">Judul</label>
              <input
                type="text"
                value={detailTitle}
                onChange={(e) => setDetailTitle(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Deskripsi</label>
              <textarea
                value={detailDesc}
                onChange={(e) => setDetailDesc(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 h-20"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Icon</label>
              <select
                value={detailIcon}
                onChange={(e) => setDetailIcon(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">-- Pilih Icon --</option>
                {availableIcons.map((ic) => (
                  <option key={ic.name} value={ic.name}>
                    {ic.name}
                  </option>
                ))}
              </select>

              {/* Preview Icon */}
              {detailIcon && (
                <div className="mt-2">
                  <span className="text-gray-600 text-sm">Preview: </span>
                  {availableIcons.find((ic) => ic.name === detailIcon)?.icon}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpenDetailModal(false);
                  setEditingDetail(null);
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
