import { createChairman, getAllChairman } from "@/lib/services/chairmanService";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const chairman = await getAllChairman();
    return NextResponse.json(chairman);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // =============================
    // 1) HANDLE JSON REQUEST
    // =============================
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const {
        name,
        title,
        sub1,
        sub2,
        desc,
        position,
        city,
        period,
        ToS,
        createdAt,
        image, // bisa langsung URL
      } = body;

      const chairman = await createChairman(
        name,
        title,
        sub1,
        sub2,
        desc,
        position,
        city,
        period,
        ToS,
        createdAt,
        image
      );
      return NextResponse.json(chairman);
    }

    // =============================
    // 2) HANDLE FORM-DATA REQUEST
    // =============================
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      const name = formData.get("name") as string;
      const title = formData.get("title") as string;
      const sub1 = formData.get("sub1") as string;
      const sub2 = formData.get("sub2") as string;
      const desc = formData.get("desc") as string;
      const position = formData.get("position") as string;
      const city = formData.get("city") as string;
      const period = formData.get("period") as string;
      const ToS = formData.get("ToS") as string;
      const createdAt = formData.get("createdAt") as string;
      const imageFile = formData.get("image") as File | null;

      let imageUrl: string | undefined = undefined;
      if (imageFile) {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = `public/uploads/${Date.now()}-${imageFile.name}`;
        await fs.promises.writeFile(filePath, buffer);
        imageUrl = "/uploads/" + filePath.split("/").pop();
      }

      const chairman = await createChairman(
        name,
        title,
        sub1,
        sub2,
        desc,
        position,
        city,
        period,
        ToS,
        createdAt,
        imageUrl
      );
      return NextResponse.json(chairman);
    }

    // =============================
    // 3) HANDLE UNSUPPORTED
    // =============================
    return NextResponse.json(
      { error: "Unsupported Content-Type" },
      { status: 415 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
