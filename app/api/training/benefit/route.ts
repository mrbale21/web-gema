/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createTraining,
  createTrainingBenefit,
  getAllTraining,
  getAllTrainingBenefit,
} from "@/lib/services/trainingService";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const data = await getAllTrainingBenefit();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const { title } = await req.json();
    const newData = await createTrainingBenefit(title);
    return NextResponse.json(newData, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
