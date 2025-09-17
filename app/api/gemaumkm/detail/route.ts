import {
  createGemaUMKMDetail,
  deleteGemaUMKMDetail,
  getAllGemaUMKMDetail,
  updateGemaUMKMDetail,
} from "@/lib/services/gemaUmkmService";
import { NextResponse } from "next/server";

// GET all
export async function GET() {
  try {
    const data = await getAllGemaUMKMDetail();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch GemaUMKMDetail" },
      { status: 500 }
    );
  }
}

// POST create
export async function POST(req: Request) {
  try {
    const { title, desc, icon } = await req.json();
    const newData = await createGemaUMKMDetail(title, desc, icon);
    return NextResponse.json(newData, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create GemaUMKMDetail" },
      { status: 500 }
    );
  }
}

// PUT update
export async function PUT(req: Request) {
  try {
    const { id, title, desc, icon } = await req.json();
    const updated = await updateGemaUMKMDetail(id, title, desc, icon);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update GemaUMKMDetail" },
      { status: 500 }
    );
  }
}

// DELETE
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await deleteGemaUMKMDetail(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete GemaUMKMDetail" },
      { status: 500 }
    );
  }
}
