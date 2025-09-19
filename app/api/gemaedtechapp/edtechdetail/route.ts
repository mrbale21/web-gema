import {
  createEdtechDetail,
  getAllEdtechDetail,
} from "@/lib/services/appGemaEdTechService";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const docs = await getAllEdtechDetail();
    return NextResponse.json(docs);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { slug, title, subtitle } = await req.json();
    const newDoc = await createEdtechDetail({ slug, title, subtitle });
    return NextResponse.json(newDoc, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create document" },
      { status: 500 }
    );
  }
}
