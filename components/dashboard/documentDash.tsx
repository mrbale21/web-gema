"use client";

import { useEffect, useState, useRef, ChangeEvent } from "react";
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

// Komponen Modal Terpisah
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose} // Tutup modal ketika klik di luar
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg"
        onClick={(e) => e.stopPropagation()} // Mencegah penutupan ketika klik di dalam modal
      >
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

// Komponen Input Modal untuk Video
const VideoModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  videoName: string;
  setVideoName: (name: string) => void;
  videoUrl: string;
  setVideoUrl: (url: string) => void;
  videoFile: File | null;
  handleVideoFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isEdit: boolean;
  editingVideo: Video | null;
}> = ({
  isOpen,
  onClose,
  onSubmit,
  videoName,
  setVideoName,
  videoUrl,
  setVideoUrl,
  videoFile,
  handleVideoFileChange,
  isEdit,
  editingVideo,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Fokus ke input ketika modal terbuka
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Video" : "Tambah Video"}
    >
      <div className="flex flex-col gap-2">
        <input
          ref={inputRef}
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
        {isEdit && editingVideo?.type === "LOCAL" && !videoFile && (
          <p className="text-sm text-gray-600">
            File video saat ini: {editingVideo.videoUrl.split("/").pop()}
          </p>
        )}
        <button
          type="button"
          onClick={onSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-2"
        >
          {isEdit ? "Update Video" : "Tambah Video"}
        </button>
      </div>
    </Modal>
  );
};

// Komponen Input Modal untuk Gallery
const GalleryModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  galleryName: string;
  setGalleryName: (name: string) => void;
  galleryFile: File | null;
  setGalleryFile: (file: File | null) => void;
  handleGalleryFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isEdit: boolean;
  editingGallery: Gallery | null;
}> = ({
  isOpen,
  onClose,
  onSubmit,
  galleryName,
  setGalleryName,
  galleryFile,
  setGalleryFile,
  handleGalleryFileChange,
  isEdit,
  editingGallery,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Fokus ke input ketika modal terbuka
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleRemoveFile = () => {
    setGalleryFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Gallery" : "Tambah Gallery"}
    >
      <div className="flex flex-col gap-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="Gallery Name"
          className="border p-2 rounded text-gray-700 placeholder-gray-500"
          value={galleryName}
          onChange={(e) => setGalleryName(e.target.value)}
        />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Pilih Gambar:
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleGalleryFileChange}
            className="border text-gray-500 rounded-sm text-sm p-2"
          />

          {galleryFile && (
            <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
              <span className="text-sm text-gray-700 truncate">
                {galleryFile.name}
              </span>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Hapus
              </button>
            </div>
          )}

          {isEdit && editingGallery && !galleryFile && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-2">Gambar saat ini:</p>
              <img
                src={editingGallery.imageUrl}
                alt={editingGallery.name}
                className="w-full h-40 object-cover rounded"
              />
              <p className="text-xs text-gray-500 mt-1">
                Anda tidak perlu memilih gambar baru jika tidak ingin
                mengubahnya.
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onSubmit}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mt-2"
        >
          {isEdit ? "Update Gallery" : "Tambah Gallery"}
        </button>
      </div>
    </Modal>
  );
};

export default function Dashboard() {
  // ===== Video State =====
  const [videos, setVideos] = useState<Video[]>([]);
  const [videoName, setVideoName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoEditId, setVideoEditId] = useState<number | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  // ===== Gallery State =====
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [galleryName, setGalleryName] = useState("");
  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const [galleryEditId, setGalleryEditId] = useState<number | null>(null);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);

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
    if (e.target.files?.[0]) {
      setVideoFile(e.target.files[0]);
      setVideoUrl(""); // Reset URL jika file dipilih
    }
  };

  const handleVideoSubmit = async () => {
    if (!videoName) {
      return setAlert({
        type: "warning",
        message: "Nama video harus diisi!",
      });
    }

    if (!videoFile && !videoUrl) {
      return setAlert({
        type: "warning",
        message: "Harap pilih file video atau masukkan URL YouTube!",
      });
    }

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

    try {
      const res = await fetch(url, { method, body, headers });
      if (res.ok) {
        setAlert({ type: "success", message: "Video berhasil disimpan!" });
        setVideoName("");
        setVideoUrl("");
        setVideoFile(null);
        setVideoEditId(null);
        setEditingVideo(null);
        setIsVideoModalOpen(false);
        fetchVideos();
      } else {
        const error = await res.json();
        setAlert({
          type: "error",
          message: error.error || "Terjadi kesalahan",
        });
      }
    } catch (err: any) {
      setAlert({ type: "error", message: err.message || "Terjadi kesalahan" });
    }
  };

  const handleVideoEdit = (v: Video) => {
    setVideoEditId(v.id);
    setVideoName(v.name);
    setEditingVideo(v);

    if (v.type === "YOUTUBE") {
      setVideoUrl(v.videoUrl);
      setVideoFile(null);
    } else {
      setVideoUrl("");
    }

    setIsVideoModalOpen(true);
  };

  const handleVideoDelete = async (id: number) => {
    setAlert({
      type: "warning",
      message: `Apakah anda yakin ingin menghapus video ini?`,
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
              message: data.error || "Gagal hapus video",
              show: true,
            });
            return;
          }
          fetchVideos();
          setAlert({
            type: "success",
            message: "Video berhasil dihapus!",
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
    if (!galleryName) {
      return setAlert({
        type: "warning",
        message: "Nama gallery harus diisi!",
      });
    }

    // Jika menambah baru, file harus dipilih
    if (!galleryEditId && !galleryFile) {
      return setAlert({
        type: "warning",
        message: "Pilih gambar terlebih dahulu!",
      });
    }

    // Jika edit dan tidak memilih file baru, gunakan gambar yang sudah ada
    if (galleryEditId && !galleryFile) {
      // Tidak perlu mengirim file jika tidak diubah
      try {
        const res = await fetch(`/api/documentasi/gallery/${galleryEditId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: galleryName }),
        });

        if (res.ok) {
          setAlert({
            type: "success",
            message: "Gallery berhasil diperbarui!",
          });
          setGalleryName("");
          setGalleryFile(null);
          setGalleryEditId(null);
          setEditingGallery(null);
          setIsGalleryModalOpen(false);
          fetchGalleries();
        } else {
          const error = await res.json();
          setAlert({
            type: "error",
            message: error.error || "Terjadi kesalahan",
          });
        }
      } catch (err: any) {
        setAlert({
          type: "error",
          message: err.message || "Terjadi kesalahan",
        });
      }
      return;
    }

    // Jika memilih file baru (baik untuk tambah atau edit)
    if (galleryFile) {
      const formData = new FormData();
      formData.append("name", galleryName);
      formData.append("image", galleryFile);

      const url = galleryEditId
        ? `/api/documentasi/gallery/${galleryEditId}`
        : "/api/documentasi/gallery";
      const method = galleryEditId ? "PUT" : "POST";

      try {
        const res = await fetch(url, { method, body: formData });
        if (res.ok) {
          setAlert({ type: "success", message: "Gallery berhasil disimpan!" });
          setGalleryName("");
          setGalleryFile(null);
          setGalleryEditId(null);
          setEditingGallery(null);
          setIsGalleryModalOpen(false);
          fetchGalleries();
        } else {
          const error = await res.json();
          setAlert({
            type: "error",
            message: error.error || "Terjadi kesalahan",
          });
        }
      } catch (err: any) {
        setAlert({
          type: "error",
          message: err.message || "Terjadi kesalahan",
        });
      }
    }
  };

  const handleGalleryEdit = (g: Gallery) => {
    setGalleryEditId(g.id);
    setGalleryName(g.name);
    setGalleryFile(null); // Reset file yang dipilih
    setEditingGallery(g);
    setIsGalleryModalOpen(true);
  };

  const handleGalleryDelete = async (id: number) => {
    setAlert({
      type: "warning",
      message: `Apakah anda yakin ingin menghapus gallery ini?`,
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
              message: data.error || "Gagal hapus gallery",
              show: true,
            });
            return;
          }
          fetchGalleries();
          setAlert({
            type: "success",
            message: "Gallery berhasil dihapus!",
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
            onClick={() => {
              setVideoEditId(null);
              setEditingVideo(null);
              setVideoName("");
              setVideoUrl("");
              setVideoFile(null);
              setIsVideoModalOpen(true);
            }}
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
            onClick={() => {
              setGalleryEditId(null);
              setEditingGallery(null);
              setGalleryName("");
              setGalleryFile(null);
              setIsGalleryModalOpen(true);
            }}
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
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => {
          setIsVideoModalOpen(false);
          setVideoEditId(null);
          setEditingVideo(null);
          setVideoName("");
          setVideoUrl("");
          setVideoFile(null);
        }}
        onSubmit={handleVideoSubmit}
        videoName={videoName}
        setVideoName={setVideoName}
        videoUrl={videoUrl}
        setVideoUrl={setVideoUrl}
        videoFile={videoFile}
        handleVideoFileChange={handleVideoFileChange}
        isEdit={!!videoEditId}
        editingVideo={editingVideo}
      />

      {/* ===== Gallery Modal ===== */}
      <GalleryModal
        isOpen={isGalleryModalOpen}
        onClose={() => {
          setIsGalleryModalOpen(false);
          setGalleryEditId(null);
          setEditingGallery(null);
          setGalleryName("");
          setGalleryFile(null);
        }}
        onSubmit={handleGallerySubmit}
        galleryName={galleryName}
        setGalleryName={setGalleryName}
        galleryFile={galleryFile}
        setGalleryFile={setGalleryFile}
        handleGalleryFileChange={handleGalleryFileChange}
        isEdit={!!galleryEditId}
        editingGallery={editingGallery}
      />
    </div>
  );
}
