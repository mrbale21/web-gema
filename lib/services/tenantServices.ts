import { prisma } from "../prisma";

export async function getTenant() {
  return prisma.tenant.findFirst();
}

export const createTenant = async (data: any) => {
  return prisma.tenant.create({ data });
};

export async function updateTenant(
  id: number,
  data: {
    nameTenant?: string;
    address?: string;
    desc?: string;
    phone?: string;
    phone2?: string;
    email?: string;
    linkMaps?: string;
    linkFacebook?: string;
    linkInstagram?: string;
    linkTwitter?: string;
    linkLinkedin?: string;
    copyRight?: string;
    imageLogo?: string;
  }
) {
  return prisma.tenant.update({
    where: { id },
    data,
  });
}

export async function deleteTenant(id: number) {
  try {
    return await prisma.tenant.delete({ where: { id } });
  } catch (error) {
    throw new Error("Tenant dengan ID tersebut tidak ditemukan");
  }
}
