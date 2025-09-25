import { prisma } from "../prisma";

export async function getAllCategories() {
  return prisma.category.findMany({
    orderBy: { name: "desc" },
  });
}

export async function getCategoryById(id: number) {
  return prisma.category.findUnique({
    where: { id },
  });
}

export async function createCategory(data: { name: string; slug?: string }) {
  return prisma.category.create({
    data,
  });
}

export async function updateCategory(
  id: number,
  data: { name?: string; slug?: string }
) {
  return prisma.category.update({
    where: { id },
    data,
  });
}

export async function deleteCategory(id: number) {
  return prisma.category.delete({
    where: { id },
  });
}
