"use client";

import {
  BarChart3,
  BookOpen,
  Camera,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  FileText,
  GraduationCap,
  Handshake,
  HeartHandshake,
  Home,
  Image,
  Info,
  Layers3,
  LayoutPanelLeft,
  Newspaper,
  Package,
  Star,
  Store,
  Target,
  UserCircle,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  title: string;
}

export function useNavItems() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/newprod");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    }
    fetchProducts();
  }, []);

  const navItems = [
    { id: "/admin/dashboard", label: "Dashboard", icon: Home },
    {
      id: "head",
      label: "Header",
      icon: LayoutPanelLeft,
      children: [
        {
          id: "/admin/dashboard/navbar",
          label: "Navbar",
          icon: LayoutPanelLeft,
        },
        { id: "/admin/dashboard/banner", label: "Banner", icon: Image },
      ],
    },
    {
      id: "posts",
      label: "Beranda",
      icon: Home,
      children: [
        { id: "/admin/dashboard/product", label: "Produk", icon: Package },
        {
          id: "/admin/dashboard/chairman",
          label: "Ketua Umum",
          icon: UserCircle,
        },
        {
          id: "/admin/dashboard/statistic",
          label: "Statistik",
          icon: BarChart3,
        },
        { id: "/admin/dashboard/partner", label: "Partner", icon: Handshake },
        { id: "/admin/dashboard/superior", label: "Keunggulan", icon: Star },
      ],
    },
    {
      id: "profile",
      label: "Profil",
      icon: UserCircle,
      children: [
        { id: "/admin/dashboard/timeline", label: "Sejarah", icon: BookOpen },
        { id: "/admin/dashboard/visi-misi", label: "Visi Misi", icon: Target },
        { id: "/admin/dashboard/program", label: "Program", icon: FileText },
        {
          id: "/admin/dashboard/principle",
          label: "Nilai & Prinsip",
          icon: HeartHandshake,
        },
      ],
    },
    {
      id: "product",
      label: "Produk",
      icon: Store,
      children: [
        {
          id: "/admin/dashboard/gemakop",
          label: "Gema Koperasi",
          icon: Layers3,
        },
        {
          id: "/admin/dashboard/gemaedtech",
          label: "Gema EdTech",
          icon: GraduationCap,
        },
        {
          id: "/admin/dashboard/gemaedtechapp",
          label: "Gema EdTech App",
          icon: GraduationCap,
        },
        { id: "/admin/dashboard/gemaumkm", label: "Gema UMKM", icon: Store },
        {
          id: "/admin/dashboard/training",
          label: "Pelatihan",
          icon: ClipboardList,
        },
        // produk dari API newprod
        ...products.map((p) => ({
          id: `/admin/dashboard/newprod/${p.id}`,
          label: p.title,
          icon: ClipboardList,
        })),
      ],
    },
    { id: "/admin/dashboard/news", label: "Blog", icon: Newspaper },
    { id: "/admin/dashboard/documentasi", label: "Dokumentasi", icon: Camera },
    { id: "/admin/dashboard/users", label: "Pengguna", icon: Users },
    { id: "/admin/dashboard/tenant", label: "Informasi", icon: Info },
  ];

  return navItems;
}

export default function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const navItems = useNavItems(); // ✅ panggil hook
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (id: string) => {
    setOpenMenus((prev) =>
      prev.includes(id) ? prev.filter((menu) => menu !== id) : [...prev, id]
    );
  };

  return (
    <>
      {/* Overlay di mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg border-r border-gray-100 z-50 transform transition-transform duration-200 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header Sidebar */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">CMS Dashboard</h1>
          <button
            onClick={onClose}
            className="md:hidden p-2 rounded hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Menu */}
        <nav className="p-4 overflow-y-auto h-[calc(100%-80px)]">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const hasChildren = item.children && item.children.length > 0;
              const isMenuOpen = openMenus.includes(item.id);

              return (
                <li key={item.id}>
                  {!hasChildren ? (
                    <Link
                      href={item.id}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                        pathname === item.id
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={onClose}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={() => toggleMenu(item.id)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        {isMenuOpen ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>

                      {isMenuOpen && (
                        <ul className="mt-1 ml-6 space-y-1">
                          {item.children?.map((child) => {
                            const ChildIcon = child.icon;
                            return (
                              <li key={child.id}>
                                <Link
                                  href={child.id}
                                  className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                                    pathname === child.id
                                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                                      : "text-gray-600 hover:bg-gray-100"
                                  }`}
                                  onClick={onClose}
                                >
                                  <ChildIcon className="h-4 w-4 mr-2" />
                                  <span className="text-sm">{child.label}</span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
