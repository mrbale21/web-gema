/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  deleteGemaEdTech,
  getGemaEdTechById,
  updateGemaEdTech,
} from "@/lib/services/gemaEdTechService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await getGemaEdTechById(Number(params.id));
  return NextResponse.json(data);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { title, desc } = await req.json();
    const updated = await updateGemaEdTech(Number(params.id), title, desc);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteGemaEdTech(Number(params.id));
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
