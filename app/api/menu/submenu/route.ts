import { createSubmenu } from "@/lib/services/menuServices";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { menuId, title, href } = await req.json();

    if (!menuId || !title) {
      return NextResponse.json(
        { error: "menuId dan title wajib diisi" },
        { status: 400 }
      );
    }

    const submenu = await createSubmenu(menuId, title, href);
    return NextResponse.json(submenu);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
