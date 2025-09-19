/* eslint-disable @typescript-eslint/no-explicit-any */
import { createMenu, getAllMenu } from "@/lib/services/menuServices";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const menu = await getAllMenu();
    return NextResponse.json(menu);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, href, submenus } = body;

    const menu = await createMenu(title, href, submenus);
    return NextResponse.json(menu);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
