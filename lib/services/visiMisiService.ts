import { prisma } from "@/lib/prisma";

export async function getAllVisiMisi() {
  return prisma.visiMisi.findMany({
    include: {
      visi: true,
      misi: true,
    },
  });
}

export async function getVisiMisiById(id: number) {
  return prisma.visiMisi.findUnique({
    where: { id },
    include: {
      visi: true,
      misi: true,
    },
  });
}

export async function createVisiMisi(
  title: string,
  subtitle: string,
  vs: string,
  ms: string,
  moto: string,
  titleMoto: string,
  visi?: { title: string }[],
  misi?: { title: string }[]
) {
  return prisma.visiMisi.create({
    data: {
      title,
      subtitle,
      vs,
      ms,
      moto,
      titleMoto,
      slug: title.toLowerCase().replace(/\s+/g, "-"),
      visi:
        visi && visi.length > 0
          ? {
              create: visi.map((v) => ({
                title: v.title,
                slug: v.title.toLowerCase().replace(/\s+/g, "-"),
              })),
            }
          : undefined,
      misi:
        misi && misi.length > 0
          ? {
              create: misi.map((m) => ({
                title: m.title,
                slug: m.title.toLowerCase().replace(/\s+/g, "-"),
              })),
            }
          : undefined,
    },
    include: {
      visi: true,
      misi: true,
    },
  });
}

export async function updateVisiMisi(
  id: number,
  title: string,
  subtitle: string,
  vs: string,
  ms: string,
  moto: string,
  titleMoto: string,
  visi?: { title: string }[],
  misi?: { title: string }[]
) {
  return prisma.visiMisi.update({
    where: { id },
    data: {
      title,
      subtitle,
      vs,
      ms,
      moto,
      titleMoto,
      slug: title.toLowerCase().replace(/\s+/g, "-"),
      // update nested kalau mau lebih advance
    },
    include: {
      visi: true,
      misi: true,
    },
  });
}

export async function deleteVisiMisi(id: number) {
  return prisma.visiMisi.delete({
    where: { id },
  });
}
