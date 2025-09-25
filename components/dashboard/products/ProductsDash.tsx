"use client";

import { useEffect, useState } from "react";
import Alert from "../../Common/Alert";
import ConfirmAlert from "@/components/Common/ConfirmAlert";
import { Product } from "@/types/products";
import { ProductTitle } from "@/types/productTitle";
import ProductSubTitle from "./ProductSubTitle";
import ProductSuperior from "./ProductSuperior";
import ProductType from "./ProductType";
import ProductBenefitPage from "./ProductBenefit";
import ProductImageImage from "./ProductImage";
import ProductImagePage from "./ProductImage";

export default function ProductDashboard({ product }: { product: Product }) {
  const [productTitles, setProductTitles] = useState<ProductTitle | null>(null);
  const [error, setError] = useState("");
  const [alert, setAlert] = useState<any>(null);

  // === STATE FORM ===
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selected, setSelected] = useState<ProductTitle | null>(null);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  // === FETCH DATA TITLE BY PRODUCT ID ===
  const fetchProductTitles = async () => {
    try {
      const res = await fetch(`/api/products/${product.id}/products-title`);
      const data = await res.json();

      if (!data?.id) {
        setProductTitles(null);
        return;
      }

      setProductTitles(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gagal mengambil data");
    }
  };

  useEffect(() => {
    if (product?.id) fetchProductTitles();
  }, [product?.id]);

  // === RESET FORM ===
  const resetForm = () => {
    setTitle("");
    setDesc("");
    setSelected(null);
    setError("");
  };

  // === ADD ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`/api/products/${product.id}/products-title`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, desc }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal tambah data");
        return;
      }
      setAddModal(false);
      resetForm();
      fetchProductTitles();
      setAlert({ type: "success", message: "Data berhasil ditambahkan!" });
    } catch (err: any) {
      setError(err.message);
    }
  };

  // === UPDATE ===
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected?.id) {
      setError("Tidak ada data yang dipilih untuk diupdate");
      return;
    }

    try {
      const res = await fetch(`/api/products/${product.id}/products-title`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, desc }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal update data");
        return;
      }
      setEditModal(false);
      resetForm();
      fetchProductTitles();
      setAlert({ type: "success", message: "Data berhasil diperbarui!" });
    } catch (err: any) {
      setError(err.message);
    }
  };

  // === DELETE ===
  const handleDelete = async (id: number) => {
    setAlert({
      type: "warning",
      message: "Apakah anda yakin ingin menghapus data ini?",
      show: true,
      onConfirm: async () => {
        setAlert(null);
        try {
          const res = await fetch(
            `/api/products/${product.id}/products-title`,
            {
              method: "DELETE",
            }
          );
          const data = await res.json();
          if (!res.ok) {
            setAlert({
              type: "error",
              message: data.error || "Gagal hapus data",
            });
            return;
          }
          fetchProductTitles();
          setAlert({ type: "success", message: "Data berhasil dihapus!" });
        } catch (err: any) {
          setAlert({
            type: "error",
            message: err.message || "Terjadi kesalahan",
          });
        }
      },
      onCancel: () => setAlert(null),
    });
  };

  return (
    <div className="min-h-screen text-gray-800">
      {/* ALERT */}
      {alert && alert.onConfirm ? (
        <ConfirmAlert {...alert} />
      ) : (
        alert && (
          <Alert {...alert} duration={6000} onClose={() => setAlert(null)} />
        )
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Judul {product.name}</h1>

        <button
          onClick={() => setAddModal(true)}
          disabled={!!productTitles}
          className={`py-2 px-4 rounded-lg text-white ${
            productTitles
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-primary/90"
          }`}
        >
          Tambah data
        </button>
      </div>

      {/* LIST TITLE */}
      <div className="space-y-6">
        {productTitles ? (
          <div className="p-4 bg-white rounded-lg shadow flex flex-col gap-2">
            <h2 className="text-xl font-semibold">
              {productTitles.title || ""}
            </h2>
            <p>{productTitles.desc || ""}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => {
                  if (!productTitles.id) return;
                  setSelected(productTitles);
                  setTitle(productTitles.title || "");
                  setDesc(productTitles.desc || "");
                  setEditModal(true);
                }}
                className="text-blue-500 hover:text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(productTitles.id)}
                className="text-red-500 hover:text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Belum ada data judul</p>
        )}
      </div>

      {/* === LIST Product Sub Title === */}
      <div className="mt-10">
        <ProductSubTitle product={product} />{" "}
      </div>

      <div className="mt-10">
        <ProductSuperior product={product} />{" "}
      </div>

      <div className="mt-10">
        <ProductImagePage product={product} />{" "}
      </div>

      <div className="mt-10">
        <ProductType product={product} />{" "}
      </div>

      <div className="mt-10 mb-20">
        <ProductBenefitPage product={product} />{" "}
      </div>

      {/* MODAL ADD */}
      {addModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-white p-6 rounded-lg shadow-lg w-96"
          >
            <input
              type="text"
              placeholder="Judul"
              value={title || ""}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border rounded-lg p-3"
            />
            <textarea
              placeholder="Deskripsi"
              value={desc || ""}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full border rounded-lg p-3"
            />
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

      {/* MODAL UPDATE */}
      {editModal && selected && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <form
            onSubmit={handleUpdate}
            className="space-y-4 bg-white p-6 rounded-lg shadow-lg w-96"
          >
            <input
              type="text"
              placeholder="Judul"
              value={title || ""}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border rounded-lg p-3"
            />
            <textarea
              placeholder="Deskripsi"
              value={desc || ""}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full border rounded-lg p-3"
            />
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
