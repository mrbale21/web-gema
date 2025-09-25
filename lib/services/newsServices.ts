import { prisma } from "../prisma";

export async function getAllNews() {
  return prisma.news.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true }, // biar langsung ambil data kategori juga
  });
}

export async function getNewsById(id: number) {
  return prisma.news.findUnique({
    where: { id },
    include: { category: true },
  });
}

// Fungsi sederhana untuk slug
function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export async function createNews(
  title: string,
  content: string,
  image?: string,
  tag?: string,
  editor?: string,
  categoryId?: number,
  visibility?: "HEADLINE" | "ALL" | "HIDDEN"
) {
  const slug = generateSlug(title || "untitled"); // amanin slug
  return prisma.news.create({
    data: {
      title: title || "", // default string kosong
      content: content || "", // default string kosong
      slug,
      image: image || null, // nullable
      tag: tag || null,
      editor: editor || null,
      categoryId: categoryId ?? null,
      visibility: visibility || "ALL",
    },
  });
}

export async function updateMenu(
  id: number,
  title?: string,
  content?: string,
  image?: string,
  tag?: string,
  editor?: string,
  categoryId?: number,
  visibility?: "HEADLINE" | "ALL" | "HIDDEN"
) {
  try {
    const updatedNews = await prisma.news.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(image && { image }),
        ...(tag && { tag }),
        ...(editor && { editor }),
        ...(categoryId && { categoryId }),
        ...(visibility && { visibility }),
      },
      include: { category: true }, // ⬅️ biar langsung return dengan kategori
    });

    return updatedNews;
  } catch (err) {
    throw new Error(`Gagal update news: ${err}`);
  }
}

export async function deleteMenu(id: number) {
  try {
    return await prisma.news.delete({ where: { id } });
  } catch (error) {
    throw new Error("Berita dengan ID tersebut tidak ditemukan");
  }
}
