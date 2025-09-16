"use client";

import { useEffect, useState } from "react";
import Alert from "../Common/Alert";

interface Tenant {
  id?: number;
  nameTenant?: string;
  address?: string;
  desc?: string;
  phone?: string;
  email?: string;
  linkMaps?: string;
  linkFacebook?: string;
  linkInstagram?: string;
  linkTwitter?: string;
  linkLinkedin?: string;
  copyRight?: string;
  imageLogo?: string;
}

const LABELS: Record<keyof Tenant, string> = {
  id: "ID",
  nameTenant: "Nama Tenant",
  address: "Alamat",
  desc: "Deskripsi",
  phone: "Telepon",
  email: "Email",
  linkMaps: "Link Maps",
  linkFacebook: "Facebook",
  linkInstagram: "Instagram",
  linkTwitter: "Twitter",
  linkLinkedin: "LinkedIn",
  copyRight: "Hak Cipta",
  imageLogo: "Logo Tenant",
};

export default function TenantDashboard() {
  const [tenant, setTenant] = useState<Tenant>({});
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchTenant();
  }, []);

  const fetchTenant = async () => {
    try {
      const res = await fetch("/api/tenant");
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      setTenant(data || {});
    } catch (err) {
      console.error(err);
      setAlert({ type: "error", message: "Gagal menyimpan data!" });
    }
  };

  const handleChange = (field: keyof Tenant, value: string) => {
    setTenant({ ...tenant, [field]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setImageFile(e.target.files[0]);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(tenant).forEach(([key, value]) => {
        if (["id", "createdAt", "updatedAt"].includes(key)) return; // skip id, createdAt, updatedAt
        if (value) formData.append(key, value as string);
      });
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch("/api/tenant", { method: "PUT", body: formData });
      const text = await res.text();
      const updated = text ? JSON.parse(text) : {};
      setTenant(updated);
      setAlert({ type: "success", message: "Data berhasil disimpan!" });
    } catch (err) {
      console.error(err);
      setAlert({ type: "error", message: "Gagal menyimpan data!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          duration={4000}
          onClose={() => setAlert(null)}
        />
      )}

      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Informasi Tenant
      </h1>

      {Object.keys(tenant).map((key) => {
        if (["id", "imageLogo", "createdAt", "updatedAt"].includes(key))
          return null;
        const k = key as keyof Tenant;
        return (
          <div key={key} className="mb-4">
            <label className="block font-semibold text-gray-800">
              {LABELS[k] || k}
            </label>
            <input
              type="text"
              value={tenant[k] || ""}
              onChange={(e) => handleChange(k, e.target.value)}
              placeholder={`Masukkan ${LABELS[k] || k}`}
              className="border p-2 w-full rounded text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        );
      })}

      <div className="mb-4">
        <label className="block font-semibold text-gray-800 mb-2">
          Logo Tenant
        </label>

        {tenant.imageLogo && (
          <img
            src={tenant.imageLogo}
            alt="Logo"
            className="my-2 h-24 w-24 object-contain"
          />
        )}

        <label className="flex items-center text-sm px-4 py-1 bg-gray-800 text-white rounded cursor-pointer hover:bg-gray-600 w-fit">
          <span>Pilih File</span>
          <input type="file" className="hidden" onChange={handleFileChange} />
        </label>

        {imageFile && (
          <p className="mt-2 text-sm text-gray-600">
            File dipilih: {imageFile.name}
          </p>
        )}
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        {loading ? "Menyimpan..." : "Simpan Tenant"}
      </button>
    </div>
  );
}
