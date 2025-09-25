"use client";

import { useEffect, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import Alert from "../Common/Alert";
import ConfirmAlert from "../Common/ConfirmAlert";

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export default function UsersDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [alert, setAlert] = useState<{
    type: "success" | "error" | "warning" | "info";
    message: string;
    show?: boolean;
    onClose?: () => void;
    onConfirm?: () => void;
    onCancel?: () => void;
  } | null>(null);

  // ===== Fetch Users =====
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");

      const text = await res.text();
      const data = text ? JSON.parse(text) : [];
      setUsers(data);
    } catch (err) {
      console.error("Fetch users error:", err);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ===== Add User =====
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setAlert({ type: "error", message: data.error || "Gagal tambah user" });
        return;
      }

      setAddModal(false);
      resetForm();
      fetchUsers();
      setAlert({ type: "success", message: "User berhasil ditambahkan!" });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setAlert({ type: "error", message: err.message || "Gagal tambah user" });
    }
  };

  // ===== Edit User =====
  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const res = await fetch(`/api/users/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password: password || undefined }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setAlert({ type: "error", message: data.error || "Gagal update user" });
        return;
      }

      setEditModal(false);
      resetForm();
      fetchUsers();
      setAlert({ type: "success", message: "User berhasil diperbarui!" });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setAlert({ type: "error", message: err.message || "Gagal update user" });
    }
  };

  // ===== Delete User dengan custom alert =====
  const handleDeleteUser = (user: User) => {
    setAlert({
      type: "warning",
      message: `Apakah anda yakin ingin menghapus ${user.name}?`,
      show: true,
      onConfirm: async () => {
        setAlert(null); // tutup alert
        try {
          const res = await fetch(`/api/users/${user.id}`, {
            method: "DELETE",
          });
          const data = await res.json();
          if (!res.ok) {
            setAlert({
              type: "error",
              message: data.error || "Gagal hapus user",
              show: true,
            });
            return;
          }
          fetchUsers();
          setAlert({
            type: "success",
            message: "User berhasil dihapus!",
            show: true,
          });
        } catch (err: any) {
          setAlert({
            type: "error",
            message: err.message || "Terjadi kesalahan",
            show: true,
          });
        }
      },
      onCancel: () => setAlert(null),
    });
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setSelectedUser(null);
    setError("");
  };

  return (
    <div className="min-h-screen p-6 bg-white text-gray-800 space-y-8 relative">
      {/* Alert */}
      {/* Alert atau Confirm */}
      {alert && alert.onConfirm ? (
        <ConfirmAlert
          type={alert.type}
          message={alert.message}
          show={alert.show ?? true}
          onConfirm={alert.onConfirm}
          onCancel={alert.onCancel}
        />
      ) : (
        alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            duration={6000}
            onClose={() => setAlert(null)}
          />
        )
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Daftar Pengguna</h1>
        <button
          onClick={() => setAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Tambah Pengguna
        </button>
      </div>

      {/* Users List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="p-4 bg-gray-50 rounded-lg shadow flex flex-col justify-between"
          >
            <div>
              <p className="font-semibold text-gray-800">{user.name}</p>
              <p className="text-gray-600 text-sm break-all">{user.email}</p>
              <p className="text-gray-500 text-xs mt-1">
                Created: {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2 mt-3 justify-end">
              <button
                onClick={() => {
                  setSelectedUser(user);
                  setName(user.name);
                  setEmail(user.email);
                  setPassword("");
                  setEditModal(true);
                }}
                className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded transition"
              >
                <BsPencilSquare />
              </button>
              <button
                onClick={() => handleDeleteUser(user)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
              >
                <MdDelete />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add & Edit Modal (sama seperti sebelumnya) */}
      {addModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <form
            onSubmit={handleAddUser}
            className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4"
          >
            <h2 className="text-xl font-bold">Tambah User</h2>
            <input
              type="text"
              placeholder="Nama"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border rounded-lg p-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded-lg p-2"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border rounded-lg p-2"
            />
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Tambah
            </button>
            <button
              type="button"
              onClick={() => setAddModal(false)}
              className="w-full mt-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-100"
            >
              Batal
            </button>
          </form>
        </div>
      )}

      {editModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <form
            onSubmit={handleEditUser}
            className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4"
          >
            <h2 className="text-xl font-bold">Edit User</h2>
            <input
              type="text"
              placeholder="Nama"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border rounded-lg p-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded-lg p-2"
            />
            <input
              type="password"
              placeholder="Password (kosongkan jika tidak ingin diubah)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg p-2"
            />
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full bg-yellow-400 text-white py-2 rounded-lg hover:bg-yellow-500"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => setEditModal(false)}
              className="w-full mt-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-100"
            >
              Batal
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
