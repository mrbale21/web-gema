"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import Alert from "../Common/Alert";
import ConfirmAlert from "../Common/ConfirmAlert";

interface Timeline {
  id: number;
  title: string;
  year: number;
  desc: string;
}

export default function SuperDashboard() {
  const [Timeline, setTimeline] = useState<Timeline[]>([]);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [error, setError] = useState("");
  const [selectedTimeline, setSelectedTimeline] = useState<Timeline | null>(
    null
  );

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const [alert, setAlert] = useState<{
    type: "success" | "error" | "warning" | "info";
    message: string;
    show?: boolean;
    onClose?: () => void;
    onConfirm?: () => void;
    onCancel?: () => void;
  } | null>(null);

  const fetchTimeline = async () => {
    const res = await fetch("/api/timeline");
    const data = await res.json();
    setTimeline(data);
  };

  useEffect(() => {
    fetchTimeline();
  }, []);

  // === ADD ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("desc", desc);
    formData.append("year", String(year));

    try {
      const res = await fetch("/api/timeline", {
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
      fetchTimeline();
      setAlert({ type: "success", message: "Data berhasil ditambahkan!" });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  // === UPDATE ===
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTimeline) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("desc", desc);
    formData.append("year", String(year));

    try {
      const res = await fetch(`/api/timeline/${selectedTimeline.id}`, {
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
      fetchTimeline();
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
          const res = await fetch(`/api/timeline/${id}`, {
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
          fetchTimeline();
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
    setTitle("");
    setDesc("");
    setYear(new Date().getFullYear());
    setSelectedTimeline(null);
    setError("");
  };

  return (
    <div className="min-h-screen text-gray-800">
      {/* Alert atau Confirm */}
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
        <h1 className="text-3xl font-bold">Daftar Sejarah Gema Nahdliyin</h1>
        <button
          onClick={() => setAddModal(true)}
          className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90"
        >
          Tambah Data
        </button>
      </div>

      {/* === LIST Timeline === */}
      <div className="space-y-6">
        {Timeline.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-4 p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
          >
            {/* Image */}

            {/* Text content */}
            <div className="flex-1 flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-black">{item.title}</h2>
              {item.desc && (
                <p className="text-sm text-gray-700 line-clamp-3">
                  {item.desc}
                </p>
              )}
              <p className="text-sm text-gray-700 line-clamp-3">{item.year}</p>

              {/* Optional actions */}
              <div className="mt-2 flex gap-2 text-sm">
                <button
                  onClick={() => {
                    setSelectedTimeline(item);
                    setTitle(item.title);
                    setDesc(item.desc);
                    setYear(item.year);
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
              placeholder="Judul"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border rounded-lg p-3"
            />
            <input
              type="number"
              placeholder="Tahun"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value) || 0)}
              min={1000}
              max={new Date().getFullYear() + 5} // misal kasih toleransi 5 tahun ke depan
              required
              className="w-full border rounded-lg p-3"
            />

            <textarea
              placeholder="Deskripsi"
              value={desc}
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

      {/* === MODAL UPDATE === */}
      {editModal && selectedTimeline && (
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

            <input
              type="number"
              placeholder="Tahun"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value) || 0)}
              min={1000}
              max={new Date().getFullYear() + 5} // misal kasih toleransi 5 tahun ke depan
              required
              className="w-full border rounded-lg p-3"
            />

            <textarea
              placeholder="Deskripsi"
              value={desc}
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
