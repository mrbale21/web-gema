import { prisma } from "../prisma";

export async function getAllStatistic() {
  return prisma.statistic.findMany({
    orderBy: { id: "desc" },
  });
}

export async function getStatisticById(id: number) {
  return prisma.statistic.findUnique({ where: { id } });
}

// Fungsi sederhana untuk slug
function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export async function createStatistic(
  name: string,
  count: number,
  image?: string
) {
  const slug = generateSlug(name);
  return prisma.statistic.create({
    data: { name, count, image },
  });
}

export async function updateStatistic(
  id: number,
  data: {
    name: string;
    count: number;
    image?: string;
  }
) {
  try {
    const updateStatistic = await prisma.statistic.update({
      where: { id },
      data,
    });

    return updateStatistic;
  } catch (err) {
    throw new Error(`Gagal update statistic: ${err}`);
  }
}

export async function deleteStatistic(id: number) {
  try {
    return await prisma.statistic.delete({ where: { id } });
  } catch (error) {
    throw new Error("statistic dengan ID tersebut tidak ditemukan");
  }
}
