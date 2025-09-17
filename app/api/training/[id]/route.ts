/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  deleteTraining,
  getTrainingById,
  updateTraining,
} from "@/lib/services/trainingService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await getTrainingById(Number(params.id));
  return NextResponse.json(data);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { title, desc } = await req.json();
    const updated = await updateTraining(Number(params.id), title, desc);
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
    await deleteTraining(Number(params.id));
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
