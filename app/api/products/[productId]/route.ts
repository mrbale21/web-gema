import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToS3Buffer } from "@/lib/s3";
import {
  deleteProducts,
  getProductsById,
  updateProducts,
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

// GET
export async function GET(
  req: Request,
  context: { params: { productId: string } }
) {
  try {
    const productId = parseInt(context.params.productId, 10);

    if (isNaN(productId)) {
      return NextResponse.json({ error: "Invalid productId" }, { status: 400 });
    }

    const products = await getProductsById(productId);
    if (!products) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(products);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT
export async function PUT(
  req: NextRequest,
  context: { params: { productId: string } }
) {
  try {
    const productId = parseInt(context.params.productId, 10);
    if (isNaN(productId)) {
      return NextResponse.json({ error: "Invalid productId" }, { status: 400 });
    }

    let data: any = {};
    let imageUrl: string | undefined;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      data = {
        name: formData.get("name") as string,
        desc: formData.get("desc") as string,
        link: formData.get("link") as string,

        subTitles: formData.get("subTitles")
          ? JSON.parse(formData.get("subTitles") as string)
          : undefined,
        benefits: formData.get("benefits")
          ? JSON.parse(formData.get("benefits") as string)
          : undefined,
      };

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

    const updatedProduct = await updateProducts(productId, {
      ...data,
      image: imageUrl ?? data.image,
    });

    return NextResponse.json(updatedProduct);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE
export async function DELETE(
  req: NextRequest,
  context: { params: { productId: string } }
) {
  try {
    const productId = parseInt(context.params.productId, 10);
    if (isNaN(productId)) {
      return NextResponse.json({ error: "Invalid productId" }, { status: 400 });
    }

    const deleted = await deleteProducts(productId);
    return NextResponse.json({ message: "Product berhasil dihapus", deleted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
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
