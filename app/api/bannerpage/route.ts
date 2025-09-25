import { NextRequest, NextResponse } from "next/server";
import { uploadToS3Buffer } from "@/lib/s3";
import { prisma } from "@/lib/prisma";
import {
  createBannerPage,
  getAllBannerPage,
} from "@/lib/services/bannerPageService";

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
    const BannerPage = await getAllBannerPage();
    return NextResponse.json(BannerPage);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // 🔎 Cek apakah sudah ada banner
    const existing = await prisma.bannerPage.findFirst();
    if (existing) {
      return NextResponse.json(
        {
          ok: false,
          message: "Hanya boleh 1 banner, hapus dulu sebelum tambah baru.",
        },
        { status: 400 }
      );
    }

    const contentType = req.headers.get("content-type");
    let name: string | undefined;
    let imageUrl: string | undefined;

    // Jika pakai multipart form-data
    if (contentType?.includes("multipart/form-data")) {
      const formData = await req.formData();
      name = formData.get("name") as string;
      const imageFile = formData.get("image") as File | null;

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
    }
    // Jika pakai JSON
    else if (contentType?.includes("application/json")) {
      const body = await req.json();
      name = body.name;
      imageUrl = body.imageUrl;
    } else {
      throw new Error("Format data tidak didukung");
    }

    if (!name) throw new Error("Nama banner wajib diisi");

    // Simpan data baru (hanya kalau belum ada)
    const BannerPage = await createBannerPage(name, imageUrl);

    return NextResponse.json({ ok: true, data: BannerPage });
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
