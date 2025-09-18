import { prisma } from "@/lib/prisma";
import { uploadToS3Buffer } from "@/lib/s3";
import { NextRequest, NextResponse } from "next/server";

// GET by id
export async function GET(
  _req: NextRequest,
  contextPromise: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await contextPromise.params;
    const chairman = await prisma.chairman.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!chairman) {
      return NextResponse.json(
        { error: "Chairman not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(chairman);
  } catch (error) {
    console.error("GET chairman error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// UPDATE by id
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = parseInt(context.params.id, 10);
    const contentType = req.headers.get("content-type") || "";
    let data: any = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("image") as File;

      if (file) {
        const buffer = await streamToBuffer(file.stream());

        const fileName = `${Date.now()}-${file.name}`;
        const s3Key = `chairman/${fileName}`;
        const imageUrl = await uploadToS3Buffer(
          buffer,
          s3Key,
          file.type || "application/octet-stream"
        );

        data.image = imageUrl; // ✅ simpan URL S3
      }

      // Ambil field lain dari formData
      for (const key of [
        "name",
        "title",
        "sub1",
        "sub2",
        "content",
        "position",
        "city",
        "period",
        "ToS",
        "createdAt",
      ]) {
        const value = formData.get(key);
        if (value !== null) data[key] = value;
      }
    } else {
      data = await req.json();
    }

    const updated = await prisma.chairman.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT chairman error:", error);
    return NextResponse.json(
      { error: "Failed to update chairman" },
      { status: 500 }
    );
  }
}

// DELETE by id
export async function DELETE(
  _req: NextRequest,
  contextPromise: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await contextPromise.params;

    await prisma.chairman.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json({ message: "Chairman deleted successfully" });
  } catch (error) {
    console.error("DELETE chairman error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// helper untuk convert stream ke buffer
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
