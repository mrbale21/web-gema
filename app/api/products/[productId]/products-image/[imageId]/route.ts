import { NextRequest, NextResponse } from "next/server";
import { uploadToS3Buffer } from "@/lib/s3";

import {
  deleteProductImage,
  getProductImageById,
  updateProductImage,
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

// ✅ GET /api/products/[productId]
export async function GET(
  _: NextRequest,
  { params }: { params: { productId: string; imageId: string } }
) {
  try {
    const productId = parseInt(params.productId, 10);
    const imageId = parseInt(params.imageId, 10);

    if (isNaN(productId) || isNaN(imageId)) {
      return NextResponse.json({ error: "Invalid productId" }, { status: 400 });
    }

    const image = await getProductImageById(imageId);
    if (!image || image.productId !== productId) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(image, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ PUT /api/products/[productId]
export async function PUT(
  req: NextRequest,
  { params }: { params: { productId: string; imageId: string } }
) {
  try {
    const productId = parseInt(params.productId, 10);
    const imageId = parseInt(params.imageId, 10);

    if (isNaN(productId) || isNaN(imageId)) {
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
        isActive: formData.get("isActive") === "true",
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

    const updatedProductImage = await updateProductImage(imageId, {
      ...data,
      image: imageUrl ?? data.image,
    });

    // Pastikan belong to productId
    if (updatedProductImage.productId !== productId) {
      return NextResponse.json(
        { error: "Image tidak sesuai dengan productId" },
        { status: 400 }
      );
    }

    return NextResponse.json(updatedProductImage, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ DELETE /api/products/[productId]
export async function DELETE(
  _: NextRequest,
  { params }: { params: { productId: string; imageId: string } }
) {
  try {
    const productId = parseInt(params.productId, 10);
    const imageId = parseInt(params.imageId, 10);

    if (isNaN(productId) || isNaN(imageId)) {
      return NextResponse.json({ error: "Invalid productId" }, { status: 400 });
    }

    const deleted = await deleteProductImage(imageId);

    if (!deleted || deleted.productId !== productId) {
      return NextResponse.json(
        { error: "Product Image not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Product Image berhasil dihapus", deleted },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 🔧 Helper: convert stream ke buffer
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
