import {
  deleteChairman,
  getChairmanById,
  updateChairman,
} from "@/lib/services/chairmanService";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";

// =============================
// GET /api/chairman/[id]
// =============================
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const chairman = await getChairmanById(id);
    if (!chairman) {
      return NextResponse.json(
        { error: "Chairman not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(chairman);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

// =============================
// PUT /api/chairman/[id]
// =============================
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const contentType = req.headers.get("content-type") || "";

    // ✅ 1. JSON request
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

      const updated = await updateChairman(
        id,
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
      return NextResponse.json(updated);
    }

    // ✅ 2. Multipart form-data (upload file)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const name = formData.get("name") as string;
      const title = formData.get("title") as string;
      const sub1 = formData.get("sub1") as string;
      const sub2 = formData.get("sub2") as string; // fix typo su21
      const desc = formData.get("desc") as string;
      const position = formData.get("position") as string;
      const city = formData.get("city") as string;
      const period = formData.get("period") as string;
      const ToS = formData.get("ToS") as string;
      const createdAt = formData.get("createdAt") as string;
      const imageFile = formData.get("image") as File | null;

      let imageUrl: string | undefined = undefined;
      if (imageFile) {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = `public/uploads/${Date.now()}-${imageFile.name}`;
        await fs.promises.writeFile(filePath, buffer);
        imageUrl = "/uploads/" + filePath.split("/").pop();
      }

      const updated = await updateChairman(
        id,
        name,
        title,
        sub1,
        sub2,
        desc,
        position,
        city,
        ToS,
        period,
        createdAt,
        imageUrl
      );
      return NextResponse.json(updated);
    }

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

// =============================
// DELETE /api/chairman/[id]
// =============================
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const deleted = await deleteChairman(id);
    return NextResponse.json({
      message: "Data chairman berhasil dihapus",
      deleted,
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
