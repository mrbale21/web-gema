/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSubmenu, getSubmenusOnly } from "@/lib/services/menuServices";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { menuId: string } }
) {
  try {
    const id = parseInt(params.menuId, 10);
    const submenus = await getSubmenusOnly(id);
    return NextResponse.json(submenus);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { menuId: string } }
) {
  try {
    const id = parseInt(params.menuId, 10);
    const body = await req.json();
    const submenu = await createSubmenu(id, body.title, body.href, body.icon);
    return NextResponse.json(submenu);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
