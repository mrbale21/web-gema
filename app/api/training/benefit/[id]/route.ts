/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  deleteTraining,
  deleteTrainingBenefit,
  getTrainingBenefitById,
  getTrainingById,
  updateTraining,
  updateTrainingBenefit,
} from "@/lib/services/trainingService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await getTrainingBenefitById(Number(params.id));
  return NextResponse.json(data);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { title } = await req.json();
    const updated = await updateTrainingBenefit(Number(params.id), title);
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
    await deleteTrainingBenefit(Number(params.id));
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
