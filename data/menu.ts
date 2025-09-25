import {
  MdSchool,
  MdPerson,
  MdEvent,
  MdDownload,
  MdApps,
} from "react-icons/md";
import {
  FaBook,
  FaChalkboardTeacher,
  FaVideo,
  FaQuran,
  FaNewspaper,
} from "react-icons/fa";

export const menus = [
  {
    label: "Beranda",
    href: "/",
  },
  {
    label: "Profil",
    href: "#",

    submenus: [
      { label: "Profil", href: "/page/profile", icon: MdSchool },
      { label: "Ketua Umum", href: "/page/chairman", icon: MdPerson },
      { label: "Visi Misi", href: "/page/visi-misi", icon: MdEvent },
      { label: "Program", href: "/page/program", icon: MdPerson },
      { label: "Capaian", href: "/page/achievement", icon: MdApps },
    ],
  },
  {
    label: "Produk",
    href: "#",

    submenus: [
      { label: "Gema EdTech", href: "/page/gema-edtech", icon: FaNewspaper },
      { label: "Gema Kop", href: "/page/gema-kop", icon: FaBook },
      { label: "Gema UMKM", href: "/page/gema-umkm", icon: MdEvent },
      { label: "Pelatihan", href: "/page/training", icon: FaChalkboardTeacher },
    ],
  },
  {
    label: "Blog",
    href: "/page/news",
  },
  {
    label: "Dokumentasi",
    href: "/page/gallery",
  },

  {
    label: "Kontak",
    href: "/page/contact",
  },
  {
    label: "Lainnya",
    href: "#",

    submenus: [{ label: "Quran Kemenag", href: "#", icon: FaQuran }],
  },
];
