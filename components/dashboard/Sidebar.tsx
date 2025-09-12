"use client";
import {
  Home,
  FileText,
  Users,
  Settings,
  Plus,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { id: "/admin/dashboard", label: "Dashboard", icon: Home },
  {
    id: "posts",
    label: "Beranda",
    icon: FileText,
    children: [
      { id: "/admin/dashboard/news", label: "News", icon: FileText },
      { id: "/admin/dashboard/banner", label: "Banner", icon: FileText },
      { id: "/admin/dashboard/product", label: "Produk", icon: FileText },
      { id: "/admin/dashboard/statistic", label: "Statistik", icon: FileText },
    ],
  },
  { id: "/admin/dashboard/users", label: "Users", icon: Users },
  { id: "/admin/dashboard/Informasi", label: "Tenant", icon: Users },
  { id: "/admin/dashboard/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (id: string) => {
    setOpenMenus((prev) =>
      prev.includes(id) ? prev.filter((menu) => menu !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-100 z-40">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">CMS Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">Content Management</p>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = openMenus.includes(item.id);

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
                      {isOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>

                    {isOpen && (
                      <ul className="mt-1 ml-6 space-y-1">
                        {item.children.map((child) => {
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
  );
}
