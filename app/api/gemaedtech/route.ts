/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createGemaEdTech,
  getAllGemaEdTech,
} from "@/lib/services/gemaEdTechService";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const data = await getAllGemaEdTech();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const allData = await getAllGemaEdTech();

    // Cek apakah sudah ada 1 data
    if (allData.length >= 1) {
      return NextResponse.json(
        { error: "Hanya diperbolehkan satu data GemaEdTech saja." },
        { status: 400 }
      );
    }

    const { title, desc } = await req.json();
    const newData = await createGemaEdTech(title, desc);
    return NextResponse.json(newData, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create GemaUMKM" },
      { status: 500 }
    );
  }
}
