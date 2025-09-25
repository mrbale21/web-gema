"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@/components/Common/Alert"; // sesuaikan path

export default function AuthPage() {
  const [type, setType] = useState<"login" | "register" | "verify">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAlertMessage("");

    try {
      // --- VERIFIKASI PIN ---
      if (type === "verify") {
        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, pin }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Terjadi kesalahan server");
          return;
        }

        setAlertMessage("Verifikasi berhasil! Silakan login.");
        setType("login");
        setPin("");
        return;
      }

      // --- REGISTER ---
      if (type === "register") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Terjadi kesalahan server");
          return;
        }

        setAlertMessage(
          "Registrasi berhasil! Silakan cek email untuk PIN verifikasi."
        );
        setType("verify");
        return;
      }

      // --- LOGIN ---
      if (type === "login") {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Email atau password salah");
          return;
        }

        // JWT sekarang disimpan di cookie HTTP-only
        // Simpan user info untuk UI
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/admin/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {alertMessage && (
        <Alert
          type="success"
          message={alertMessage}
          duration={4000}
          onClose={() => setAlertMessage("")}
        />
      )}

      {/* Form utama */}
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {type === "login"
            ? "Login"
            : type === "register"
            ? "Register"
            : "Verifikasi PIN"}
        </h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {type === "register" && (
            <input
              type="text"
              placeholder="Nama Lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-gray-800 text-gray-900"
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-gray-800 text-gray-900"
            required
          />

          {type !== "verify" && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-gray-800 text-gray-900"
              required
            />
          )}

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            {type === "login"
              ? "Login"
              : type === "register"
              ? "Register"
              : "Verifikasi PIN"}
          </button>
        </form>

        {type !== "verify" && (
          <p className="mt-4 text-center text-gray-600">
            {type === "login" ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
            <button
              className="text-primary font-semibold underline"
              onClick={() => setType(type === "login" ? "register" : "login")}
            >
              {type === "login" ? "Register" : "Login"}
            </button>
          </p>
        )}
      </div>

      {/* Modal PIN overlay */}
      {type === "verify" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
              Masukkan PIN Verifikasi
            </h2>
            {error && <p className="text-red-500 mb-2 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="PIN verifikasi"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                required
              />
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Verifikasi PIN
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
