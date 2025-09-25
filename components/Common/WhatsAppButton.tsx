// components/WhatsappButton.tsx
"use client";

import React from "react";

interface WhatsappButtonProps {
  phone: string; // nomor WhatsApp (misal dari phone2)
  message?: string; // pesan default
  className?: string; // untuk styling custom
  children?: React.ReactNode; // teks button
}

export default function WhatsappButton({
  phone,
  message = "Halo, saya ingin menghubungi Anda.",
  className = "bg-green-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-700 transition",
  children = "Hubungi Sekarang",
}: WhatsappButtonProps) {
  const handleClick = () => {
    if (!phone) {
      alert("Nomor WhatsApp tidak tersedia");
      return;
    }
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phone}?text=${encodedMessage}`;
    window.open(url, "_blank");
  };

  return (
    <button className={className} onClick={handleClick}>
      {children}
    </button>
  );
}
