import {
  deleteVisiMisi,
  getVisiMisiById,
  updateVisiMisi,
} from "@/lib/services/visiMisiService";
import { NextRequest, NextResponse } from "next/server";

// =============================
// GET /api/VisiMisi/[id]
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

    const visiMisi = await getVisiMisiById(id);
    if (!visiMisi) {
      return NextResponse.json(
        { error: "VisiMisi not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(visiMisi);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

// =============================
// PUT /api/VisiMisi/[id]
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

    const body = await req.json();
    const { title, subtitle, vs, ms, moto, titleMoto, visi, misi } = body;

    const updated = await updateVisiMisi(
      id,
      title,
      subtitle,
      vs,
      ms,
      moto,
      titleMoto,
      visi,
      misi
    );
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
// =============================
// DELETE /api/VisiMisi/[id]
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

    const deleted = await deleteVisiMisi(id);
    return NextResponse.json({
      message: "Data VisiMisi berhasil dihapus",
      deleted,
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
