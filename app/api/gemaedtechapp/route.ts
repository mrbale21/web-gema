import {
  createEdtech,
  EdtechData,
  getAllEdtech,
} from "@/lib/services/appGemaEdTechService";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getAllEdtech();
    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body: EdtechData = await req.json();
  const newEdtech = await createEdtech(body);
  return NextResponse.json(newEdtech);
}
