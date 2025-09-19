import {
  deleteEdtech,
  getEdtechById,
  updateEdtech,
} from "@/lib/services/appGemaEdTechService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (isNaN(id))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const doc = await getEdtechById(id);
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(doc);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (isNaN(id))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const body = await req.json(); // pastikan JSON dikirim dari client
    const updated = await updateEdtech(id, body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// DELETE /api/gemaedtech?id=1
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await deleteEdtech(Number(id));
  return NextResponse.json({ message: "Deleted successfully" });
}
