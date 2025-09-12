"use client";

import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";

interface Statistic {
  id: number;
  name: string;
  count: number;
  image?: string | null;
  createdAt: string;
}

export default function StatisticDash() {
  const [statistic, setStatistic] = useState<Statistic[]>([]);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [error, setError] = useState("");
  const [selectedStatistic, setSelectedStatistic] = useState<Statistic | null>(
    null
  );

  const [name, setName] = useState("");
  const [count, setCount] = useState<number>(0);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchStatistic = async () => {
    const res = await fetch("/api/statistic");
    const data = await res.json();
    setStatistic(data);
  };

  useEffect(() => {
    fetchStatistic();
  }, []);

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
    formData.append("count", String(count));
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await fetch("/api/statistic", {
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
      fetchStatistic();
      alert("Statistic berhasil ditambahkan");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  // === UPDATE ===
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStatistic) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("count", String(count));
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await fetch(`/api/statistic/${selectedStatistic.id}`, {
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
      fetchStatistic();
      alert("Statistic berhasil diupdate");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  // === DELETE ===
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus Statistic ini?")) return;

    try {
      const res = await fetch(`/api/statistic/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Gagal menghapus Statistic");
        return;
      }

      fetchStatistic();
      alert("Statistic berhasil dihapus");
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan");
    }
  };

  const resetForm = () => {
    setName("");
    setCount(0);
    setImageFile(null);
    setSelectedStatistic(null);
    setError("");
  };

  return (
    <div className="min-h-screen text-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Daftar Statistic</h1>
        <button
          onClick={() => setAddModal(true)}
          className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90"
        >
          Tambah Statistic
        </button>
      </div>

      {/* === LIST Statistic === */}
      <div className="space-y-6">
        {statistic.map((item) => (
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
              <p className="text-sm text-gray-700">Jumlah: {item.count}</p>

              {/* Optional actions */}
              <div className="mt-2 flex gap-2 text-sm">
                <button
                  onClick={() => {
                    setSelectedStatistic(item);
                    setName(item.name);
                    setCount(item.count);
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border rounded-lg p-3"
            />
            <input
              type="number"
              placeholder="Jumlah"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
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
      {editModal && selectedStatistic && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <form
            onSubmit={handleUpdate}
            className="space-y-4 bg-white p-6 rounded-lg shadow-lg w-96"
          >
            <input
              type="text"
              placeholder="Judul"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border rounded-lg p-3"
            />
            <input
              type="number"
              placeholder="Jumlah"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
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
