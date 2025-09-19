import {
  deleteEdtechDetail,
  getEdtechDetailById,
  updateEdtechDetail,
} from "@/lib/services/appGemaEdTechService";
import { NextRequest, NextResponse } from "next/server";

// GET by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (isNaN(id))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const doc = await getEdtechDetailById(id);
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

// PUT update
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (isNaN(id))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const body = await req.json(); // pastikan JSON dikirim dari client
    const updated = await updateEdtechDetail(id, body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (isNaN(id))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    await deleteEdtechDetail(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
