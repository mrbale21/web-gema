import { prisma } from "../prisma";

// === GemaKop ===
export async function getAllGemaKop() {
  return prisma.gemaKop.findMany({ orderBy: { id: "desc" } });
}

export async function getGemaKopById(id: number) {
  return prisma.gemaKop.findUnique({ where: { id } });
}

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export async function createGemaKop(
  title: string,
  desc: string,
  title1: string,
  desc1: string
) {
  const slug = generateSlug(title);
  return prisma.gemaKop.create({
    data: { title, desc, desc1, title1, slug },
  });
}

export async function updateGemaKop(
  id: number,
  title: string,
  desc: string,
  title1: string,
  desc1: string
) {
  const slug = generateSlug(title);
  return prisma.gemaKop.update({
    where: { id },
    data: { title, desc, title1, desc1, slug },
  });
}

export async function deleteGemaKop(id: number) {
  return prisma.gemaKop.delete({ where: { id } });
}

// === GemaKopDetail ===
export async function getAllGemaKopDetail() {
  return prisma.gemaKopDetail.findMany({ orderBy: { id: "desc" } });
}

export async function getGemaKopDetailById(id: number) {
  return prisma.gemaKopDetail.findUnique({ where: { id } });
}

export async function createGemaKopDetail(
  title: string,
  desc: string,
  icon: string
) {
  const slug = generateSlug(title);
  return prisma.gemaKopDetail.create({
    data: { title, desc, slug, icon },
  });
}

export async function updateGemaKopDetail(
  id: number,
  title: string,
  desc: string,
  icon: string
) {
  const slug = generateSlug(title);
  return prisma.gemaKopDetail.update({
    where: { id },
    data: { title, desc, slug, icon },
  });
}

export async function deleteGemaKopDetail(id: number) {
  return prisma.gemaKopDetail.delete({ where: { id } });
}
