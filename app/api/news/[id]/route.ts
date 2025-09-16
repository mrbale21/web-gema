import { NextRequest, NextResponse } from "next/server";
import {
  deleteMenu,
  getNewsById,
  updateMenu,
} from "@/lib/services/newsServices";
import { uploadToS3Buffer } from "@/lib/s3";

const MAX_SIZE = 6 * 1024 * 1024; // 6MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
  "image/gif",
  "image/svg+xml",
];

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const newsId = parseInt(id, 10);

    const news = await getNewsById(newsId);
    if (!news)
      return NextResponse.json({ error: "News not found" }, { status: 404 });

    return NextResponse.json(news);
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
    if (isNaN(id))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const tag = formData.get("tag") as string;
    const editor = formData.get("editor") as string;
    const content = formData.get("content") as string;
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

      // Convert ke buffer
      const buffer = await streamToBuffer(imageFile.stream());

      // Upload ke S3
      const fileName = Date.now() + "_" + imageFile.name;
      const s3Key = `news/${fileName}`;
      imageUrl = await uploadToS3Buffer(
        buffer,
        s3Key,
        imageFile.type || "application/octet-stream"
      );
    }

    const updatedNews = await updateMenu(
      id,
      title,
      content,
      imageUrl,
      tag,
      editor
    );
    return NextResponse.json(updatedNews);
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
    if (isNaN(id))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const deleted = await deleteMenu(id);
    return NextResponse.json({ message: "News berhasil dihapus", deleted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Helper untuk konversi stream ke buffer
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
