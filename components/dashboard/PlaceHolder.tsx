"use client";

export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow-md text-center max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">{title}</h1>
        <p className="text-gray-600">This section is coming soon!</p>
      </div>
    </div>
  );
}
