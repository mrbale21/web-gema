/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { deleteSubmenu, updateSubmenu } from "@/lib/services/menuServices";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { menuId: string; submenusid: string } }
) {
  try {
    const id = parseInt(params.submenusid, 10); // ✅ sesuai nama folder
    const submenu = await prisma.submenu.findUnique({ where: { id } });
    return NextResponse.json(submenu);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { menuId: string; submenusid: string } }
) {
  try {
    const body = await req.json();
    const id = parseInt(params.submenusid, 10); // ✅ ini yang bener
    const updated = await updateSubmenu(id, body);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { menuId: string; submenusid: string } }
) {
  try {
    const id = parseInt(params.submenusid, 10); // ✅ sama juga
    const deleted = await deleteSubmenu(id);
    return NextResponse.json(deleted);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
