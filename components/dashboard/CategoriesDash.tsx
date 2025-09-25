"use client";

import { useEffect, useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { FaRegPenToSquare } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import ConfirmAlert from "../Common/ConfirmAlert";
import Alert from "../Common/Alert";
import { CategoriesType } from "@/types/categories";

export default function CategoriesDash() {
  const [categories, setCategories] = useState<CategoriesType[]>([]);
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "warning" | "info";
    message: string;
    show?: boolean;
    onClose?: () => void;
    onConfirm?: () => void;
    onCancel?: () => void;
  } | null>(null);

  // === GET DATA ===
  const fetchData = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // === CREATE ===
  const handleAdd = async () => {
    if (!newName.trim()) return;
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
    setAlert({ type: "success", message: "Kategori berhasil ditambahkan!" });
    setNewName("");
    fetchData();
  };

  // === UPDATE ===
  const handleEdit = async () => {
    if (!editName.trim() || !editId) return;
    await fetch(`/api/categories/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName }),
    });
    setAlert({ type: "success", message: "Kategori berhasil diperbarui!" });
    setEditId(null);
    setEditName("");
    fetchData();
  };

  // === DELETE ===
  const handleDelete = (id: number) => {
    setAlert({
      type: "warning",
      message: "Apakah anda yakin ingin menghapus kategori ini?",
      show: true,
      onConfirm: async () => {
        setAlert(null);
        try {
          const res = await fetch(`/api/categories/${id}`, {
            method: "DELETE",
          });
          const data = await res.json();
          if (!res.ok) {
            setAlert({
              type: "error",
              message: data.error || "Gagal hapus kategori",
              show: true,
            });
            return;
          }
          fetchData();
          setAlert({
            type: "success",
            message: "Kategori berhasil dihapus!",
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

  return (
    <div className="p-6 text-gray-800">
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
            duration={5000}
            onClose={() => setAlert(null)}
          />
        )
      )}

      <h1 className="text-3xl font-bold mb-4">Manajemen Kategori</h1>

      {/* List Categories */}
      <div className="bg-white shadow rounded p-4">
        {categories.length === 0 ? (
          <p className="text-gray-500">Belum ada kategori</p>
        ) : (
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="flex justify-between items-center border-b py-2"
              >
                {editId === cat.id ? (
                  <div className="flex w-full gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="border rounded p-1 flex-1"
                    />
                    <button
                      onClick={handleEdit}
                      className="text-green-600 font-medium"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={() => {
                        setEditId(null);
                        setEditName("");
                      }}
                      className="text-gray-600"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <>
                    <span>{cat.name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditId(cat.id);
                          setEditName(cat.name);
                        }}
                        className="text-blue-600"
                      >
                        <FaRegPenToSquare />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="text-red-600"
                      >
                        <MdDeleteOutline size={20} />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* Add Category */}
        <div className="flex gap-2 mt-4">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Tambah kategori..."
            className="border rounded p-2 flex-1"
          />
          <button
            onClick={handleAdd}
            className="bg-green-600 text-white px-3 rounded"
          >
            <IoAddCircleOutline size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
