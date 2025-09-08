import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { prisma } from "@/lib/prisma";
import {
  deleteBanner,
  getBannerById,
  updateBanner,
} from "@/lib/services/bannerServices";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> } // params harus Promise
) {
  try {
    const { id } = await context.params;
    const bannerId = parseInt(id, 10);

    const banner = await getBannerById(bannerId);

    if (!banner) {
      return NextResponse.json({ error: "banner not found" }, { status: 404 });
    }

    return NextResponse.json(banner);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string;
    const desc = formData.get("desc") as string;
    const imageFile = formData.get("image") as File | null;

    let imageUrl: string | undefined = undefined;
    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = `public/uploads/${Date.now()}-${imageFile.name}`;
      await fs.promises.writeFile(filePath, buffer);
      imageUrl = "/uploads/" + filePath.split("/").pop();
    }

    const updatedbanner = await updateBanner(
      id,
      title,
      desc,
      subtitle,
      imageUrl
    );
    return NextResponse.json(updatedbanner);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const deleted = await deleteBanner(id);

    return NextResponse.json({ message: "banner berhasil dihapus", deleted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
