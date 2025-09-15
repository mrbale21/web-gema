import { prisma } from "../prisma";

export async function getChairman() {
  return prisma.chairman.findFirst({
    orderBy: { id: "desc" },
  });
}

export async function getChairmanById(id: number) {
  return prisma.chairman.findUnique({ where: { id } });
}

// Fungsi sederhana untuk slug
function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export async function createChairman(
  name: string,
  title: string,
  sub1: string,
  sub2: string,
  desc: string,
  position: string,
  city: string,
  period: string,
  ToS: string,
  createdAt: string,
  image?: string
) {
  const slug = generateSlug(title);
  return prisma.chairman.create({
    data: {
      name,
      title,
      sub1,
      sub2,
      slug,
      desc,
      position,
      city,
      period,
      ToS,
      createdAt,
      image,
    },
  });
}

export async function updateChairman(
  id: number,
  name: string,
  title: string,
  sub1: string,
  sub2: string,
  desc: string,
  position: string,
  city: string,
  period: string,
  ToS: string,
  createdAt: string,
  image?: string
) {
  try {
    const updatechairman = await prisma.chairman.update({
      where: { id },
      data: {
        name,
        title,
        sub1,
        sub2,
        image,
        desc,
        position,
        city,
        period,
        createdAt,
        ToS,
      },
    });

    return updatechairman;
  } catch (err) {
    throw new Error(`Gagal update chairman: ${err}`);
  }
}

export async function deleteChairman(id: number) {
  try {
    return await prisma.chairman.delete({ where: { id } });
  } catch (error) {
    throw new Error(`Chairman dengan ID tersebut tidak ditemukan, ${error}`);
  }
}
