import { NextRequest, NextResponse } from "next/server";
import { uploadToS3Buffer } from "@/lib/s3";
import { prisma } from "@/lib/prisma";
import {
  getBannerById,
  updateBanner,
  deleteBanner,
} from "@/lib/services/bannerServices";

const MAX_SIZE = 6 * 1024 * 1024; // 6MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
  "image/gif",
  "image/svg+xml",
];

// GET Banner by ID
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const bannerId = parseInt(id, 10);
    const banner = await getBannerById(bannerId);

    if (!banner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data: banner });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err.message },
      { status: 500 }
    );
  }
}

// PUT Banner (Edit)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id))
      return NextResponse.json(
        { ok: false, message: "Invalid ID" },
        { status: 400 }
      );

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string;
    const desc = formData.get("desc") as string;
    const imageFile = formData.get("image") as File | null;

    let imageUrl: string | undefined;

    if (imageFile) {
      if (imageFile.size === 0) throw new Error("File kosong");
      if (imageFile.size > MAX_SIZE)
        throw new Error(`File maksimal ${MAX_SIZE / 1024 / 1024}MB`);
      if (!ALLOWED_TYPES.includes(imageFile.type))
        throw new Error(
          `Tipe file harus salah satu dari: ${ALLOWED_TYPES.join(", ")}`
        );

      const buffer = await streamToBuffer(imageFile.stream());
      const fileName = Date.now() + "_" + imageFile.name;
      const s3Key = `banner/${fileName}`;
      imageUrl = await uploadToS3Buffer(
        buffer,
        s3Key,
        imageFile.type || "application/octet-stream"
      );
    }

    const updatedBanner = await updateBanner(
      id,
      title,
      desc,
      subtitle,
      imageUrl
    );

    return NextResponse.json({ ok: true, data: updatedBanner });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: err.message },
      { status: 500 }
    );
  }
}

// DELETE Banner
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id))
      return NextResponse.json(
        { ok: false, message: "Invalid ID" },
        { status: 400 }
      );

    const deleted = await deleteBanner(id);

    return NextResponse.json({
      ok: true,
      message: "Banner berhasil dihapus",
      deleted,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: err.message },
      { status: 500 }
    );
  }
}

// Helper untuk convert stream ke buffer
async function streamToBuffer(
  stream: ReadableStream<Uint8Array> | null | undefined
) {
  if (!stream) return Buffer.alloc(0);
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  return Buffer.concat(chunks);
}
