import { createChairman, getChairman } from "@/lib/services/chairmanService";
import { NextRequest, NextResponse } from "next/server";
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

export async function GET() {
  try {
    const chairman = await getChairman();
    return NextResponse.json(chairman);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // =============================
    // 1) HANDLE JSON REQUEST
    // =============================
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const {
        name,
        title,
        sub1,
        sub2,
        desc,
        position,
        city,
        period,
        ToS,
        createdAt,
        image,
      } = body;

      const chairman = await createChairman(
        name,
        title,
        sub1,
        sub2,
        desc,
        position,
        city,
        period,
        ToS,
        createdAt,
        image
      );
      return NextResponse.json(chairman);
    }

    // =============================
    // 2) HANDLE FORM-DATA REQUEST
    // =============================
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      const name = formData.get("name") as string;
      const title = formData.get("title") as string;
      const sub1 = formData.get("sub1") as string;
      const sub2 = formData.get("sub2") as string;
      const desc = formData.get("desc") as string;
      const position = formData.get("position") as string;
      const city = formData.get("city") as string;
      const period = formData.get("period") as string;
      const ToS = formData.get("ToS") as string;
      const createdAt = formData.get("createdAt") as string;
      const imageFile = formData.get("image") as File | null;

      let imageUrl: string | undefined = undefined;
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
        const s3Key = `chairman/${fileName}`;
        imageUrl = await uploadToS3Buffer(
          buffer,
          s3Key,
          imageFile.type || "application/octet-stream"
        );
      }

      const chairman = await createChairman(
        name,
        title,
        sub1,
        sub2,
        desc,
        position,
        city,
        period,
        ToS,
        createdAt,
        imageUrl
      );
      return NextResponse.json(chairman);
    }

    // =============================
    // 3) HANDLE UNSUPPORTED
    // =============================
    return NextResponse.json(
      { error: "Unsupported Content-Type" },
      { status: 415 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

// Helper convert stream ke buffer
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
