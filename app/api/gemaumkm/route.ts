/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  createGemaUMKM,
  deleteGemaUMKM,
  getAllGemaUMKM,
  updateGemaUMKM,
} from "@/lib/services/gemaUmkmService";
import { NextResponse } from "next/server";

// GET all
export async function GET() {
  try {
    const data = await getAllGemaUMKM();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch GemaUMKM" },
      { status: 500 }
    );
  }
}

// POST create
export async function POST(req: Request) {
  try {
    const allData = await getAllGemaUMKM();

    // Cek apakah sudah ada 1 data
    if (allData.length >= 1) {
      return NextResponse.json(
        { error: "Hanya diperbolehkan satu data GemaUMKM saja." },
        { status: 400 }
      );
    }

    const { title, desc } = await req.json();
    const newData = await createGemaUMKM(title, desc);
    return NextResponse.json(newData, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create GemaUMKM" },
      { status: 500 }
    );
  }
}
