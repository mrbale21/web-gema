/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Alert from "../Common/Alert";
import ConfirmAlert from "../Common/ConfirmAlert";
import DynamicIcon from "../Common/DynamicIcon";
import IconDropdown from "../Common/IconDropdown";

type SubmenuType = {
  id: number;
  title: string;
  href?: string;
  icon?: string;
};

type MenuType = {
  id: number;
  title: string;
  href?: string;
  submenus: SubmenuType[];
};

export default function Placeholder() {
  const [menus, setMenus] = useState<MenuType[]>([]);
  const [addMenuModal, setAddMenuModal] = useState(false);
  const [editMenuModal, setEditMenuModal] = useState(false);
  const [addSubmenuModal, setAddSubmenuModal] = useState(false);
  const [editSubmenuModal, setEditSubmenuModal] = useState(false);

  const [selectedMenu, setSelectedMenu] = useState<MenuType | null>(null);
  const [selectedSubmenu, setSelectedSubmenu] = useState<SubmenuType | null>(
    null
  );

  const [title, setTitle] = useState("");
  const [href, setHref] = useState("");
  const [icon, setIcon] = useState("");

  const [error, setError] = useState("");
  const [alert, setAlert] = useState<any>(null);

  // === Fetch Menu
  const fetchMenus = async () => {
    const res = await fetch("/api/menu");
    const data = await res.json();
    setMenus(data);
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const resetForm = () => {
    setTitle("");
    setHref("");
    setIcon("");
    setError("");
    setSelectedMenu(null);
    setSelectedSubmenu(null);
  };

  // === ADD Menu
  const handleAddMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, href }),
      });
      if (!res.ok) throw new Error("Gagal tambah menu");
      fetchMenus();
      resetForm();
      setAddMenuModal(false);
      setAlert({ type: "success", message: "Menu berhasil ditambahkan!" });
    } catch (err: any) {
      setError(err.message);
    }
  };

  // === ADD Submenu
  const handleAddSubmenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMenu) return;
    try {
      const res = await fetch(`/api/menu/${selectedMenu.id}/submenus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, href, icon }),
      });
      if (!res.ok) throw new Error("Gagal tambah submenu");
      fetchMenus();
      resetForm();
      setAddSubmenuModal(false);
      setAlert({ type: "success", message: "Submenu berhasil ditambahkan!" });
    } catch (err: any) {
      setError(err.message);
    }
  };

  // === UPDATE Menu
  const handleUpdateMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMenu) return;
    try {
      const res = await fetch(`/api/menu/${selectedMenu.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, href }),
      });
      if (!res.ok) throw new Error("Gagal update menu");
      fetchMenus();
      resetForm();
      setEditMenuModal(false);
      setAlert({ type: "success", message: "Menu berhasil diperbarui!" });
    } catch (err: any) {
      setError(err.message);
    }
  };

  // === UPDATE Submenu
  const handleUpdateSubmenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmenu && !selectedMenu) return;
    try {
      const res = await fetch(
        `/api/menu/${selectedMenu?.id}/submenus/${selectedSubmenu?.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, href, icon }),
        }
      );
      if (!res.ok) throw new Error("Gagal update submenu");
      fetchMenus();
      resetForm();
      setEditSubmenuModal(false);
      setAlert({ type: "success", message: "Submenu berhasil diperbarui!" });
    } catch (err: any) {
      setError(err.message);
    }
  };

  // === DELETE Menu/Submenu
  const handleDeleteMenu = (type: "menu", id: number) => {
    setAlert({
      type: "warning",
      message: `Yakin hapus ${type}?`,
      show: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/${type}/${id}`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error("Gagal hapus");
          fetchMenus();
          setAlert({
            type: "success",
            message: `${type} berhasil dihapus`,
            show: true,
          });
        } catch (err: any) {
          setAlert({
            type: "error",
            message: err.message,
            show: true,
          });
        }
      },
      onCancel: () => setAlert(null),
    });
  };
  const handleDeleteSubmenu = (
    type: "submenus",
    menuId: number,
    id: number
  ) => {
    setAlert({
      type: "warning",
      message: `Yakin hapus ${type}?`,
      show: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/menu/${menuId}/${type}/${id}`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error("Gagal hapus");
          fetchMenus();
          setAlert({
            type: "success",
            message: `${type} berhasil dihapus`,
            show: true,
          });
        } catch (err: any) {
          setAlert({
            type: "error",
            message: err.message,
            show: true,
          });
        }
      },
      onCancel: () => setAlert(null),
    });
  };

  return (
    <div className="min-h-screen text-gray-800">
      {alert && alert.onConfirm ? (
        <ConfirmAlert {...alert} />
      ) : (
        alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            duration={5000}
            onClose={() => setAlert(null)}
          />
        )
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Daftar Navbar</h1>
        <button
          onClick={() => setAddMenuModal(true)}
          className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90"
        >
          Tambah Menu
        </button>
      </div>

      {/* === List Menu + Submenu === */}
      <div className="space-y-4">
        {menus.map((menu) => (
          <div
            key={menu.id}
            className="bg-white p-4 rounded-lg shadow space-y-2"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold">{menu.title}</h2>
                <p className="text-sm text-gray-600">{menu.href}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="text-blue-500"
                  onClick={() => {
                    setSelectedMenu(menu);
                    setTitle(menu.title);
                    setHref(menu.href || "");
                    setEditMenuModal(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="text-red-500"
                  onClick={() => handleDeleteMenu("menu", menu.id)}
                >
                  Delete
                </button>
                <button
                  className="text-green-600"
                  onClick={() => {
                    setSelectedMenu(menu);
                    setAddSubmenuModal(true);
                  }}
                >
                  + Submenu
                </button>
              </div>
            </div>

            {/* Submenus */}
            {menu.submenus.length > 0 && (
              <div className="ml-6 border-l pl-4 space-y-2">
                {menu.submenus.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2">
                      {sub.icon && (
                        <DynamicIcon name={sub.icon} className="w-5 h-5" />
                      )}
                      <span>{sub.title}</span>
                      <span className="text-sm text-gray-500">{sub.href}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="text-blue-500"
                        onClick={() => {
                          setSelectedSubmenu(sub);
                          setTitle(sub.title);
                          setHref(sub.href || "");
                          setIcon(sub.icon || "");
                          setEditSubmenuModal(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500"
                        onClick={() =>
                          handleDeleteSubmenu("submenus", menu.id, sub.id)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Add Menu */}
      {addMenuModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form
            onSubmit={handleAddMenu}
            className="bg-white p-6 rounded-lg w-96 space-y-4"
          >
            <input
              type="text"
              placeholder="Judul Menu"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border rounded p-2"
            />
            <input
              type="text"
              placeholder="Href"
              value={href}
              onChange={(e) => setHref(e.target.value)}
              className="w-full border rounded p-2"
            />
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-primary text-white rounded p-2"
              >
                Simpan
              </button>
              <button
                type="button"
                className="flex-1 border rounded p-2"
                onClick={() => setAddMenuModal(false)}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Modal Edit Menu */}
      {editMenuModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form
            onSubmit={handleUpdateMenu}
            className="bg-white p-6 rounded-lg w-96 space-y-4"
          >
            <input
              type="text"
              placeholder="Judul Menu"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border rounded p-2"
            />
            <input
              type="text"
              placeholder="Href"
              value={href}
              onChange={(e) => setHref(e.target.value)}
              className="w-full border rounded p-2"
            />
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-primary text-white rounded p-2"
              >
                Simpan
              </button>
              <button
                type="button"
                className="flex-1 border rounded p-2"
                onClick={() => setEditMenuModal(false)}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Add Submenu */}
      {addSubmenuModal && selectedMenu && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form
            onSubmit={handleAddSubmenu}
            className="bg-white p-6 rounded-lg w-96 space-y-4"
          >
            <input
              type="text"
              placeholder="Judul Submenu"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border rounded p-2"
            />
            <input
              type="text"
              placeholder="Href"
              value={href}
              onChange={(e) => setHref(e.target.value)}
              className="w-full border rounded p-2"
            />
            <IconDropdown value={icon} onChange={setIcon} />
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white rounded p-2"
              >
                Simpan
              </button>
              <button
                type="button"
                className="flex-1 border rounded p-2"
                onClick={() => setAddSubmenuModal(false)}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Modal edit Submenu */}
      {editSubmenuModal && selectedSubmenu && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form
            onSubmit={handleUpdateSubmenu}
            className="bg-white p-6 rounded-lg w-96 space-y-4"
          >
            <input
              type="text"
              placeholder="Judul Submenu"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border rounded p-2"
            />
            <input
              type="text"
              placeholder="Href"
              value={href}
              onChange={(e) => setHref(e.target.value)}
              className="w-full border rounded p-2"
            />
            <IconDropdown value={icon} onChange={setIcon} />
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white rounded p-2"
              >
                Simpan
              </button>
              <button
                type="button"
                className="flex-1 border rounded p-2"
                onClick={() => setEditSubmenuModal(false)}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
