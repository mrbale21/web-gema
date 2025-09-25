"use client";

import { useEffect, useState } from "react";
import ConfirmAlert from "../../Common/ConfirmAlert";
import Alert from "../../Common/Alert";
import { ProductImage } from "@/types/productImage";
import { Product } from "@/types/products";

export default function ProductImagePage({ product }: { product: Product }) {
  const [productImage, setProductImage] = useState<ProductImage[]>([]);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [error, setError] = useState("");
  const [selectedProductImage, setSelectedProductImage] =
    useState<ProductImage | null>(null);

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [alert, setAlert] = useState<{
    type: "success" | "error" | "warning" | "info";
    message: string;
    show?: boolean;
    onClose?: () => void;
    onConfirm?: () => void;
    onCancel?: () => void;
  } | null>(null);

  const fetchProductImage = async () => {
    const res = await fetch(`/api/products/${product.id}/products-image`);
    const data = await res.json();
    setProductImage(data);
  };

  useEffect(() => {
    if (product?.id) fetchProductImage();
  }, [product?.id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // === ADD ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("desc", desc);
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await fetch(`/api/products/${product.id}/products-image`, {
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
      fetchProductImage();
      setAlert({ type: "success", message: "Data berhasil ditambahkan!" });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  // === UPDATE ===
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductImage) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("desc", desc);
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await fetch(
        `/api/products/${product.id}/products-image/${selectedProductImage.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setEditModal(false);
      resetForm();
      fetchProductImage();
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
          const res = await fetch(
            `/api/products/${product.id}/products-image/${id}`,
            {
              method: "DELETE",
            }
          );
          const data = await res.json();
          if (!res.ok) {
            setAlert({
              type: "error",
              message: data.error || "Gagal hapus data",
              show: true,
            });
            return;
          }
          fetchProductImage();
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
    setDesc("");
    setImageFile(null);
    setSelectedProductImage(null);
    setError("");
  };

  return (
    <div className="max-h-md text-gray-800">
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
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold">Image {product.name}</h1>
        <button
          onClick={() => setAddModal(true)}
          className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90"
        >
          Tambah Data
        </button>
      </div>

      {/* === LIST ProductImage === */}
      <div className="space-y-6">
        {productImage.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-4 p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
          >
            {/* Image */}
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

            {/* Text content */}
            <div className="flex-1 flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-black">{item.name}</h2>
              <p className="text-sm text-gray-600">{item.desc}</p>{" "}
              {/* 🔥 tampilkan desc */}
              {/* Optional actions */}
              <div className="mt-2 flex gap-2 text-sm">
                <button
                  onClick={() => {
                    setSelectedProductImage(item);
                    setName(item.name || "");
                    setDesc(item.desc || ""); // 🔥 isi desc saat edit
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

      {/* === MODAL TAMBAH === */}
      {addModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-white p-6 rounded-lg shadow-lg w-96"
          >
            <input
              type="text"
              placeholder="Nama ProductImage"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border rounded-lg p-3"
            />

            <input
              type="text"
              placeholder="Deskripsi"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
              className="w-full border rounded-lg p-3"
            />

            <input type="file" accept="image/*" onChange={handleFileChange} />

            {error && <p className="text-red-500">{error}</p>}

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90"
            >
              Tambah
            </button>
            <button
              type="button"
              onClick={() => setAddModal(false)}
              className="w-full mt-2 border border-gray-300 rounded-lg py-2 hover:bg-gray-100"
            >
              Batal
            </button>
          </form>
        </div>
      )}

      {/* === MODAL UPDATE === */}
      {editModal && selectedProductImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <form
            onSubmit={handleUpdate}
            className="space-y-4 bg-white p-6 rounded-lg shadow-lg w-96"
          >
            <input
              type="text"
              placeholder="Nama ProductImage"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border rounded-lg p-3"
            />

            <input
              type="text"
              placeholder="Deskripsi"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
              className="w-full border rounded-lg p-3"
            />

            <input type="file" accept="image/*" onChange={handleFileChange} />

            {error && <p className="text-red-500">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => setEditModal(false)}
              className="w-full mt-2 border border-gray-300 rounded-lg py-2 hover:bg-gray-100"
            >
              Batal
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
