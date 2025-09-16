"use client";

import { PlayCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Video {
  id: number;
  name: string;
  videoUrl: string | null;
  type: "YOUTUBE" | "LOCAL";
}

export default function VideoSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [video, setVideo] = useState<Video | null>(null);
  const [videoSrc, setVideoSrc] = useState("");

  // Fetch 1 video by ID
  useEffect(() => {
    fetch("/api/documentasi/video/3")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch video");
        return res.json();
      })
      .then((data: Video) => setVideo(data))
      .catch((err) => console.error("Error fetch video:", err));
  }, []);

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
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Play Button */}
      {video?.videoUrl && (
        <button
          onClick={() => openVideo(video.videoUrl!)}
          className="relative z-10 text-white hover:text-primary hover:scale-110 transition-transform"
        >
          <PlayCircle size={80} />
        </button>
      )}

      {/* Modal Video */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg shadow-lg max-w-4xl w-full p-4">
            {/* Close Button */}
            <button
              onClick={closeVideo}
              className="absolute -top-10 -right-10 text-gray-600 hover:text-black"
            >
              <div className="p-2 bg-primary rounded-full">
                <X size={28} color="white" />
              </div>
            </button>

            {/* Video */}
            {videoSrc.includes("youtube.com") ? (
              <iframe
                src={videoSrc}
                title={video?.name || "YouTube video"}
                className="w-full aspect-video rounded-lg"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
            ) : (
              <video
                src={videoSrc}
                controls
                autoPlay
                className="w-full aspect-video rounded-lg"
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
