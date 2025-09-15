import { prisma } from "../prisma";

export async function getAllProgram() {
  return prisma.program.findMany({
    orderBy: { id: "desc" },
  });
}

export async function getProgramById(id: number) {
  return prisma.program.findUnique({ where: { id } });
}

// Fungsi sederhana untuk slug
function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export async function createProgram(
  title: string,
  desc: string,
  icon?: string
) {
  const slug = generateSlug(title);
  return prisma.program.create({
    data: { title, desc, icon },
  });
}

export async function updateProgram(
  id: number,
  data: {
    name: string;
    link: string;
    imageLogo?: string;
  }
) {
  try {
    const updateprogram = await prisma.program.update({
      where: { id },
      data,
    });

    return updateprogram;
  } catch (err) {
    throw new Error(`Gagal update keunggulan: ${err}`);
  }
}

export async function deleteProgram(id: number) {
  try {
    return await prisma.program.delete({ where: { id } });
  } catch (error) {
    throw new Error("Keunggulan dengan ID tersebut tidak ditemukan");
  }
}
