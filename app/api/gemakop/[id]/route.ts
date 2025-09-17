/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  deleteGemaKop,
  getGemaKopById,
  updateGemaKop,
} from "@/lib/services/gemaKopService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await getGemaKopById(Number(params.id));
  return NextResponse.json(data);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { title, desc, title1, desc1 } = await req.json();
    const updated = await updateGemaKop(
      Number(params.id),
      title,
      desc,
      title1,
      desc1
    );
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
    await deleteGemaKop(Number(params.id));
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
