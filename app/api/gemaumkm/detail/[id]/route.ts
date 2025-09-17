/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  deleteGemaUMKMDetail,
  getGemaUMKMDetailById,
  updateGemaUMKMDetail,
} from "@/lib/services/gemaUmkmService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await getGemaUMKMDetailById(Number(params.id));
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { title, desc, icon } = body;

    const data = await updateGemaUMKMDetail(
      Number(params.id),
      title,
      desc,
      icon
    );
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteGemaUMKMDetail(Number(params.id));
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
