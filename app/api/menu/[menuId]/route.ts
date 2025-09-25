/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  deleteMenu,
  getMenuById,
  updateMenu,
} from "@/lib/services/menuServices";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { menuId: string } }
) {
  try {
    const id = parseInt(params.menuId, 10);
    const menu = await getMenuById(id);
    if (!menu)
      return NextResponse.json({ error: "Menu not found" }, { status: 404 });
    return NextResponse.json(menu);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { menuId: string } }
) {
  try {
    const id = parseInt(params.menuId, 10);
    const data = await req.json();
    const updated = await updateMenu(id, data);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { menuId: string } }
) {
  try {
    const id = parseInt(params.menuId, 10);
    const deleted = await deleteMenu(id);
    return NextResponse.json({ message: "Menu dihapus", deleted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
