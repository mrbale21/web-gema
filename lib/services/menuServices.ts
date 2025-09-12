import { prisma } from "../prisma";

export async function getAllMenu() {
  return prisma.menu.findMany({
    include: { submenus: true },
  });
}

export async function getMenuById(id: number) {
  return prisma.menu.findUnique({ where: { id }, include: { submenus: true } });
}

export async function createMenu(
  title: string,
  href?: string,
  submenus?: { title: string; href?: string }[]
) {
  return prisma.menu.create({
    data: {
      title,
      href,
      submenus: {
        create: submenus || [],
      },
    },
    include: { submenus: true },
  });
}
export async function updateMenu(
  id: number,
  data: {
    title?: string;
    href?: string;
    submenus?: { id?: number; title: string; href?: string }[];
  }
) {
  return prisma.menu.update({
    where: { id },
    data: {
      title: data.title,
      href: data.href,
      ...(data.submenus
        ? {
            submenus: {
              // hapus semua submenus lama, lalu set baru
              deleteMany: {},
              create: data.submenus.map((s) => ({
                title: s.title,
                href: s.href,
              })),
            },
          }
        : {}),
    },
    include: { submenus: true },
  });
}

export async function deleteMenu(id: number) {
  return prisma.menu.delete({
    where: { id },
  });
}

// --- SUBMENU ---
export async function getSubmenuById(id: number) {
  return prisma.submenu.findUnique({
    where: { id },
  });
}

export async function createSubmenu(
  menuId: number,
  title: string,
  href?: string
) {
  return prisma.submenu.create({
    data: { title, href, menuId },
  });
}

export async function updateSubmenu(
  id: number,
  data: { title?: string; href?: string }
) {
  return prisma.submenu.update({ where: { id }, data });
}

export async function deleteSubmenu(id: number) {
  return prisma.submenu.delete({ where: { id } });
}
