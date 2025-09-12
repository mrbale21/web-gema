"use client";

import { useEffect, useState } from "react";

interface Tenant {
  id: number;
  nameTenant: string;
  address: string;
  desc: string;
  phone: string;
  email: string;
  linkMaps?: string;
  linkFacebook?: string;
  linkInstagram?: string;
  linkTwitter?: string;
  linkLinkedin?: string;
  copyRight?: string;
  imageLogo?: string;
}

export default function TenantDashboard() {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchTenant();
  }, []);

  const fetchTenant = async () => {
    try {
      const res = await fetch("/api/tenant");
      const text = await res.text();
      const data = text ? JSON.parse(text) : null;
      setTenant(data);
    } catch (err) {
      console.error(err);
      alert("Gagal fetch tenant");
    }
  };

  const handleChange = (field: keyof Tenant, value: string) => {
    if (!tenant) return;
    setTenant({ ...tenant, [field]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (!tenant) return;
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(tenant).forEach(([key, value]) => {
        if (value) formData.append(key, value as string);
      });
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch("/api/tenant", {
        method: "PUT",
        body: formData,
      });
      const text = await res.text();
      const updated = text ? JSON.parse(text) : null;
      setTenant(updated);
      alert("Tenant berhasil diperbarui!");
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui tenant");
    } finally {
      setLoading(false);
    }
  };

  if (!tenant) return <p>Loading tenant...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dashboard Tenant</h1>

      {Object.keys(tenant).map((key) => {
        if (key === "id" || key === "imageLogo") return null;
        return (
          <div key={key} className="mb-4">
            <label className="block font-semibold text-gray-800 capitalize">
              {key}
            </label>
            <input
              type="text"
              value={(tenant as any)[key] || ""}
              onChange={(e) =>
                handleChange(key as keyof Tenant, e.target.value)
              }
              placeholder={`Masukkan ${key}`}
              className="border p-2 w-full rounded text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        );
      })}

      <div className="mb-4">
        <label className="block font-semibold">Logo Tenant</label>
        <input type="file" onChange={handleFileChange} />
        {tenant.imageLogo && (
          <img
            src={tenant.imageLogo}
            alt="Logo"
            className="mt-2 h-24 w-24 object-contain"
          />
        )}
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        {loading ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </div>
  );
}
