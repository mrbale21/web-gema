import { prisma } from "../prisma";

export async function getAllBanner() {
  return prisma.banner.findMany({
    orderBy: { id: "desc" },
  });
}

export async function getBannerById(id: number) {
  return prisma.banner.findUnique({ where: { id } });
}

// Fungsi sederhana untuk slug
function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export async function createBanner(
  title: string,
  subtitle: string,
  desc: string,
  image?: string
) {
  const slug = generateSlug(title);
  return prisma.banner.create({
    data: { title, subtitle, slug, image, desc },
  });
}

export async function updateBanner(
  id: number,
  title: string,
  subtitle: string,
  desc: string,
  image?: string
) {
  try {
    const updateBanner = await prisma.banner.update({
      where: { id },
      data: {
        title,
        subtitle,
        image,
        desc,
      },
    });

    return updateBanner;
  } catch (err) {
    throw new Error(`Gagal update banner: ${err}`);
  }
}

export async function deleteBanner(id: number) {
  try {
    return await prisma.banner.delete({ where: { id } });
  } catch (error) {
    throw new Error("Banner dengan ID tersebut tidak ditemukan");
  }
}
