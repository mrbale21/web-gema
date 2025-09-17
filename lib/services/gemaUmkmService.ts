import { prisma } from "../prisma";

// === Helper untuk slug ===
// Fungsi sederhana untuk slug
function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}
// ==========================
// GemaUMKM
// ==========================
export async function getAllGemaUMKM() {
  return prisma.gemaUMKM.findMany({ orderBy: { id: "desc" } });
}

export async function getGemaUMKMById(id: number) {
  return prisma.gemaUMKM.findUnique({ where: { id } });
}

export async function createGemaUMKM(title: string, desc: string) {
  const slug = generateSlug(title);
  return prisma.gemaUMKM.create({
    data: { title, desc, slug },
  });
}

export async function updateGemaUMKM(id: number, title: string, desc: string) {
  const slug = generateSlug(title);
  return prisma.gemaUMKM.update({
    where: { id },
    data: { title, desc, slug },
  });
}

export async function deleteGemaUMKM(id: number) {
  return prisma.gemaUMKM.delete({ where: { id } });
}

// ==========================
// GemaUMKMImg
// ==========================

export async function getAllGemaUmkmImg() {
  return prisma.gemaImgUMKM.findMany({
    orderBy: { id: "desc" },
  });
}

export async function getGemaUmkmImgById(id: number) {
  return prisma.gemaImgUMKM.findUnique({ where: { id } });
}

export async function createGemaUmkmImg(
  name: string,
  desc: string,
  image?: string
) {
  return prisma.gemaImgUMKM.create({
    data: { name, desc, image },
  });
}

export async function updateGemaUmkmImg(
  id: number,
  data: {
    name: string;
    desc: string;
    imageLogo?: string;
  }
) {
  try {
    const updateGemaUmkmImg = await prisma.gemaImgUMKM.update({
      where: { id },
      data,
    });

    return updateGemaUmkmImg;
  } catch (err) {
    throw new Error(`Gagal update GemaUmkmImg: ${err}`);
  }
}

export async function deleteGemaUmkmImg(id: number) {
  try {
    return await prisma.gemaImgUMKM.delete({ where: { id } });
  } catch (error) {
    throw new Error("GemaUmkmImg dengan ID tersebut tidak ditemukan");
  }
}

// ==========================
// GemaUMKMDetail
// ==========================
export async function getAllGemaUMKMDetail() {
  return prisma.gemaUMKMDetail.findMany({ orderBy: { id: "desc" } });
}

export async function getGemaUMKMDetailById(id: number) {
  return prisma.gemaUMKMDetail.findUnique({ where: { id } });
}

export async function createGemaUMKMDetail(
  title: string,
  desc: string,
  icon: string
) {
  const slug = generateSlug(title);
  return prisma.gemaUMKMDetail.create({
    data: { title, desc, icon, slug },
  });
}

export async function updateGemaUMKMDetail(
  id: number,
  title: string,
  desc: string,
  icon: string
) {
  const slug = generateSlug(title);
  return prisma.gemaUMKMDetail.update({
    where: { id },
    data: { title, desc, icon, slug },
  });
}

export async function deleteGemaUMKMDetail(id: number) {
  return prisma.gemaUMKMDetail.delete({ where: { id } });
}
