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
    const contentType = req.headers.get("content-type") || "";
    let data: any = {};

    if (contentType.includes("application/json")) {
      data = await req.json();
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      data = {
        title: formData.get("title") as string,
        href: formData.get("href") as string,
        submenus: JSON.parse((formData.get("submenus") as string) || "[]"),
      };
    } else {
      return NextResponse.json(
        { error: "Unsupported Content-Type" },
        { status: 400 }
      );
    }

    const menu = await createMenu(data.title, data.href, data.submenus);
    return NextResponse.json(menu);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
