import { prisma } from "../../prisma";

export async function getAllProducts() {
  return prisma.products.findMany({
    orderBy: { id: "desc" },
    include: {
      titles: true,
      subTitles: true,
      superiors: true,
      benefits: true,
      types: true,
      images: true,
    },
  });
}

export async function getProductsById(id: number) {
  return prisma.products.findUnique({
    where: { id },
    include: {
      titles: true,
      subTitles: true,
      superiors: true,
      benefits: true,
      types: true,
      images: true,
    },
  });
}

export async function getProductsBySlug(slug: string) {
  return prisma.products.findUnique({
    where: { slug },
    include: {
      titles: true,
      subTitles: true,
      superiors: true,
      benefits: true,
      types: true,
      images: true,
    },
  });
}

// Fungsi sederhana untuk generate slug
function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

// Create produk baru
export async function createProducts(data: {
  name: string;
  desc: string;
  link?: string;
  image?: string;
  slug?: string;
  isActive?: boolean;
  subTitles?: { title: string; desc?: string }[];
  benefits?: { title: string; desc?: string }[];
  superiors?: { title: string; desc?: string }[];
  images?: { name: string; desc?: string }[];
  types?: { name: string }[];
}) {
  return prisma.products.create({
    data: {
      name: data.name,
      desc: data.desc,
      link: data.link ?? null,
      image: data.image ?? null,
      slug: data.slug || generateSlug(data.name),
      isActive: data.isActive ?? true,
      subTitles: data.subTitles ? { create: data.subTitles } : undefined,
      benefits: data.benefits ? { create: data.benefits } : undefined,
      superiors: data.superiors ? { create: data.superiors } : undefined,
      images: data.images ? { create: data.images } : undefined,
      types: data.types ? { create: data.types } : undefined,
    },
    include: {
      subTitles: true,
      benefits: true,
      superiors: true,
      types: true,
      images: true,
    },
  });
}

// Update produk
export async function updateProducts(
  id: number,
  data: {
    name?: string;
    desc?: string;
    link?: string;
    image?: string;
    isActive?: boolean;
  }
) {
  try {
    const updateData: Record<string, any> = { ...data };

    if (data.name) {
      updateData.slug = generateSlug(data.name);
    }

    return await prisma.products.update({
      where: { id },
      data: updateData,
    });
  } catch (err) {
    throw new Error(`Gagal update product: ${err}`);
  }
}

// Hapus produk
export async function deleteProducts(id: number) {
  try {
    return await prisma.products.delete({ where: { id } });
  } catch {
    throw new Error("Product dengan ID tersebut tidak ditemukan");
  }
}
