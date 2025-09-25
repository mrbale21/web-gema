import { prisma } from "../prisma";

export async function getAllBannerPage() {
  return prisma.bannerPage.findMany({
    orderBy: { id: "desc" },
  });
}

export async function getBannerPageById(id: number) {
  return prisma.bannerPage.findUnique({ where: { id } });
}

export async function createBannerPage(name: string, image?: string) {
  return prisma.bannerPage.create({
    data: { name, image },
  });
}

export async function updateBannerPage(
  id: number,
  name: string,
  image?: string
) {
  try {
    const updateBannerPage = await prisma.bannerPage.update({
      where: { id },
      data: {
        name,
        image,
      },
    });

    return updateBannerPage;
  } catch (err) {
    throw new Error(`Gagal update BannerPage: ${err}`);
  }
}

export async function deleteBannerPage(id: number) {
  try {
    return await prisma.bannerPage.delete({ where: { id } });
  } catch (error) {
    throw new Error("BannerPage dengan ID tersebut tidak ditemukan");
  }
}
