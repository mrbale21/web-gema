/* eslint-disable @typescript-eslint/no-explicit-any */
import { createGemaKop, getAllGemaKop } from "@/lib/services/gemaKopService";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const data = await getAllGemaKop();
  return NextResponse.json(data);
}

// POST create
export async function POST(req: Request) {
  try {
    const allData = await getAllGemaKop();

    // Cek apakah sudah ada 1 data
    if (allData.length >= 1) {
      return NextResponse.json(
        { error: "Hanya diperbolehkan satu data GemaKOP saja." },
        { status: 400 }
      );
    }

    const { title, desc, title1, desc1 } = await req.json();
    const newData = await createGemaKop(title, desc, title1, desc1);
    return NextResponse.json(newData, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create GemaUMKM" },
      { status: 500 }
    );
  }
}
