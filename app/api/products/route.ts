import { NextRequest, NextResponse } from "next/server";
import { uploadToS3Buffer } from "@/lib/s3";
import {
  createProducts,
  getAllProducts,
} from "@/lib/services/products/productsService";

const MAX_SIZE = 6 * 1024 * 1024; // 6MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
  "image/gif",
  "image/svg+xml",
];

// GET all products
export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json(products);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST create new product (fleksibel JSON / multipart)
export async function POST(req: NextRequest) {
  try {
    let data: any = {};
    let imageUrl: string | undefined;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      data = {
        name: formData.get("name") as string,
        link: formData.get("link") as string,
        desc: formData.get("desc") as string,
        slug: formData.get("slug") as string,
        isActive: formData.get("isActive") === "true",
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

    const product = await createProducts({
      name: data.name,
      link: data.link,
      desc: data.desc,
      slug: data.slug,
      image: imageUrl ?? data.image,
      isActive: data.isActive,
      subTitles: data.subTitles,
      benefits: data.benefits,
      images: data.images,
      types: data.types,
      superiors: data.superiors,
    });

    return NextResponse.json(product, { status: 201 });
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
