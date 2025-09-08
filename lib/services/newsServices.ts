import { prisma } from "../prisma";

export async function getAllNews() {
  return prisma.news.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getNewsById(id: number) {
  return prisma.news.findUnique({ where: { id } });
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
  editor?: string
) {
  const slug = generateSlug(title);
  return prisma.news.create({
    data: { title, content, slug, image, tag, editor },
  });
}

export async function updateMenu(
  id: number,
  title: string,
  content: string,
  image?: string,
  tag?: string,
  editor?: string
) {
  try {
    const updatedNews = await prisma.news.update({
      where: { id },
      data: {
        title,
        content,
        image,
        tag,
        editor,
      },
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
