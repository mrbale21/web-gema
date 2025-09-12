import { prisma } from "../prisma";

export async function getAllPartner() {
  return prisma.partner.findMany({
    orderBy: { id: "desc" },
  });
}

export async function getPartnerById(id: number) {
  return prisma.partner.findUnique({ where: { id } });
}

// Fungsi sederhana untuk slug
function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export async function createPartner(
  name: string,
  link: string,
  image?: string
) {
  const slug = generateSlug(name);
  return prisma.partner.create({
    data: { name, link, image },
  });
}

export async function updatePartner(
  id: number,
  data: {
    name: string;
    link: string;
    imageLogo?: string;
  }
) {
  try {
    const updatePartner = await prisma.partner.update({
      where: { id },
      data,
    });

    return updatePartner;
  } catch (err) {
    throw new Error(`Gagal update partner: ${err}`);
  }
}

export async function deletePartner(id: number) {
  try {
    return await prisma.partner.delete({ where: { id } });
  } catch (error) {
    throw new Error("partner dengan ID tersebut tidak ditemukan");
  }
}
