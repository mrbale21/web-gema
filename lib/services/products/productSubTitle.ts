import { prisma } from "../../prisma";

// Ambil semua productSubTitle (opsional kalau mau dashboard admin)
export async function getAllProductSubTitles() {
  return prisma.productSubTitle.findMany({
    orderBy: { id: "desc" },
    include: { product: true },
  });
}

// Ambil productSubTitle berdasarkan productId (karena 1 product hanya punya 1 title)
export async function getProductSubTitleByProductId(productId: number) {
  return prisma.productSubTitle.findFirst({
    where: { productId },
    include: { product: true },
  });
}

// Create productSubTitle (1 product hanya boleh punya 1 title)
export async function createProductSubTitle(
  productId: number,
  title: string,
  desc?: string
) {
  // pastikan tidak duplikat
  const existing = await prisma.productSubTitle.findFirst({
    where: { productId },
  });
  if (existing) {
    throw new Error("Product ini sudah memiliki Title");
  }

  return prisma.productSubTitle.create({
    data: {
      productId,
      title,
      desc,
      isActive: true,
    },
    include: { product: true },
  });
}

// Update productSubTitle by productId
export async function updateProductSubTitleByProductId(
  productId: number,
  data: {
    title?: string;
    desc?: string;
    isActive?: boolean;
  }
) {
  return prisma.productSubTitle.updateMany({
    where: { productId },
    data,
  });
}

// Hapus productSubTitle by productId
export async function deleteProductSubTitleByProductId(productId: number) {
  return prisma.productSubTitle.deleteMany({
    where: { productId },
  });
}
