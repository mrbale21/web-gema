"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  Store,
  ChevronDown,
  ChevronRight,
  X,
  LayoutPanelLeft,
  Image,
  UserCircle,
  BarChart3,
  Handshake,
  Star,
  BookOpen,
  Target,
  HeartHandshake,
  Newspaper,
  Camera,
  Info,
  MessageSquareText,
  ChartColumnStacked,
  ScrollText,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  slug: string;
}

export default function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const [products, setProducts] = useState<Product[]>([]);
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path);
  const isExactActive = (path: string) => pathname === path;
  const isStartsWithActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  const toggleMenu = (id: string) => {
    setOpenMenus((prev) =>
      prev.includes(id) ? prev.filter((menu) => menu !== id) : [...prev, id]
    );
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg border-r border-gray-100 z-50 transform transition-transform duration-200 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">CMS Dashboard</h1>
          <button
            onClick={onClose}
            className="md:hidden p-2 rounded hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4 overflow-y-auto h-[calc(100%-80px)] text-gray-700">
          <ul className="space-y-2">
            {/* Dashboard */}
            <li>
              <Link
                href="/admin/dashboard/products"
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                  pathname === "/admin/dashboard"
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={onClose}
              >
                <Home className="h-5 w-5 mr-3" />
                <span className="font-medium">Dashboard</span>
              </Link>
            </li>

            {/* Header */}
            <li>
              <button
                onClick={() => toggleMenu("header")}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <LayoutPanelLeft className="h-5 w-5" />
                  <span className="font-medium">Header</span>
                </div>
                {openMenus.includes("header") ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {openMenus.includes("header") && (
                <ul className="mt-1 ml-6 space-y-1">
                  <li>
                    <Link
                      href="/admin/dashboard/navbar"
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                        isActive("/admin/dashboard/navbar")
                          ? "bg-primary/10 text-primary/80 border border-primary/50"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={onClose}
                    >
                      <LayoutPanelLeft className="h-4 w-4 mr-2" />
                      Navbar
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/dashboard/banner"
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                        isExactActive("/admin/dashboard/banner")
                          ? "bg-primary/10 text-primary/80 border border-primary/50"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={onClose}
                    >
                      <Image className="h-4 w-4 mr-2" />
                      Banner
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/dashboard/bannerpage"
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                        isExactActive("/admin/dashboard/bannerpage")
                          ? "bg-primary/10 text-primary/80 border border-primary/50"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={onClose}
                    >
                      <Image className="h-4 w-4 mr-2" />
                      Banner Page
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Produk (Dynamic dari DB) */}
            <li>
              <button
                onClick={() => toggleMenu("products")}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <Store className="h-5 w-5" />
                  <span className="font-medium">Produk</span>
                </div>
                {openMenus.includes("products") ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>

              {openMenus.includes("products") && (
                <ul className="mt-1 ml-6 space-y-1">
                  <li>
                    <Link
                      href="/admin/dashboard/product"
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                        isExactActive("/admin/dashboard/product")
                          ? "bg-primary/10 text-primary/80 border border-primary/50"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={onClose}
                    >
                      <ScrollText className="h-4 w-4 mr-2" />
                      Data Produk
                    </Link>
                  </li>
                  {products.map((product) => (
                    <li key={product.id}>
                      <Link
                        href={`/admin/dashboard/products/${product.slug}`}
                        className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                          isExactActive(
                            `/admin/dashboard/products/${product.slug}`
                          )
                            ? "bg-primary/10 text-primary/80 border border-primary/50"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                        onClick={onClose}
                      >
                        <Package className="h-4 w-4 mr-2" />
                        <span className="font-medium">{product.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Profil */}
            <li>
              <button
                onClick={() => toggleMenu("profile")}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <UserCircle className="h-5 w-5" />
                  <span className="font-medium">Profil</span>
                </div>
                {openMenus.includes("profile") ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {openMenus.includes("profile") && (
                <ul className="mt-1 ml-6 space-y-1">
                  <li>
                    <Link
                      href="/admin/dashboard/timeline"
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                        isActive("/admin/dashboard/timeline")
                          ? "bg-primary/10 text-primary/80 border border-primary/50"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={onClose}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Sejarah
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/dashboard/visi-misi"
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                        isActive("/admin/dashboard/visi-misi")
                          ? "bg-primary/10 text-primary/80 border border-primary/50"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={onClose}
                    >
                      <Target className="h-4 w-4 mr-2" />
                      Visi Misi
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/dashboard/program"
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                        isActive("/admin/dashboard/program")
                          ? "bg-primary/10 text-primary/80 border border-primary/50"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={onClose}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Program
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/dashboard/principle"
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                        isActive("/admin/dashboard/principle")
                          ? "bg-primary/10 text-primary/80 border border-primary/50"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={onClose}
                    >
                      <HeartHandshake className="h-4 w-4 mr-2" />
                      Nilai & Prinsip
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Blog */}
            <li>
              <button
                onClick={() => toggleMenu("blog")}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <Newspaper className="h-5 w-5" />
                  <span className="font-medium">Blog</span>
                </div>
                {openMenus.includes("blog") ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {openMenus.includes("blog") && (
                <ul className="mt-1 ml-6 space-y-1">
                  <li>
                    <Link
                      href="/admin/dashboard/news"
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                        isActive("/admin/dashboard/news")
                          ? "bg-primary/10 text-primary/80 border border-primary/50"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={onClose}
                    >
                      <Newspaper className="h-4 w-4 mr-2" />
                      Data Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/dashboard/categories"
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                        isActive("/admin/dashboard/categories")
                          ? "bg-primary/10 text-primary/80 border border-primary/50"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={onClose}
                    >
                      <ChartColumnStacked className="h-4 w-4 mr-2" />
                      Kategori
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/dashboard/comment"
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                        isActive("/admin/dashboard/comment")
                          ? "bg-primary/10 text-primary/80 border border-primary/50"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={onClose}
                    >
                      <MessageSquareText className="h-4 w-4 mr-2" />
                      Komentar
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Dokumentasi */}
            <li>
              <Link
                href="/admin/dashboard/documentasi"
                className={`flex items-center px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                  isActive("/admin/dashboard/documentasi")
                    ? "bg-primary/10 text-primary/80 border border-primary/50"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={onClose}
              >
                <Camera className="h-5 w-5 mr-3" />
                Dokumentasi
              </Link>
            </li>

            {/* Informasi */}
            <li>
              <Link
                href="/admin/dashboard/tenant"
                className={`flex items-center px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                  isActive("/admin/dashboard/tenant")
                    ? "bg-primary/10 text-primary/80 border border-primary/50"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={onClose}
              >
                <Info className="h-5 w-5 mr-3" />
                Informasi
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
