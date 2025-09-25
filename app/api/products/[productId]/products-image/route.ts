import { NextRequest, NextResponse } from "next/server";
import { uploadToS3Buffer } from "@/lib/s3";
import {
  createProductImage,
  getProductImageByProductId,
} from "@/lib/services/products/productImage";

const MAX_SIZE = 6 * 1024 * 1024; // 6MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
  "image/gif",
  "image/svg+xml",
];

// GET /api/products/[productId]/images
export async function GET(
  _: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const productId = parseInt(params.productId, 10);
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "productId wajib diisi" },
        { status: 400 }
      );
    }

    const images = await getProductImageByProductId(productId);
    return NextResponse.json(images, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Gagal mengambil data Produk Image" },
      { status: 500 }
    );
  }
}

// POST /api/products/[productId]/images
export async function POST(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const productId = parseInt(params.productId, 10);
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "productId wajib diisi" },
        { status: 400 }
      );
    }

    let data: any = {};
    let imageUrl: string | undefined;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      data = {
        name: formData.get("name") as string,
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
        const s3Key = `products/${fileName}`;
        imageUrl = await uploadToS3Buffer(
          buffer,
          s3Key,
          imageFile.type || "application/octet-stream"
        );
      }
    } else {
      data = await req.json();
    }

    const image = await createProductImage({
      name: data.name,
      desc: data.desc,
      image: imageUrl ?? data.image,
      productId,
    });

    return NextResponse.json(image, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Helper: konversi stream ke buffer
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
