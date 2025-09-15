import { prisma } from "../prisma";
import { VideoType } from "@prisma/client";

export async function getAllGallery() {
  return prisma.gallery.findMany({
    orderBy: { id: "desc" },
  });
}

export async function getGalleryById(id: number) {
  return prisma.gallery.findUnique({ where: { id } });
}

export async function createGallery(name: string, imageUrl?: string) {
  return prisma.gallery.create({
    data: { name, imageUrl },
  });
}

export async function updateGallery(
  id: number,
  data: {
    name: string;
    imageUrl: string;
  }
) {
  try {
    const updateGallery = await prisma.gallery.update({
      where: { id },
      data,
    });

    return updateGallery;
  } catch (err) {
    throw new Error(`Gagal update Gallery: ${err}`);
  }
}

export async function deleteGallery(id: number) {
  try {
    return await prisma.gallery.delete({ where: { id } });
  } catch (error) {
    throw new Error("Gallery dengan ID tersebut tidak ditemukan");
  }
}

export const createVideo = async (
  name: string,
  videoUrl: string,
  type: VideoType
) => {
  return prisma.video.create({
    data: { name, videoUrl, type },
  });
};

export const getAllVideo = async () => {
  return prisma.video.findMany({ orderBy: { createdAt: "desc" } });
};

export const getVideoById = async (id: number) => {
  return prisma.video.findUnique({ where: { id } });
};

export const updateVideo = async (
  id: number,
  data: { name?: string; videoUrl?: string; type?: VideoType }
) => {
  return prisma.video.update({ where: { id }, data });
};

export const deleteVideo = async (id: number) => {
  return prisma.video.delete({ where: { id } });
};
