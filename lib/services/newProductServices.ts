import { prisma } from "../prisma";

// === SLUG GENERATOR ===
function generateSlug(title?: string | null) {
  if (!title) return null;
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

// === PRODUCT ===
export async function getAllProduct() {
  return prisma.newProduct.findMany({ include: { image: true, detail: true } });
}

export async function getNewProductById(id: number) {
  return prisma.newProduct.findUnique({
    where: { id },
    include: { image: true, detail: true },
  });
}

export async function createNewProduct(data: {
  title: string;
  desc?: string;
  image?: { name: string; desc?: string; image?: string }[];
  detail?: { title: string; desc?: string; icon?: string }[];
}) {
  return prisma.newProduct.create({
    data: {
      title: data.title,
      desc: data.desc ?? null,
      slug: generateSlug(data.title),

      image: data.image
        ? {
            create: data.image.map((img) => ({
              ...img,
              slug: generateSlug(img.name),
            })),
          }
        : undefined,

      detail: data.detail
        ? {
            create: data.detail.map((d) => ({
              ...d,
              slug: generateSlug(d.title),
            })),
          }
        : undefined,
    },
    include: { image: true, detail: true },
  });
}

export async function updateNewProduct(
  id: number,
  data: { title?: string; desc?: string }
) {
  return prisma.newProduct.update({
    where: { id },
    data: {
      title: data.title,
      desc: data.desc,
      slug: data.title ? generateSlug(data.title) : undefined,
    },
    include: { image: true, detail: true },
  });
}

export async function deleteNewProduct(id: number) {
  return prisma.newProduct.delete({ where: { id } });
}

// === IMAGE ===
export async function getNewProductImages(productId: number) {
  return prisma.newProductImage.findMany({
    where: { authId: productId },
  });
}

export async function getNewProductImageById(
  productId: number,
  imageId: number
) {
  return prisma.newProductImage.findFirst({
    where: { id: imageId, authId: productId },
  });
}

export async function createNewProductImage(
  productId: number,
  data: { name: string; desc?: string; image?: string }
) {
  return prisma.newProductImage.create({
    data: {
      ...data,
      slug: generateSlug(data.name),
      authId: productId,
    },
  });
}

export async function updateNewProductImage(
  id: number,
  imageId: number,
  data: { name?: string; desc?: string; image?: string }
) {
  return prisma.newProductImage.update({
    where: { id },
    data: {
      ...data,
      slug: data.name ? generateSlug(data.name) : undefined,
    },
  });
}

export async function deleteNewProductImage(id: number, imageId: number) {
  return prisma.newProductImage.delete({ where: { id } });
}

// === DETAIL ===
export async function getNewProductDetails(productId: number) {
  return prisma.newProductDetail.findMany({
    where: { authId: productId },
  });
}

export async function getNewProductDetailById(
  productId: number,
  detailId: number
) {
  return prisma.newProductDetail.findFirst({
    where: { id: detailId, authId: productId },
  });
}

export async function createNewProductDetail(
  productId: number,
  data: { title: string; desc?: string; icon?: string }
) {
  return prisma.newProductDetail.create({
    data: {
      ...data,
      slug: generateSlug(data.title),
      authId: productId,
    },
  });
}

export async function updateNewProductDetail(
  id: number,
  detailId: number,
  data: { title?: string; desc?: string; icon?: string }
) {
  return prisma.newProductDetail.update({
    where: { id },
    data: {
      ...data,
      slug: data.title ? generateSlug(data.title) : undefined,
    },
  });
}

export async function deleteNewProductDetail(id: number, detailId: number) {
  return prisma.newProductDetail.delete({ where: { id } });
}
