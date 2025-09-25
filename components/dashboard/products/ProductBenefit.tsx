"use client";

import { useEffect, useState } from "react";
import Alert from "../../Common/Alert";
import ConfirmAlert from "../../Common/ConfirmAlert";
import { ProductBenefit } from "@/types/productBenefit";
import { Product } from "@/types/products";

export default function ProductBenefitPage({ product }: { product: Product }) {
  const [ProductBenefit, setProductBenefit] = useState<ProductBenefit[]>([]);

  const [error, setError] = useState("");
  const [alert, setAlert] = useState<any>(null);

  // === STATE FORM ===
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selected, setSelected] = useState<ProductBenefit | null>(null);

  const [title, setTitle] = useState("");

  // === FETCH DATA ===
  const fetchData = async () => {
    const res = await fetch(`/api/products/${product.id}/products-benefit`);
    setProductBenefit(await res.json());
  };

  useEffect(() => {
    if (product?.id) fetchData();
  }, [product?.id]);

  // === RESET FORM ===
  const resetForm = () => {
    setTitle("");
    setSelected(null);
    setError("");
  };

  // === ADD ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`/api/products/${product.id}/products-benefit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal tambah data");
        return;
      }
      setAddModal(false);
      resetForm();
      fetchData();
      setAlert({
        type: "success",
        message: "Data Benefit berhasil ditambahkan!",
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  // === UPDATE ===
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;

    try {
      const res = await fetch(
        `/api/products/${product.id}/products-benefit/${selected.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal update data");
        return;
      }
      setEditModal(false);
      resetForm();
      fetchData();
      setAlert({
        type: "success",
        message: "Data Benefit berhasil diperbarui!",
      });
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
            `/api/products/${product.id}/products-benefit/${id}`,
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
          fetchData();
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
    <div className=" text-gray-800">
      {/* Alert */}
      {alert && alert.onConfirm ? (
        <ConfirmAlert {...alert} />
      ) : (
        alert && (
          <Alert {...alert} duration={6000} onClose={() => setAlert(null)} />
        )
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Data {product.name} Benefit</h1>
        <button
          onClick={() => setAddModal(true)}
          className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90"
        >
          Tambah Data
        </button>
      </div>

      {/* === LIST ProductBenefit === */}
      <div className="space-y-6">
        {ProductBenefit && ProductBenefit.length > 0 ? (
          ProductBenefit.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-white rounded-lg shadow flex justify-between gap-2"
            >
              <h2 className="text-md font-semibold">{item.title}</h2>

              <div className="flex gap-2 ">
                <button
                  onClick={() => {
                    setSelected(item);
                    setTitle(item.title);
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
          ))
        ) : (
          <p className="text-gray-500 italic">
            Belum ada benefit untuk produk ini
          </p>
        )}
      </div>

      {/* === MODAL ADD === */}
      {addModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-white p-6 rounded-lg shadow-lg w-96"
          >
            <input
              type="text"
              placeholder="Judul"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
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

      {/* === MODAL UPDATE === */}
      {editModal && selected && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <form
            onSubmit={handleUpdate}
            className="space-y-4 bg-white p-6 rounded-lg shadow-lg w-96"
          >
            <input
              type="text"
              placeholder="Judul"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
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
