import {
  deleteSubmenu,
  getSubmenuById,
  updateSubmenu,
} from "@/lib/services/menuServices";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ menuId: string; submenuId: string }> }
) {
  try {
    const { submenuId } = await params;
    const id = parseInt(submenuId, 10);

    const submenu = await getSubmenuById(id);
    if (!submenu) {
      return NextResponse.json({ error: "Submenu not found" }, { status: 404 });
    }

    return NextResponse.json(submenu);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// UPDATE submenu
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ menuId: string; submenuId: string }> }
) {
  try {
    const { submenuId } = await params;
    const id = parseInt(submenuId, 10);

    const data = await req.json();
    const updated = await updateSubmenu(id, data);

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE submenu
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ menuId: string; submenuId: string }> }
) {
  try {
    const { submenuId } = await params;
    const id = parseInt(submenuId, 10);

    const deleted = await deleteSubmenu(id);
    return NextResponse.json({ message: "Submenu dihapus", deleted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
