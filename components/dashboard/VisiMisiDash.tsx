"use client";

import { VisiMisiType } from "@/types/visimisi";
import { useEffect, useState } from "react";
import { FaRegPenToSquare } from "react-icons/fa6";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import ConfirmAlert from "../Common/ConfirmAlert";
import Alert from "../Common/Alert";

export default function VisiMisiDashboard() {
  const [visiMisi, setVisiMisi] = useState<VisiMisiType | null>(null);

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

  const [alert, setAlert] = useState<{
    type: "success" | "error" | "warning" | "info";
    message: string;
    show?: boolean;
    onClose?: () => void;
    onConfirm?: () => void;
    onCancel?: () => void;
  } | null>(null);

  const fetchData = async () => {
    const res = await fetch("/api/visimisi");
    const data = await res.json();
    setVisiMisi(data[0] ?? null); // hanya ambil 1 data utama
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
    setAlert({ type: "success", message: "Data berhasil ditambahkan!" });
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
    setAlert({ type: "success", message: "Data berhasil ditambahkan!" });
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
    setAlert({ type: "success", message: "Data berhasil diperbarui!" });
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
    setAlert({ type: "success", message: "Data berhasil diperbarui!" });
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
        vs: "",
        ms: "",
        titleMoto: editTitleMoto,
        moto: editMoto,
        visi: visiMisi.visi,
        misi: visiMisi.misi,
      }),
    });
    setAlert({ type: "success", message: "Data berhasil diperbarui!" });
    setIsEditingMoto(false);
    fetchData();
  };

  // === DELETE VISI ===
  const handleDeleteVisi = async (id: number) => {
    setAlert({
      type: "warning",
      message: `Apakah anda yakin ingin menghapus ?`,
      show: true,
      onConfirm: async () => {
        setAlert(null);
        try {
          const res = await fetch(`/api/visimisi/visi/${id}`, {
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
          fetchData();
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

  // === DELETE MISI ===
  const handleDeleteMisi = async (id: number) => {
    setAlert({
      type: "warning",
      message: `Apakah anda yakin ingin menghapus ?`,
      show: true,
      onConfirm: async () => {
        setAlert(null);
        try {
          const res = await fetch(`/api/visimisi/misi/${id}`, {
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
          fetchData();
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

  // === Kalau data utama belum ada ===
  if (!visiMisi) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Belum ada data Visi & Misi</h1>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const title = (form.elements.namedItem("title") as HTMLInputElement)
              .value;
            const subtitle = (
              form.elements.namedItem("subtitle") as HTMLInputElement
            ).value;
            const titleMoto = (
              form.elements.namedItem("titleMoto") as HTMLInputElement
            ).value;
            const moto = (form.elements.namedItem("moto") as HTMLInputElement)
              .value;

            await fetch("/api/visimisi", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title,
                subtitle,
                titleMoto,
                moto,
                vs: "",
                ms: "",
                visi: [],
                misi: [],
              }),
            });

            fetchData();
          }}
          className="space-y-3 bg-white shadow p-4 rounded"
        >
          <input
            type="text"
            name="title"
            placeholder="Judul"
            className="border rounded p-2 w-full placeholder:text-gray-500 text-gray-800"
          />
          <input
            type="text"
            name="subtitle"
            placeholder="Subjudul"
            className="border rounded p-2 w-full placeholder:text-gray-500 text-gray-800"
          />
          <input
            type="text"
            name="titleMoto"
            placeholder="Judul Moto"
            className="border rounded p-2 w-full placeholder:text-gray-500 text-gray-800"
          />
          <textarea
            name="moto"
            placeholder="Isi Moto"
            className="border rounded p-2 w-full placeholder:text-gray-500 text-gray-800"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-3 py-2 rounded"
          >
            Tambah Data
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-6 text-gray-800">
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
      <h1 className="text-3xl font-bold mb-4">Halaman Visi & Misi</h1>

      {/* Info Umum */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h2 className="text-xl font-semibold">{visiMisi.title}</h2>
        <p className="text-gray-600">{visiMisi.subtitle}</p>
      </div>

      {/* Visi */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Visi</h2>
        {visiMisi.visi.length === 0 ? (
          <p className="text-gray-500">Belum ada visi</p>
        ) : (
          <ul className="list-disc pl-6">
            {visiMisi.visi.map((v) => (
              <li
                key={v.id}
                className="flex justify-between items-center gap-2"
              >
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
        )}

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
        {visiMisi.misi.length === 0 ? (
          <p className="text-gray-500">Belum ada misi</p>
        ) : (
          <ul className="list-decimal pl-6">
            {visiMisi.misi.map((m) => (
              <li
                key={m.id}
                className="flex justify-between items-center gap-2"
              >
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
        )}

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

      {/* Motto */}
      <div className="bg-white shadow rounded p-4 mt-6">
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
            {visiMisi.titleMoto || visiMisi.moto ? (
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
            ) : (
              <p className="text-gray-500">
                Belum ada motto, silakan tambahkan
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
