"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface BlogCardProps {
  id: number;
  title: string;
  slug: string;
  tag: string;
  editor: string;
  content: string;
  image?: string | null;
  createdAt: string;
}

export default function NewsCard({
  id,
  image,
  title,
  content,
  createdAt,
  tag,
  slug,
}: BlogCardProps) {
  const router = useRouter();
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col">
      <img
        src={image || "no image"}
        alt={title}
        className="w-full h-56 object-cover object-center"
      />
      <div className="p-5 flex flex-col flex-grow">
        <span className="text-secondary text-sm font-semibold">
          {createdAt}
        </span>
        <h3 className="text-lg font-bold mt-2 mb-3">{title}</h3>
        <p className="text-gray-600 flex-grow">{content}</p>
        <button
          onClick={() => router.push(`/news/${id}`)}
          className="mt-4 inline-flex items-center text-primary font-semibold hover:underline"
        >
          Baca Selengkapnya <ArrowRight size={18} className="ml-1" />
        </button>
      </div>
    </div>
  );
}
