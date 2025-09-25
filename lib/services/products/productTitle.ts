import { prisma } from "../../prisma";

// Ambil semua ProductTitle (opsional kalau mau dashboard admin)
export async function getAllProductTitles() {
  return prisma.productTitle.findMany({
    orderBy: { id: "desc" },
    include: { product: true },
  });
}

// Ambil ProductTitle berdasarkan productId (karena 1 product hanya punya 1 title)
export async function getProductTitleByProductId(productId: number) {
  return prisma.productTitle.findFirst({
    where: { productId },
    include: { product: true },
  });
}

// Create ProductTitle (1 product hanya boleh punya 1 title)
export async function createProductTitle(
  productId: number,
  title: string,
  desc?: string
) {
  // pastikan tidak duplikat
  const existing = await prisma.productTitle.findFirst({
    where: { productId },
  });
  if (existing) {
    throw new Error("Product ini sudah memiliki Title");
  }

  return prisma.productTitle.create({
    data: {
      productId,
      title,
      desc,
      isActive: true,
    },
    include: { product: true },
  });
}

// Update ProductTitle by productId
export async function updateProductTitleByProductId(
  productId: number,
  data: {
    title?: string;
    desc?: string;
    isActive?: boolean;
  }
) {
  return prisma.productTitle.updateMany({
    where: { productId },
    data,
  });
}

// Hapus ProductTitle by productId
export async function deleteProductTitleByProductId(productId: number) {
  return prisma.productTitle.deleteMany({
    where: { productId },
  });
}
