import { prisma } from "../prisma";

// Ambil semua komentar + news terkait
export async function getAllComment() {
  return prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    include: { News: true }, // pastikan field di schema namanya `news`
  });
}

// Tambah komentar baru
export async function createComment(
  name: string,
  comment: string,
  newsId: number,
  status?: string
) {
  return prisma.comment.create({
    data: {
      name,
      comment,
      status,
      newsId,
    },
  });
}
