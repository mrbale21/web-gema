"use client";

import { useState } from "react";
import { PlayCircle, X } from "lucide-react";

export default function VideoSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [videoSrc, setVideoSrc] = useState("");

  const openVideo = (src: string) => {
    setVideoSrc(src);
    setIsOpen(true);
  };

  const closeVideo = () => {
    setIsOpen(false);
    setVideoSrc("");
  };

  return (
    <section
      className="relative h-[600px] bg-fixed bg-center bg-cover flex items-center justify-center"
      style={{
        backgroundImage: "url('/assets/images/banner-2.png')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-opacity-50"></div>

      {/* Play Button */}
      <button
        onClick={() =>
          openVideo(
            "https://www.youtube.com/embed/-IcqdG-uSPw?si=XzkqjSXs69Iv_-ym"
          )
        }
        className="relative z-10 text-white hover:text-primary hover:scale-110 transition-transform"
      >
        <PlayCircle size={80} />
      </button>

      {/* Modal Video */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg shadow-lg max-w-4xl w-full p-4">
            <button
              onClick={closeVideo}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              <div className="p-2 bg-primary rounded-full">
                <X size={28} color="white" />
              </div>
            </button>

            {/* Video */}
            {videoSrc.includes("youtube.com") ? (
              <iframe
                src={videoSrc}
                title="YouTube video"
                className="w-full aspect-video rounded-lg"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
            ) : (
              <video
                src={videoSrc}
                controls
                autoPlay
                className="w-full rounded-lg"
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
