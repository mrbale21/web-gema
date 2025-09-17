import { prisma } from "../prisma";

// === Training ===
export async function getAllTraining() {
  return prisma.training.findMany({ orderBy: { id: "desc" } });
}

export async function getTrainingById(id: number) {
  return prisma.training.findUnique({ where: { id } });
}

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export async function createTraining(
  title: string,
  desc: string,
  icon: string
) {
  const slug = generateSlug(title);
  return prisma.training.create({
    data: { title, desc, slug, icon },
  });
}

export async function updateTraining(id: number, title: string, desc: string) {
  const slug = generateSlug(title);
  return prisma.training.update({
    where: { id },
    data: { title, desc, slug },
  });
}

export async function deleteTraining(id: number) {
  return prisma.training.delete({ where: { id } });
}

// === TrainingDetail ===
export async function getAllTrainingDetail() {
  return prisma.trainingDetail.findMany({ orderBy: { id: "desc" } });
}

export async function getTrainingDetailById(id: number) {
  return prisma.trainingDetail.findUnique({ where: { id } });
}

export async function createTrainingDetail(
  title: string,
  desc: string,
  icon: string
) {
  const slug = generateSlug(title);
  return prisma.trainingDetail.create({
    data: { title, desc, slug, icon },
  });
}

export async function updateTrainingDetail(
  id: number,
  title: string,
  desc: string,
  icon: string
) {
  const slug = generateSlug(title);
  return prisma.trainingDetail.update({
    where: { id },
    data: { title, desc, slug, icon },
  });
}

export async function deleteTrainingDetail(id: number) {
  return prisma.trainingDetail.delete({ where: { id } });
}

// === training benefit ===
export async function getAllTrainingBenefit() {
  return prisma.trainingBenefit.findMany({ orderBy: { id: "desc" } });
}

export async function getTrainingBenefitById(id: number) {
  return prisma.trainingBenefit.findUnique({ where: { id } });
}

export async function createTrainingBenefit(title: string) {
  const slug = generateSlug(title);
  return prisma.trainingBenefit.create({
    data: { title, slug },
  });
}

export async function updateTrainingBenefit(id: number, title: string) {
  const slug = generateSlug(title);
  return prisma.trainingBenefit.update({
    where: { id },
    data: { title, slug },
  });
}

export async function deleteTrainingBenefit(id: number) {
  return prisma.trainingBenefit.delete({ where: { id } });
}
