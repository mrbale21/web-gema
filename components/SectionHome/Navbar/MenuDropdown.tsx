import Link from "next/link";
import React from "react";

interface MenuItem {
  label: string;
  href: string;
  icon?: React.ReactNode; // icon bisa ReactNode (opsional)
}

export default function MenuDropdown({
  title,
  icon,
  items,
  textColor = "text-white", // default putih
}: {
  title: string;
  icon: React.ReactNode;
  items: MenuItem[];
  cols?: number;
  width?: string;
  textColor?: string;
}) {
  return (
    <li className="relative flex items-center group ">
      <Link
        href="/"
        className={`group-hover:text-primary text-xl font-semibold font-inter menu-link lg:text-heading-6 mr-[7px] ${textColor}`} // pakai textColor di sini
      >
        {title}
      </Link>

      <ul className="menu-child opacity-0 -mt-2 bg-primary top-full z-50  grid menu-shadow -translate-x-6 translate-y-8 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto lg:absolute rounded-[4px] group-hover:grid group-hover:opacity-100 before:content-[''] before:block before:absolute before:w-full before:h-12 before:top-[-35px] before:left-0">
        {items.map((item, i) => (
          <li
            key={i}
            className="w-[200px] bg-white hover:bg-primary hover:text-white menu-child-item font-chivo group transition-all duration-500 py-[10px] px-[22px]  hover:pl-[25px] hover:opacity-100"
          >
            <Link href={item.href} className="flex items-center text-[16px] ">
              {item.icon && (
                <span className="opacity-40 w-[16px] h-[16px] mr-2 flex items-center justify-center">
                  {item.icon}
                </span>
              )}
              <span className="whitespace-nowrap">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}
