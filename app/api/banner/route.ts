import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { createBanner, getAllBanner } from "@/lib/services/bannerServices";

export async function GET() {
  try {
    const banner = await getAllBanner();
    return NextResponse.json(banner);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string;
    const desc = formData.get("desc") as string;
    const imageFile = formData.get("image") as File | null;

    let imageUrl: string | undefined = undefined;
    if (imageFile) {
      // contoh: simpan ke public/uploads
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = `public/uploads/${Date.now()}-${imageFile.name}`;
      await fs.promises.writeFile(filePath, buffer);
      imageUrl = "/uploads/" + filePath.split("/").pop();
    }

    const banner = await createBanner(title, subtitle, desc, imageUrl);
    return NextResponse.json(banner);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
