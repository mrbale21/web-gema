import { NextRequest, NextResponse } from "next/server";
import { createProduct, getAllProduct } from "@/lib/services/productServices";
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
    const product = await getAllProduct();
    return NextResponse.json(product);
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
        nameTenant: formData.get("nameTenant") as string,
        name: formData.get("name") as string,
        link: formData.get("link") as string,
        desc: formData.get("desc") as string,
      };

      const imageFile = formData.get("image") as File | null;
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
        const s3Key = `product/${fileName}`;
        imageUrl = await uploadToS3Buffer(
          buffer,
          s3Key,
          imageFile.type || "application/octet-stream"
        );
      }
    } else {
      return NextResponse.json(
        { error: "Unsupported Content-Type" },
        { status: 400 }
      );
    }

    const product = await createProduct(
      data.name,
      data.link,
      data.desc,
      imageUrl
    );

    return NextResponse.json(product);
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
