"use client";

import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/dashboard/news"
          className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-transform text-center"
        >
          <h2 className="text-xl font-semibold mb-2">Manage News</h2>
          <p>Tambah, edit, hapus berita</p>
        </Link>

        <Link
          href="#"
          className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-transform text-center"
        >
          <h2 className="text-xl font-semibold mb-2">Manage Users</h2>
          <p>Kelola user login dan akses</p>
        </Link>

        <Link
          href="/dashboard/banner"
          className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-transform text-center"
        >
          <h2 className="text-xl font-semibold mb-2">Manage Banner</h2>
          <p>Tambah, edit, hapus banner</p>
        </Link>

        {/* Bisa ditambah menu lain misal Program, Services, Capaian */}
      </div>
    </div>
  );
}
