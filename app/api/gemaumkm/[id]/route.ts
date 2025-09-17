import {
  deleteGemaUMKM,
  getGemaUMKMById,
  updateGemaUMKM,
} from "@/lib/services/gemaUmkmService";
import { NextResponse } from "next/server";

// GET by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const data = await getGemaUMKMById(id);
    if (!data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch GemaUMKM" },
      { status: 500 }
    );
  }
}

// PUT update by ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const { title, desc } = await req.json();
    const updated = await updateGemaUMKM(id, title, desc);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update GemaUMKM" },
      { status: 500 }
    );
  }
}

// DELETE by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    await deleteGemaUMKM(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete GemaUMKM" },
      { status: 500 }
    );
  }
}
