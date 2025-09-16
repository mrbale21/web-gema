import { NextRequest, NextResponse } from "next/server";
import { createGallery, getAllGallery } from "@/lib/services/documentService";
import { uploadToS3Buffer } from "@/lib/s3";

export async function GET() {
  try {
    const gallery = await getAllGallery();
    return NextResponse.json(gallery);
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
        const buffer = await streamToBuffer(imageFile.stream());
        const fileName = `${Date.now()}-${imageFile.name}`;
        const s3Key = `gallery/${fileName}`;

        // upload ke S3
        imageUrl = await uploadToS3Buffer(
          buffer,
          s3Key,
          imageFile.type || "image/jpeg"
        );
      }
    } else {
      return NextResponse.json(
        { error: "Unsupported Content-Type" },
        { status: 400 }
      );
    }

    const gallery = await createGallery(data.name, imageUrl);
    return NextResponse.json(gallery);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// helper konversi ReadableStream ke Buffer
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
