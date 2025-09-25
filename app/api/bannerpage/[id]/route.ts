import { NextRequest, NextResponse } from "next/server";
import { uploadToS3Buffer } from "@/lib/s3";
import { prisma } from "@/lib/prisma";
import {
  getBannerPageById,
  updateBannerPage,
  deleteBannerPage,
} from "@/lib/services/bannerPageService";

const MAX_SIZE = 6 * 1024 * 1024; // 6MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
  "image/gif",
  "image/svg+xml",
];

// GET BannerPage by ID
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const BannerPageId = parseInt(id, 10);
    const BannerPage = await getBannerPageById(BannerPageId);

    if (!BannerPage) {
      return NextResponse.json(
        { error: "BannerPage not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, data: BannerPage });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err.message },
      { status: 500 }
    );
  }
}

// PUT BannerPage (Edit)
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
    const name = formData.get("name") as string;
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
      const s3Key = `BannerPage/${fileName}`;
      imageUrl = await uploadToS3Buffer(
        buffer,
        s3Key,
        imageFile.type || "application/octet-stream"
      );
    }

    const updatedBannerPage = await updateBannerPage(id, name, imageUrl);

    return NextResponse.json({ ok: true, data: updatedBannerPage });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: err.message },
      { status: 500 }
    );
  }
}

// DELETE BannerPage
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

    const deleted = await deleteBannerPage(id);

    return NextResponse.json({
      ok: true,
      message: "BannerPage berhasil dihapus",
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
