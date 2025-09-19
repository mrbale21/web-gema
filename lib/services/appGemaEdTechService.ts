import { prisma } from "../prisma";

export interface EdtechData {
  slug?: string;
  title: string;
  subtitle: string;
  video?: string;
}

// ========== Edtech ==========
export async function getAllEdtech() {
  return prisma.edtech.findMany();
}

export async function getEdtechById(id: number) {
  return prisma.edtech.findUnique({ where: { id } });
}

export async function createEdtech(data: EdtechData) {
  return prisma.edtech.create({ data });
}

export async function updateEdtech(id: number, data: Partial<EdtechData>) {
  const updateData: Partial<EdtechData> = {};

  // Sertakan hanya field yang tidak undefined
  if (data.title !== undefined) updateData.title = data.title;
  if (data.subtitle !== undefined) updateData.subtitle = data.subtitle;
  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.video !== undefined) updateData.video = data.video;

  return prisma.edtech.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteEdtech(id: number) {
  return prisma.edtech.delete({ where: { id } });
}

// ========== EdtechDetail ==========
export interface EdtechDetailData {
  slug?: string;
  title: string;
  subtitle: string;
}

export async function getAllEdtechDetail() {
  return prisma.edtechDetail.findMany();
}

export async function getEdtechDetailById(id: number) {
  return prisma.edtechDetail.findUnique({ where: { id } });
}

export async function createEdtechDetail(data: EdtechDetailData) {
  return prisma.edtechDetail.create({ data });
}

export async function updateEdtechDetail(
  id: number,
  data: Partial<EdtechDetailData>
) {
  return prisma.edtechDetail.update({ where: { id }, data });
}

export async function deleteEdtechDetail(id: number) {
  return prisma.edtechDetail.delete({ where: { id } });
}
