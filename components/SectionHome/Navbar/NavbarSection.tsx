"use client";

import { availableIcons } from "@/components/Common/AvailableIcons";
import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CgMenuGridO } from "react-icons/cg";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import MenuDropdown from "./MenuDropdown";
import { Product } from "@/types/products";
import { Package } from "lucide-react"; // icon default
import Loading from "@/components/Common/Loading";
import { usePathname } from "next/navigation";

interface MenuItem {
  id: number;
  title: string;
  href?: string;
  submenus: Submenu[];
}

interface Submenu {
  id: number;
  title: string;
  href?: string;
  icon?: string;
}

const getIcon = (iconName?: string, size: number = 18) => {
  if (!iconName) return <Package className="h-4 w-4" />; // default icon
  const found = availableIcons.find((i) => i.name === iconName);
  if (!found) return <Package className="h-4 w-4" />;
  return <span className="flex items-center justify-center">{found.icon}</span>;
};

export default function NavbarSection() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeSubIndex, setActiveSubIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isPastBanner, setIsPastBanner] = useState(false);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  let lastScrollY = 0;

  useEffect(() => {
    const fetchMenuAndProducts = async () => {
      try {
        const menuRes = await fetch("/api/menu");
        const menuData: MenuItem[] = await menuRes.json();

        const productRes = await fetch("/api/products");
        const productData: Product[] = await productRes.json();
        const activeProducts = productData.filter((p) => p.isActive);

        const updatedMenus = menuData.map((menu) => {
          if (menu.title.toLowerCase() === "produk") {
            return {
              ...menu,
              submenus: activeProducts.map((p) => ({
                id: p.id,
                title: p.name,
                href: `/page/products/${p.slug}`,
                icon: "Package", // default icon
              })),
            };
          }
          return menu;
        });

        setMenus(updatedMenus);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch menu or products");
      } finally {
        setLoading(false);
      }
    };
    fetchMenuAndProducts();
  }, []);

  useEffect(() => {
    const bannerHeight = 500;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsPastBanner(currentScrollY > bannerHeight);
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100);
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSubmenu = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleSubClick = (subIndex: number) => {
    setActiveSubIndex(subIndex);
    setIsOpen(false); // Tutup mobile menu setelah klik
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href; // exact match
  };

  if (loading) return <Loading type="spinner" text="Memuat Menu..." />;
  if (error) return <Loading type="spinner" text="Data Tidak Ditemukan!" />;

  return (
    <header
      className={`fixed top-0 left-0 w-full lg:py-6 z-50 transition-all duration-300 ${
        isPastBanner ? "bg-white shadow-md" : "bg-white"
      } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="px-[12px] md:px-[36px] xl:px-0 flex items-center justify-between mx-auto relative max-w-[1320px]">
        {/* LOGO */}
        <Link href="/" className="flex">
          <img
            src="/assets/images/logo.png"
            alt="logo"
            className=" z-50 w-[80px] sm:w-[100px]"
          />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="z-50 absolute hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:block">
          <ul className="navbar flex flex-col justify-center font-chivo gap-[34px] lg:flex-row">
            {menus.map((menu) =>
              menu.submenus && menu.submenus.length > 0 ? (
                <MenuDropdown
                  key={menu.id}
                  title={menu.title}
                  icon="/storage/template_3/assets/images/icons/icon-caret.svg"
                  items={menu.submenus.map((sub) => ({
                    label: sub.title,
                    href: sub.href as string,
                    icon: getIcon(sub.icon, 20),
                    active: isActive(sub.href), // 👈 aktifkan di sini
                  }))}
                  cols={2}
                  width="w-[340px]"
                  textColor={isPastBanner ? "text-black" : "text-black"}
                />
              ) : (
                <li key={menu.id}>
                  <Link
                    href={menu.href as string}
                    className={`${
                      isActive(menu.href)
                        ? "text-primary border-b-2 border-primary"
                        : "text-black"
                    } hover:text-primary text-xl font-semibold transition duration-200`}
                  >
                    {menu.title}
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>

        {/* MOBILE NAV TOGGLE */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden z-[150] w-42 h-18 sm:h-24 -mr-10"
        >
          <div className="flex items-center justify-center gap-2 mt-3">
            {isOpen ? (
              <X size={38} className="text-black" />
            ) : (
              <CgMenuGridO className="text-black" size={38} />
            )}
          </div>
        </button>
      </div>

      {/* MOBILE MENU */}
      <nav
        className={`lg:hidden text-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/10 mt-17 sm:mt-20 bg-white shadow-md flex flex-col transition-all duration-200 w-[300px] sm:w-[420px] z-[100] ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="p-[30px] w-full text-center">
          <ul className="font-chivo font-medium text-[16px] leading-[16px] w-full">
            {menus.map((menu, index) => (
              <li key={menu.id} className="group py-[13px]">
                {menu.submenus && menu.submenus.length > 0 ? (
                  <>
                    {/* Parent Menu */}
                    <div
                      className={`flex items-center justify-center gap-2 transition-all duration-200 hover:text-primary hover:translate-x-[2px] cursor-pointer ${
                        menu.submenus.some((s) => isActive(s.href))
                          ? "text-primary font-bold"
                          : ""
                      }`}
                      onClick={() => toggleSubmenu(index)}
                    >
                      <p>{menu.title}</p>
                      <IoIosArrowDropdownCircle
                        className={`transition-transform duration-200 ${
                          activeIndex === index ? "rotate-180" : ""
                        }`}
                      />
                    </div>

                    {/* Submenu */}
                    <ul
                      className={`mt-5 pt-[10px] pb-2 border-t border-b border-primary bg-white transition-all duration-200 overflow-hidden ${
                        activeIndex === index ? "block" : "hidden"
                      }`}
                    >
                      {menu.submenus.map((sub, subIndex) => (
                        <li
                          key={sub.id}
                          onClick={() => handleSubClick(subIndex)}
                          className={`text-md py-[15px] flex items-center justify-center gap-2 px-5 cursor-pointer transition-all duration-200 ${
                            isActive(sub.href)
                              ? "bg-primary text-white"
                              : "hover:bg-primary/20"
                          }`}
                        >
                          {getIcon(sub.icon, 18)}
                          <Link
                            href={sub.href as string}
                            className="block text-center"
                          >
                            {sub.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    href={menu.href as string}
                    className={`flex items-center justify-center gap-2 transition-all duration-200 hover:text-primary hover:translate-x-[2px] ${
                      isActive(menu.href) ? "text-primary font-bold" : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {menu.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
