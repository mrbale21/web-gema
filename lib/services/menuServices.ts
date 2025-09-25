import { prisma } from "../prisma";

// === MENU ===
export async function getAllMenu() {
  return prisma.menu.findMany({ include: { submenus: true } });
}

export async function getMenuById(id: number) {
  return prisma.menu.findUnique({ where: { id }, include: { submenus: true } });
}

export async function createMenu(
  title: string,
  href?: string,
  submenus?: { title: string; href?: string; icon?: string }[]
) {
  return prisma.menu.create({
    data: {
      title,
      href,

      submenus: { create: submenus || [] },
    },
    include: { submenus: true },
  });
}

export async function updateMenu(
  id: number,
  data: {
    title?: string;
    href?: string;
    submenus?: { id?: number; title: string; href?: string; icon?: string }[];
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
              deleteMany: {},
              create: data.submenus.map((s) => ({
                title: s.title,
                href: s.href,
                icon: s.icon || "",
              })),
            },
          }
        : {}),
    },
    include: { submenus: true },
  });
}

export async function deleteMenu(id: number) {
  const menu = await prisma.menu.findUnique({
    where: { id },
    include: { submenus: true },
  });

  if (!menu) throw new Error("Menu tidak ditemukan");

  if (menu.submenus.length > 0) {
    await prisma.submenu.deleteMany({ where: { menuId: id } });
  }

  return prisma.menu.delete({ where: { id } });
}

// === SUBMENU ===
export async function getSubmenuById(id: number) {
  return prisma.submenu.findUnique({ where: { id } });
}

export async function getSubmenusOnly(menuId: number) {
  return prisma.submenu.findMany({ where: { menuId } });
}

export async function createSubmenu(
  menuId: number,
  title: string,
  href?: string,
  icon?: string
) {
  return prisma.submenu.create({
    data: { title, href, icon: icon || "", menuId },
  });
}

export async function updateSubmenu(
  id: number,
  data: { title?: string; href?: string; icon?: string }
) {
  return prisma.submenu.update({ where: { id }, data });
}

export async function deleteSubmenu(id: number) {
  return prisma.submenu.delete({ where: { id } });
}
