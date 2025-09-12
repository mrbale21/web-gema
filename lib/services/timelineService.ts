import { prisma } from "../prisma";

export async function getAllTimeline() {
  return prisma.timeline.findMany({
    orderBy: { id: "desc" },
  });
}

export async function getTimelineById(id: number) {
  return prisma.timeline.findUnique({ where: { id } });
}

// Fungsi sederhana untuk slug
function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export async function createTimeline(
  title: string,
  year: string,
  desc: string
) {
  const slug = generateSlug(title);
  return prisma.timeline.create({
    data: {
      title,
      year,
      slug,
      desc,
    },
  });
}

export async function updateTimeline(
  id: number,

  title: string,
  year: string,

  desc: string
) {
  try {
    const updateTimeline = await prisma.timeline.update({
      where: { id },
      data: {
        title,
        year,
        desc,
      },
    });

    return updateTimeline;
  } catch (err) {
    throw new Error(`Gagal update Timeline: ${err}`);
  }
}

export async function deleteTimeline(id: number) {
  try {
    return await prisma.timeline.delete({ where: { id } });
  } catch (error) {
    throw new Error(`Timeline dengan ID tersebut tidak ditemukan, ${error}`);
  }
}
