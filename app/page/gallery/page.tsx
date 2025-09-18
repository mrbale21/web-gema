"use client";

// pages/dokumentasi.tsx
import { GalleryType } from "@/types/gallery";
import { VideoType } from "@/types/video";
import Image from "next/image";
import { useEffect, useState } from "react";
import LayoutPage from "../layout-page";

export default function DokumentasiPage() {
  const [allGallery, setAllGallery] = useState<GalleryType[]>([]);
  const [allVideo, setAllVideo] = useState<VideoType[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(allGallery.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPhotos = allGallery.slice(startIndex, startIndex + itemsPerPage);

  //   function ZoomableImage({ src }: { src: string }) {
  //   const [isZoomed, setIsZoomed] = useState(false);

  //   return (
  //     <div
  //       className={`transition-transform duration-300 cursor-${
  //         isZoomed ? "zoom-out" : "zoom-in"
  //       }`}
  //       onClick={(e) => {
  //         e.stopPropagation(); // biar tidak nutup popup
  //         setIsZoomed(!isZoomed);
  //       }}
  //     >
  //       <Image
  //         src={src}
  //         alt="popup"
  //         width={1200}
  //         height={800}
  //         className={`object-contain max-h-[90vh] w-auto mx-auto rounded-lg transform ${
  //           isZoomed ? "scale-150" : "scale-100"
  //         }`}
  //       />
  //     </div>
  //   );
  // }

  function getYoutubeEmbedUrl(url: string): string {
    if (url.includes("watch?v=")) {
      const parts = url.split("watch?v=");
      const videoId = parts[1]?.split("&")[0]; // pakai optional chaining
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    return url; // fallback kalau bukan format watch?v=
  }

  useEffect(() => {
    fetch("/api/documentasi/gallery")
      .then((res) => res.json())
      .then((data) => setAllGallery(data));
  }, []);

  useEffect(() => {
    fetch("/api/documentasi/video")
      .then((res) => res.json())
      .then((data) => setAllVideo(data));
  }, []);

  return (
    <LayoutPage
      title="Dokumentasi"
      titlePage="Dokumentasi Gema Nahdliyin"
      desc="Galeri foto & video kegiatan Gema Nahdliyin"
    >
      <div className="text-center items-center flex flex-col mb-12 px-4 mt-20">
        <h2 className="text-gray-900 font-bold font-chivo mb-5 text-[35px] leading-[44px] md:text-[46px] md:leading-[52px] lg:text-heading-1 md:mb-[30px]">
          Dokumentasi Gema Nahdliyin
        </h2>
        <p className="text-quote md:text-lead-lg text-xl text-gray-600 max-w-2xl">
          Kumpulan dokumentasi foto dan video kegiatan Gema Nahdliyin, mulai
          dari pelatihan, kolaborasi, hingga acara-acara penting lainnya.
        </p>
      </div>

      <section className="mb-16 px-4 lg:px-20">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">Galeri Foto</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentPhotos.map((photo, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-xl shadow-lg hover:scale-105 transform transition duration-300"
              onClick={() =>
                setSelectedImage(
                  photo.imageUrl ?? "/assets/images/placeholder.jpg"
                )
              }
            >
              <Image
                src={photo.imageUrl ?? "/assets/images/placeholder.jpg"} // fallback
                alt={photo.name}
                width={500}
                height={350}
                className="w-full h-[250px] object-cover"
              />
            </div>
          ))}
        </div>
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={() => setSelectedImage(null)} // klik background untuk close
          >
            <div className="relative max-w-5xl max-h-[90vh]">
              {/* <ZoomableImage src={selectedImage} /> */}
              <Image
                src={selectedImage}
                alt="popup"
                width={1200}
                height={800}
                className="object-contain max-h-[90vh] w-auto mx-auto rounded-lg"
              />
              <button
                className="absolute top-2 font-bold right-2 text-2xl text-red-600 hover:text-red-400 rounded-full p-2  "
                onClick={() => setSelectedImage(null)}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {totalPages > 1 && ( //paging
          <div className="flex justify-center mt-6 gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded ${
                  currentPage === page ? "bg-green-500 text-white" : ""
                }`}
              >
                {page}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </section>

      <section className="px-4 sm:px-20 pb-20">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">Galeri Video</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allVideo.map((video, index) => (
            <div
              key={index}
              className="aspect-video rounded-xl overflow-hidden shadow-lg hover:scale-105 transform transition duration-300"
            >
              {video.type === "YOUTUBE" ? (
                <iframe
                  className="w-full h-full"
                  src={getYoutubeEmbedUrl(video.videoUrl ?? "")}
                  title={video.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <video className="w-full h-full" src={video.videoUrl} controls>
                  Browser Anda tidak mendukung pemutar video.
                </video>
              )}
            </div>
          ))}
        </div>
      </section>
    </LayoutPage>
  );
}
