// pages/dokumentasi.tsx
import LayoutPage from "../layout-page";
import Image from "next/image";

export default function DokumentasiPage() {
  // Data Foto Dokumentasi
  const photos = [
    {
      src: "/assets/images/news-3.jpg",
      alt: "Acara Gema Nahdliyin 1",
    },
    {
      src: "/assets/images/news-5.jpg",
      alt: "Acara Gema Nahdliyin 2",
    },
    {
      src: "/assets/images/news-2.jpg",
      alt: "Acara Gema Nahdliyin 3",
    },
    {
      src: "/assets/images/news-4.jpg",
      alt: "Acara Gema Nahdliyin 4",
    },
  ];

  // Data Video Dokumentasi
  const videos = [
    {
      src: "https://www.youtube.com/embed/PXzAU2tgIUM?si=FdIY1pJc9CQDb16l",
      title: "Dokumentasi Gema Nahdliyin 1",
    },
    {
      src: "https://www.youtube.com/embed/GoCoaAP9pNs?si=nqUY_x3OP7nZ7_pS",
      title: "Dokumentasi Gema Nahdliyin 2",
    },
  ];

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
          {photos.map((photo, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-xl shadow-lg hover:scale-105 transform transition duration-300"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={500}
                height={350}
                className="w-full h-[250px] object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-20 pb-20">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">Galeri Video</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((video, index) => (
            <div
              key={index}
              className="aspect-video rounded-xl overflow-hidden shadow-lg hover:scale-105 transform transition duration-300"
            >
              <iframe
                className="w-full h-full"
                src={video.src}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ))}
        </div>
      </section>
    </LayoutPage>
  );
}
