import { prisma } from "../prisma";

export async function getAllSuperior() {
  return prisma.superior.findMany({
    orderBy: { id: "desc" },
  });
}

export async function getSuperiorById(id: number) {
  return prisma.superior.findUnique({ where: { id } });
}

// Fungsi sederhana untuk slug
function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export async function createSuperior(
  title: string,
  desc: string,
  icon?: string
) {
  const slug = generateSlug(title);
  return prisma.superior.create({
    data: { title, desc, icon },
  });
}

export async function updateSuperior(
  id: number,
  data: {
    name: string;
    link: string;
    imageLogo?: string;
  }
) {
  try {
    const updateSuperior = await prisma.superior.update({
      where: { id },
      data,
    });

    return updateSuperior;
  } catch (err) {
    throw new Error(`Gagal update keunggulan: ${err}`);
  }
}

export async function deleteSuperior(id: number) {
  try {
    return await prisma.superior.delete({ where: { id } });
  } catch (error) {
    throw new Error("Keunggulan dengan ID tersebut tidak ditemukan");
  }
}
