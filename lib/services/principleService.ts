import { prisma } from "../prisma";

export async function getAllPrinciple() {
  return prisma.principle.findMany({
    orderBy: { id: "desc" },
  });
}

export async function getPrincipleById(id: number) {
  return prisma.principle.findUnique({ where: { id } });
}

// Fungsi sederhana untuk slug
function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export async function createPrinciple(
  title: string,
  desc: string,
  icon?: string
) {
  const slug = generateSlug(title);
  return prisma.principle.create({
    data: { title, desc, icon },
  });
}

export async function updatePrinciple(
  id: number,
  data: {
    name: string;
    link: string;
    imageLogo?: string;
  }
) {
  try {
    const updatePrinciple = await prisma.principle.update({
      where: { id },
      data,
    });

    return updatePrinciple;
  } catch (err) {
    throw new Error(`Gagal update keunggulan: ${err}`);
  }
}

export async function deletePrinciple(id: number) {
  try {
    return await prisma.principle.delete({ where: { id } });
  } catch (error) {
    throw new Error("Keunggulan dengan ID tersebut tidak ditemukan");
  }
}
