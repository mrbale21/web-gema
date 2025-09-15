import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { createProgram, getAllProgram } from "@/lib/services/programService";

export async function GET() {
  try {
    const program = await getAllProgram();
    return NextResponse.json(program);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    let data: any = {};
    let iconUrl: string | undefined = undefined;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      // 📌 Kalau JSON
      data = await req.json();
      iconUrl = data.icon; // ambil langsung dari JSON body
    } else if (contentType.includes("multipart/form-data")) {
      // 📌 Kalau FormData
      const formData = await req.formData();
      data = {
        title: formData.get("title") as string,
        desc: formData.get("desc") as string,
      };

      const iconFile = formData.get("icon") as File | null;
      if (iconFile) {
        const bytes = await iconFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = `public/uploads/${Date.now()}-${iconFile.name}`;
        await fs.promises.writeFile(filePath, buffer);
        iconUrl = "/uploads/" + filePath.split("/").pop();
      }
    } else {
      return NextResponse.json(
        { error: "Unsupported Content-Type" },
        { status: 400 }
      );
    }

    const program = await createProgram(data.title, data.desc, iconUrl);

    return NextResponse.json(program);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
