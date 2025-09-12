import { prisma } from "../prisma";

export async function getAllVisiMisi() {
  return prisma.visiMisi.findMany({
    orderBy: { id: "desc" },
    include: {
      visi: true,
      misi: true,
    },
  });
}

export async function getVisiMisiById(id: number) {
  return prisma.visiMisi.findUnique({ where: { id } });
}

// Fungsi sederhana untuk slug
function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export async function createVisiMisi(
  title: string,
  subtitle: string,
  vs: string,
  ms: string,
  moto: string,
  titleMoto: string,
  visi?: { title?: string }[],
  misi?: { title?: string }[]
) {
  const slug = generateSlug(title);

  return prisma.visiMisi.create({
    data: {
      slug,
      title,
      subtitle,
      vs,
      ms,
      moto,
      titleMoto,
      visi: visi
        ? {
            create: visi.map((v) => ({
              title: v.title ?? "",
            })),
          }
        : undefined,
      misi: misi
        ? {
            create: misi.map((m) => ({
              title: m.title ?? "",
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
  visi?: { id?: number; title?: string }[],
  misi?: { id?: number; title?: string }[]
) {
  try {
    const updateVisiMisi = await prisma.visiMisi.update({
      where: { id },
      data: {
        title,
        subtitle,
        vs,
        ms,
        moto,
        titleMoto,
        visi: visi
          ? {
              upsert: visi.map((v) => ({
                where: { id: v.id ?? 0 }, // pakai 0 kalau id undefined
                create: { title: v.title ?? "" },
                update: { title: v.title ?? "" },
              })),
            }
          : undefined,
        misi: misi
          ? {
              upsert: misi.map((m) => ({
                where: { id: m.id ?? 0 },
                create: { title: m.title ?? "" },
                update: { title: m.title ?? "" },
              })),
            }
          : undefined,
      },
      include: {
        visi: true,
        misi: true,
      },
    });

    return updateVisiMisi;
  } catch (err) {
    throw new Error(`Gagal update VisiMisi: ${err}`);
  }
}

export async function deleteVisiMisi(id: number) {
  try {
    return await prisma.visiMisi.delete({ where: { id } });
  } catch (error) {
    throw new Error(`VisiMisi dengan ID tersebut tidak ditemukan, ${error}`);
  }
}
