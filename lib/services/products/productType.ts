import { prisma } from "../../prisma";

// Ambil semua Type tanpa filter
export async function getAllProductType() {
  return prisma.productType.findMany({
    orderBy: { id: "desc" },
    include: { product: true }, // relasi balik biar lebih lengkap
  });
}

// Ambil semua Type milik 1 product
export async function getProductTypesByProductId(productId: number) {
  return prisma.productType.findMany({
    where: { productId },
    orderBy: { id: "desc" },
    include: { product: true },
  });
}

// Ambil 1 Type by ID
export async function getProductTypeById(id: number) {
  return prisma.productType.findUnique({
    where: { id },
    include: { product: true },
  });
}

// Tambah Type baru
export async function createProductType(
  productId: number,
  title: string,
  desc: string,
  icon?: string
) {
  return prisma.productType.create({
    data: { productId, title, desc, icon },
    include: { product: true },
  });
}

// Update Type
export async function updateProductType(
  id: number,
  data: {
    title?: string;
    desc?: string;
    icon?: string;
    isActive?: boolean;
  }
) {
  try {
    const updated = await prisma.productType.update({
      where: { id },
      data,
      include: { product: true },
    });
    return updated;
  } catch (err) {
    throw new Error(`Gagal update ProductType: ${err}`);
  }
}

// Hapus Type
export async function deleteProductType(id: number) {
  try {
    return await prisma.productType.delete({
      where: { id },
    });
  } catch (error) {
    throw new Error("Keunggulan dengan ID tersebut tidak ditemukan");
  }
}
