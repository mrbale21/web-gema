import { NextRequest, NextResponse } from "next/server";
import { uploadToS3Buffer } from "@/lib/s3";
import { prisma } from "@/lib/prisma";

const MAX_SIZE = 6 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
  "image/gif",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
  "video/ogg",
  "application/pdf",
];

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;

    // Validasi file
    if (!file)
      return NextResponse.json(
        { ok: false, message: "File tidak ditemukan" },
        { status: 400 }
      );
    if (file.size === 0)
      return NextResponse.json(
        { ok: false, message: "File kosong" },
        { status: 400 }
      );
    if (file.size > MAX_SIZE)
      return NextResponse.json(
        { ok: false, message: `File maksimal ${MAX_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    if (!ALLOWED_TYPES.includes(file.type))
      return NextResponse.json(
        {
          ok: false,
          message: `Tipe file harus salah satu dari: ${ALLOWED_TYPES.join(
            ", "
          )}`,
        },
        { status: 400 }
      );

    // Convert stream ke buffer
    const buffer = await streamToBuffer(file.stream());

    // Upload ke S3
    const fileName = Date.now() + "_" + file.name;
    const s3Key = `webgema/${file.type.split("/")[0]}/${fileName}`;
    const publicUrl = await uploadToS3Buffer(
      buffer,
      s3Key,
      file.type || "application/octet-stream"
    );

    // Simpan metadata di Prisma
    const attachment = await prisma.attachment.create({
      data: {
        name: fileName,
        type: file.type,
        extname: fileName.substring(fileName.lastIndexOf(".")),
        size: file.size,
        url: publicUrl,
      },
    });

    return NextResponse.json({ ok: true, data: attachment });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { ok: false, message: "Gagal upload file." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const attachments = await prisma.attachment.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ ok: true, data: attachments });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Gagal mengambil data." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id)
      return NextResponse.json(
        { ok: false, message: "ID tidak ditemukan" },
        { status: 400 }
      );

    await prisma.attachment.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ ok: true, message: "File berhasil dihapus" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Gagal menghapus file." },
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
