import { NextRequest, NextResponse } from "next/server";
import { uploadToS3Buffer } from "@/lib/s3";
import { prisma } from "@/lib/prisma";
import { createBanner, getAllBanner } from "@/lib/services/bannerServices";

const MAX_SIZE = 6 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
  "image/gif",
  "image/svg+xml",
];

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
      // Validasi file
      if (imageFile.size === 0) throw new Error("File kosong");
      if (imageFile.size > MAX_SIZE)
        throw new Error(`File maksimal ${MAX_SIZE / 1024 / 1024}MB`);
      if (!ALLOWED_TYPES.includes(imageFile.type))
        throw new Error(
          `Tipe file harus salah satu dari: ${ALLOWED_TYPES.join(", ")}`
        );

      // Convert stream ke buffer
      const buffer = await streamToBuffer(imageFile.stream());

      // Upload ke S3
      const fileName = Date.now() + "_" + imageFile.name;
      const s3Key = `banner/${fileName}`;
      imageUrl = await uploadToS3Buffer(
        buffer,
        s3Key,
        imageFile.type || "application/octet-stream"
      );
    }

    // Simpan data banner ke database
    const banner = await createBanner(title, subtitle, desc, imageUrl);

    return NextResponse.json({ ok: true, data: banner });
  } catch (err: any) {
    console.error("Upload error:", err);
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
