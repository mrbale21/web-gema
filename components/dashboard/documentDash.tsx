"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { LuSquarePen } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";
import Alert from "../Common/Alert";
import ConfirmAlert from "../Common/ConfirmAlert";

type VideoType = "YOUTUBE" | "LOCAL";

interface Video {
  id: number;
  name: string;
  videoUrl: string;
  type: VideoType;
  createdAt: string;
}

interface Gallery {
  id: number;
  name: string;
  imageUrl: string;
  createdAt: string;
}

export default function Dashboard() {
  // ===== Video State =====
  const [videos, setVideos] = useState<Video[]>([]);
  const [videoName, setVideoName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoEditId, setVideoEditId] = useState<number | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // ===== Gallery State =====
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [galleryName, setGalleryName] = useState("");
  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const [galleryEditId, setGalleryEditId] = useState<number | null>(null);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);

  const [alert, setAlert] = useState<{
    type: "success" | "error" | "warning" | "info";
    message: string;
    show?: boolean;
    onClose?: () => void;
    onConfirm?: () => void;
    onCancel?: () => void;
  } | null>(null);

  // ===== Fetch Data =====
  const fetchVideos = async () => {
    const res = await fetch("/api/documentasi/video");
    const data = await res.json();
    setVideos(data);
  };

  const fetchGalleries = async () => {
    const res = await fetch("/api/documentasi/gallery");
    const data = await res.json();
    setGalleries(data);
  };

  useEffect(() => {
    fetchVideos();
    fetchGalleries();
  }, []);

  // ===== Handlers Video =====
  const handleVideoFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setVideoFile(e.target.files[0]);
  };

  const handleVideoSubmit = async () => {
    let body: FormData | string;
    let headers: any = {};

    if (videoFile) {
      body = new FormData();
      body.append("name", videoName);
      body.append("video", videoFile);
    } else {
      body = JSON.stringify({ name: videoName, videoUrl });
      headers["Content-Type"] = "application/json";
    }

    const url = videoEditId
      ? `/api/documentasi/video/${videoEditId}`
      : "/api/documentasi/video";
    const method = videoEditId ? "PUT" : "POST";

    const res = await fetch(url, { method, body, headers });
    if (res.ok) {
      // reset state hanya setelah sukses
      setAlert({ type: "success", message: "Berhasil!" });
      setVideoName("");
      setVideoUrl("");
      setVideoFile(null);
      setVideoEditId(null);
      setIsVideoModalOpen(false);
      fetchVideos();
    }
  };

  const handleVideoEdit = (v: Video) => {
    setVideoEditId(v.id);
    setVideoName(v.name);
    if (v.type === "YOUTUBE") setVideoUrl(v.videoUrl);
    setIsVideoModalOpen(true);
  };

  const handleVideoDelete = async (id: number) => {
    setAlert({
      type: "warning",
      message: `Apakah anda yakin ingin menghapus ?`,
      show: true,
      onConfirm: async () => {
        setAlert(null);
        try {
          const res = await fetch(`/api/documentasi/video/${id}`, {
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
          fetchVideos();
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

  // ===== Handlers Gallery =====
  const handleGalleryFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setGalleryFile(e.target.files[0]);
  };

  const handleGallerySubmit = async () => {
    if (!galleryFile)
      return setAlert({
        type: "warning",
        message: "pilih poto terlebih dahulu!",
      });

    const formData = new FormData();
    formData.append("name", galleryName);
    formData.append("image", galleryFile);

    const url = galleryEditId
      ? `/api/documentasi/gallery/${galleryEditId}`
      : "/api/documentasi/gallery";
    const method = galleryEditId ? "PUT" : "POST";

    const res = await fetch(url, { method, body: formData });
    if (res.ok) {
      setAlert({ type: "success", message: "Berhasil!" });
      setGalleryName("");
      setGalleryFile(null);
      setGalleryEditId(null);
      setIsGalleryModalOpen(false);
      fetchGalleries();
    }
  };

  const handleGalleryEdit = (g: Gallery) => {
    setAlert({ type: "success", message: "Berhasil!" });
    setGalleryEditId(g.id);
    setGalleryName(g.name);
    setIsGalleryModalOpen(true);
  };

  const handleGalleryDelete = async (id: number) => {
    setAlert({
      type: "warning",
      message: `Apakah anda yakin ingin menghapus ?`,
      show: true,
      onConfirm: async () => {
        setAlert(null);
        try {
          const res = await fetch(`/api/documentasi/gallery/${id}`, {
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
          fetchGalleries();
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

  // ===== Modal Component =====
  const Modal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
  }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>
          {children}
          <button
            type="button"
            onClick={onClose}
            className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-white min-h-screen space-y-12">
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
      {/* ===== Video Section ===== */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Video</h1>
          <button
            type="button"
            onClick={() => setIsVideoModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Tambah Video
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.map((v) => (
            <div
              key={v.id}
              className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white flex flex-col justify-between"
            >
              <div className="flex flex-col gap-3">
                <p className="font-semibold text-gray-800 break-words">
                  {v.name}
                </p>
                {v.type === "LOCAL" ? (
                  <video
                    src={v.videoUrl}
                    controls
                    className="w-full h-40 mt-2 rounded"
                  />
                ) : (
                  <a
                    href={v.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline mt-2 break-all"
                  >
                    YouTube Link
                  </a>
                )}
              </div>
              <div className="flex gap-2 mt-3 flex-wrap items-end w-full justify-end">
                <button
                  type="button"
                  onClick={() => handleVideoEdit(v)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded transition"
                >
                  <LuSquarePen size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => handleVideoDelete(v.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                >
                  <MdDeleteOutline size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Gallery Section ===== */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Gallery</h1>
          <button
            type="button"
            onClick={() => setIsGalleryModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Tambah Gallery
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {galleries.map((g) => (
            <div
              key={g.id}
              className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white flex flex-col justify-between"
            >
              <div className="flex flex-col gap-3">
                <p className="font-semibold text-gray-800 break-words">
                  {g.name}
                </p>
                <img
                  src={g.imageUrl}
                  alt={g.name}
                  className="w-full h-40 object-cover rounded mt-2"
                />
              </div>
              <div className="flex gap-2 mt-3 flex-wrap items-end w-full justify-end">
                <button
                  type="button"
                  onClick={() => handleGalleryEdit(g)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded transition"
                >
                  <LuSquarePen size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => handleGalleryDelete(g.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                >
                  <MdDeleteOutline size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Video Modal ===== */}
      <Modal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        title={videoEditId ? "Edit Video" : "Tambah Video"}
      >
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Video Name"
            className="border p-2 rounded text-gray-700 placeholder-gray-500"
            value={videoName}
            onChange={(e) => setVideoName(e.target.value)}
          />
          {!videoFile && (
            <input
              type="text"
              placeholder="YouTube URL"
              className="border p-2 rounded text-gray-700 placeholder-gray-500"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
          )}
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoFileChange}
            className="border text-gray-500 rounded-sm text-sm"
          />
          <button
            type="button"
            onClick={handleVideoSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-2"
          >
            {videoEditId ? "Edit" : "Tambah"}
          </button>
        </div>
      </Modal>

      {/* ===== Gallery Modal ===== */}
      <Modal
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        title={galleryEditId ? "Edit Gallery" : "Tambah Gallery"}
      >
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Gallery Name"
            className="border p-2 rounded text-gray-700 placeholder-gray-500"
            value={galleryName}
            onChange={(e) => setGalleryName(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleGalleryFileChange}
            className="border text-gray-500 rounded-sm text-sm"
          />
          <button
            type="button"
            onClick={handleGallerySubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mt-2"
          >
            {galleryEditId ? "Edit" : "Tambah"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
