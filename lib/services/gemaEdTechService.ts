import { prisma } from "../prisma";

// === GemaEdTech ===
export async function getAllGemaEdTech() {
  return prisma.gemaEdTech.findMany({ orderBy: { id: "desc" } });
}

export async function getGemaEdTechById(id: number) {
  return prisma.gemaEdTech.findUnique({ where: { id } });
}

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export async function createGemaEdTech(title: string, desc: string) {
  const slug = generateSlug(title);
  return prisma.gemaEdTech.create({
    data: { title, desc, slug },
  });
}

export async function updateGemaEdTech(
  id: number,
  title: string,
  desc: string
) {
  const slug = generateSlug(title);
  return prisma.gemaEdTech.update({
    where: { id },
    data: { title, desc, slug },
  });
}

export async function deleteGemaEdTech(id: number) {
  return prisma.gemaEdTech.delete({ where: { id } });
}

// === GemaEdTechDetail ===
export async function getAllGemaEdTechDetail() {
  return prisma.gemaEdTechDetail.findMany({ orderBy: { id: "desc" } });
}

export async function getGemaEdTechDetailById(id: number) {
  return prisma.gemaEdTechDetail.findUnique({ where: { id } });
}

export async function createGemaEdTechDetail(
  title: string,
  desc: string,
  icon: string
) {
  const slug = generateSlug(title);
  return prisma.gemaEdTechDetail.create({
    data: { title, desc, slug, icon },
  });
}

export async function updateGemaEdTechDetail(
  id: number,
  title: string,
  desc: string,
  icon: string
) {
  const slug = generateSlug(title);
  return prisma.gemaEdTechDetail.update({
    where: { id },
    data: { title, desc, slug, icon },
  });
}

export async function deleteGemaEdTechDetail(id: number) {
  return prisma.gemaEdTechDetail.delete({ where: { id } });
}
