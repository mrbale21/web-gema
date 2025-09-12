import { prisma } from "../prisma";

export async function getAllProduct() {
  return prisma.product.findMany({
    orderBy: { id: "desc" },
  });
}

export async function getProductById(id: number) {
  return prisma.product.findUnique({ where: { id } });
}

// Fungsi sederhana untuk slug
function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export async function createProduct(
  name: string,
  link: string,
  desc: string,
  image?: string
) {
  const slug = generateSlug(name);
  return prisma.product.create({
    data: { name, link, desc, image },
  });
}

export async function updateProduct(
  id: number,
  data: {
    name: string;
    link: string;
    desc: string;
    imageLogo?: string;
  }
) {
  try {
    const updateProduct = await prisma.product.update({
      where: { id },
      data,
    });

    return updateProduct;
  } catch (err) {
    throw new Error(`Gagal update product: ${err}`);
  }
}

export async function deleteProduct(id: number) {
  try {
    return await prisma.product.delete({ where: { id } });
  } catch (error) {
    throw new Error("product dengan ID tersebut tidak ditemukan");
  }
}
