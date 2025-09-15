import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { createGallery, getAllGallery } from "@/lib/services/documentService";

export async function GET() {
  try {
    const Gallery = await getAllGallery();
    return NextResponse.json(Gallery);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    let data: any = {};
    let imageUrl: string | undefined = undefined;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      // 📌 Kalau JSON
      data = await req.json();
      imageUrl = data.image; // ambil langsung dari JSON body
    } else if (contentType.includes("multipart/form-data")) {
      // 📌 Kalau FormData
      const formData = await req.formData();
      data = {
        name: formData.get("name") as string,
      };

      const imageFile = formData.get("image") as File | null;
      if (imageFile) {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = `public/uploads/${Date.now()}-${imageFile.name}`;
        await fs.promises.writeFile(filePath, buffer);
        imageUrl = "/uploads/" + filePath.split("/").pop();
      }
    } else {
      return NextResponse.json(
        { error: "Unsupported Content-Type" },
        { status: 400 }
      );
    }

    const Gallery = await createGallery(data.name, imageUrl);

    return NextResponse.json(Gallery);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
