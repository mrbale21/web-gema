"use client";

import { useEffect, useState } from "react";
import { FaRegPenToSquare } from "react-icons/fa6";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";

interface Visi {
  id: number;
  title: string;
}

interface Misi {
  id: number;
  title: string;
}

interface VisiMisi {
  id: number;
  title: string;
  subtitle: string;
  moto: string;
  titleMoto: string;
  visi: Visi[];
  misi: Misi[];
}

export default function VisiMisiDashboard() {
  const [visiMisi, setVisiMisi] = useState<VisiMisi | null>(null);

  const [addVisi, setAddVisi] = useState("");
  const [addMisi, setAddMisi] = useState("");
  const [editVisiId, setEditVisiId] = useState<number | null>(null);
  const [editVisiTitle, setEditVisiTitle] = useState("");

  const [editMisiId, setEditMisiId] = useState<number | null>(null);
  const [editMisiTitle, setEditMisiTitle] = useState("");

  // === State untuk edit motto ===
  const [isEditingMoto, setIsEditingMoto] = useState(false);
  const [editTitleMoto, setEditTitleMoto] = useState("");
  const [editMoto, setEditMoto] = useState("");

  const fetchData = async () => {
    const res = await fetch("/api/visimisi");
    const data = await res.json();
    setVisiMisi(data[0]); // hanya ambil 1 data utama
  };

  useEffect(() => {
    fetchData();
  }, []);

  // === ADD VISI ===
  const handleAddVisi = async () => {
    if (!addVisi.trim() || !visiMisi) return;
    await fetch(`/api/visimisi/visi`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: addVisi, authId: visiMisi.id }),
    });
    setAddVisi("");
    fetchData();
  };

  // === ADD MISI ===
  const handleAddMisi = async () => {
    if (!addMisi.trim() || !visiMisi) return;
    await fetch(`/api/visimisi/misi`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: addMisi, authId: visiMisi.id }),
    });
    setAddMisi("");
    fetchData();
  };

  // === EDIT VISI ===
  const handleEditVisi = async () => {
    if (!editVisiTitle.trim() || !editVisiId) return;
    await fetch(`/api/visimisi/visi/${editVisiId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editVisiTitle }),
    });
    setEditVisiId(null);
    setEditVisiTitle("");
    fetchData();
  };

  // === EDIT MISI ===
  const handleEditMisi = async () => {
    if (!editMisiTitle.trim() || !editMisiId) return;
    await fetch(`/api/visimisi/misi/${editMisiId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editMisiTitle }),
    });
    setEditMisiId(null);
    setEditMisiTitle("");
    fetchData();
  };

  // === EDIT MOTTO ===
  const handleEditMoto = async () => {
    if (!visiMisi) return;
    await fetch(`/api/visimisi/${visiMisi.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: visiMisi.title,
        subtitle: visiMisi.subtitle,
        vs: "", // kalau ada isi vs dari data
        ms: "", // kalau ada isi ms dari data
        titleMoto: editTitleMoto,
        moto: editMoto,
        visi: visiMisi.visi,
        misi: visiMisi.misi,
      }),
    });
    setIsEditingMoto(false);
    fetchData();
  };

  // === DELETE VISI ===
  const handleDeleteVisi = async (id: number) => {
    if (!confirm("Yakin hapus visi ini?")) return;
    await fetch(`/api/visimisi/visi/${id}`, { method: "DELETE" });
    fetchData();
  };

  // === DELETE MISI ===
  const handleDeleteMisi = async (id: number) => {
    if (!confirm("Yakin hapus misi ini?")) return;
    await fetch(`/api/visimisi/misi/${id}`, { method: "DELETE" });
    fetchData();
  };

  if (!visiMisi) return <p>Loading...</p>;

  return (
    <div className="p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Halaman Visi & Misi</h1>

      {/* Informasi Umum + Moto */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h2 className="text-xl font-semibold">{visiMisi.title}</h2>
        <p className="text-gray-600">{visiMisi.subtitle}</p>
      </div>

      {/* Visi */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Visi</h2>
        <ul className="list-disc pl-6">
          {visiMisi.visi.map((v) => (
            <li key={v.id} className="flex justify-between items-center gap-2">
              {editVisiId === v.id ? (
                <>
                  <input
                    type="text"
                    value={editVisiTitle}
                    onChange={(e) => setEditVisiTitle(e.target.value)}
                    className="border rounded p-1 flex-1"
                  />
                  <button onClick={handleEditVisi} className="text-green-600">
                    Simpan
                  </button>
                  <button
                    onClick={() => {
                      setEditVisiId(null);
                      setEditVisiTitle("");
                    }}
                    className="text-gray-600"
                  >
                    Batal
                  </button>
                </>
              ) : (
                <>
                  <span>{v.title}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditVisiId(v.id);
                        setEditVisiTitle(v.title);
                      }}
                      className="text-blue-600"
                    >
                      <FaRegPenToSquare />
                    </button>
                    <button
                      onClick={() => handleDeleteVisi(v.id)}
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

        <div className="flex gap-2 mt-3">
          <input
            type="text"
            value={addVisi}
            onChange={(e) => setAddVisi(e.target.value)}
            placeholder="Tambah visi..."
            className="border rounded p-2 flex-1"
          />
          <button
            onClick={handleAddVisi}
            className="bg-green-600 text-white px-3 rounded"
          >
            <IoAddCircleOutline size={24} />
          </button>
        </div>
      </div>

      {/* Misi */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-semibold mb-2">Misi</h2>
        <ul className="list-decimal pl-6">
          {visiMisi.misi.map((m) => (
            <li key={m.id} className="flex justify-between items-center gap-2">
              {editMisiId === m.id ? (
                <>
                  <input
                    type="text"
                    value={editMisiTitle}
                    onChange={(e) => setEditMisiTitle(e.target.value)}
                    className="border rounded p-1 flex-1"
                  />
                  <button onClick={handleEditMisi} className="text-green-600">
                    Simpan
                  </button>
                  <button
                    onClick={() => {
                      setEditMisiId(null);
                      setEditMisiTitle("");
                    }}
                    className="text-gray-600"
                  >
                    Batal
                  </button>
                </>
              ) : (
                <>
                  <span>{m.title}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditMisiId(m.id);
                        setEditMisiTitle(m.title);
                      }}
                      className="text-blue-600"
                    >
                      <FaRegPenToSquare />
                    </button>
                    <button
                      onClick={() => handleDeleteMisi(m.id)}
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

        <div className="flex gap-2 mt-3">
          <input
            type="text"
            value={addMisi}
            onChange={(e) => setAddMisi(e.target.value)}
            placeholder="Tambah misi..."
            className="border rounded p-2 flex-1"
          />
          <button
            onClick={handleAddMisi}
            className="bg-green-600 text-white px-3 rounded"
          >
            <IoAddCircleOutline size={24} />
          </button>
        </div>
      </div>

      <div className="  bg-white shadow rounded p-4 mt-6">
        {isEditingMoto ? (
          <div className="mt-3 space-y-2">
            <input
              type="text"
              value={editTitleMoto}
              onChange={(e) => setEditTitleMoto(e.target.value)}
              className="border rounded p-2 w-full"
              placeholder="Judul Moto"
            />
            <textarea
              value={editMoto}
              onChange={(e) => setEditMoto(e.target.value)}
              className="border rounded p-2 w-full"
              placeholder="Isi Moto"
            />
            <div className="flex gap-2">
              <button
                onClick={handleEditMoto}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Simpan
              </button>
              <button
                onClick={() => setIsEditingMoto(false)}
                className="bg-gray-400 text-white px-3 py-1 rounded"
              >
                Batal
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="mt-2 font-semibold">{visiMisi.titleMoto}:</p>
            <p>{visiMisi.moto}</p>
            <button
              onClick={() => {
                setIsEditingMoto(true);
                setEditTitleMoto(visiMisi.titleMoto);
                setEditMoto(visiMisi.moto);
              }}
              className="text-blue-600 mt-2 flex items-center gap-1"
            >
              <FaRegPenToSquare /> Edit Motto
            </button>
          </>
        )}
      </div>
    </div>
  );
}
