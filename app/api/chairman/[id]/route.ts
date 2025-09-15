// app/api/chairman/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

// GET by id
export async function GET(
  _req: NextRequest,
  contextPromise: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await contextPromise.params; // ✅ tunggu dulu
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

    // 🔎 cek content-type
    const contentType = req.headers.get("content-type") || "";

    let data: any = {};

    if (contentType.includes("multipart/form-data")) {
      // 🟢 HANDLE UPLOAD IMAGE
      const formData = await req.formData();
      const file = formData.get("image") as File;

      if (file) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await fs.mkdir(uploadDir, { recursive: true });

        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path.join(uploadDir, fileName);

        await fs.writeFile(filePath, buffer);

        data.image = `/uploads/${fileName}`;
      }
    } else {
      // 🟢 HANDLE JSON UPDATE
      const body = await req.json();
      data = body;
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
    const { id } = await contextPromise.params; // ✅ tunggu dulu

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
