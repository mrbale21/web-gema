// services/products/productBenefit.ts
import { prisma } from "../../prisma";

export async function getProductBenefitsByProductId(productId: number) {
  return prisma.productBenefit.findMany({
    where: { productId },
    orderBy: { id: "desc" },
    include: { product: true },
  });
}

export async function getProductBenefitById(id: number) {
  return prisma.productBenefit.findUnique({
    where: { id },
    include: { product: true },
  });
}

export async function createProductBenefit(title: string, productId: number) {
  return prisma.productBenefit.create({
    data: { title, productId },
  });
}

export async function updateProductBenefit(
  id: number,
  title: string,
  isActive: boolean
) {
  return prisma.productBenefit.update({
    where: { id },
    data: { title, isActive },
    include: { product: true },
  });
}

export async function deleteProductBenefit(id: number) {
  return prisma.productBenefit.delete({ where: { id } });
}
