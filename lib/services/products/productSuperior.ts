import { prisma } from "../../prisma";

// Ambil semua superior tanpa filter
export async function getAllProductSuperior() {
  return prisma.productSuperior.findMany({
    orderBy: { id: "desc" },
    include: { product: true }, // relasi balik biar lebih lengkap
  });
}

// Ambil semua superior milik 1 product
export async function getProductSuperiorsByProductId(productId: number) {
  return prisma.productSuperior.findMany({
    where: { productId },
    orderBy: { id: "desc" },
    include: { product: true },
  });
}

// Ambil 1 superior by ID
export async function getProductSuperiorById(id: number) {
  return prisma.productSuperior.findUnique({
    where: { id },
    include: { product: true },
  });
}

// Tambah superior baru
export async function createProductSuperior(
  productId: number,
  title: string,
  desc: string,
  icon?: string
) {
  return prisma.productSuperior.create({
    data: { productId, title, desc, icon },
    include: { product: true },
  });
}

// Update superior
export async function updateProductSuperior(
  id: number,
  data: {
    title?: string;
    desc?: string;
    icon?: string;
    isActive?: boolean;
  }
) {
  try {
    const updated = await prisma.productSuperior.update({
      where: { id },
      data,
      include: { product: true },
    });
    return updated;
  } catch (err) {
    throw new Error(`Gagal update ProductSuperior: ${err}`);
  }
}

// Hapus superior
export async function deleteProductSuperior(id: number) {
  try {
    return await prisma.productSuperior.delete({
      where: { id },
    });
  } catch (error) {
    throw new Error("Keunggulan dengan ID tersebut tidak ditemukan");
  }
}
