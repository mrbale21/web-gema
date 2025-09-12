import { createVisiMisi, getAllVisiMisi } from "@/lib/services/visiMisiService";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const VisiMisi = await getAllVisiMisi();
    return NextResponse.json(VisiMisi);
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

    if (contentType.includes("application/json")) {
      const body = await req.json();
      const { title, subtitle, vs, ms, moto, titleMoto, visi, misi } = body;

      const visiMisi = await createVisiMisi(
        title,
        subtitle,
        vs,
        ms,
        moto,
        titleMoto,
        visi,
        misi
      );
      return NextResponse.json(visiMisi);
    }

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const title = formData.get("title") as string;
      const subtitle = formData.get("subtitle") as string;
      const vs = formData.get("vs") as string;
      const ms = formData.get("ms") as string;
      const moto = formData.get("moto") as string;
      const titleMoto = formData.get("titleMoto") as string;

      // multipart biasanya ga bawa array, jadi bisa parse manual kalau perlu
      const visi = JSON.parse((formData.get("visi") as string) || "[]");
      const misi = JSON.parse((formData.get("misi") as string) || "[]");

      const visiMisi = await createVisiMisi(
        title,
        subtitle,
        vs,
        ms,
        moto,
        titleMoto,
        visi,
        misi
      );
      return NextResponse.json(visiMisi);
    }

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
