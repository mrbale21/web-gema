// app/api/visimisi/route.ts
import { createVisiMisi, getAllVisiMisi } from "@/lib/services/visiMisiService";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const visiMisi = await getAllVisiMisi();
    return NextResponse.json(visiMisi);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
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
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
