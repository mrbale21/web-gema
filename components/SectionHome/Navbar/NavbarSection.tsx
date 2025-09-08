"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { menus } from "@/data/menu";
import { X } from "lucide-react";
import MenuDropdown from "./MenuDropdown";
import { CgMenuGridO } from "react-icons/cg";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { IconType } from "react-icons";

export default function NavbarSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeSubIndex, setActiveSubIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isPastBanner, setIsPastBanner] = useState(false);

  let lastScrollY = 0;

  type MenuItem = {
    label: string;
    href: string;
    icon?: IconType; // ← optional
    submenus?: {
      label: string;
      href: string;
      icon: IconType;
    }[];
  };

  useEffect(() => {
    const bannerHeight = 500;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsPastBanner(currentScrollY > bannerHeight);

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

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
            {menus.map((menu, index) =>
              menu.submenus && menu.submenus.length > 0 ? (
                <MenuDropdown
                  key={menu.label}
                  title={menu.label}
                  icon="/storage/template_3/assets/images/icons/icon-caret.svg"
                  items={menu.submenus.map((sub) => ({
                    label: sub.label,
                    href: sub.href,
                    icon: <sub.icon size={35} className="" />,
                  }))}
                  cols={2}
                  width="w-[340px]"
                  textColor={isPastBanner ? "text-black" : "text-black"}
                />
              ) : (
                <li key={index}>
                  <Link
                    href={menu.href}
                    className={`${
                      isPastBanner ? "text-black" : "text-black"
                    } hover:text-primary text-xl font-semibold transition duration-200`}
                  >
                    {menu.label}
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
        className={`lg:hidden text-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/10 mt-17 sm:mt-20 bg-white shadow-md flex flex-col max-h-auto transition-all duration-200 w-[300px] sm:w-[420px] z-[100] ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="p-[30px] w-full text-center">
          <ul className="font-chivo font-medium text-[16px] leading-[16px] w-full">
            {menus.map((menu, index) => (
              <li key={index} className="group py-[13px]">
                {menu.submenus && menu.submenus.length > 0 ? (
                  <>
                    {/* Parent Menu (center + icon) */}
                    <div
                      className="flex items-center justify-center gap-2 transition-all duration-200 hover:text-primary  hover:translate-x-[2px] cursor-pointer"
                      onClick={() => toggleSubmenu(index)}
                    >
                      <p>{menu.label}</p>
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
                          key={subIndex}
                          onClick={() => handleSubClick(subIndex)}
                          className={`text-md py-[15px] flex items-center justify-center gap-2 px-5 cursor-pointer transition-all duration-200 ${
                            activeSubIndex === subIndex
                              ? "bg-secondary text-white"
                              : "hover:bg-primary/20"
                          }`}
                        >
                          <sub.icon
                            size={18}
                            className={`${
                              activeSubIndex === subIndex
                                ? "text-white"
                                : "text-gray-700"
                            }`}
                          />
                          <Link href={sub.href} className="block text-center">
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    href={menu.href}
                    className="flex items-center justify-center gap-2 transition-all duration-200 hover:text-primary hover:translate-x-[2px]"
                    onClick={() => setIsOpen(false)}
                  >
                    {menu.label}
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
