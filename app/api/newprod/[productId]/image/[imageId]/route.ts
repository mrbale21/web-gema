/* eslint-disable @typescript-eslint/no-explicit-any */
import { uploadToS3Buffer } from "@/lib/s3";
import {
  deleteNewProductImage,
  getNewProductImageById,
  updateNewProductImage,
} from "@/lib/services/newProductServices";
import { NextResponse } from "next/server";

const MAX_SIZE = 6 * 1024 * 1024; // 6MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
  "image/gif",
  "image/svg+xml",
];

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

// GET /api/newprod/[productId]/image/[imageId]
export async function GET(
  req: Request,
  { params }: { params: { productId: string; imageId: string } }
) {
  const productId = parseInt(params.productId, 10);
  const imageId = parseInt(params.imageId, 10);

  if (isNaN(productId) || isNaN(imageId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const image = await getNewProductImageById(productId, imageId);
    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }
    return NextResponse.json(image);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    );
  }
}

// PUT /api/newprod/[productId]/image/[imageId]
export async function PUT(
  req: Request,
  { params }: { params: { productId: string; imageId: string } }
) {
  try {
    const productId = Number(params.productId);
    const imageId = Number(params.imageId);

    if (isNaN(productId) || isNaN(imageId))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    let data: any = {};
    let image: string | undefined;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      data = await req.json();
      image = data.image;
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      data = {
        name: formData.get("name") as string,
        desc: formData.get("desc") as string,
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
        const s3Key = `GemaUmkmImg/${fileName}`;
        image = await uploadToS3Buffer(
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

    // ❌ Salah: updateNewProductImage(productId, {...})
    // ✅ Benar: updateNewProductImage(imageId, {...})
    const updatedImage = await updateNewProductImage(
      productId, // authId / productId
      imageId, // id image
      {
        name: data.name,
        desc: data.desc,
        image,
      }
    );

    return NextResponse.json(updatedImage, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string; imageId: string } }
) {
  try {
    const productId = Number(params.productId);
    const imageId = Number(params.imageId);

    if (isNaN(productId) || isNaN(imageId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Validasi bahwa image memang milik productId
    const image = await getNewProductImageById(productId, imageId);
    if (!image)
      return NextResponse.json(
        { error: "Image tidak ditemukan" },
        { status: 404 }
      );

    // Kirim kedua argumen sesuai service
    await deleteNewProductImage(productId, imageId);

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
