import { prisma } from "../../prisma";

export async function getProductImageByProductId(productId: number) {
  return prisma.productImage.findMany({
    where: { productId },
    orderBy: { id: "desc" },
    include: { product: true },
  });
}

export async function getProductImageById(id: number) {
  return prisma.productImage.findUnique({
    where: { id },
    include: { product: true },
  });
}

export async function createProductImage(data: {
  name: string;
  desc: string;
  image?: string;
  productId: number;
}) {
  return prisma.productImage.create({
    data,
  });
}

export async function updateProductImage(
  id: number,
  data: {
    name: string;
    desc: string;
    image?: string;
  }
) {
  try {
    return await prisma.productImage.update({
      where: { id },
      data,
      include: { product: true },
    });
  } catch (err) {
    throw new Error(`Gagal update ProductImage: ${err}`);
  }
}

export async function deleteProductImage(id: number) {
  try {
    return await prisma.productImage.delete({ where: { id } });
  } catch (error) {
    throw new Error("ProductImage dengan ID tersebut tidak ditemukan");
  }
}
