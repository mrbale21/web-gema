import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import {
  deleteGallery,
  getGalleryById,
  updateGallery,
} from "@/lib/services/documentService";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> } // params harus Promise
) {
  try {
    const { id } = await context.params;
    const GalleryId = parseInt(id, 10);

    const Gallery = await getGalleryById(GalleryId);

    if (!Gallery) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
    }

    return NextResponse.json(Gallery);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const GalleryId = parseInt(id, 10);
    if (isNaN(GalleryId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    let data: any = {};
    let imageUrl: string | undefined;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
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
      data = await req.json();
    }

    const updatedGallery = await updateGallery(GalleryId, {
      ...data,
      imageUrl: imageUrl ?? data.imageUrl,
    });

    return NextResponse.json(updatedGallery);
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

    const deleted = await deleteGallery(id);

    return NextResponse.json({ message: "Gallery berhasil dihapus", deleted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
